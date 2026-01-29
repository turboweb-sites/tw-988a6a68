import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

export default function GameBoard({ snake, food, gridSize }: GameBoardProps) {
  const cellSize = 100 / gridSize;

  return (
    <div className="relative w-full aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent ${cellSize - 0.1}%, rgba(255,255,255,0.1) ${cellSize - 0.1}%, rgba(255,255,255,0.1) ${cellSize}%),
            repeating-linear-gradient(90deg, transparent, transparent ${cellSize - 0.1}%, rgba(255,255,255,0.1) ${cellSize - 0.1}%, rgba(255,255,255,0.1) ${cellSize}%)
          `
        }}
      />

      {/* Food */}
      <div
        className="absolute transition-all duration-200 flex items-center justify-center animate-pulse"
        style={{
          left: `${food.x * cellSize}%`,
          top: `${food.y * cellSize}%`,
          width: `${cellSize}%`,
          height: `${cellSize}%`,
        }}
      >
        <div className="w-4/5 h-4/5 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold">

        </div>
      </div>

      {/* Snake */}
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === snake.length - 1;
        
        return (
          <div
            key={index}
            className={`absolute transition-all duration-100 ${
              isHead 
                ? 'z-10' 
                : ''
            }`}
            style={{
              left: `${segment.x * cellSize}%`,
              top: `${segment.y * cellSize}%`,
              width: `${cellSize}%`,
              height: `${cellSize}%`,
            }}
          >
            <div 
              className={`w-full h-full flex items-center justify-center ${
                isHead
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg shadow-lg scale-110'
                  : isTail
                  ? 'bg-gradient-to-br from-green-600 to-emerald-800 rounded-md'
                  : 'bg-gradient-to-br from-green-500 to-emerald-700 rounded-md'
              }`}
            >
              {isHead && (
                <span className="text-xs">👀</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}