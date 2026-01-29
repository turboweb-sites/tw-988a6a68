import Game from './components/Game';
import './styles/game.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Game />
    </div>
  );
}