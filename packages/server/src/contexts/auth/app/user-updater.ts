import { GSApiError } from '@/contexts/shared/domain/error';
import type { UserRepository } from '../domain/user-repository';
import { User } from '../domain/user';

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
      throw new GSApiError('User not found', 404);
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
