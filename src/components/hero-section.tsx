import React from 'react';
import { Sword } from 'lucide-react';
import { Button } from '@components/ui/button';

export function HeroSection() {
  const scrollToTraining = () => {
    const trainingSection = document.querySelector('#training-section');
    trainingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chess-gradient px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <Sword className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            LondonScandi
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Maîtrisez le système de Londres aux blancs et la défense Scandinave aux noirs
            grâce à un entraînement personnalisé.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" onClick={scrollToTraining}>
              Commencer l'entraînement
            </Button>
            <Button variant="outline" size="lg">
              En savoir plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}