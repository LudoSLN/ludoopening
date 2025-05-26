// src/features/chess/components/chessboard.tsx
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
  const isAIThinking = useGameStore((state) => state.isAIThinking);

  const handlePieceDrop = (sourceSquare: string, targetSquare: string) => {
    console.log('Tentative de coup:', sourceSquare, '->', targetSquare);
    
    if (!trainingMode || !onPieceDrop) {
      console.log('Pas de mode d\'entraînement ou pas de handler');
      return false;
    }
    
    // Pour le système de Londres, le joueur joue les blancs
    // Pour la Scandinave, le joueur joue les noirs
    const move = sourceSquare + targetSquare;
    console.log('Mode:', trainingMode, 'Ouverture:', currentOpening);
    
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
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
        />
      </div>
      
      {/* Informations de debug */}
      <div className="text-xs text-gray-400 max-w-md">
        <div>Mode: {trainingMode || 'Aucun'}</div>
        <div>Ouverture: {currentOpening || 'Aucune'}</div>
        <div>IA réfléchit: {isAIThinking ? 'Oui' : 'Non'}</div>
        <div>Dernier coup: {lastMove || 'Aucun'}</div>
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
