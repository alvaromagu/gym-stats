import { GSNotFoundError } from '../../shared/domain/error.js';
import type { UserRepository } from '../domain/user-repository.js';
import { User } from '../domain/user.js';

export class UserUpdater {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    id,
    fullName,
  }: {
    id: string;
    fullName?: string;
  }): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (user == null) {
      throw new GSNotFoundError('User not found');
    }
    const updatedUser = new User(
      user.id,
      user.email,
      fullName ?? user.fullName,
      user.credentials,
      user.currentChallenge,
    );
    await this.userRepository.update(updatedUser);
  }
}
