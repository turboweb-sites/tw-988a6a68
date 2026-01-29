import Game from './components/Game';
import './styles/game.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">

          </h1>
          <p className="text-xl text-purple-200">
            Классическая аркадная игра
          </p>
        </div>
        
        <Game />
        
        <div className="mt-8 text-center space-y-2">
          <p className="text-purple-200 text-sm">
            <span className="font-semibold">Управление:</span> Стрелки или WASD
          </p>
          <p className="text-purple-300 text-xs">
            На мобильных: свайп в нужном направлении
          </p>
        </div>
      </div>
    </div>
  );
}