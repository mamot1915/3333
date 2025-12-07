
import React, { useEffect, useRef, useState } from 'react';

interface ThreeDDiceProps {
  value: number | null;
  isRolling: boolean;
  onClick?: () => void;
  size?: number;
  disabled?: boolean;
}

export const ThreeDDice: React.FC<ThreeDDiceProps> = ({ 
  value, 
  isRolling, 
  onClick, 
  size = 100,
  disabled = false
}) => {
  // We keep track of the total rotation to ensure we always spin "forward"
  const rotationRef = useRef({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });

  // Map dice values to specific 3D rotations
  const getTargetRotation = (val: number) => {
    switch (val) {
      case 1: return { x: 0, y: 0 };       // Face 1 is Front
      case 6: return { x: 180, y: 0 };     // Face 6 is Back
      case 2: return { x: 90, y: 0 };      // Face 2 is Bottom
      case 5: return { x: -90, y: 0 };     // Face 5 is Top
      case 3: return { x: 0, y: -90 };     // Face 3 is Right
      case 4: return { x: 0, y: 90 };      // Face 4 is Left
      default: return { x: 0, y: 0 };
    }
  };

  useEffect(() => {
    if (!isRolling && value) {
      const target = getTargetRotation(value);
      const current = rotationRef.current;

      let nextX = target.x;
      let nextY = target.y;
      
      const adjustRotation = (currentVal: number, targetVal: number) => {
          let next = currentVal + 720; 
          const remainder = next % 360;
          const targetRemainder = ((targetVal % 360) + 360) % 360;
          const diff = targetRemainder - ((remainder + 360) % 360);
          return next + diff;
      };

      nextX = adjustRotation(current.x, target.x);
      nextY = adjustRotation(current.y, target.y);

      rotationRef.current = { x: nextX, y: nextY };
      setCurrentRotation({ x: nextX, y: nextY });
    }
  }, [value, isRolling]);

  // Dot generation helper
  const renderDots = (count: number) => {
    const pos: Record<number, number[][]> = {
      1: [[50, 50]],
      2: [[20, 20], [80, 80]],
      3: [[20, 20], [50, 50], [80, 80]],
      4: [[20, 20], [20, 80], [80, 20], [80, 80]],
      5: [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]],
      6: [[20, 20], [20, 50], [20, 80], [80, 20], [80, 50], [80, 80]]
    };

    return pos[count].map((p, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: `${p[0]}%`,
          top: `${p[1]}%`,
          transform: 'translate(-50%, -50%)',
          width: '18%',
          height: '18%',
          background: 'radial-gradient(circle at 30% 30%, #FCD34D 0%, #F59E0B 40%, #B45309 100%)',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.9)'
        }}
      />
    ));
  };

  const Face = ({ val, transform }: { val: number, transform: string }) => (
    <div
      className="absolute flex items-center justify-center box-border"
      style={{
        transform,
        // Make faces larger than container to overlap and hide seams (overlap by 1px on all sides)
        width: size + 1, 
        height: size + 1,
        borderRadius: size * 0.15,
        // Black Glossy Plastic Look
        background: 'linear-gradient(145deg, #1a1a1a 0%, #000000 100%)',
        boxShadow: 'inset 0 0 8px rgba(255,255,255,0.1)', 
        backfaceVisibility: 'hidden',
        // Center the larger face
        left: -0.5,
        top: -0.5,
      }}
    >
      {renderDots(val)}
    </div>
  );

  // Inner core to block light through gaps
  const CoreFace = ({ transform }: { transform: string }) => (
    <div 
      className="absolute bg-black"
      style={{
        width: size - 2,
        height: size - 2,
        left: 1,
        top: 1,
        transform: transform,
        backfaceVisibility: 'visible'
      }}
    />
  );

  return (
    <div 
      className={`relative perspective-1000 group ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ width: size, height: size }}
      onClick={!disabled && !isRolling ? onClick : undefined}
    >
       <style>{`
        .dice-container {
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
        }
        @keyframes random-roll {
          0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
          25% { transform: rotateX(120deg) rotateY(180deg) rotateZ(45deg); }
          50% { transform: rotateX(-60deg) rotateY(200deg) rotateZ(90deg); }
          75% { transform: rotateX(180deg) rotateY(300deg) rotateZ(180deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        .animate-chaos {
          animation: random-roll 0.6s linear infinite;
        }
      `}</style>

      {/* The 3D Object */}
      <div
        className={`dice-container bg-transparent transition-transform duration-700 ease-[cubic-bezier(0.2,1.8,0.5,1)] ${isRolling ? 'animate-chaos' : ''}`}
        style={{
          transform: isRolling 
            ? undefined 
            : `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`
        }}
      >
        {/* Solid Inner Core Cube */}
        <CoreFace transform={`rotateY(0deg) translateZ(${size/2 - 1}px)`} />
        <CoreFace transform={`rotateY(180deg) translateZ(${size/2 - 1}px)`} />
        <CoreFace transform={`rotateY(90deg) translateZ(${size/2 - 1}px)`} />
        <CoreFace transform={`rotateY(-90deg) translateZ(${size/2 - 1}px)`} />
        <CoreFace transform={`rotateX(90deg) translateZ(${size/2 - 1}px)`} />
        <CoreFace transform={`rotateX(-90deg) translateZ(${size/2 - 1}px)`} />

        {/* Outer Faces with slight overlap */}
        <Face val={1} transform={`rotateY(0deg) translateZ(${size / 2}px)`} />
        <Face val={6} transform={`rotateY(180deg) translateZ(${size / 2}px)`} />
        <Face val={3} transform={`rotateY(90deg) translateZ(${size / 2}px)`} />
        <Face val={4} transform={`rotateY(-90deg) translateZ(${size / 2}px)`} />
        <Face val={5} transform={`rotateX(90deg) translateZ(${size / 2}px)`} />
        <Face val={2} transform={`rotateX(-90deg) translateZ(${size / 2}px)`} />
      </div>

      {/* Shadow underneath */}
      <div 
        className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[80%] h-[20%] bg-black/40 blur-md rounded-full transition-all duration-300"
        style={{ 
            opacity: isRolling ? 0.6 : 0.4,
            transform: isRolling ? 'translate(-50%, 0) scale(0.8)' : 'translate(-50%, 0) scale(1)'
        }}
      />
    </div>
  );
};
