import { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import { GameState, Direction, Position } from '../types/game';
import { RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 150;

export default function Game() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });

  // Generate random food position
  function generateFood(currentSnake: Position[]): Position {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'ready' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        setGameState('playing');
      }

      if (gameState === 'gameOver' && e.key === ' ') {
        e.preventDefault();
        resetGame();
        return;
      }

      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          setGameState('paused');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setDirection(nextDirection);
      
      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead: Position;

        // Calculate new head position
        switch (nextDirection) {
          case 'UP':
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case 'DOWN':
            newHead = { x: head.x, y: head.y + 1 };
            break;
          case 'LEFT':
            newHead = { x: head.x - 1, y: head.y };
            break;
          case 'RIGHT':
            newHead = { x: head.x + 1, y: head.y };
            break;
        }

        // Wrap around walls (teleport to opposite side)
        if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
        if (newHead.x >= GRID_SIZE) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
        if (newHead.y >= GRID_SIZE) newHead.y = 0;

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState('gameOver');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameState, nextDirection, food, score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState('ready');
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  const startGame = () => {
    if (gameState === 'ready') {
      setGameState('playing');
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">

        </h1>
        <p className="game-subtitle">Проходи сквозь стены!</p>
      </div>

      <ScoreBoard score={score} highScore={highScore} />

      <div className="relative">
        <GameBoard 
          snake={snake} 
          food={food} 
          gridSize={GRID_SIZE}
        />

        {/* Game State Overlays */}
        {gameState === 'ready' && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2 className="text-4xl font-bold mb-4">Готов?</h2>
              <p className="text-xl mb-6">Используй стрелки для управления</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
              >
                <Play size={24} />
                Начать игру
              </button>
              <p className="text-sm mt-4 opacity-75">Пробел — пауза</p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="game-overlay">
            <div className="overlay-content">
              <Pause size={64} className="mx-auto mb-4 opacity-50" />
              <h2 className="text-4xl font-bold mb-4">Пауза</h2>
              <button
                onClick={togglePause}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto"
              >
                <Play size={24} />
                Продолжить
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="game-overlay bg-red-900/90">
            <div className="overlay-content">
              <h2 className="text-5xl font-bold mb-4">Игра окончена!</h2>
              <p className="text-2xl mb-2">Счёт: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-400 text-xl mb-6 animate-pulse">

                </p>
              )}
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2 mx-auto mt-4"
              >
                <RotateCcw size={24} />
                Играть снова
              </button>
              <p className="text-sm mt-4 opacity-75">или нажми Пробел</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="game-controls">
        <button
          onClick={togglePause}
          disabled={gameState === 'ready' || gameState === 'gameOver'}
          className="control-button"
        >
          {gameState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
          {gameState === 'playing' ? 'Пауза' : 'Продолжить'}
        </button>
        <button
          onClick={resetGame}
          className="control-button"
        >
          <RotateCcw size={20} />
          Новая игра
        </button>
      </div>

      {/* Instructions */}
      <div className="game-instructions">
        <h3 className="text-lg font-bold mb-2">Управление:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>⬆️ ⬇️ ⬅️ ➡️ — Движение</div>
          <div>Пробел — Пауза</div>
          <div>🍎 — Еда (+10 очков)</div>
          <div>🌀 — Проходи сквозь стены!</div>
        </div>
      </div>
    </div>
  );
}