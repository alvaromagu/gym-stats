import { trek } from '@/shared/lib/trek';

export async function deleteWorkout({ id }: { id: string }) {
  return await trek.delete(`/workouts/${id}`);
}
