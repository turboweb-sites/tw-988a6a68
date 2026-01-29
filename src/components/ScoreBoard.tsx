import { Trophy, Star } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
}

export default function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className="score-board">
      <div className="score-item">
        <Star className="score-icon" size={24} />
        <div>
          <div className="score-label">Счёт</div>
          <div className="score-value">{score}</div>
        </div>
      </div>
      
      <div className="score-divider" />
      
      <div className="score-item">
        <Trophy className="score-icon text-yellow-400" size={24} />
        <div>
          <div className="score-label">Рекорд</div>
          <div className="score-value">{highScore}</div>
        </div>
      </div>
    </div>
  );
}