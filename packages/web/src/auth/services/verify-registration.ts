import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';
import { trek } from '@/shared/lib/trek';

export async function verifyRegistration({
  email,
  registrationResponse,
}: {
  email: string;
  registrationResponse: RegistrationResponseJSON;
}) {
  return await trek.post<PublicKeyCredentialCreationOptionsJSON>(
    '/auth/verify-register',
    { email, registrationResponse },
  );
}
