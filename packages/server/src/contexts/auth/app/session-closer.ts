import type { TokenRepository } from '../domain/token-repository.js';
import { hashToken } from './hash-token.js';

export class SessionCloser {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute({
    token,
    userId,
  }:
    | { token: string; userId: undefined }
    | { userId: string; token: undefined }): Promise<void> {
    if (token != null) {
      const hashedToken = hashToken(token);
      await this.tokenRepository.deleteByHash(hashedToken);
    } else {
      await this.tokenRepository.deleteByUserId(userId);
    }
  }
}
