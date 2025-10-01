import { trek } from '@/shared/lib/trek';

export async function authUserRemoveCredentialRequest() {
  return await trek.delete<never>('/auth/me/credential-request');
}
