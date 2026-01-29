import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Direction } from '../types/game';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  disabled: boolean;
}

export default function Controls({ onDirectionChange, disabled }: ControlsProps) {
  const buttonClass = `
    w-16 h-16 bg-white/20 hover:bg-white/30 disabled:bg-white/10 
    rounded-xl flex items-center justify-center text-white 
    transition-all active:scale-95 disabled:cursor-not-allowed
    disabled:opacity-50 border border-white/20 shadow-lg
  `;

  return (
    <div className="flex flex-col items-center gap-2 md:hidden">
      <p className="text-purple-200 text-sm mb-2">Мобильное управление</p>
      <div className="grid grid-cols-3 gap-2">
        <div></div>
        <button
          onClick={() => onDirectionChange('UP')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Up"
        >
          <ChevronUp className="w-8 h-8" />
        </button>
        <div></div>
        
        <button
          onClick={() => onDirectionChange('LEFT')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div className="w-16 h-16"></div>
        <button
          onClick={() => onDirectionChange('RIGHT')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        
        <div></div>
        <button
          onClick={() => onDirectionChange('DOWN')}
          disabled={disabled}
          className={buttonClass}
          aria-label="Down"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
        <div></div>
      </div>
    </div>
  );
}