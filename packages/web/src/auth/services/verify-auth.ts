import type { AuthenticationResponseJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function verifyAuth({
  email,
  authResponse,
}: {
  email: string;
  authResponse: AuthenticationResponseJSON;
}) {
  return await trek.post<{
    verified: boolean;
  }>('/auth/verify-authentication', { email, authResponse });
}
