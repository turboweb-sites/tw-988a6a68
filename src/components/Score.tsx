import { Trophy, Star } from 'lucide-react';

interface ScoreProps {
  score: number;
  highScore: number;
}

export default function Score({ score, highScore }: ScoreProps) {
  return (
    <div className="score-container">
      <div className="score-card">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-300 font-medium">Счёт</span>
        </div>
        <div className="text-4xl font-bold text-white">
          {score}
        </div>
      </div>

      <div className="score-card">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-gray-300 font-medium">Рекорд</span>
        </div>
        <div className="text-4xl font-bold text-amber-400">
          {highScore}
        </div>
      </div>
    </div>
  );
}