import { Chess } from 'chess.js';
import { StateCreator } from 'zustand';
import { StoreState } from './index';

export interface GameSlice {
  game: Chess;
  position: string;
  lastMove: string | null;
  setPosition: (position: string) => void;
  makeMove: (move: string) => boolean;
  resetGame: () => void;
}

export const createGameSlice = (set: any, get: any): GameSlice => ({
  game: new Chess(),
  position: 'start',
  lastMove: null,

  setPosition: (position) => {
    const newGame = new Chess();
    if (position !== 'start') {
      newGame.load(position);
    }
    set({ game: newGame, position: newGame.fen() });

    const state = get();
    if (state.trainingMode === 'game' && 
        state.currentOpening === 'scandinavian' && 
        newGame.turn() === 'w') {
      setTimeout(() => state.makeAIMove(), 500);
    }
  },

  makeMove: (move) => {
    let result = false;
    set((state: StoreState) => {
      const newGame = new Chess(state.game.fen());
      try {
        const moveResult = newGame.move({
          from: move.slice(0, 2),
          to: move.slice(2, 4),
          promotion: move.length === 5 ? move[4] : undefined
        });

        if (moveResult) {
          result = true;
          return { 
            game: newGame,
            position: newGame.fen(),
            lastMove: move
          };
        }
      } catch (e) {
        console.error('Invalid move:', e);
      }
      return state;
    });

    const state = get();
    if (result && 
        state.trainingMode === 'game' && 
        !state.game.isGameOver()) {
      const isWhiteToMove = state.game.turn() === 'w';
      if ((state.currentOpening === 'london' && !isWhiteToMove) ||
          (state.currentOpening === 'scandinavian' && isWhiteToMove)) {
        setTimeout(() => state.makeAIMove(), 500);
      }
    }

    return result;
  },

  resetGame: () => {
    const newGame = new Chess();
    set({ 
      game: newGame,
      position: newGame.fen(),
      lastMove: null
    });

    const state = get();
    if (state.trainingMode === 'game' && 
        state.currentOpening === 'scandinavian') {
      setTimeout(() => state.makeAIMove(), 500);
    }
  }
});