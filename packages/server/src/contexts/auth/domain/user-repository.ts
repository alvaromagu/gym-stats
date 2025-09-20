import type { User } from '@auth/domain/user';

export interface UserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  create: (user: User) => Promise<void>;
  update: (user: User) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
