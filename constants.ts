import { PlayerColor, Point } from './types';

export const BOARD_SIZE = 15;
export const CELL_SIZE = 40; // Base unit for calculations

export const COLORS = {
  [PlayerColor.BLUE]: {
    main: '#3B82F6', // blue-500
    dark: '#1D4ED8', // blue-700
    light: '#60A5FA', // blue-400
    bg: '#EFF6FF', // blue-50
  },
  [PlayerColor.RED]: {
    main: '#EF4444', // red-500
    dark: '#B91C1C', // red-700
    light: '#F87171', // red-400
    bg: '#FEF2F2', // red-50
  },
  [PlayerColor.GREEN]: {
    main: '#22C55E', // green-500
    dark: '#15803D', // green-700
    light: '#4ADE80', // green-400
    bg: '#F0FDF4', // green-50
  },
  [PlayerColor.YELLOW]: {
    main: '#EAB308', // yellow-500
    dark: '#A16207', // yellow-700
    light: '#FACC15', // yellow-400
    bg: '#FEFCE8', // yellow-50
  },
  boardBg: '#FFFFFF',
  stroke: '#1E293B', // slate-800
};

// Start Offsets on the Global Track (0-51)
export const START_OFFSETS = {
  [PlayerColor.BLUE]: 0,    // (1,6)
  [PlayerColor.RED]: 13,    // (8,1)
  [PlayerColor.GREEN]: 26,  // (13,8)
  [PlayerColor.YELLOW]: 39, // (6,13)
};

// Global Indices of Safe Spots
// Starts: 0, 13, 26, 39 (Ticked squares)
// Stars: 8, 21, 34, 47 (Standard safe spots, 8 steps from start)
export const SAFE_SPOTS = [
  0,  // Blue Start
  8,  // Blue Track Star (6,2)
  13, // Red Start
  21, // Red Track Star (12,6)
  26, // Green Start
  34, // Green Track Star (8,12)
  39, // Yellow Start
  47  // Yellow Track Star (2,8)
];

export const INITIAL_TOKENS = [
  { id: 'b1', color: PlayerColor.BLUE, position: -1, isSafe: true },
  { id: 'b2', color: PlayerColor.BLUE, position: -1, isSafe: true },
  { id: 'b3', color: PlayerColor.BLUE, position: -1, isSafe: true },
  { id: 'b4', color: PlayerColor.BLUE, position: -1, isSafe: true },
  
  { id: 'r1', color: PlayerColor.RED, position: -1, isSafe: true },
  { id: 'r2', color: PlayerColor.RED, position: -1, isSafe: true },
  { id: 'r3', color: PlayerColor.RED, position: -1, isSafe: true },
  { id: 'r4', color: PlayerColor.RED, position: -1, isSafe: true },

  { id: 'g1', color: PlayerColor.GREEN, position: -1, isSafe: true },
  { id: 'g2', color: PlayerColor.GREEN, position: -1, isSafe: true },
  { id: 'g3', color: PlayerColor.GREEN, position: -1, isSafe: true },
  { id: 'g4', color: PlayerColor.GREEN, position: -1, isSafe: true },

  { id: 'y1', color: PlayerColor.YELLOW, position: -1, isSafe: true },
  { id: 'y2', color: PlayerColor.YELLOW, position: -1, isSafe: true },
  { id: 'y3', color: PlayerColor.YELLOW, position: -1, isSafe: true },
  { id: 'y4', color: PlayerColor.YELLOW, position: -1, isSafe: true },
];

// Mapping of the 52-step main track to (x, y) coordinates
// Starting from Blue Start (1,6) moving Clockwise
export const TRACK_COORDINATES: Point[] = [
  {x:1, y:6}, {x:2, y:6}, {x:3, y:6}, {x:4, y:6}, {x:5, y:6}, // Blue Start Straight
  {x:6, y:5}, {x:6, y:4}, {x:6, y:3}, {x:6, y:2}, {x:6, y:1}, {x:6, y:0}, // Up to Top Left
  {x:7, y:0}, {x:8, y:0}, // Top Edge
  {x:8, y:1}, {x:8, y:2}, {x:8, y:3}, {x:8, y:4}, {x:8, y:5}, // Red Start Straight (Down)
  {x:9, y:6}, {x:10,y:6}, {x:11,y:6}, {x:12,y:6}, {x:13,y:6}, {x:14,y:6}, // Right Arm Top
  {x:14,y:7}, {x:14,y:8}, // Right Edge
  {x:13,y:8}, {x:12,y:8}, {x:11,y:8}, {x:10,y:8}, {x:9, y:8}, // Green Start Straight (Left)
  {x:8, y:9}, {x:8, y:10},{x:8, y:11},{x:8, y:12},{x:8, y:13},{x:8, y:14}, // Down Right Leg
  {x:7, y:14},{x:6, y:14}, // Bottom Edge
  {x:6, y:13},{x:6, y:12},{x:6, y:11},{x:6, y:10},{x:6, y:9}, // Yellow Start Straight (Up)
  {x:5, y:8}, {x:4, y:8}, {x:3, y:8}, {x:2, y:8}, {x:1, y:8}, {x:0, y:8}, // Left Arm Bottom
  {x:0, y:7}, {x:0, y:6}  // Left Edge
];

// Home Path Coordinates (Relative steps 51-56)
export const HOME_PATH_COORDINATES = {
  [PlayerColor.BLUE]:   [{x:1,y:7}, {x:2,y:7}, {x:3,y:7}, {x:4,y:7}, {x:5,y:7}, {x:6,y:7}],
  [PlayerColor.RED]:    [{x:7,y:1}, {x:7,y:2}, {x:7,y:3}, {x:7,y:4}, {x:7,y:5}, {x:7,y:6}],
  [PlayerColor.GREEN]:  [{x:13,y:7},{x:12,y:7},{x:11,y:7},{x:10,y:7},{x:9,y:7}, {x:8,y:7}],
  [PlayerColor.YELLOW]: [{x:7,y:13},{x:7,y:12},{x:7,y:11},{x:7,y:10},{x:7,y:9}, {x:7,y:8}],
};