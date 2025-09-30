import type { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function createCredentialRequestOptions({ id }: { id: string }) {
  return await trek.post<PublicKeyCredentialCreationOptionsJSON>(
    '/auth/create-credential-request-options',
    { id },
  );
}
