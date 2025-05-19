import { Chess } from 'chess.js';
import { StateCreator } from 'zustand';
import { StoreState } from './index';
import { initializeStockfish } from '../stockfish';

let stockfish: Worker | null = null;

export interface AISlice {
  skillLevel: number;
  isAIThinking: boolean;
  evaluation: string | null;
  setSkillLevel: (level: number) => void;
  makeAIMove: () => void;
  evaluatePosition: () => void;
}

export const createAISlice = (set: any, get: any): AISlice => {
  const initStockfish = () => {
    if (!stockfish) {
      stockfish = initializeStockfish();
    }
    return stockfish;
  };

  const setupStockfish = (sf: Worker) => {
    sf.postMessage('ucinewgame');
    sf.postMessage(`setoption name Skill Level value ${get().skillLevel}`);
    sf.postMessage(`position fen ${get().game.fen()}`);
  };

  return {
    skillLevel: 10,
    isAIThinking: false,
    evaluation: null,

    setSkillLevel: (level) => {
      const sf = initStockfish();
      sf.postMessage(`setoption name Skill Level value ${level}`);
      set({ skillLevel: level });
    },

    makeAIMove: () => {
      const state = get();
      if (state.game.isGameOver() || state.trainingMode !== 'game') return;

      const sf = initStockfish();
      set({ isAIThinking: true });

      // Configure Stockfish
      setupStockfish(sf);

      // Clear previous message handler
      sf.onmessage = null;

      // Set up new message handler
      sf.onmessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.startsWith('bestmove')) {
          const moveStr = message.split(' ')[1];
          if (moveStr && moveStr !== '(none)') {
            try {
              const newGame = new Chess(state.game.fen());
              const moveResult = newGame.move({
                from: moveStr.slice(0, 2),
                to: moveStr.slice(2, 4),
                promotion: moveStr.length === 5 ? moveStr[4] : undefined
              });

              if (moveResult) {
                set({ 
                  game: newGame,
                  position: newGame.fen(),
                  isAIThinking: false,
                  lastMove: moveStr
                });
                return;
              }
            } catch (e) {
              console.error('Invalid AI move:', e);
            }
          }
          set({ isAIThinking: false });
        }
      };

      // Start thinking
      sf.postMessage('go movetime 1000');
    },

    evaluatePosition: () => {
      const state = get();
      const sf = initStockfish();
      set({ isAIThinking: true });

      setupStockfish(sf);

      sf.onmessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.startsWith('bestmove')) {
          set({ 
            isAIThinking: false,
            evaluation: message
          });
        }
      };

      sf.postMessage('go depth 20');
    }
  };
};