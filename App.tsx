
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
  const connectionsRef = useRef<any[]>([]); // For Host
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
    [PlayerColor.BLUE]: { name: 'Player 1', flag: null, isActive: true, isBot: true },
    [PlayerColor.RED]: { name: 'Host', flag: null, isActive: true, isBot: false },
    [PlayerColor.GREEN]: { name: 'Player 3', flag: null, isActive: true, isBot: true },
    [PlayerColor.YELLOW]: { name: 'Player 4', flag: null, isActive: true, isBot: true },
  });
  
  // Sound
  const [customDiceSound, setCustomDiceSound] = useState<string | null>(null);
  
  // Timer State
  const [moveTimer, setMoveTimer] = useState(15);
  
  // Queue System
  const [isQueueMode, setIsQueueMode] = useState(false); 
  const [queueSpotTaken, setQueueSpotTaken] = useState(false);
  const [queueEntryTime, setQueueEntryTime] = useState<number | null>(null);

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
          } else if (data.type === 'WELCOME') {
             setMyColor(data.color);
          }
        });
      }
    });

    if (isHost) {
      peer.on('connection', (conn: any) => {
        connectionsRef.current.push(conn);
        
        conn.on('open', () => {
           // On Join, assign Blue to first Guest for now
           // In a full implementation, find first available non-host slot
           setPlayerProfiles(prev => {
               const newProfiles = { ...prev };
               newProfiles[PlayerColor.BLUE] = { ...newProfiles[PlayerColor.BLUE], isBot: false, isRemote: true, name: 'Guest' };
               
               // Sync immediately
               conn.send({ type: 'WELCOME', color: PlayerColor.BLUE });
               conn.send({ type: 'SYNC', payload: { gameState, playerProfiles: newProfiles, turnStep } });
               return newProfiles;
           });
        });

        conn.on('data', (data: any) => {
           if (data.type === 'ROLL') {
               handleRollDice(true); // Force system roll on behalf of remote
           } else if (data.type === 'MOVE') {
               handleTokenClick(data.tokenId, true); // Force move on behalf of remote
           } else if (data.type === 'UPDATE_PROFILE') {
               setPlayerProfiles(prev => ({
                   ...prev,
                   [data.color]: { ...prev[data.color], ...data.updates }
               }));
           }
        });
        
        conn.on('close', () => {
             connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
             // Could revert player to Bot, but let's leave as is for now
        });
      });
    }

    return () => peer.destroy();
  }, [hostId, isHost]);

  // Host: Broadcast State on Change
  useEffect(() => {
      if (isHost && connectionsRef.current.length > 0) {
          const payload = { type: 'SYNC', payload: { gameState, playerProfiles, turnStep } };
          connectionsRef.current.forEach(conn => {
              if (conn.open) conn.send(payload);
          });
      }
  }, [gameState, playerProfiles, turnStep, isHost]);

  // Initialize Applause Sound
  useEffect(() => {
    applauseRef.current = new Audio("https://actions.google.com/sounds/v1/crowds/applause_large_crowd.ogg");
  }, []);

  // --- Strict Identity Logic & Bot Automation ---
  useEffect(() => {
    // Only Host runs bots! Guest is purely a viewer/inputter.
    if (!isHost) return;

    // Logic to update local profile based on myColor (Host is Red)
    if (gameState.status === 'PLAYING' && gameState.winner === null && gameState.currentPlayer !== myColor) {
        const currentPlayerProfile = playerProfiles[gameState.currentPlayer];
        
        if (currentPlayerProfile.isActive && currentPlayerProfile.isBot) {
            // Bot Logic
            if (!gameState.isRolling && !gameState.diceValue && turnStep === 'ROLL') {
                const timer = setTimeout(() => {
                    handleRollDice(true);
                }, 1000);
                return () => clearTimeout(timer);
            }

            if (turnStep === 'MOVE' && !gameState.isMoving && gameState.diceValue) {
                const timer = setTimeout(() => {
                    executeBotMove();
                }, 1500);
                return () => clearTimeout(timer);
            }
        } else if (!currentPlayerProfile.isActive) {
             finishTurn(gameState.tokens, `${playerProfiles[gameState.currentPlayer].name} skipped.`, false);
        }
    }
  }, [gameState, turnStep, playerProfiles, isHost, myColor]);

  // --- Start Game Logic ---
  const handleStartGame = () => {
      setMenuOpen(false);
      setCountDown(10);
  };

  useEffect(() => {
      if (countDown === null) return;
      if (countDown > 0) {
          const timer = setTimeout(() => setCountDown(countDown - 1), 1000);
          return () => clearTimeout(timer);
      } else {
          // Timer finished: Start Game
          if (!isHost) return; // Only Host commits the start

          setCountDown(null);
          setManualLock(true); // Automatically lock entry
          
          // Remove tokens of inactive players
          const activeColors = Object.entries(playerProfiles)
              .filter(([_, p]) => (p as PlayerProfile).isActive)
              .map(([color]) => color);
              
          const newTokens = INITIAL_TOKENS.filter(t => activeColors.includes(t.color));

          setGameState(prev => ({ 
              ...prev, 
              tokens: newTokens,
              status: 'PLAYING',
              gameLog: ["Game Started! Good luck."] 
          }));
      }
  }, [countDown, playerProfiles, isHost]);

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

      setTimeout(() => {
          kickAllExceptMe();
          if (applauseRef.current) {
              applauseRef.current.pause();
          }
      }, 30000);
  };

  const kickAllExceptMe = () => {
      if (!isHost) return;
      setPlayerProfiles((prev: Record<PlayerColor, PlayerProfile>) => {
          const next = { ...prev };
          (Object.keys(next) as PlayerColor[]).forEach((key) => {
              if (key !== myColor) {
                  const profile = next[key];
                  if (profile) {
                      next[key] = { ...profile, isActive: false };
                  }
              }
          });
          return next;
      });
      setGameState(prev => ({
          ...prev,
          tokens: prev.tokens.filter(t => t.color === myColor),
          gameLog: [...prev.gameLog, "Everyone else has been removed."]
      }));
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
      
      setPlayerProfiles((prev: Record<PlayerColor, PlayerProfile>) => {
          const next = { ...prev };
          (Object.keys(next) as PlayerColor[]).forEach((k) => {
              next[k] = { ...next[k], isActive: true };
          });
          return next;
      });
  };

  // --- Bot / AI Move Logic ---
  const executeBotMove = () => {
      const validTokens = getSelectableTokens();
      if (validTokens.length > 0) {
          const tokenObjs = gameState.tokens.filter(t => validTokens.includes(t.id));
          tokenObjs.sort((a,b) => b.position - a.position);
          handleTokenClick(tokenObjs[0].id, true);
      } else {
           finishTurn(gameState.tokens, `No moves for ${playerProfiles[gameState.currentPlayer].name}.`, false);
      }
  };

  const hasValidMoves = (player: PlayerColor, dice: number, tokens: Token[]) => {
      return tokens
        .filter(t => t.color === player)
        .some(t => {
             if (t.position === -1) return dice === 6;
             return (t.position + dice) <= 56;
        });
  };

  // --- Handlers ---
  const handleRollDice = (forceSystem = false) => {
    // If Guest, send Request to Host
    if (!isHost) {
        if (gameState.currentPlayer === myColor && connectionRef.current?.open) {
            connectionRef.current.send({ type: 'ROLL' });
        }
        return;
    }

    if (!forceSystem && gameState.currentPlayer !== myColor) return;
    if (gameState.winner) return;
    if (gameState.status !== 'PLAYING') return; 

    if (gameState.isRolling || gameState.isMoving) return;
    
    setGameState(prev => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      const newLog = [...gameState.gameLog.slice(-4), `${playerProfiles[gameState.currentPlayer].name} rolled a ${newValue}`];

      setGameState(prev => ({
        ...prev,
        isRolling: false,
        diceValue: newValue,
        gameLog: newLog
      }));

      if (hasValidMoves(gameState.currentPlayer, newValue, gameState.tokens)) {
          setTurnStep('MOVE');
          setMoveTimer(15); 
      } else {
          setTurnStep('MOVE'); 
          setTimeout(() => {
              finishTurn(gameState.tokens, `No valid moves for ${playerProfiles[gameState.currentPlayer].name}.`, false);
          }, 1500); 
      }
    }, 800);
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

  const handleTokenClick = async (tokenId: string, forceSystem = false) => {
    // If Guest, send Request to Host
    if (!isHost) {
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

    if (!forceSystem) {
        if (gameState.currentPlayer !== myColor) return;
        if (token.color !== myColor) return;
    }

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

    // Set Capture event in State to broadcast it
    if (newCaptureEvent) {
         setGameState(prev => ({ ...prev, captureEvent: newCaptureEvent }));
         // Clear it shortly after so it doesn't persist
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
    // Generate Invite Link with ?hostId=PEER_ID
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
      setPlayerProfiles(prev => ({
          ...prev,
          [color]: { ...prev[color], isActive: false }
      }));
      setGameState(prev => ({
          ...prev,
          tokens: prev.tokens.filter(t => t.color !== color)
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
          // Timer active during both ROLL and MOVE steps
          if (moveTimer > 0) {
              interval = setInterval(() => {
                  setMoveTimer(prev => prev - 1);
              }, 1000);
          } else {
              // Timer Reached 0
              if (gameState.currentPlayer === myColor || playerProfiles[gameState.currentPlayer].isRemote) {
                  // Action for "Me" or "Remote Player" (Auto-roll/move if timeout)
                  if (turnStep === 'ROLL') {
                      handleRollDice(true); // Auto roll
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
              // Bots handle their own timing in the other useEffect
          }
      }
      return () => clearInterval(interval);
  }, [turnStep, moveTimer, selectableTokens, gameState.currentPlayer, myColor, gameState.winner, gameState.status, gameState.isMoving, gameState.isRolling, isHost, playerProfiles]);

  // --- Queue Screen Component ---
  if (isQueueMode) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
              <h1 className="text-white text-2xl font-bold mb-8">Waiting Queue</h1>
              
              {!queueSpotTaken ? (
                  <button 
                      onClick={() => {
                          setQueueSpotTaken(true);
                          setQueueEntryTime(Date.now());
                      }}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-[0_0_20px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105"
                  >
                      JOIN QUEUE
                  </button>
              ) : (
                  <div className="flex flex-col items-center gap-4">
                      <div className="text-green-400 font-mono text-xl animate-pulse">Position Reserved</div>
                      <p className="text-slate-500 text-sm">Please wait for the current game to finish.</p>
                      
                      {gameState.status === 'LOBBY' && (
                          <div className="mt-8 flex flex-col items-center animate-bounce">
                             <p className="text-yellow-400 font-bold mb-2">You're Up!</p>
                             <button 
                                onClick={() => { setIsQueueMode(false); setQueueSpotTaken(false); }}
                                className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-xl font-bold"
                             >
                                 ENTER GAME
                             </button>
                             <div className="h-1 w-full bg-slate-800 rounded mt-2 overflow-hidden">
                                 <div className="h-full bg-yellow-500 w-full animate-[width_60s_linear_forwards]"></div>
                             </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 overflow-hidden relative font-sans select-none">
       
       {/* COUNTDOWN OVERLAY */}
       {countDown !== null && (
           <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
               <div className="text-[12rem] font-black text-white animate-pulse">
                   {countDown}
               </div>
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
                                <UserPlus size={18}/> Admit Next Players
                            </button>
                        )}
                    </div>

                    {/* Active Players List */}
                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 mt-2">
                         <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Users size={12} /> Active Players
                         </div>
                         <div className="space-y-2">
                            {Object.values(PlayerColor).map(c => {
                                const p = playerProfiles[c];
                                if (!p.isActive) return null;
                                return (
                                <div key={c} className="flex justify-between items-center text-xs group">
                                     <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full shadow-sm" style={{backgroundColor: COLORS[c].main}}></div>
                                        <span className={`font-medium ${c === myColor ? 'text-white' : 'text-slate-400'}`}>
                                            {p.name} {c === myColor ? '(You)' : ''}
                                            {p.isRemote && !p.isBot && <span className="ml-1 text-[10px] bg-blue-900 text-blue-300 px-1 rounded">NET</span>}
                                        </span>
                                     </div>
                                     {c !== myColor && (
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
                        <span className="flex items-center gap-2"><LinkIcon size={14}/> Invite Friend</span>
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
            onDiceClick={handleRollDice}
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
