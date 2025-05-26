// src/features/chess/store/ai-slice.ts
import { Chess } from 'chess.js';
import { StoreState } from './index';
import { initializeStockfish, sendStockfishCommand, setStockfishMessageHandler, removeStockfishMessageHandler } from '../stockfish';

export interface AISlice {
  skillLevel: number;
  isAIThinking: boolean;
  evaluation: string | null;
  setSkillLevel: (level: number) => void;
  makeAIMove: () => void;
  evaluatePosition: () => void;
}

export const createAISlice = (set: any, get: any): AISlice => {
  let currentMoveHandler: ((event: MessageEvent) => void) | null = null;

  const cleanupHandler = () => {
    if (currentMoveHandler) {
      removeStockfishMessageHandler(currentMoveHandler);
      currentMoveHandler = null;
    }
  };

  return {
    skillLevel: 10,
    isAIThinking: false,
    evaluation: null,

    setSkillLevel: async (level) => {
      try {
        await initializeStockfish();
        sendStockfishCommand(`setoption name Skill Level value ${level}`);
        sendStockfishCommand(`setoption name Skill Level Maximum Error value ${Math.max(1, 20 - level)}`);
        sendStockfishCommand(`setoption name Skill Level Probability value ${Math.max(1, 20 - level)}`);
        set({ skillLevel: level });
      } catch (error) {
        console.error('Erreur lors du réglage du niveau:', error);
      }
    },

    makeAIMove: async () => {
      const state = get();
      
      // Vérifications préliminaires
      if (state.game.isGameOver() || 
          state.trainingMode !== 'game' || 
          state.isAIThinking) {
        return;
      }

      try {
        set({ isAIThinking: true });
        
        await initializeStockfish();
        
        // Nettoyer l'ancien handler
        cleanupHandler();

        // Configurer Stockfish
        sendStockfishCommand('ucinewgame');
        sendStockfishCommand(`setoption name Skill Level value ${state.skillLevel}`);
        sendStockfishCommand(`position fen ${state.game.fen()}`);

        // Créer le nouveau handler
        currentMoveHandler = (event: MessageEvent) => {
          const message = event.data;
          console.log('Stockfish response:', message);

          if (message.startsWith('bestmove')) {
            const parts = message.split(' ');
            const moveStr = parts[1];
            
            if (moveStr && moveStr !== '(none)') {
              try {
                // Créer une nouvelle instance de Chess pour tester le coup
                const testGame = new Chess(state.game.fen());
                const moveResult = testGame.move({
                  from: moveStr.slice(0, 2),
                  to: moveStr.slice(2, 4),
                  promotion: moveStr.length === 5 ? moveStr[4] : undefined
                });

                if (moveResult) {
                  console.log('IA joue:', moveStr);
                  set({ 
                    game: testGame,
                    position: testGame.fen(),
                    isAIThinking: false,
                    lastMove: moveStr
                  });
                  cleanupHandler();
                  return;
                }
              } catch (e) {
                console.error('Coup IA invalide:', moveStr, e);
              }
            }
            
            // Si on arrive ici, le coup était invalide ou inexistant
            console.warn('Aucun coup valide trouvé par l\'IA');
            set({ isAIThinking: false });
            cleanupHandler();
          }
        };

        // Attacher le handler et demander un coup
        setStockfishMessageHandler(currentMoveHandler);
        sendStockfishCommand('go movetime 2000');
        
        // Timeout de sécurité
        setTimeout(() => {
          if (get().isAIThinking) {
            console.warn('Timeout IA - arrêt forcé');
            set({ isAIThinking: false });
            cleanupHandler();
          }
        }, 5000);

      } catch (error) {
        console.error('Erreur lors du calcul IA:', error);
        set({ isAIThinking: false });
        cleanupHandler();
      }
    },

    evaluatePosition: async () => {
      const state = get();
      
      try {
        set({ isAIThinking: true });
        await initializeStockfish();

        cleanupHandler();

        sendStockfishCommand(`position fen ${state.game.fen()}`);

        currentMoveHandler = (event: MessageEvent) => {
          const message = event.data;
          if (message.startsWith('bestmove')) {
            set({ 
              isAIThinking: false,
              evaluation: message
            });
            cleanupHandler();
          }
        };

        setStockfishMessageHandler(currentMoveHandler);
        sendStockfishCommand('go depth 15');

      } catch (error) {
        console.error('Erreur lors de l\'évaluation:', error);
        set({ isAIThinking: false });
        cleanupHandler();
      }
    }
  };
};