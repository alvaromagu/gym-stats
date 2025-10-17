import { trek } from '@/shared/lib/trek';
import type { WorkoutListItem } from '../types/workout-list';

export async function getWorkotus() {
  return await trek.get<WorkoutListItem[]>('/workouts');
}
