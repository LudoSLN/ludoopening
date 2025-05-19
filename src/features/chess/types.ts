export type TrainingMode = 'puzzle' | 'game' | null;

export interface ChessMove {
  sourceSquare: string;
  targetSquare: string;
  piece: string;
}

export interface OpeningPosition {
  fen: string;
  name: string;
  description: string;
  nextMoves: string[];
  explanation?: string;
}

export interface TrainingState {
  mode: TrainingMode;
  skillLevel: number;
  puzzlePosition?: OpeningPosition;
}