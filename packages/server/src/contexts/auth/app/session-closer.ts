import type { TokenRepository } from '../domain/token-repository.js';
import { hashToken } from './hash-token.js';

export class SessionCloser {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute({ token }: { token: string }): Promise<void> {
    const hashedToken = hashToken(token);
    await this.tokenRepository.deleteByHash(hashedToken);
  }
}
