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
    const id = crypto.randomUUID();
    const user = new User(id, email, fullName);
    await this.userRepository.create(user);
    return id;
  }
}
