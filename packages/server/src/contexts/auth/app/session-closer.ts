import type { Config } from '../../shared/domain/config.js';
import type { TokenRepository } from '../domain/token-repository.js';
import type { UserRepository } from '../domain/user-repository.js';
import { hashToken } from './hash-token.js';

export class SessionCloser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly config: Config,
  ) {}

  async execute({ token }: { token: string }): Promise<void> {
    const hashedToken = hashToken(token);
    await this.tokenRepository.deleteByHash(hashedToken);
  }
}
