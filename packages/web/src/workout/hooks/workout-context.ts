import { createContext, useContext } from 'react';
import type { WorkoutState } from './workout';

export type WorkoutContextState = WorkoutState;

export const WorkoutContext = createContext<WorkoutContextState>({
  workout: null,
  loading: true,
  reload: async () => {
    throw new Error('reload not implemented');
  },
});

export function useWorkoutContext() {
  const context = useContext(WorkoutContext);
  return context;
}
