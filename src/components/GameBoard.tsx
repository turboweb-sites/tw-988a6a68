import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  gridSize: number;
}

export default function GameBoard({ snake, food, gridSize }: GameBoardProps) {
  const renderCell = (x: number, y: number) => {
    const isSnakeHead = snake[0].x === x && snake[0].y === y;
    const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = 'game-cell';
    if (isSnakeHead) cellClass += ' snake-head';
    else if (isSnakeBody) cellClass += ' snake-body';
    else if (isFood) cellClass += ' food';

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
      >
        {isSnakeHead && <div className="snake-eye" />}
        {isFood && <div className="food-shine" />}
      </div>
    );
  };

  return (
    <div 
      className="game-board"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }}
    >
      {Array.from({ length: gridSize }, (_, y) =>
        Array.from({ length: gridSize }, (_, x) => renderCell(x, y))
      )}
    </div>
  );
}