import { trek } from '@/shared/lib/trek';

export async function updateUser({ fullName }: { fullName?: string }) {
  return await trek.patch<never>('/auth/me', { fullName });
}
