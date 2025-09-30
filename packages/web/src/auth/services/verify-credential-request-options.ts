import type { RegistrationResponseJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function verifyCredentialRequestOptions({
  id,
  registrationResponse,
}: {
  id: string;
  registrationResponse: RegistrationResponseJSON;
}) {
  return await trek.post<{
    verified: boolean;
  }>('/auth/verify-credential-request-options', { id, registrationResponse });
}
