import { GSApiError } from '@/contexts/shared/domain/error.js';
import type { TokenRepository } from '../domain/token-repository.js';
import type { UserRepository } from '../domain/user-repository.js';
import { User } from '../domain/user.js';
import httpStatus from 'http-status';

export class CredentialRemover {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute({
    userId,
    credentialId,
  }: {
    userId: string;
    credentialId: string;
  }): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user == null) {
      throw new GSApiError('User not found', httpStatus.NOT_FOUND);
    }
    const credential = user.credentials.find(
      (cred) => cred.id === credentialId,
    );
    if (credential == null) {
      throw new GSApiError('Credential not found', httpStatus.NOT_FOUND);
    }
    if (user.credentials.length <= 1) {
      throw new GSApiError(
        'Cannot remove the only credential. User must have at least one credential.',
        httpStatus.PRECONDITION_FAILED,
      );
    }
    const updatedUser = new User(
      user.id,
      user.email,
      user.fullName,
      user.credentials.filter((cred) => cred.id !== credentialId),
      user.currentChallenge,
    );
    await this.userRepository.update(updatedUser);
    await this.tokenRepository.deleteByCredentialId(credentialId);
  }
}
