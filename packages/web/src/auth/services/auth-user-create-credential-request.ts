import { trek } from '@/shared/lib/trek';
import type { CredentialRequest } from '../types/credential-request';

export async function authUserCreateCredentialRequest() {
  return await trek.post<CredentialRequest>('/auth/me/credential-request', {});
}
