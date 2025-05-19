import React from 'react';
import { TrainingBoard } from './training-board';
import { OpeningSelector } from './opening-selector';
import { TrainingControls } from './training-controls';
import { SkillLevelSelector } from './skill-level-selector';

export function TrainingSection() {
  return (
    <section id="training-section" className="py-12 px-4 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Zone d'entraînement</h2>
          <p className="mt-4 text-lg text-gray-300">
            Sélectionnez une ouverture et un mode d'entraînement
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-8">
          <OpeningSelector />
          <TrainingControls />
          <SkillLevelSelector />
          <TrainingBoard />
        </div>
      </div>
    </section>
  );
}