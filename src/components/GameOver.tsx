import { Trophy, Award, RotateCcw } from 'lucide-react';

interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOver({ score, highScore, onRestart }: GameOverProps) {
  const isNewRecord = score === highScore && score > 0;

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-purple-900/95 backdrop-blur-sm flex items-center justify-center rounded-2xl">
      <div className="text-center px-6">
        <div className="mb-6">
          {isNewRecord ? (
            <div className="inline-block animate-bounce">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            </div>
          ) : (
            <div className="text-6xl mb-4">💀</div>
          )}
        </div>

        <h2 className="text-5xl font-bold text-white mb-4">
          {isNewRecord ? 'Новый рекорд!' : 'Игра окончена'}
        </h2>

        <div className="space-y-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm font-medium">Ваш счёт</span>
            </div>
            <div className="text-5xl font-bold text-white">
              {score}
            </div>
          </div>

          {!isNewRecord && (
            <div className="bg-white/5 backdrop-blur rounded-xl p-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-gray-400 text-xs font-medium">Рекорд</span>
              </div>
              <div className="text-3xl font-bold text-amber-400">
                {highScore}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onRestart}
          className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xl rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
        >
          <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          Играть снова
        </button>

        <p className="text-gray-400 text-sm mt-6">
          {isNewRecord 
            ? '🎉 Потрясающе! Так держать!' 
            : 'Попробуйте побить рекорд!'}
        </p>
      </div>
    </div>
  );
}