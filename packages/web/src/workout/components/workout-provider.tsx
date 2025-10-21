import type { ReactNode } from 'react';
import { useWorkout } from '../hooks/workout';
import { WorkoutContext } from '../hooks/workout-context';

export function WorkoutProvider({
  params: { id },
  children,
}: {
  params: {
    id: string;
  };
  children: ReactNode;
}) {
  const state = useWorkout({ id });
  return <WorkoutContext value={state}>{children}</WorkoutContext>;
}
