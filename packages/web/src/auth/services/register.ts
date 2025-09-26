import { trek } from '@/shared/lib/trek';

export async function register({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  return await trek.post('/auth/register', { email, fullName });
}
