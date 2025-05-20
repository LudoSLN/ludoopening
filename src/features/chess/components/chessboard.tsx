import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useGameStore } from '../store';

interface ChessboardProps {
  onPieceDrop?: (sourceSquare: string, targetSquare: string) => boolean;
  className?: string;
}

export function Chessboard({ onPieceDrop, className = '' }: ChessboardProps) {
  const position = useGameStore((state) => state.position);
  const trainingMode = useGameStore((state) => state.trainingMode);
  const currentPuzzle = useGameStore((state) => state.currentPuzzle);
  const evaluation = useGameStore((state) => state.evaluation);
  const lastMove = useGameStore((state) => state.lastMove);
  const currentOpening = useGameStore((state) => state.currentOpening);

  const handlePieceDrop = (sourceSquare: string, targetSquare: string) => {
    if (!trainingMode || !onPieceDrop) return false;
    
    const isWhitePiece = sourceSquare.charAt(1) === '2' || sourceSquare.charAt(1) === '1';
    const shouldPlayWhite = currentOpening === 'london';
    
    if (isWhitePiece !== shouldPlayWhite) {
      return false;
    }
    
    return onPieceDrop(sourceSquare, targetSquare);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={className}>
        <ReactChessboard
          position={position}
          onPieceDrop={handlePieceDrop}
          boardWidth={560}
          boardOrientation={currentOpening === 'london' ? 'white' : 'black'}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#ff0000' }}
          customLightSquareStyle={{ backgroundColor: '#ffffff' }}
        />
      </div>
      
      {currentPuzzle && (
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-white mb-2">{currentPuzzle.name}</h3>
          <p className="text-gray-300">{currentPuzzle.description}</p>
        </div>
      )}
      
      {evaluation && lastMove && (
        <div className="bg-gray-700 p-4 rounded-lg max-w-md">
          <p className="text-green-400 font-medium mb-2">
            Dernier coup joué : {lastMove}
          </p>
          <p className="text-gray-300">
            {currentPuzzle?.explanation || "L'IA analyse votre position..."}
          </p>
        </div>
      )}
    </div>
  );
}