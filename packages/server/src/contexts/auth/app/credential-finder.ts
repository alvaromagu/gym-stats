import httpStatus from 'http-status';
import { GSApiError } from '../../../contexts/shared/domain/error.js';
import type { UserRepository } from '../domain/user-repository.js';

export class CredentialFinder {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: { userId: string }) {
    const user = await this.userRepository.findById(userId);
    if (user == null) {
      throw new GSApiError('User not found', httpStatus.NOT_FOUND);
    }
    const credentials = user.credentials;
    return credentials
      .map((cred) => cred.toPrimitives())
      .map((cred) => ({
        id: cred.id,
        deviceName: cred.deviceName,
      }));
  }
}
