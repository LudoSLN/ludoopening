import React from 'react';
import { Button } from '@/components/ui/button';
import { Sword } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Sword className="h-8 w-8 text-green-500" />
            <span className="ml-2 text-xl font-bold text-white">LondonScandi</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Entraînement
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              Ouvertures
            </Button>
            <Button variant="primary">Connexion</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}