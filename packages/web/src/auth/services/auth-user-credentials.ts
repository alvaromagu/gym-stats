import { trek } from '@/shared/lib/trek';
import type { Credential } from '../hooks/credentials';

export async function getAuthUserCredentials() {
  return await trek.get<Credential[]>('/auth/me/credentials');
}
