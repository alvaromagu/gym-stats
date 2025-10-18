import { useState } from 'react';
import type { Workout } from '../types/workout-list';
import { deleteWorkout } from '../services/delete-workout';
import { toast } from 'sonner';

export function useWorkoutListItem({ workout }: { workout: Workout }) {
  const [removing, setRemoving] = useState(false);

  async function remove() {
    setRemoving(true);
    try {
      await deleteWorkout({ id: workout.id });
      toast.success('Workout deleted');
    } catch {
      toast.error('Failed to delete workout');
    }
    setRemoving(false);
  }

  return { removing, remove };
}
