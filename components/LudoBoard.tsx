
import React, { useEffect, useRef, useState } from 'react';
import { PlayerColor, Token } from '../types';
import { COLORS, TRACK_COORDINATES, HOME_PATH_COORDINATES, START_OFFSETS, SAFE_SPOTS } from '../constants';
import { Star, Swords } from 'lucide-react';
import { ThreeDDice } from './ThreeDDice';

interface LudoBoardProps {
  tokens: Token[];
  onTokenClick: (tokenId: string) => void;
  highlightedTokens: string[];
  diceValue: number | null;
  isRolling: boolean;
  onDiceClick: () => void;
  currentPlayer: PlayerColor;
  turnStep: 'ROLL' | 'MOVE';
  moveTimer: number; 
  customDiceSound: string | null;
  captureEvent: { globalIndex: number } | null;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({ 
  tokens, 
  onTokenClick, 
  highlightedTokens,
  diceValue,
  isRolling,
  onDiceClick,
  currentPlayer,
  turnStep,
  moveTimer,
  customDiceSound,
  captureEvent,
}) => {
  // SVG ViewBox settings
  const SIZE = 1500;
  const CELL = SIZE / 15; // 100 units per cell
  const audioContextRef = useRef<AudioContext | null>(null);
  const prevTokensRef = useRef<Token[]>(tokens);
  
  // Capture Animation State
  const [swordCoords, setSwordCoords] = useState<{x: number, y: number} | null>(null);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const playDiceSound = () => {
    if (customDiceSound) {
        const audio = new Audio(customDiceSound);
        audio.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const playStepSound = () => {
      initAudio();
      const ctx = audioContextRef.current;
      if(!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
  };

  const playSwordSound = () => {
      initAudio();
      const ctx = audioContextRef.current;
      if(!ctx) return;
      const now = ctx.currentTime;

      // Metallic clash (High frequency noise + sine)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
      
      // Noise burst for impact
      const bufferSize = ctx.sampleRate * 0.2; // 200ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
  };

  useEffect(() => {
    if (isRolling) {
        playDiceSound();
    }
  }, [isRolling]);

  // Detect token movement for step sound
  useEffect(() => {
      tokens.forEach(token => {
          const prev = prevTokensRef.current.find(t => t.id === token.id);
          if (prev && prev.position !== token.position) {
              if (token.position !== -1 || (prev.position === -1)) {
                  playStepSound();
              }
          }
      });
      prevTokensRef.current = tokens;
  }, [tokens]);

  // Handle Capture Event
  useEffect(() => {
      if (captureEvent) {
          const pos = TRACK_COORDINATES[captureEvent.globalIndex];
          if (pos) {
              setSwordCoords({ x: (pos.x + 0.5) * CELL, y: (pos.y + 0.5) * CELL });
              playSwordSound();
              
              // Clear animation after 1s
              const timer = setTimeout(() => {
                  setSwordCoords(null);
              }, 1000);
              return () => clearTimeout(timer);
          }
      }
  }, [captureEvent]);

  // Helper to render grid cells
  const renderCell = (x: number, y: number, color: string, stroke: string = '#1E293B', id?: string) => (
    <rect
      key={`cell-${x}-${y}-${id || ''}`}
      x={x * CELL}
      y={y * CELL}
      width={CELL}
      height={CELL}
      fill={color}
      stroke={stroke}
      strokeWidth="3"
    />
  );

  // --- Board Construction Functions ---
  const renderBases = () => {
    const bases = [
      { color: PlayerColor.BLUE, x: 0, y: 0 },
      { color: PlayerColor.RED, x: 9, y: 0 },
      { color: PlayerColor.YELLOW, x: 0, y: 9 },
      { color: PlayerColor.GREEN, x: 9, y: 9 },
    ];

    return bases.map((base) => (
      <g key={base.color}>
        <rect x={base.x * CELL} y={base.y * CELL} width={6 * CELL} height={6 * CELL} fill={COLORS[base.color].main} stroke={COLORS.stroke} strokeWidth="4" />
        <rect x={(base.x + 1.2) * CELL} y={(base.y + 1.2) * CELL} width={3.6 * CELL} height={3.6 * CELL} fill="white" rx={CELL * 0.5} ry={CELL * 0.5} stroke={COLORS.stroke} strokeWidth="1" />
        {[
          { cx: base.x + 1.8, cy: base.y + 1.8 },
          { cx: base.x + 4.2, cy: base.y + 1.8 },
          { cx: base.x + 1.8, cy: base.y + 4.2 },
          { cx: base.x + 4.2, cy: base.y + 4.2 },
        ].map((pos, idx) => (
          <circle key={`${base.color}-base-circle-${idx}`} cx={pos.cx * CELL} cy={pos.cy * CELL} r={0.8 * CELL / 2} fill={COLORS[base.color].bg} stroke={COLORS[base.color].main} strokeWidth="4" />
        ))}
      </g>
    ));
  };

  const renderTracks = () => {
    const elements = [];
    // White background tracks
    for (let y = 0; y < 6; y++) for (let x = 6; x <= 8; x++) elements.push(renderCell(x, y, 'white'));
    for (let x = 0; x < 6; x++) for (let y = 6; y <= 8; y++) elements.push(renderCell(x, y, 'white'));
    for (let x = 9; x < 15; x++) for (let y = 6; y <= 8; y++) elements.push(renderCell(x, y, 'white'));
    for (let y = 9; y < 15; y++) for (let x = 6; x <= 8; x++) elements.push(renderCell(x, y, 'white'));

    // Colored Home Paths
    for (let y = 1; y < 6; y++) elements.push(renderCell(7, y, COLORS[PlayerColor.RED].main));
    for (let x = 9; x < 14; x++) elements.push(renderCell(x, 7, COLORS[PlayerColor.GREEN].main));
    for (let y = 9; y < 14; y++) elements.push(renderCell(7, y, COLORS[PlayerColor.YELLOW].main));
    for (let x = 1; x < 6; x++) elements.push(renderCell(x, 7, COLORS[PlayerColor.BLUE].main));

    // Colored Start Squares
    elements.push(renderCell(8, 1, COLORS[PlayerColor.RED].main));
    elements.push(renderCell(13, 8, COLORS[PlayerColor.GREEN].main));
    elements.push(renderCell(6, 13, COLORS[PlayerColor.YELLOW].main));
    elements.push(renderCell(1, 6, COLORS[PlayerColor.BLUE].main));
    return elements;
  };

  const renderCenter = () => {
    const cx = 7.5 * CELL;
    const cy = 7.5 * CELL;
    return (
      <g>
        <rect x={6 * CELL} y={6 * CELL} width={3 * CELL} height={3 * CELL} fill="white" stroke={COLORS.stroke} strokeWidth="0" />
        <polygon points={`${6*CELL},${6*CELL} ${9*CELL},${6*CELL} ${cx},${cy}`} fill={COLORS[PlayerColor.RED].main} stroke={COLORS.stroke} strokeWidth="2"/>
        <polygon points={`${9*CELL},${6*CELL} ${9*CELL},${9*CELL} ${cx},${cy}`} fill={COLORS[PlayerColor.GREEN].main} stroke={COLORS.stroke} strokeWidth="2"/>
        <polygon points={`${9*CELL},${9*CELL} ${6*CELL},${9*CELL} ${cx},${cy}`} fill={COLORS[PlayerColor.YELLOW].main} stroke={COLORS.stroke} strokeWidth="2"/>
        <polygon points={`${6*CELL},${9*CELL} ${6*CELL},${6*CELL} ${cx},${cy}`} fill={COLORS[PlayerColor.BLUE].main} stroke={COLORS.stroke} strokeWidth="2"/>
      </g>
    );
  };

  const renderDecorations = () => {
    const starCoords = [{ x: 2, y: 8 }, { x: 6, y: 2 }, { x: 12, y: 6 }, { x: 8, y: 12 }];
    const starSize = CELL * 0.75;
    const starOffset = -starSize / 2;

    const renderArrow = (x: number, y: number, rotation: number, color: string) => {
        return (
            <g transform={`translate(${x * CELL}, ${y * CELL}) rotate(${rotation})`}>
                 <g transform={`scale(${CELL/100})`}>
                    <path 
                        d="M 0 35 L -35 -15 L -20 -15 L -20 -45 L 20 -45 L 20 -15 L 35 -15 Z" 
                        fill={color} 
                        stroke="#1E293B" 
                        strokeWidth="4" 
                        strokeLinejoin="round"
                    />
                 </g>
            </g>
        );
    };

    return (
      <g pointerEvents="none">
         {starCoords.map((pos, i) => (
             <g key={`star-${i}`} transform={`translate(${pos.x * CELL + CELL*0.5}, ${pos.y * CELL + CELL*0.5})`}>
                 <Star size={starSize} x={starOffset} y={starOffset} fill="white" stroke="#1E293B" strokeWidth={1.5} />
             </g>
         ))}
         
         {renderArrow(7.5, 0.6, 0, COLORS[PlayerColor.RED].main)}
         {renderArrow(14.4, 7.5, 90, COLORS[PlayerColor.GREEN].main)}
         {renderArrow(7.5, 14.4, 180, COLORS[PlayerColor.YELLOW].main)}
         {renderArrow(0.6, 7.5, -90, COLORS[PlayerColor.BLUE].main)}
      </g>
    );
  };

  const getCoordinates = (token: Token) => {
      if (token.position === -1) {
          const offsets: Record<string, number[][]> = {
              [PlayerColor.BLUE]: [[1.8, 1.8], [4.2, 1.8], [1.8, 4.2], [4.2, 4.2]],
              [PlayerColor.RED]: [[10.8, 1.8], [13.2, 1.8], [10.8, 4.2], [13.2, 4.2]],
              [PlayerColor.GREEN]: [[10.8, 10.8], [13.2, 10.8], [10.8, 13.2], [13.2, 13.2]],
              [PlayerColor.YELLOW]: [[1.8, 10.8], [4.2, 10.8], [1.8, 13.2], [4.2, 13.2]],
          };
          const index = parseInt(token.id.slice(1)) - 1; 
          const pos = offsets[token.color][index];
          return { x: pos[0] * CELL, y: pos[1] * CELL };
      }
      const offset = START_OFFSETS[token.color];
      if (token.position <= 50) {
          const globalIndex = (token.position + offset) % 52;
          const pos = TRACK_COORDINATES[globalIndex];
          if (!pos) return { x: 7.5 * CELL, y: 7.5 * CELL }; 
          return { x: (pos.x + 0.5) * CELL, y: (pos.y + 0.5) * CELL };
      } else {
          const homeIndex = token.position - 51;
          const homePath = HOME_PATH_COORDINATES[token.color];
          if (homePath && homePath[homeIndex]) {
              const pos = homePath[homeIndex];
              return { x: (pos.x + 0.5) * CELL, y: (pos.y + 0.5) * CELL };
          }
          return { x: 7.5 * CELL, y: 7.5 * CELL };
      }
  };

  const tokenGroups: Record<string, Token[]> = {};
  tokens.forEach(t => {
      let key = "";
      if (t.position === -1) key = `base-${t.color}-${t.id}`;
      else if (t.position > 50) key = `home-${t.color}-${t.position}`;
      else {
          const offset = START_OFFSETS[t.color];
          const globalIndex = (t.position + offset) % 52;
          key = `track-${globalIndex}`;
      }
      if (!tokenGroups[key]) tokenGroups[key] = [];
      tokenGroups[key].push(t);
  });
  
  const getCharacterSVG = (color: PlayerColor) => {
       switch (color) {
      case PlayerColor.RED: 
        return (
          <g>
             <circle r="35" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
             <path d="M -25 20 Q 0 45 25 20 A 35 35 0 0 1 -25 20" fill="#FCA5A5" opacity="0.8" />
             <path d="M -5 -33 Q 5 -50 15 -33" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
             <g transform="translate(0, -5)">
               <circle cx="-10" cy="0" r="11" fill="white" stroke="black" strokeWidth="1" />
               <circle cx="10" cy="0" r="11" fill="white" stroke="black" strokeWidth="1" />
               <circle cx="-8" cy="0" r="3" fill="black" />
               <circle cx="8" cy="0" r="3" fill="black" />
               <path d="M -22 -8 L 0 5 L 22 -8 L 22 -14 L 0 -2 L -22 -14 Z" fill="black" />
             </g>
             <path d="M -8 5 L 0 15 L 8 5" fill="#FBBF24" stroke="black" strokeWidth="1" />
          </g>
        );
      case PlayerColor.YELLOW: 
        return (
          <g transform="translate(0, 5)">
             <path d="M 0 -45 L 35 35 Q 0 45 -35 35 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
             <g transform="translate(0, -5)">
               <circle cx="-10" cy="0" r="9" fill="white" stroke="black" strokeWidth="1" />
               <circle cx="10" cy="0" r="9" fill="white" stroke="black" strokeWidth="1" />
               <circle cx="-8" cy="0" r="2" fill="black" />
               <circle cx="8" cy="0" r="2" fill="black" />
               <path d="M -18 -12 L -5 -8" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
               <path d="M 18 -12 L 5 -8" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
             </g>
             <path d="M -5 10 L 0 20 L 5 10" fill="#F97316" stroke="black" strokeWidth="1" />
             <path d="M 0 -45 L -5 -60" stroke="black" strokeWidth="4" />
             <path d="M 0 -45 L 8 -58" stroke="black" strokeWidth="4" />
          </g>
        );
      case PlayerColor.GREEN:
        return (
          <g>
             <circle cx="-25" cy="-25" r="9" fill="#4ADE80" stroke="#166534" strokeWidth="2" />
             <circle cx="25" cy="-25" r="9" fill="#4ADE80" stroke="#166534" strokeWidth="2" />
             <circle cx="-25" cy="-25" r="5" fill="#15803D" />
             <circle cx="25" cy="-25" r="5" fill="#15803D" />
             <circle r="36" fill="#4ADE80" stroke="#166534" strokeWidth="2" />
             <ellipse cx="0" cy="8" rx="16" ry="12" fill="#86EFAC" stroke="#166534" strokeWidth="1" />
             <circle cx="-6" cy="8" r="4" fill="#14532D" />
             <circle cx="6" cy="8" r="4" fill="#14532D" />
             <circle cx="-18" cy="-12" r="9" fill="white" stroke="black" strokeWidth="1" />
             <circle cx="18" cy="-12" r="9" fill="white" stroke="black" strokeWidth="1" />
             <circle cx="-18" cy="-12" r="2" fill="black" />
             <circle cx="18" cy="-12" r="2" fill="black" />
          </g>
        );
      case PlayerColor.BLUE:
        return (
          <g>
             <g transform="translate(0, -18)">
               <circle r="14" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
               <circle cx="-5" cy="-2" r="4" fill="white" /> <circle cx="-4" cy="-2" r="1.5" fill="black" />
               <circle cx="5" cy="-2" r="4" fill="white" /> <circle cx="4" cy="-2" r="1.5" fill="black" />
               <path d="M -2 4 L 0 7 L 2 4" fill="#FBBF24" />
               <circle cx="-3" cy="8" r="3" fill="#FCA5A5" opacity="0.4" />
               <circle cx="3" cy="8" r="3" fill="#FCA5A5" opacity="0.4" />
             </g>
             <g transform="translate(-16, 10)">
               <circle r="14" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
               <circle cx="-5" cy="-2" r="4" fill="white" /> <circle cx="-4" cy="-2" r="1.5" fill="black" />
               <circle cx="5" cy="-2" r="4" fill="white" /> <circle cx="4" cy="-2" r="1.5" fill="black" />
               <path d="M -2 4 L 0 7 L 2 4" fill="#FBBF24" />
             </g>
             <g transform="translate(16, 10)">
               <circle r="14" fill="#3B82F6" stroke="#1E40AF" strokeWidth="1" />
               <circle cx="-5" cy="-2" r="4" fill="white" /> <circle cx="-4" cy="-2" r="1.5" fill="black" />
               <circle cx="5" cy="-2" r="4" fill="white" /> <circle cx="4" cy="-2" r="1.5" fill="black" />
               <path d="M -2 4 L 0 7 L 2 4" fill="#FBBF24" />
             </g>
          </g>
        );
    }
  }

  const getDicePositionStyle = () => {
      switch(currentPlayer) {
          case PlayerColor.BLUE: return { left: '20%', top: '20%' };
          case PlayerColor.RED: return { left: '80%', top: '20%' };
          case PlayerColor.GREEN: return { left: '80%', top: '80%' };
          case PlayerColor.YELLOW: return { left: '20%', top: '80%' };
          default: return { left: '50%', top: '50%' };
      }
  };

  return (
    <div className="relative w-full h-full shadow-2xl rounded-xl overflow-hidden bg-slate-800 border-8 border-slate-700">
      <style>{`
          @keyframes jump {
              0% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-20px) scale(1.15); }
              100% { transform: translateY(0) scale(1); }
          }
          .animate-jump-step {
              animation: jump 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes slash {
              0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
              20% { opacity: 1; transform: scale(1.5) rotate(-20deg); }
              50% { transform: scale(1.2) rotate(10deg); }
              100% { opacity: 0; transform: scale(1) rotate(0deg); }
          }
          .animate-sword {
              animation: slash 1s ease-out forwards;
              transform-origin: center;
          }
          @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
              animation: spin-slow 4s linear infinite;
              transform-origin: center;
          }
      `}</style>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full bg-white">
        <defs>
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="15" />
                <feOffset dx="5" dy="10" result="offsetblur" />
                <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
                <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
        </defs>

        {renderTracks()}
        {renderBases()}
        {renderCenter()}
        {renderDecorations()}

        {tokens.map((token) => {
            let { x, y } = getCoordinates(token);
            let isSafeSpot = false;
            let countInSpot = 1;
            let indexInSpot = 0;
            if (token.position !== -1 && token.position <= 50) {
               const offset = START_OFFSETS[token.color];
               const globalIndex = (token.position + offset) % 52;
               if (SAFE_SPOTS.includes(globalIndex)) {
                  isSafeSpot = true;
                  const key = `track-${globalIndex}`;
                  const group = tokenGroups[key] || [];
                  countInSpot = group.length;
                  indexInSpot = group.indexOf(token);
               }
            }
            if (isSafeSpot && countInSpot > 1) {
                const gridOffset = CELL * 0.22; 
                const posIndex = indexInSpot % 4;
                x += (posIndex % 2 === 0 ? -1 : 1) * gridOffset;
                y += (Math.floor(posIndex / 2) === 0 ? -1 : 1) * gridOffset;
            }

            const isHighlighted = highlightedTokens.includes(token.id);
            const renderScale = isSafeSpot && countInSpot > 1 ? 0.6 : 1;
            const highlightColor = COLORS[token.color].main;

            return (
                <g 
                    key={token.id} 
                    transform={`translate(${x}, ${y}) scale(${renderScale})`}
                    onClick={() => isHighlighted && onTokenClick(token.id)}
                    className={isHighlighted ? 'cursor-pointer' : ''}
                    style={{ transition: 'all 0.3s linear' }}
                >
                     <circle cx="0" cy="8" r={CELL * 0.4} fill="black" opacity="0.3" filter="blur(4px)" />
                     
                     <g key={`anim-${token.position}`} className={token.position !== -1 ? "animate-jump-step" : ""}>
                        {getCharacterSVG(token.color)}
                     </g>

                    {isHighlighted && (
                       <circle 
                         cx="0" 
                         cy="0" 
                         r={CELL * 0.65} 
                         fill="none" 
                         stroke={highlightColor} 
                         strokeWidth="8" 
                         strokeDasharray="20, 15" 
                         className="animate-spin-slow" 
                         opacity="1" 
                       />
                    )}
                </g>
            );
        })}
      </svg>
      
      {/* Sword Capture Overlay */}
      {swordCoords && (
          <div 
             className="absolute z-30 pointer-events-none animate-sword"
             style={{ 
                 left: swordCoords.x / SIZE * 100 + '%',
                 top: swordCoords.y / SIZE * 100 + '%',
                 width: '15%',
                 height: '15%',
                 marginLeft: '-7.5%',
                 marginTop: '-7.5%'
             }}
          >
             <Swords size="100%" color="#EF4444" strokeWidth={2} fill="#FCA5A5" />
          </div>
      )}

      <div 
         className="absolute w-[15%] h-[15%] z-20 flex items-center justify-center"
         style={{ 
             ...getDicePositionStyle(),
             transform: 'translate(-50%, -50%)',
             transition: 'left 0.5s ease-in-out, top 0.5s ease-in-out'
         }}
      >
          <div className="relative flex flex-col items-center">
             <ThreeDDice 
                value={diceValue || 1} 
                isRolling={isRolling}
                onClick={() => !isRolling && turnStep === 'ROLL' && onDiceClick()}
                size={window.innerWidth < 768 ? 30 : 40}
                disabled={turnStep !== 'ROLL'}
             />
             
             {/* Small Timer Under Dice - Visible during ROLL and MOVE */}
             {!isRolling && (turnStep === 'MOVE' || turnStep === 'ROLL') && (
                <div className="mt-2 w-[40px] h-1.5 rounded-full overflow-hidden border border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]">
                    <div 
                        className={`h-full bg-yellow-400 ${moveTimer === 15 ? 'transition-none' : 'transition-all duration-1000 ease-linear'}`}
                        style={{ width: `${(moveTimer / 15) * 100}%` }}
                    />
                </div>
             )}
          </div>
      </div>
    </div>
  );
};
