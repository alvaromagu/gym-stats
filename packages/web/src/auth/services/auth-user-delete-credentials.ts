import { trek } from '@/shared/lib/trek';

export async function authUserDeleteCredential(id: string) {
  return await trek.delete(`/auth/me/credentials/${id}`);
}
