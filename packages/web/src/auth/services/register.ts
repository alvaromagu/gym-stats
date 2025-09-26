import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function register({
  email,
  fullName,
}: {
  email: string;
  fullName: string;
}) {
  return await trek.post<PublicKeyCredentialCreationOptionsJSON>(
    '/auth/register',
    { email, fullName },
  );
}
