import React from 'react';
import { useGameStore } from '../store';

const SKILL_LEVELS = [
  { value: 5, label: 'Débutant' },
  { value: 10, label: 'Intermédiaire' },
  { value: 15, label: 'Avancé' },
  { value: 20, label: 'Expert' },
];

export function SkillLevelSelector() {
  const skillLevel = useGameStore((state) => state.skillLevel);
  const setSkillLevel = useGameStore((state) => state.setSkillLevel);
  const trainingMode = useGameStore((state) => state.trainingMode);

  if (trainingMode !== 'game') return null;

  return (
    <div className="flex items-center gap-4">
      <label htmlFor="skill-level" className="text-gray-300">Niveau de l'IA:</label>
      <select
        id="skill-level"
        value={skillLevel}
        onChange={(e) => setSkillLevel(Number(e.target.value))}
        className="bg-gray-700 text-white rounded px-3 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {SKILL_LEVELS.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label} (Niveau {level.value})
          </option>
        ))}
      </select>
    </div>
  );
}