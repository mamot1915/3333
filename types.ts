
export enum PlayerColor {
  BLUE = 'blue',
  RED = 'red',
  GREEN = 'green',
  YELLOW = 'yellow',
}

export interface Token {
  id: string;
  color: PlayerColor;
  position: number; // -1 = base, 100 = home, 0-51 = track
  isSafe: boolean;
}

export interface GameState {
  tokens: Token[];
  currentPlayer: PlayerColor;
  diceValue: number | null;
  isRolling: boolean;
  isMoving: boolean; // New state to lock UI during jump animation
  gameLog: string[];
  winner: PlayerColor | null; // Track who won
}

export interface PlayerProfile {
  name: string;
  flag: string | null; // URL to the image
  isActive: boolean; // If false, player is kicked/removed
  isBot: boolean; // To simulate other players in this local-only version
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

// Coordinate system for the board rendering
export interface Point {
  x: number;
  y: number;
}
