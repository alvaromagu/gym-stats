import type { CredentialRequestRepository } from '../domain/credential-request-repository.js';

export class CredentialRequestRemover {
  constructor(
    private readonly credentialRequestRepository: CredentialRequestRepository,
  ) {}

  async execute({ userId }: { userId: string }): Promise<void> {
    await this.credentialRequestRepository.deleteByUserId(userId);
  }
}
