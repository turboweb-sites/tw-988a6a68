import { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Score from './Score';
import GameOver from './GameOver';
import { Position, Direction, GameState } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

export default function Game() {
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, [snake]);

  // Check collision with walls or self
  const checkCollision = (head: Position): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setDirection(nextDirection);

      setSnake(prevSnake => {
        const head = prevSnake[0];
        let newHead: Position;

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

        // Check collision
        if (checkCollision(newHead)) {
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
          setFood(generateFood());
          // Increase speed every 5 points
          if ((score + 10) % 50 === 0) {
            setSpeed(prev => Math.max(50, prev - SPEED_INCREMENT));
          }
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [gameState, nextDirection, food, score, highScore, speed, generateFood, snake, checkCollision]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'ready') {
        setGameState('playing');
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (gameState === 'playing') {
            setGameState('paused');
          } else if (gameState === 'paused') {
            setGameState('playing');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameState]);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    if (gameState === 'ready') {
      setGameState('playing');
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && direction !== 'LEFT') {
          setNextDirection('RIGHT');
        } else if (deltaX < 0 && direction !== 'RIGHT') {
          setNextDirection('LEFT');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && direction !== 'UP') {
          setNextDirection('DOWN');
        } else if (deltaY < 0 && direction !== 'DOWN') {
          setNextDirection('UP');
        }
      }
    }

    setTouchStart(null);
  };

  const handleRestart = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('ready');
  };

  const handleStart = () => {
    setGameState('playing');
  };

  return (
    <div className="game-container">
      <Score score={score} highScore={highScore} />
      
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <GameBoard 
          snake={snake} 
          food={food} 
          gridSize={GRID_SIZE}
        />
        
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Готовы?
              </h2>
              <button
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
              >
                ▶ Начать игру
              </button>
              <p className="text-gray-300 mt-4 text-sm">
                Или нажмите любую стрелку
              </p>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                ⏸ Пауза
              </h2>
              <p className="text-gray-300 text-sm">
                Нажмите ПРОБЕЛ для продолжения
              </p>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <GameOver 
            score={score} 
            highScore={highScore}
            onRestart={handleRestart}
          />
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {gameState === 'playing' && (
          <button
            onClick={() => setGameState('paused')}
            className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            ⏸ Пауза
          </button>
        )}
        
        {gameState === 'paused' && (
          <button
            onClick={() => setGameState('playing')}
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
          >
            ▶ Продолжить
          </button>
        )}
        
        <button
          onClick={handleRestart}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors col-span-full"
        >

        </button>
      </div>
    </div>
  );
}