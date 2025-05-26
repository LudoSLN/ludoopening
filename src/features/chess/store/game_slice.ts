// src/features/chess/store/game-slice.ts
import { Chess } from 'chess.js';
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
      try {
        newGame.load(position);
      } catch (e) {
        console.error('Position FEN invalide:', position);
        return;
      }
    }
    
    set({ game: newGame, position: newGame.fen() });

    // Déclencher le coup IA si nécessaire
    const state = get();
    if (state.trainingMode === 'game' && !newGame.isGameOver()) {
      const shouldAIMove = (state.currentOpening === 'scandinavian' && newGame.turn() === 'w') ||
                          (state.currentOpening === 'london' && newGame.turn() === 'b');
      
      if (shouldAIMove) {
        setTimeout(() => {
          if (!get().isAIThinking) {
            state.makeAIMove();
          }
        }, 500);
      }
    }
  },

  makeMove: (move) => {
    const state = get();
    let result = false;
    
    try {
      const newGame = new Chess(state.game.fen());
      const moveResult = newGame.move({
        from: move.slice(0, 2),
        to: move.slice(2, 4),
        promotion: move.length === 5 ? move[4] : undefined
      });

      if (moveResult) {
        result = true;
        set({ 
          game: newGame,
          position: newGame.fen(),
          lastMove: move
        });

        console.log('Coup joué:', move, 'Position:', newGame.fen());

        // Déclencher le coup IA après le coup du joueur
        if (state.trainingMode === 'game' && !newGame.isGameOver()) {
          const shouldAIMove = (state.currentOpening === 'london' && newGame.turn() === 'b') ||
                              (state.currentOpening === 'scandinavian' && newGame.turn() === 'w');
          
          if (shouldAIMove) {
            setTimeout(() => {
              const currentState = get();
              if (!currentState.isAIThinking && !currentState.game.isGameOver()) {
                currentState.makeAIMove();
              }
            }, 500);
          }
        }
      }
    } catch (e) {
      console.error('Coup invalide:', move, e);
    }

    return result;
  },

  resetGame: () => {
    const newGame = new Chess();
    set({ 
      game: newGame,
      position: newGame.fen(),
      lastMove: null,
      evaluation: null
    });

    console.log('Partie réinitialisée');

    // Si on joue la Scandinave, l'IA (blancs) doit commencer
    const state = get();
    if (state.trainingMode === 'game' && state.currentOpening === 'scandinavian') {
      setTimeout(() => {
        if (!get().isAIThinking) {
          state.makeAIMove();
        }
      }, 1000);
    }
  }
});
