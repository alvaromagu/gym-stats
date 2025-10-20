import { trek } from '@/shared/lib/trek';
import type { NewExercise } from '../types/new-exercise-request';

export async function newExercise(exercise: NewExercise) {
  return await trek.post<{ id: string }>('/workouts/exercises', exercise);
}
