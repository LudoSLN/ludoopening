import { Chess } from 'chess.js';
import { StateCreator } from 'zustand';
import { StoreState } from './index';
import { TrainingMode, OpeningPosition } from '../types';
import { LONDON_SYSTEM_POSITIONS, SCANDINAVIAN_POSITIONS } from '../constants';

export interface TrainingSlice {
  currentOpening: 'london' | 'scandinavian' | null;
  trainingMode: TrainingMode;
  currentPuzzle: OpeningPosition | null;
  setOpening: (opening: 'london' | 'scandinavian') => void;
  startTraining: (mode: TrainingMode) => void;
  stopTraining: () => void;
  getRandomPuzzle: () => void;
}

export const createTrainingSlice = (set: any, get: any): TrainingSlice => ({
  currentOpening: null,
  trainingMode: null,
  currentPuzzle: null,

  setOpening: (opening) => {
    set({ currentOpening: opening });
    get().resetGame();
  },

  startTraining: (mode) => {
    set({ trainingMode: mode });
    if (mode === 'puzzle') {
      get().getRandomPuzzle();
    } else if (mode === 'game') {
      get().resetGame();
    }
  },

  stopTraining: () => {
    set({ 
      trainingMode: null,
      currentPuzzle: null,
      evaluation: null
    });
  },

  getRandomPuzzle: () => {
    const { currentOpening } = get();
    const positions = currentOpening === 'london' 
      ? LONDON_SYSTEM_POSITIONS 
      : SCANDINAVIAN_POSITIONS;
    
    const randomPuzzle = positions[Math.floor(Math.random() * positions.length)];
    if (randomPuzzle) {
      const newGame = new Chess();
      newGame.load(randomPuzzle.fen);
      set({ 
        game: newGame,
        currentPuzzle: randomPuzzle,
        position: randomPuzzle.fen
      });
    }
  }
});