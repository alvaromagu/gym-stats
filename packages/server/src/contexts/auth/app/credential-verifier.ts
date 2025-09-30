import { GSApiError } from '@/contexts/shared/domain/error.js';
import type { UserRepository } from '../domain/user-repository.js';
import { Credential } from '../domain/credential.js';
import httpStatus from 'http-status';
import { User } from '../domain/user.js';

export class CredentialVerifier {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    credentialId,
    userId,
  }: {
    credentialId: string;
    userId: string;
  }): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user == null) {
      throw new GSApiError('User not found', httpStatus.NOT_FOUND);
    }
    const credential = user.credentials.find((c) => c.id === credentialId);
    if (credential == null) {
      throw new GSApiError('Credential not found', httpStatus.NOT_FOUND);
    }
    if (credential.verified) {
      throw new GSApiError(
        'Credential already verified',
        httpStatus.BAD_REQUEST,
      );
    }
    const updatedCrential = new Credential(
      credential.id,
      credential.publicKey,
      credential.counter,
      credential.deviceName,
      true,
      credential.createdAt,
      credential.transports,
    );
    const updatedUser = new User(
      user.id,
      user.email,
      user.fullName,
      user.credentials.map((c) =>
        c.id === credentialId ? updatedCrential : c,
      ),
      user.currentChallenge,
    );
    await this.userRepository.update(updatedUser);
  }
}
