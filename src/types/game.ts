export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Tile {
  id: string;
  value: number;
  row: number; // 0 to 3
  col: number; // 0 to 3
  prevRow?: number;
  prevCol?: number;
  isNew?: boolean;
  isMerged?: boolean;
}

export interface ScorePopup {
  id: string;
  value: number;
}

export interface SavedGameState {
  tiles: Tile[];
  score: number;
  moves: number;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  moves: number;
  timer: number; // seconds
  isGameOver: boolean;
  hasWon: boolean;
  hasContinued: boolean;
  history: SavedGameState[];
}
