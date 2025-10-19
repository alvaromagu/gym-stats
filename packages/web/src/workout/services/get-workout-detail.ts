import { trek } from '@/shared/lib/trek';
import type { WorkoutDetail } from '../types/workout-detail';

export async function getWorkoutDetail({ id }: { id: string }) {
  return await trek.get<null | WorkoutDetail>(`/workouts/${id}`);
}
