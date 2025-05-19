import { create } from 'zustand';
import { createGameSlice, type GameSlice } from './game-slice';
import { createTrainingSlice, type TrainingSlice } from './training-slice';
import { createAISlice, type AISlice } from './ai-slice';

export type StoreState = GameSlice & TrainingSlice & AISlice;

export const useGameStore = create<StoreState>((set, get) => ({
  ...createGameSlice(set, get),
  ...createTrainingSlice(set, get),
  ...createAISlice(set, get)
}));