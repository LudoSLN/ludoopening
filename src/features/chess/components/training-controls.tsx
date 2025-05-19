import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, PlayCircle, StopCircle, Target, Swords } from 'lucide-react';
import { useGameStore } from '../store';
import { TrainingMode } from '../types';

export function TrainingControls() {
  const resetGame = useGameStore((state) => state.resetGame);
  const startTraining = useGameStore((state) => state.startTraining);
  const stopTraining = useGameStore((state) => state.stopTraining);
  const trainingMode = useGameStore((state) => state.trainingMode);
  const currentOpening = useGameStore((state) => state.currentOpening);

  const handleStartTraining = (mode: TrainingMode) => {
    if (!currentOpening) {
      alert("Veuillez sélectionner une ouverture avant de commencer l'entraînement");
      return;
    }
    startTraining(mode);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        <Button 
          onClick={() => handleStartTraining('puzzle')}
          variant={trainingMode === 'puzzle' ? 'primary' : 'outline'}
          className="flex items-center"
        >
          <Target className="w-4 h-4 mr-2" />
          Mode Puzzle
        </Button>
        <Button 
          onClick={() => handleStartTraining('game')}
          variant={trainingMode === 'game' ? 'primary' : 'outline'}
          className="flex items-center"
        >
          <Swords className="w-4 h-4 mr-2" />
          Mode Partie
        </Button>
      </div>
      
      <div className="flex gap-4">
        <Button onClick={resetGame} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Recommencer
        </Button>
        {trainingMode && (
          <Button onClick={stopTraining} variant="secondary">
            <StopCircle className="w-4 h-4 mr-2" />
            Arrêter l'entraînement
          </Button>
        )}
      </div>
    </div>
  );
}