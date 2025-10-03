import { GSNotFoundError } from '../../shared/domain/error.js';
import type { UserRepository } from '../domain/user-repository.js';

export class UserFinder {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: { id: string }): Promise<{
    id: string;
    email: string;
    fullName: string | null;
  }> {
    const user = await this.userRepository.findById(id);
    if (user == null) {
      throw new GSNotFoundError('User not found');
    }
    return { id: user.id, email: user.email, fullName: user.fullName };
  }
}
