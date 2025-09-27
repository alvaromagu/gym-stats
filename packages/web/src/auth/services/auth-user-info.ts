import { trek } from '@/shared/lib/trek';
import type { User } from '../types/user';

export async function getAuthUserInfo() {
  return await trek.get<User>('/auth/me');
}
