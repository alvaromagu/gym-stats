import { trek } from '@/shared/lib/trek';

export async function getWorkotus() {
  return await trek.get('/workouts');
}
