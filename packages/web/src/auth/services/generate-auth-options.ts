import type { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function generateAuthOptions({ email }: { email: string }) {
  return await trek.post<PublicKeyCredentialRequestOptionsJSON>(
    '/auth/auth-options/generate',
    { email },
  );
}
