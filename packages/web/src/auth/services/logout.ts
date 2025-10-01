import { trek } from '@/shared/lib/trek';

export async function logout() {
  return await trek.post<never>('/auth/me/logout', {});
}
