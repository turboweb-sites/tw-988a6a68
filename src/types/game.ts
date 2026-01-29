export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = 'ready' | 'playing' | 'paused' | 'gameOver';

export interface Position {
  x: number;
  y: number;
}