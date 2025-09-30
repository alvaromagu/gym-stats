import { GSApiError } from '../../../contexts/shared/domain/error.js';
import type { CredentialRequestRepository } from '../domain/credential-request-repository.js';
import type { UserRepository } from '../domain/user-repository.js';
import { CredentialRequest } from '../domain/credential-request.js';

export class CredentialRequestCreator {
  private readonly EXPIRATION_TIME_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    private readonly userRepository: UserRepository,
    private readonly credentialRequestRepository: CredentialRequestRepository,
  ) {}

  async execute({ userId }: { userId: string }): Promise<CredentialRequest> {
    const user = await this.userRepository.findById(userId);
    if (user == null) {
      throw new GSApiError('User not found', 404);
    }
    const currentCredentialRequest =
      await this.credentialRequestRepository.findByUserId(userId);
    if (currentCredentialRequest != null) {
      const now = new Date();
      if (currentCredentialRequest.expiresAt > now) {
        return currentCredentialRequest;
      }
      await this.credentialRequestRepository.deleteById(
        currentCredentialRequest.id,
      );
    }
    const expiresAt = new Date(Date.now() + this.EXPIRATION_TIME_MS);
    const credentialRequest = new CredentialRequest(
      crypto.randomUUID(),
      expiresAt,
      userId,
    );
    await this.credentialRequestRepository.create(credentialRequest);
    return credentialRequest;
  }
}
