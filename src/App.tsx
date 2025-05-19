import React from 'react';
import { Navbar } from './components/navbar';
import { HeroSection } from './components/hero-section';
import { Features } from './components/features';
import { TrainingSection } from './features/chess/components/training-section';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main>
        <HeroSection />
        <Features />
        <TrainingSection />
      </main>
    </div>
  );
}

export default App;