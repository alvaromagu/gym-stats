import type { Token } from './token';

export interface TokenRepository {
  create: (token: Token) => Promise<void>;
  findByHash: (hash: string) => Promise<Token | null>;
  delete: (id: string) => Promise<void>;
  deleteByUserId: (userId: string) => Promise<void>;
  deleteByHash: (hashedToken: string) => Promise<void>;
}
