import { GSApiError } from '../../shared/domain/error.js';
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
      throw new GSApiError('User not found', 404);
    }
    return { id: user.id, email: user.email, fullName: user.fullName };
  }
}
