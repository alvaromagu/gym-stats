import type { AuthenticationResponseJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export type VerifyAuthResponse =
  | {
      verified: true;
      token: string;
    }
  | {
      verified: false;
      token: undefined;
    };

export async function verifyAuth({
  email,
  authResponse,
}: {
  email: string;
  authResponse: AuthenticationResponseJSON;
}) {
  return await trek.post<VerifyAuthResponse>('/auth/verify-authentication', {
    email,
    authResponse,
  });
}
