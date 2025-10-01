import { trek } from '@/shared/lib/trek';

export async function logoutAll() {
  return await trek.post<never>('/auth/me/logout/all', {});
}
