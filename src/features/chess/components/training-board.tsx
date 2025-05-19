import React from 'react';
import { Chessboard } from './chessboard';
import { useChessGame } from '../hooks/useChessGame';
import { useGameStore } from '../store';

export function TrainingBoard() {
  const { handleMove } = useChessGame();
  const isAIThinking = useGameStore((state) => state.isAIThinking);

  return (
    <div className="flex flex-col items-center gap-4">
      <Chessboard
        onPieceDrop={handleMove}
        className="max-w-[560px] w-full aspect-square"
      />
      {isAIThinking && (
        <div className="text-green-500 animate-pulse">
          L'IA réfléchit...
        </div>
      )}
    </div>
  );
}