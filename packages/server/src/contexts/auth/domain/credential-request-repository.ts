import type { CredentialRequest } from './credential-request.js';

export interface CredentialRequestRepository {
  create: (credentialRequest: CredentialRequest) => Promise<void>;
  findById: (id: string) => Promise<CredentialRequest | null>;
  deleteById: (id: string) => Promise<void>;
  findByUserId: (userId: string) => Promise<CredentialRequest | null>;
}
