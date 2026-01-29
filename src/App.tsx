import { useState, useEffect, useCallback } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 25;
const INITIAL_SPEED = 150;

export default function App() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      let newHead: Position;

      switch (direction) {
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

      // Проход сквозь стены (wrap around)
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;

      // Проверка столкновения с самим собой
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Проверка съедания еды
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        generateFood();
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
        return;
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setDirection((prev) => (prev !== 'DOWN' ? 'UP' : prev));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setDirection((prev) => (prev !== 'UP' ? 'DOWN' : prev));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setDirection((prev) => (prev !== 'RIGHT' ? 'LEFT' : prev));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setDirection((prev) => (prev !== 'LEFT' ? 'RIGHT' : prev));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">

          </h1>
          <div className="flex items-center justify-between text-lg font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Счёт: {score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📏</span>
              <span>Длина: {snake.length}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-2 shadow-inner"
            style={{
              width: GRID_SIZE * CELL_SIZE + 4,
              height: GRID_SIZE * CELL_SIZE + 4,
            }}
          >
            {/* Сетка */}
            <div className="absolute inset-2 grid" style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            }}>
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-700/20"
                />
              ))}
            </div>

            {/* Змейка */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-md transition-all duration-100 ${
                  index === 0
                    ? 'bg-gradient-to-br from-red-400 to-red-500 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-br from-red-500 to-red-600'
                }`}
                style={{
                  left: segment.x * CELL_SIZE + 2,
                  top: segment.y * CELL_SIZE + 2,
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                }}
              >
                {index === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">

                  </div>
                )}
              </div>
            ))}

            {/* Еда */}
            <div
              className="absolute rounded-full bg-gradient-to-br from-red-400 to-pink-500 shadow-lg shadow-red-500/50 animate-pulse"
              style={{
                left: food.x * CELL_SIZE + 2,
                top: food.y * CELL_SIZE + 2,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm">

              </div>
            </div>

            {/* Overlay для Game Over */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">Игра окончена!</h2>
                  <p className="text-2xl text-cyan-400 mb-6">Счёт: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg"
                  >
                    Играть снова
                  </button>
                </div>
              </div>
            )}

            {/* Overlay для Паузы */}
            {isPaused && !gameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-4">⏸️ Пауза</h2>
                  <p className="text-cyan-400">Нажмите пробел для продолжения</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Управление */}
        <div className="text-center space-y-4">
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            <div></div>
            <button
              onClick={() => setDirection((prev) => (prev !== 'DOWN' ? 'UP' : prev))}
              className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg active:scale-95"
            >
              ⬆️
            </button>
            <div></div>
            <button
              onClick={() => setDirection((prev) => (prev !== 'RIGHT' ? 'LEFT' : prev))}
              className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg active:scale-95"
            >
              ⬅️
            </button>
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg active:scale-95"
            >
              {isPaused ? '▶️' : '⏸️'}
            </button>
            <button
              onClick={() => setDirection((prev) => (prev !== 'LEFT' ? 'RIGHT' : prev))}
              className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg active:scale-95"
            >
              ➡️
            </button>
            <div></div>
            <button
              onClick={() => setDirection((prev) => (prev !== 'UP' ? 'DOWN' : prev))}
              className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg active:scale-95"
            >
              ⬇️
            </button>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>🎮 Используйте стрелки на клавиатуре или кнопки</p>
            <p>⏸️ Пробел - пауза</p>
            <p>🔄 Проходите сквозь стены!</p>
          </div>

          {gameOver && (
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-lg"
            >

            </button>
          )}
        </div>
      </div>
    </div>
  );
}