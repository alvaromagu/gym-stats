import { GSError } from '@/contexts/shared/domain/error';
import { User } from '../domain/user';
import type { UserRepository } from '../domain/user-repository';

export class UserCreator {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    email,
    fullName,
  }: {
    email: string;
    fullName: string;
  }): Promise<string> {
    await this.ensureEmailIsUnique(email);
    const id = crypto.randomUUID();
    const user = new User(id, email, fullName);
    await this.userRepository.create(user);
    return id;
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user != null) {
      throw new GSError('Email already in use');
    }
  }
}
