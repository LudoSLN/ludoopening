import React from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '../store';

export function OpeningSelector() {
  const setOpening = useGameStore((state) => state.setOpening);
  const currentOpening = useGameStore((state) => state.currentOpening);

  return (
    <div className="flex gap-4 justify-center">
      <Button
        variant={currentOpening === 'london' ? 'primary' : 'outline'}
        onClick={() => setOpening('london')}
      >
        Système de Londres
      </Button>
      <Button
        variant={currentOpening === 'scandinavian' ? 'primary' : 'outline'}
        onClick={() => setOpening('scandinavian')}
      >
        Défense Scandinave
      </Button>
    </div>
  );
}