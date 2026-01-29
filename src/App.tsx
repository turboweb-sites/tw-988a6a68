import Game from './components/Game';
import './styles/game.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <Game />
    </div>
  );
}