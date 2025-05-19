import { create } from 'zustand';
import { Chess } from 'chess.js';
import { initializeStockfish } from './stockfish';
import { TrainingMode, OpeningPosition } from './types';
import { LONDON_SYSTEM_POSITIONS, SCANDINAVIAN_POSITIONS } from './constants';

interface GameState {
  game: Chess;
  position: string;
  currentOpening: 'london' | 'scandinavian' | null;
  trainingMode: TrainingMode;
  skillLevel: number;
  isAIThinking: boolean;
  currentPuzzle: OpeningPosition | null;
  lastMove: string | null;
  evaluation: string | null;
  setPosition: (position: string) => void;
  makeMove: (move: string) => boolean;
  resetGame: () => void;
  setOpening: (opening: 'london' | 'scandinavian') => void;
  startTraining: (mode: TrainingMode) => void;
  stopTraining: () => void;
  makeAIMove: () => void;
  setSkillLevel: (level: number) => void;
  getRandomPuzzle: () => void;
  evaluatePosition: () => void;
}

let stockfish: Worker | null = null;

export const useGameStore = create<GameState>((set, get) => {
  const initStockfish = () => {
    if (!stockfish) {
      stockfish = initializeStockfish();
    }
    return stockfish;
  };

  const shouldMakeAIMove = () => {
    const state = get();
    const isWhiteToMove = state.game.turn() === 'w';
    return (state.currentOpening === 'london' && !isWhiteToMove) ||
           (state.currentOpening === 'scandinavian' && isWhiteToMove);
  };

  return {
    game: new Chess(),
    position: 'start',
    currentOpening: null,
    trainingMode: null,
    skillLevel: 10,
    isAIThinking: false,
    currentPuzzle: null,
    lastMove: null,
    evaluation: null,

    setPosition: (position) => {
      const game = new Chess();
      if (position !== 'start') {
        game.load(position);
      }
      set({ game, position });
      
      if (shouldMakeAIMove()) {
        get().makeAIMove();
      }
    },

    makeMove: (move) => {
      let result = false;
      set((state) => {
        try {
          const moveResult = state.game.move(move);
          if (moveResult) {
            result = true;
            return { 
              position: state.game.fen(),
              lastMove: move
            };
          }
        } catch (e) {
          console.error('Invalid move:', e);
        }
        return {};
      });

      if (result && shouldMakeAIMove()) {
        get().makeAIMove();
      }

      return result;
    },

    resetGame: () => {
      const game = new Chess();
      set({ 
        game,
        position: game.fen(),
        currentPuzzle: null,
        lastMove: null,
        evaluation: null
      });
      
      const state = get();
      if (state.currentOpening === 'scandinavian' && state.trainingMode === 'game') {
        get().makeAIMove();
      }
    },

    setOpening: (opening) => {
      set({ currentOpening: opening });
      get().resetGame();
    },

    startTraining: (mode) => {
      const sf = initStockfish();
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

    setSkillLevel: (level) => {
      const sf = initStockfish();
      sf.postMessage(`setoption name Skill Level value ${level}`);
      set({ skillLevel: level });
    },

    getRandomPuzzle: () => {
      const { currentOpening } = get();
      const positions = currentOpening === 'london' 
        ? LONDON_SYSTEM_POSITIONS 
        : SCANDINAVIAN_POSITIONS;
      
      const randomPuzzle = positions[Math.floor(Math.random() * positions.length)];
      if (randomPuzzle) {
        set({ 
          currentPuzzle: randomPuzzle,
          position: randomPuzzle.fen,
          game: new Chess(randomPuzzle.fen)
        });
      }
    },

    evaluatePosition: () => {
      const state = get();
      const sf = initStockfish();
      set({ isAIThinking: true });

      sf.postMessage('position fen ' + state.game.fen());
      sf.postMessage('go depth 20');

      sf.onmessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.startsWith('bestmove')) {
          set({ 
            isAIThinking: false,
            evaluation: message
          });
        }
      };
    },

    makeAIMove: () => {
      const state = get();
      if (state.game.isGameOver() || state.trainingMode !== 'game') return;

      const sf = initStockfish();
      set({ isAIThinking: true });

      sf.postMessage('position fen ' + state.game.fen());
      sf.postMessage('go depth 15');

      sf.onmessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.startsWith('bestmove')) {
          const move = message.split(' ')[1];
          if (move) {
            try {
              state.game.move(move);
              set({ 
                position: state.game.fen(),
                isAIThinking: false,
                lastMove: move
              });
            } catch (e) {
              console.error('Invalid AI move:', e);
              set({ isAIThinking: false });
            }
          }
        }
      };
    }
  };
});