import { Award } from 'lucide-react';

interface ScoreProps {
  score: number;
}

export default function Score({ score }: ScoreProps) {
  return (
    <div className="flex items-center justify-center gap-3 bg-white/10 rounded-xl px-6 py-4 border border-white/20">
      <Award className="w-6 h-6 text-yellow-300" />
      <div>
        <div className="text-sm text-purple-200 font-medium">Счёт</div>
        <div className="text-3xl font-bold text-white tabular-nums">{score}</div>
      </div>
    </div>
  );
}