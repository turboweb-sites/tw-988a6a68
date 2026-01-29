import { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Score from './Score';
import Controls from './Controls';
import { Position, Direction, GameState } from '../types/game';
import { Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

export default function Game() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  // Start new game
  const startGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setGameState('playing');
    setScore(0);
    setSpeed(INITIAL_SPEED);
  };

  // Handle direction change
  const changeDirection = useCallback((newDirection: Direction) => {
    setNextDirection(prev => {
      // Prevent reversing direction
      if (
        (prev === 'UP' && newDirection === 'DOWN') ||
        (prev === 'DOWN' && newDirection === 'UP') ||
        (prev === 'LEFT' && newDirection === 'RIGHT') ||
        (prev === 'RIGHT' && newDirection === 'LEFT')
      ) {
        return prev;
      }
      return newDirection;
    });
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'idle' || gameState === 'gameOver') {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
          return;
        }
      }

      if (gameState !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, changeDirection]);

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

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameState('gameOver');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameState('gameOver');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          setScore(prev => prev + 10);
          // Increase speed every 5 foods
          if ((score + 10) % 50 === 0) {
            setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
          }
          return newSnake; // Don't remove tail (snake grows)
        }

        // Remove tail if no food eaten
        newSnake.pop();
        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [gameState, nextDirection, food, score, highScore, speed, generateFood]);

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-t-3xl p-6 border-b border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">

            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Snake Game</h1>
              <p className="text-purple-200 text-sm">Классическая змейка</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-yellow-300">
                <Trophy className="w-5 h-5" />
                <span className="text-sm font-medium">Рекорд</span>
              </div>
              <div className="text-2xl font-bold text-white">{highScore}</div>
            </div>
          </div>
        </div>

        <Score score={score} />
      </div>

      {/* Game Area */}
      <div className="bg-white/10 backdrop-blur-md p-6 relative">
        <GameBoard 
          snake={snake} 
          food={food} 
          gridSize={GRID_SIZE}
        />

        {/* Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center space-y-6 p-8">
              <div className="text-6xl animate-bounce">🐍</div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Snake Game</h2>
                <p className="text-purple-200 mb-6">Съедай яблоки, расти и не врезайся!</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
              >
                Начать игру
              </button>
              <div className="text-sm text-purple-200 space-y-1">
                <p>Управление: ← → ↑ ↓ или WASD</p>
                <p>Пауза: Пробел</p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center space-y-4 p-8">
              <div className="text-5xl">⏸️</div>
              <h2 className="text-3xl font-bold text-white">Пауза</h2>
              <p className="text-purple-200">Нажмите пробел для продолжения</p>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center space-y-6 p-8">
              <div className="text-6xl">💀</div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Game Over!</h2>
                <p className="text-purple-200 mb-4">Ваш счёт: <span className="text-2xl font-bold text-white">{score}</span></p>
                {score === highScore && score > 0 && (
                  <p className="text-yellow-300 font-semibold animate-pulse">🏆 Новый рекорд!</p>
                )}
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Играть снова
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls (Mobile) */}
      <div className="bg-white/10 backdrop-blur-md rounded-b-3xl p-6 border-t border-white/20">
        <Controls 
          onDirectionChange={changeDirection} 
          disabled={gameState !== 'playing'}
        />
        
        <div className="mt-4 text-center">
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all"
            >
              Пауза (Пробел)
            </button>
          )}
          {gameState === 'paused' && (
            <button
              onClick={() => setGameState('playing')}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
            >
              Продолжить (Пробел)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}