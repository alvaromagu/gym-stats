import type { RegistrationResponseJSON } from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function verifyRegistration({
  email,
  registrationResponse,
}: {
  email: string;
  registrationResponse: RegistrationResponseJSON;
}) {
  return await trek.post<{
    verified: boolean;
  }>('/auth/verify-register', { email, registrationResponse });
}
