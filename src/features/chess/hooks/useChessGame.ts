import { useCallback } from 'react';
import { useGameStore } from '../store';

export function useChessGame() {
  const { game, position, makeMove, resetGame, setPosition } = useGameStore();

  const handleMove = useCallback((sourceSquare: string, targetSquare: string) => {
    return makeMove(`${sourceSquare}${targetSquare}`);
  }, [makeMove]);

  return {
    game,
    position,
    handleMove,
    resetGame,
    setPosition
  };
}