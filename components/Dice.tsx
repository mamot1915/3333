import React from 'react';
import { PlayerColor } from '../types';
import { COLORS } from '../constants';

interface DiceProps {
  value: number | null;
  rolling: boolean;
  onRoll: () => void;
  color: PlayerColor;
  disabled: boolean;
}

export const Dice: React.FC<DiceProps> = ({ value, rolling, onRoll, color, disabled }) => {
  const diceColor = COLORS[color].main;
  
  // Mapping dots for each face
  const dotPositionMatrix = {
    1: [[50, 50]],
    2: [[20, 20], [80, 80]],
    3: [[20, 20], [50, 50], [80, 80]],
    4: [[20, 20], [20, 80], [80, 20], [80, 80]],
    5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
    6: [[20, 20], [20, 50], [20, 80], [80, 20], [80, 50], [80, 80]]
  };

  const dots = value && dotPositionMatrix[value as keyof typeof dotPositionMatrix] 
    ? dotPositionMatrix[value as keyof typeof dotPositionMatrix] 
    : [];

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        onClick={!disabled && !rolling ? onRoll : undefined}
        className={`w-20 h-20 bg-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] 
        flex relative cursor-pointer transition-all duration-300 transform 
        ${rolling ? 'animate-spin' : 'hover:scale-105'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        border-2 border-slate-200
        `}
      >
        {value === null && !rolling && (
           <span className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs uppercase">Tap</span>
        )}
        
        {!rolling && dots.map((dot, i) => (
          <div 
            key={i}
            className="absolute w-4 h-4 rounded-full shadow-inner"
            style={{ 
              left: `${dot[0]}%`, 
              top: `${dot[1]}%`, 
              transform: 'translate(-50%, -50%)',
              backgroundColor: diceColor 
            }}
          />
        ))}
      </div>
      <button 
        onClick={!disabled && !rolling ? onRoll : undefined}
        disabled={disabled || rolling}
        className={`px-6 py-2 rounded-full font-bold text-white shadow-lg transition-colors
        ${disabled ? 'bg-slate-600' : ''}
        `}
        style={{ backgroundColor: disabled ? undefined : diceColor }}
      >
        {rolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};
