import { trek } from '@/shared/lib/trek';
import type { UpdateWorkoutRequest } from '../types/update-workout-request';

export async function updateWorkout(workout: UpdateWorkoutRequest) {
  return await trek.put(`/workouts/${workout.id}`, {
    name: workout.name,
    date: workout.date,
    notes: workout.notes,
  });
}
