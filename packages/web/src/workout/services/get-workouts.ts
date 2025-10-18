import { trek } from '@/shared/lib/trek';
import type { Workout } from '../types/workout-list';

export async function getWorkotus() {
  return await trek.get<Workout[]>('/workouts');
}
