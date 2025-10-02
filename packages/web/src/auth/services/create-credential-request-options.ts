import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function createCredentialRequestOptions({ id }: { id: string }) {
  return await trek.post<PublicKeyCredentialCreationOptionsJSON>(
    '/auth/credential-request/options/generate',
    { id },
  );
}
