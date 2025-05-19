import React from 'react';
import { Brain, Target, Trophy, BarChart3 } from 'lucide-react';

const features = [
  {
    name: "Positions d'entraînement spécifiques",
    description: "Plus de 100 positions clés couvrant le système de Londres et la Scandinavie.",
    icon: Target,
  },
  {
    name: "Analyse IA personnalisée",
    description: "Recevez des commentaires détaillés sur vos coups et progressez plus rapidement.",
    icon: Brain,
  },
  {
    name: "Parties contre l'IA",
    description: "Affrontez un moteur d'échecs adapté à votre niveau pour mettre en pratique.",
    icon: Trophy,
  },
  {
    name: "Suivi de progression",
    description: "Visualisez votre évolution et identifiez vos points d'amélioration.",
    icon: BarChart3,
  },
];

export function Features() {
  return (
    <div className="bg-gray-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-500">
            Progressez efficacement
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tout ce dont vous avez besoin pour maîtriser vos ouvertures
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-green-500" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}