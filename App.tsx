
import React, { useState, useEffect, useRef } from 'react';
import { LudoBoard } from './components/LudoBoard';
import { PlayerColor, GameState, Token, PlayerProfile } from './types';
import { INITIAL_TOKENS, COLORS, START_OFFSETS, SAFE_SPOTS } from './constants';
import { Trophy, Menu, X, Link as LinkIcon, Copy, Check, Upload, Music, Globe, Users, Play, Ban, Lock, Unlock, UserPlus, Zap } from 'lucide-react';

declare var Peer: any;

// Country List for Selector
const COUNTRIES = [
    { code: 'IR', name: 'Iran' },
    { code: 'US', name: 'USA' },
    { code: 'GB', name: 'UK' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'BR', name: 'Brazil' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IN', name: 'India' },
    { code: 'CN', name: 'China' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'S. Korea' },
    { code: 'TR', name: 'Turkey' },
    { code: 'RU', name: 'Russia' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SA', name: 'Saudi Arabia' },
];

const FlagSelector = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (url: string) => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-white font-bold">Select Country Flag</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="overflow-y-auto p-4 grid grid-cols-4 gap-4 scrollbar-hide">
                    {COUNTRIES.map(c => {
                        const url = `https://flagcdn.com/w80/${c.code.toLowerCase()}.png`;
                        return (
                            <button 
                                key={c.code} 
                                onClick={() => { onSelect(url); onClose(); }}
                                className="flex flex-col items-center gap-2 hover:bg-slate-800 p-2 rounded-lg transition-colors"
                            >
                                <img src={url} alt={c.name} className="w-10 h-auto rounded shadow-sm object-cover" />
                                <span className="text-[10px] text-slate-300">{c.code}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const PlayerProfileWidget = ({ 
    profile, 
    color, 
    onUpdate,
    positionClass,
    isMe,
    canEdit
}: { 
    profile: PlayerProfile, 
    color: PlayerColor, 
    onUpdate: (field: 'name' | 'flag', value: string) => void,
    positionClass: string,
    isMe: boolean,
    canEdit: boolean
}) => {
    const [isSelectorOpen, setSelectorOpen] = useState(false);

    // Don't render if inactive
    if (!profile.isActive) return null;

    return (
        <div className={`absolute ${positionClass} flex flex-col items-center gap-2 z-20`}>
            <div 
                onClick={() => canEdit && setSelectorOpen(true)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-800/80 backdrop-blur border-4 shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300
                ${canEdit ? 'cursor-pointer hover:scale-105 hover:border-white' : 'border-slate-500'}
                ${isMe ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''}
                `}
                style={{ borderColor: COLORS[color].main }}
            >
                {profile.flag ? (
                    <img src={profile.flag} alt="flag" className="w-full h-full object-cover" />
                ) : (
                    <Globe className="text-slate-400 w-6 h-6 md:w-8 md:h-8" />
                )}
            </div>
            
            <input 
                type="text" 
                value={profile.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                maxLength={12}
                disabled={!canEdit}
                placeholder="Name"
                className={`w-24 text-center bg-transparent text-xs text-white px-1 py-0.5 outline-none placeholder-white/30
                ${canEdit ? 'border-b border-white/30 focus:border-white' : 'border-none opacity-80 cursor-default'}
                `}
            />
            
            <FlagSelector 
                isOpen={isSelectorOpen} 
                onClose={() => setSelectorOpen(false)} 
                onSelect={(url) => onUpdate('flag', url)} 
            />
        </div>
    );
};

const Confetti = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const colors = ['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#FFFFFF'];
        const newParticles = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: -10 - Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 0.8 + 0.4,
            speed: Math.random() * 1 + 0.5,
            wobble: Math.random() * 10,
            delay: Math.random() * 2
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${p.x}%`,
                        top: `-10%`,
                        width: `${p.size}rem`,
                        height: `${p.size * 0.6}rem`,
                        backgroundColor: p.color,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${3 + Math.random() * 2}s`
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); top: -10%; opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); top: 110%; opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti-fall linear infinite;
                }
            `}</style>
        </div>
    );
};

export default function App() {
  // --- Multiplayer Identity & PeerJS ---
  const [peerId, setPeerId] = useState<string>('');
  const [hostId] = useState(() => new URLSearchParams(window.location.search).get('hostId'));
  const isHost = !hostId;
  
  // Host stores connections along with the assigned color
  const connectionsRef = useRef<{ conn: any, color: PlayerColor }[]>([]); 
  const connectionRef = useRef<any>(null); // For Guest

  const [myColor, setMyColor] = useState<PlayerColor>(isHost ? PlayerColor.RED : PlayerColor.BLUE);

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    tokens: INITIAL_TOKENS,
    currentPlayer: PlayerColor.BLUE,
    diceValue: null,
    isRolling: false,
    isMoving: false,
    gameLog: ["Waiting for players..."],
    winner: null,
    status: 'LOBBY',
    captureEvent: null,
  });

  // Flow Control
  const [turnStep, setTurnStep] = useState<'ROLL' | 'MOVE'>('ROLL');
  const [menuOpen, setMenuOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  // Game Lifecycle
  const [manualLock, setManualLock] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  
  // Audio Refs
  const applauseRef = useRef<HTMLAudioElement | null>(null);

  // Player Profiles
  const [playerProfiles, setPlayerProfiles] = useState<Record<PlayerColor, PlayerProfile>>({
    [PlayerColor.BLUE]: { name: 'Waiting...', flag: null, isActive: true, isBot: false },
    [PlayerColor.RED]: { name: 'Host (You)', flag: null, isActive: true, isBot: false },
    [PlayerColor.GREEN]: { name: 'Waiting...', flag: null, isActive: true, isBot: false },
    [PlayerColor.YELLOW]: { name: 'Waiting...', flag: null, isActive: true, isBot: false },
  });
  
  // Sound
  const [customDiceSound, setCustomDiceSound] = useState<string | null>(null);
  
  // Timer State
  const [moveTimer, setMoveTimer] = useState(15);
  
  // Queue System
  const [isQueueMode, setIsQueueMode] = useState(false); 
  const [queueSpotTaken, setQueueSpotTaken] = useState(false);

  // --- PeerJS Logic ---
  useEffect(() => {
    const peer = new Peer(undefined, { debug: 1 });

    peer.on('open', (id: string) => {
      setPeerId(id);
      
      if (!isHost && hostId) {
        // I am Guest, connect to Host
        const conn = peer.connect(hostId);
        connectionRef.current = conn;

        conn.on('open', () => {
          conn.send({ type: 'JOIN' });
        });

        conn.on('data', (data: any) => {
          if (data.type === 'SYNC') {
             setGameState(data.payload.gameState);
             setPlayerProfiles(data.payload.playerProfiles);
             if (data.payload.turnStep) setTurnStep(data.payload.turnStep);
             // Sync Timer
             if (typeof data.payload.moveTimer === 'number') setMoveTimer(data.payload.moveTimer);
          } else if (data.type === 'WELCOME') {
             setMyColor(data.color);
          } else if (data.type === 'ERROR') {
             alert(data.message);
          }
        });
      }
    });

    if (isHost) {
      peer.on('connection', (conn: any) => {
        conn.on('open', () => {
           // Assign a unique color to this connection
           const assignedColors = [PlayerColor.RED, ...connectionsRef.current.map(c => c.color)];
           const allColors = [PlayerColor.BLUE, PlayerColor.GREEN, PlayerColor.YELLOW]; // Preference order
           const nextColor = allColors.find(c => !assignedColors.includes(c));

           if (nextColor) {
               // Successful Join
               connectionsRef.current.push({ conn, color: nextColor });
               
               setPlayerProfiles(prev => {
                   const newProfiles = { ...prev };
                   newProfiles[nextColor] = { 
                       ...newProfiles[nextColor], 
                       isBot: false, 
                       isRemote: true, 
                       name: `Player ${connectionsRef.current.length + 1}` 
                   };
                   
                   // Sync immediately with new profile
                   conn.send({ type: 'WELCOME', color: nextColor });
                   broadcastState({ profiles: newProfiles });
                   return newProfiles;
               });
           } else {
               // Room Full
               conn.send({ type: 'ERROR', message: 'Room is full (4 players max)' });
               setTimeout(() => conn.close(), 500);
           }
        });

        conn.on('data', (data: any) => {
           // Find which color this connection is
           const sender = connectionsRef.current.find(c => c.conn === conn);
           if (!sender) return;

           const senderColor = sender.color;

           if (data.type === 'ROLL') {
               // Only allow if it's their turn
               setGameState(current => {
                   if (current.currentPlayer === senderColor && !current.isRolling && !current.diceValue) {
                       // We can't update state inside callback like this safely for complex logic, 
                       // so we trigger the handler via effect or direct call.
                       // For simplicity, we'll allow the effect loop or handleRollDice to check validity.
                       handleRollDice(true, senderColor); 
                   }
                   return current;
               });
           } else if (data.type === 'MOVE') {
               handleTokenClick(data.tokenId, true, senderColor);
           } else if (data.type === 'UPDATE_PROFILE') {
               setPlayerProfiles(prev => ({
                   ...prev,
                   [senderColor]: { ...prev[senderColor], ...data.updates }
               }));
           }
        });
        
        conn.on('close', () => {
             const disconnected = connectionsRef.current.find(c => c.conn === conn);
             if (disconnected) {
                 connectionsRef.current = connectionsRef.current.filter(c => c.conn !== conn);
                 setPlayerProfiles(prev => ({
                     ...prev,
                     [disconnected.color]: { ...prev[disconnected.color], isRemote: false, name: 'Disconnected' }
                 }));
             }
        });
      });
    }

    return () => peer.destroy();
  }, [hostId, isHost]);

  // Host: Broadcast helper
  const broadcastState = (overrides?: { gs?: GameState, profiles?: any, step?: any, timer?: number }) => {
      if (!isHost) return;
      const payload = { 
          type: 'SYNC', 
          payload: { 
              gameState: overrides?.gs || gameState, 
              playerProfiles: overrides?.profiles || playerProfiles, 
              turnStep: overrides?.step || turnStep, 
              moveTimer: overrides?.timer !== undefined ? overrides.timer : moveTimer 
          } 
      };
      connectionsRef.current.forEach(c => {
          if (c.conn.open) c.conn.send(payload);
      });
  };

  // Host: Broadcast State on Change
  useEffect(() => {
      if (isHost) {
          broadcastState();
      }
  }, [gameState, playerProfiles, turnStep, moveTimer, isHost]);

  // Initialize Applause Sound
  useEffect(() => {
    applauseRef.current = new Audio("https://actions.google.com/sounds/v1/crowds/applause_large_crowd.ogg");
  }, []);

  // --- Strict Identity & Bot Logic ---
  useEffect(() => {
    if (!isHost) return;

    if (gameState.status === 'PLAYING' && gameState.winner === null) {
        const currentPlayerProfile = playerProfiles[gameState.currentPlayer];
        
        // Host (Red) Auto-actions only if Host is AFK? No, we don't auto-play for Host unless 'isBot' is true.
        // Currently Host is always human (isBot: false).

        // Bot Logic for unfilled slots that might have been left as bots (optional, but requested behavior is "remove them")
        // The requested behavior is: "If less than 4 players, remove the others". 
        // So effectively, there are NO bots in this version.
        
        // Skip logic for inactive players is handled in finishTurn.
    }
  }, [gameState, turnStep, playerProfiles, isHost]);

  // --- Start Game Logic ---
  const handleStartGame = () => {
      setMenuOpen(false);
      setCountDown(10);
      
      // Update profiles immediately to show host initiated countdown
      setGameState(prev => ({ ...prev, gameLog: [...prev.gameLog, "Host started countdown..."] }));
  };

  useEffect(() => {
      if (countDown === null) return;
      if (countDown > 0) {
          const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
          return () => clearTimeout(timer);
      } else {
          // Timer finished: Start Game
          if (!isHost) return; 

          setCountDown(null);
          setManualLock(true); 
          
          // Determine who is actually playing
          // Red is Host (always active)
          // Others are active ONLY if isRemote is true (meaning a human is connected)
          
          setPlayerProfiles(prevProfiles => {
              const newProfiles = { ...prevProfiles };
              const activeColors: PlayerColor[] = [];
              
              (Object.keys(newProfiles) as PlayerColor[]).forEach(color => {
                  if (color === PlayerColor.RED) {
                      newProfiles[color].isActive = true;
                      activeColors.push(color);
                  } else {
                      if (newProfiles[color].isRemote) {
                          newProfiles[color].isActive = true;
                          activeColors.push(color);
                      } else {
                          // No player connected, remove this color from game
                          newProfiles[color].isActive = false;
                      }
                  }
              });

              // Filter tokens to only include active players
              const newTokens = INITIAL_TOKENS.filter(t => activeColors.includes(t.color));
              
              const newGameState = { 
                  ...gameState, 
                  tokens: newTokens,
                  status: 'PLAYING' as const, // Explicit cast
                  gameLog: ["Game Started!"] 
              };

              setGameState(newGameState);
              broadcastState({ gs: newGameState, profiles: newProfiles });
              
              return newProfiles;
          });
      }
  }, [countDown, isHost]);

  // --- Winning Logic ---
  const checkWinCondition = (tokens: Token[], player: PlayerColor) => {
      const finishedCount = tokens.filter(t => t.color === player && t.position === 56).length;
      if (finishedCount === 4) {
          handleWin(player);
      }
  };

  const handleWin = (winner: PlayerColor) => {
      setGameState(prev => ({ ...prev, winner, status: 'FINISHED' }));
      
      if (applauseRef.current) {
          applauseRef.current.currentTime = 0;
          applauseRef.current.play().catch(() => {});
      }
  };

  const handleAdmitNextPlayers = () => {
      setGameState({
        tokens: INITIAL_TOKENS,
        currentPlayer: PlayerColor.BLUE,
        diceValue: null,
        isRolling: false,
        isMoving: false,
        gameLog: ["New players admitted!"],
        winner: null,
        status: 'LOBBY',
        captureEvent: null
      });
      setTurnStep('ROLL');
      setManualLock(false);
      setMenuOpen(false);
      
      // Reset all slots to waiting
      setPlayerProfiles(prev => {
          const next = { ...prev };
          (Object.keys(next) as PlayerColor[]).forEach((k) => {
              // Keep remote connections, just reset status logic if needed
              // Actually we want to keep connected players
              if (k === PlayerColor.RED || next[k].isRemote) {
                  next[k].isActive = true;
              } else {
                  next[k].isActive = true; // Open lobby back up visually
              }
          });
          return next;
      });
  };

  // --- Handlers ---
  const handleRollDice = (forceSystemInput: boolean = false, requestingColor?: PlayerColor) => {
    // 1. Identification Check
    if (isHost) {
        // I am Host.
        // If it's a forced system input (from network or timer), proceed.
        // If it's a manual click (forceSystemInput=false), ensure it is MY turn (Red).
        if (!forceSystemInput && gameState.currentPlayer !== PlayerColor.RED) return;
        
        // If network request, ensure the requester matches the current player
        if (requestingColor && requestingColor !== gameState.currentPlayer) return;
    } else {
        // I am Guest.
        // Send request to Host.
        if (gameState.currentPlayer === myColor && connectionRef.current?.open) {
            connectionRef.current.send({ type: 'ROLL' });
        }
        return; // Client stops here, waits for sync
    }

    if (gameState.winner) return;
    if (gameState.status !== 'PLAYING') return; 
    if (gameState.isRolling || gameState.isMoving) return;
    if (gameState.diceValue !== null) return; // Already rolled
    
    setGameState(prev => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      const newLog = [...gameState.gameLog.slice(-4), `${playerProfiles[gameState.currentPlayer].name} rolled a ${newValue}`];

      setGameState(prev => {
        const nextState = {
            ...prev,
            isRolling: false,
            diceValue: newValue,
            gameLog: newLog
        };
        
        // Check moves immediately after state update (in next render cycle effectively, 
        // but for Host logic we need to determine next step)
        return nextState;
      });

      // Logic to determine if move is possible needs the new value
      const canMove = hasValidMoves(gameState.currentPlayer, newValue, gameState.tokens);

      if (canMove) {
          setTurnStep('MOVE');
          setMoveTimer(15); 
      } else {
          setTurnStep('MOVE'); // Still switch to MOVE phase to show "No moves"
          setTimeout(() => {
              finishTurn(gameState.tokens, `No valid moves for ${playerProfiles[gameState.currentPlayer].name}.`, false);
          }, 1500); 
      }
    }, 800);
  };

  const hasValidMoves = (player: PlayerColor, dice: number, tokens: Token[]) => {
      return tokens
        .filter(t => t.color === player)
        .some(t => {
             if (t.position === -1) return dice === 6;
             return (t.position + dice) <= 56;
        });
  };

  const finishTurn = (tokens: Token[], logMessage: string, rolledSix: boolean) => {
      if (gameState.winner) return;

      let nextPlayer = gameState.currentPlayer;
      let nextLogMsg = logMessage;

      if (rolledSix) {
          nextLogMsg += " Rolled 6! Bonus turn.";
      } else {
          const order = [PlayerColor.BLUE, PlayerColor.RED, PlayerColor.GREEN, PlayerColor.YELLOW];
          let nextIdx = order.indexOf(gameState.currentPlayer);
          let loops = 0;
          do {
              nextIdx = (nextIdx + 1) % 4;
              loops++;
          } while (!playerProfiles[order[nextIdx]].isActive && loops < 4);
          
          if (loops >= 4) {
             // Everyone is inactive? (Shouldn't happen)
             return;
          }
          nextPlayer = order[nextIdx];
      }

      setGameState(prev => ({
          ...prev,
          tokens: tokens,
          currentPlayer: nextPlayer,
          isMoving: false, 
          gameLog: [...prev.gameLog, nextLogMsg],
          diceValue: null
      }));
      
      setTurnStep('ROLL');
      setMoveTimer(15); 
  };

  const handleTokenClick = async (tokenId: string, forceSystemInput: boolean = false, requestingColor?: PlayerColor) => {
    // 1. Identification Check
    if (isHost) {
        // If manual click, must be Red
        if (!forceSystemInput && gameState.currentPlayer !== PlayerColor.RED) return;
        // If network request, must be from current player
        if (requestingColor && requestingColor !== gameState.currentPlayer) return;
    } else {
        // Guest: Request Move
        if (gameState.currentPlayer === myColor && connectionRef.current?.open) {
             const token = gameState.tokens.find(t => t.id === tokenId);
             if (token && token.color === myColor) {
                 connectionRef.current.send({ type: 'MOVE', tokenId });
             }
        }
        return;
    }

    if (gameState.winner) return;
    const token = gameState.tokens.find(t => t.id === tokenId);
    if (!token) return;

    if (gameState.isMoving || !gameState.diceValue) return;
    if (token.color !== gameState.currentPlayer) return;

    const diceVal = gameState.diceValue || 0;
    const isMoveValid = (token.position === -1 && diceVal === 6) || (token.position !== -1 && token.position + diceVal <= 56);
    if (!isMoveValid) return;

    setGameState(prev => ({ ...prev, isMoving: true }));

    let startPos = token.position;
    let endPos = startPos;
    if (token.position === -1 && diceVal === 6) {
        endPos = 0;
    } else {
        endPos = startPos + diceVal;
    }

    // Animation loop
    if (startPos !== -1) {
        for (let i = startPos + 1; i <= endPos; i++) {
             setGameState(prev => ({
                 ...prev,
                 tokens: prev.tokens.map(t => t.id === tokenId ? { ...t, position: i } : t)
             }));
             await new Promise(r => setTimeout(r, 250));
        }
    } else {
         setGameState(prev => ({
             ...prev,
             tokens: prev.tokens.map(t => t.id === tokenId ? { ...t, position: 0 } : t)
         }));
         await new Promise(r => setTimeout(r, 250));
    }

    // Determine final state after animation
    const finalPos = endPos; 
    let captureOccurred = false;
    let captureLog = "";
    let opponentToResetId: string | null = null;
    let newCaptureEvent = null;

    if (finalPos <= 50) {
        const currentOffset = START_OFFSETS[token.color];
        const globalIndex = (finalPos + currentOffset) % 52;
        const isSafeSpot = SAFE_SPOTS.includes(globalIndex);
        
        if (!isSafeSpot) {
            const opponentToken = gameState.tokens.find(t => {
               if (t.color === gameState.currentPlayer || t.position === -1 || t.position > 50) return false;
               const oppOffset = START_OFFSETS[t.color];
               const oppGlobalIndex = (t.position + oppOffset) % 52;
               return oppGlobalIndex === globalIndex;
            });
            
            if (opponentToken) {
                opponentToResetId = opponentToken.id;
                captureOccurred = true;
                captureLog = ` Captured ${opponentToken.color}!`;
                newCaptureEvent = { globalIndex };
            }
        }
    }

    if (newCaptureEvent) {
         setGameState(prev => ({ ...prev, captureEvent: newCaptureEvent }));
         setTimeout(() => {
             setGameState(prev => ({ ...prev, captureEvent: null }));
         }, 1500);
    }

    let finalTokenList = gameState.tokens.map(t => {
        if (t.id === tokenId) return { ...t, position: finalPos }; 
        if (t.id === opponentToResetId) return { ...t, position: -1 };
        return t;
    });

    const rolledSix = diceVal === 6;
    let logMsg = `${playerProfiles[gameState.currentPlayer].name} moved.`;
    if (captureOccurred) logMsg += captureLog;
    if (finalPos === 56) logMsg += " Reached Home!";

    checkWinCondition(finalTokenList, gameState.currentPlayer);

    if (!gameState.winner) {
        finishTurn(finalTokenList, logMsg, rolledSix);
    } else {
         setGameState(prev => ({
          ...prev,
          tokens: finalTokenList,
          isMoving: false,
          gameLog: [...prev.gameLog, logMsg]
      }));
    }
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('mode');
    url.searchParams.set('hostId', peerId);
    
    navigator.clipboard.writeText(url.toString());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };
  
  const handleSoundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const url = URL.createObjectURL(file);
          setCustomDiceSound(url);
      }
  };

  const handleProfileUpdate = (color: PlayerColor, field: 'name' | 'flag', value: string) => {
    if (color !== myColor) return;
    setPlayerProfiles(prev => {
        const newState = {
            ...prev,
            [color]: { ...prev[color], [field]: value }
        };
        // If Guest, send update to Host
        if (!isHost && connectionRef.current?.open) {
            connectionRef.current.send({ type: 'UPDATE_PROFILE', color, updates: { [field]: value } });
        }
        return newState;
    });
  };
  
  const kickPlayer = (color: PlayerColor) => {
      if (!isHost) return;
      // Find connection with this color and close it
      const connectionInfo = connectionsRef.current.find(c => c.color === color);
      if (connectionInfo) {
          connectionInfo.conn.close();
          connectionsRef.current = connectionsRef.current.filter(c => c.color !== color);
      }

      setPlayerProfiles(prev => ({
          ...prev,
          [color]: { ...prev[color], isActive: false, isRemote: false, name: 'Empty' }
      }));
  };

  const getSelectableTokens = () => {
      if (turnStep !== 'MOVE' || !gameState.diceValue || gameState.isMoving) return [];
      return gameState.tokens
        .filter(t => t.color === gameState.currentPlayer)
        .filter(t => {
            if (t.position === -1) return gameState.diceValue === 6;
            return (t.position + (gameState.diceValue || 0)) <= 56;
        })
        .map(t => t.id);
  };

  const selectableTokens = getSelectableTokens();

  // --- Main Timer Logic (Roll & Move) ---
  useEffect(() => {
      // Guest does not run timer logic, only Host
      if (!isHost) return;

      let interval: any;
      if (gameState.status === 'PLAYING' && !gameState.winner && !gameState.isMoving && !gameState.isRolling) {
          if (moveTimer > 0) {
              interval = setInterval(() => {
                  setMoveTimer(prev => prev - 1);
              }, 1000);
          } else {
              // Timer Reached 0 - Auto Turn Logic
              if (turnStep === 'ROLL') {
                  handleRollDice(true); // System auto-roll
              } else if (turnStep === 'MOVE') {
                  if (selectableTokens.length > 0) {
                      const bestToken = gameState.tokens
                              .filter(t => selectableTokens.includes(t.id))
                              .sort((a,b) => b.position - a.position)[0];
                      if(bestToken) handleTokenClick(bestToken.id, true);
                  } else {
                      finishTurn(gameState.tokens, "Time's up!", false);
                  }
              }
          }
      }
      return () => clearInterval(interval);
  }, [turnStep, moveTimer, selectableTokens, gameState.currentPlayer, myColor, gameState.winner, gameState.status, gameState.isMoving, gameState.isRolling, isHost]);

  // --- Queue Screen Component (Guest View) ---
  if (isQueueMode) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
              <h1 className="text-white text-2xl font-bold mb-8">Waiting Queue</h1>
              {!queueSpotTaken ? (
                  <button 
                      onClick={() => {
                          setQueueSpotTaken(true);
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105"
                  >
                      JOIN QUEUE
                  </button>
              ) : (
                  <div className="flex flex-col items-center gap-4">
                      <div className="text-green-400 font-mono text-xl animate-pulse">Position Reserved</div>
                      <p className="text-slate-500 text-sm">Please wait for the current game to finish.</p>
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 overflow-hidden relative font-sans select-none">
       
       {/* COUNTDOWN OVERLAY */}
       {countDown !== null && (
           <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
               <div className="text-[12rem] font-black text-white animate-pulse">
                   {countDown}
               </div>
               <div className="absolute bottom-10 text-white text-xl">Game Starting...</div>
           </div>
       )}
       
       {/* WINNER OVERLAY */}
       {gameState.winner && (
           <>
                <Confetti />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center animate-bounce">
                    <Trophy size={80} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                    <h1 className="text-6xl font-black text-white drop-shadow-xl mt-4 border-text">
                        {playerProfiles[gameState.winner].name} WINS!
                    </h1>
                </div>
           </>
       )}

       {/* Header */}
       <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
          {/* Title/Turn Indicator */}
          <div className="pointer-events-auto bg-slate-800/90 backdrop-blur border border-slate-700 rounded-2xl p-3 shadow-xl flex items-center gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Turn</span>
                <span className="text-xl font-black" style={{ color: COLORS[gameState.currentPlayer].light }}>
                   {playerProfiles[gameState.currentPlayer].name}
                </span>
             </div>
             <div className="h-8 w-px bg-slate-700"></div>
             <div className="flex items-center gap-2">
                <Trophy className="text-yellow-500 w-5 h-5" />
                <span className="font-bold text-white">Ludo Master</span>
             </div>
             {/* Connection Status Indicator */}
             <div className="flex items-center gap-1 ml-2">
                 {isHost ? (
                     <div className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded-md">
                         <Users size={12} className="text-slate-300"/>
                         <span className="text-xs text-slate-300">{connectionsRef.current.length}</span>
                     </div>
                 ) : (
                     <div className={`w-2 h-2 rounded-full ${peerId ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></div>
                 )}
             </div>
          </div>
          
          {/* Menu Button - ONLY VISIBLE TO HOST */}
          <div className="pointer-events-auto relative">
             {isHost && (
                 <button onClick={() => setMenuOpen(!menuOpen)} className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl border border-slate-600 transition-colors shadow-lg">
                    <Menu />
                 </button>
             )}
             
             {/* Dropdown Menu */}
             {menuOpen && isHost && (
                 <div className="absolute top-12 right-0 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 flex flex-col gap-3 z-50">
                    <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                        <span className="font-bold text-white">Menu</span>
                        <button onClick={() => setMenuOpen(false)} className="text-slate-400 hover:text-white"><X size={16}/></button>
                    </div>

                    {gameState.status === 'LOBBY' && (
                        <button 
                            onClick={handleStartGame}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg mb-2"
                        >
                            <Play size={18} fill="currentColor"/> Start Game (10s)
                        </button>
                    )}

                    {/* Admin Options */}
                    <div className="space-y-2">
                        <button 
                            onClick={() => setManualLock(!manualLock)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors border ${manualLock ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-slate-700 border-transparent text-slate-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                {manualLock ? <Lock size={14}/> : <Unlock size={14}/>} 
                                {manualLock ? 'Game Locked' : 'Game Unlocked'}
                            </span>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${manualLock ? 'bg-red-500' : 'bg-slate-500'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${manualLock ? 'left-4.5' : 'left-0.5'}`}></div>
                            </div>
                        </button>
                        
                        {gameState.winner && (
                            <button 
                                onClick={handleAdmitNextPlayers}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg animate-pulse"
                            >
                                <UserPlus size={18}/> New Game
                            </button>
                        )}
                    </div>

                    {/* Active Players List */}
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 mt-2">
                         <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Users size={12} /> Connected Players
                         </div>
                         <div className="space-y-2">
                            {Object.values(PlayerColor).map(c => {
                                const p = playerProfiles[c];
                                if (!p.isActive && !p.isRemote && c !== PlayerColor.RED) return null;
                                return (
                                <div key={c} className="flex justify-between items-center text-xs group">
                                     <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full shadow-sm" style={{backgroundColor: COLORS[c].main}}></div>
                                        <span className={`font-medium ${c === myColor ? 'text-white' : 'text-slate-400'}`}>
                                            {p.name} {c === myColor ? '(You)' : ''}
                                            {p.isRemote && <span className="ml-1 text-[10px] bg-blue-900 text-blue-300 px-1 rounded">NET</span>}
                                        </span>
                                     </div>
                                     {c !== myColor && c !== PlayerColor.RED && p.isRemote && (
                                         <button 
                                            onClick={() => kickPlayer(c)}
                                            className="text-red-500 hover:bg-red-500/20 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                                            title="Kick Player"
                                         >
                                             <Ban size={12} />
                                         </button>
                                     )}
                                     {c === myColor && (
                                         <span className="text-emerald-400 text-[10px] font-bold">YOU</span>
                                     )}
                                </div>
                            )})}
                         </div>
                    </div>
                    
                    <button 
                        onClick={handleCopyLink}
                        disabled={!peerId}
                        className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors mt-2
                        ${(!peerId) ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}
                        `}
                    >
                        <span className="flex items-center gap-2"><LinkIcon size={14}/> Invite Link</span>
                        {peerId && (linkCopied ? <Check size={14}/> : <Copy size={14}/>)}
                    </button>
                    
                    <div className="bg-slate-900 rounded-lg p-2 border border-slate-700 mt-2">
                        <label className="text-xs text-slate-400 mb-2 block flex items-center gap-2">
                            <Music size={12}/> Custom Dice Sound
                        </label>
                        <label className="flex items-center justify-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs p-2 rounded border border-dashed border-slate-600 transition-colors">
                            <Upload size={12}/>
                            <span>{customDiceSound ? 'Sound Loaded' : 'Upload MP3/WAV'}</span>
                            <input type="file" accept="audio/*" onChange={handleSoundUpload} className="hidden" />
                        </label>
                    </div>
                 </div>
             )}
          </div>
       </div>
       
       {/* Profile Widgets */}
       <PlayerProfileWidget 
           profile={playerProfiles[PlayerColor.BLUE]} 
           color={PlayerColor.BLUE} 
           isMe={PlayerColor.BLUE === myColor}
           canEdit={PlayerColor.BLUE === myColor}
           onUpdate={(f, v) => handleProfileUpdate(PlayerColor.BLUE, f, v)}
           positionClass="top-[5%] left-[5%] md:top-[10%] md:left-[10%]"
       />
       <PlayerProfileWidget 
           profile={playerProfiles[PlayerColor.RED]} 
           color={PlayerColor.RED} 
           isMe={PlayerColor.RED === myColor}
           canEdit={PlayerColor.RED === myColor}
           onUpdate={(f, v) => handleProfileUpdate(PlayerColor.RED, f, v)}
           positionClass="top-[5%] right-[5%] md:top-[10%] md:right-[10%]"
       />
       <PlayerProfileWidget 
           profile={playerProfiles[PlayerColor.YELLOW]} 
           color={PlayerColor.YELLOW} 
           isMe={PlayerColor.YELLOW === myColor}
           canEdit={PlayerColor.YELLOW === myColor}
           onUpdate={(f, v) => handleProfileUpdate(PlayerColor.YELLOW, f, v)}
           positionClass="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
       />
       <PlayerProfileWidget 
           profile={playerProfiles[PlayerColor.GREEN]} 
           color={PlayerColor.GREEN} 
           isMe={PlayerColor.GREEN === myColor}
           canEdit={PlayerColor.GREEN === myColor}
           onUpdate={(f, v) => handleProfileUpdate(PlayerColor.GREEN, f, v)}
           positionClass="bottom-[5%] right-[5%] md:bottom-[10%] md:right-[10%]"
       />

       {/* Board Container */}
       <div className={`relative w-[80vmin] h-[80vmin] max-w-[600px] max-h-[600px] transition-all duration-1000`}>
          <LudoBoard 
            tokens={gameState.tokens}
            onTokenClick={handleTokenClick}
            highlightedTokens={selectableTokens}
            diceValue={gameState.diceValue}
            isRolling={gameState.isRolling}
            onDiceClick={() => handleRollDice()} // Manual click via UI
            currentPlayer={gameState.currentPlayer}
            turnStep={turnStep}
            moveTimer={moveTimer}
            customDiceSound={customDiceSound}
            captureEvent={gameState.captureEvent}
          />
       </div>
       
       {/* Game Log */}
       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700 pointer-events-none z-40">
          <p className="text-xs text-slate-300">
             {gameState.gameLog[gameState.gameLog.length - 1]}
          </p>
       </div>
    </div>
  );
}
