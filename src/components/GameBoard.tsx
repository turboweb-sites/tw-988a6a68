import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

export default function GameBoard({ snake, food, gridSize }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="game-board">
      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10">
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <div key={i} className="border border-white/20"></div>
        ))}
      </div>

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={`snake-${index}`}
          className="snake-segment"
          style={{
            left: `${segment.x * cellSize}%`,
            top: `${segment.y * cellSize}%`,
            width: `${cellSize}%`,
            height: `${cellSize}%`,
            opacity: index === 0 ? 1 : 0.8 - (index / snake.length) * 0.3,
            zIndex: snake.length - index,
          }}
        >
          {index === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs">

            </div>
          )}
        </div>
      ))}

      {/* Food */}
      <div
        className="food"
        style={{
          left: `${food.x * cellSize}%`,
          top: `${food.y * cellSize}%`,
          width: `${cellSize}%`,
          height: `${cellSize}%`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-2xl">

        </div>
      </div>
    </div>
  );
}