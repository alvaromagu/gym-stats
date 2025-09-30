import { trek } from '@/shared/lib/trek';

export async function authUserVerifyCredential({ id }: { id: string }) {
  return await trek.post<never>(`/auth/me/credentials/${id}/verify`, {});
}
