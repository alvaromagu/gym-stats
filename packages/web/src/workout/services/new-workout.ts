import { trek } from '@/shared/lib/trek';

export async function newWorkout({
  name,
  date,
}: {
  name: string;
  date: string;
}) {
  return await trek.post<{ id: string }>('/workouts', { name, date });
}
