import type { Config } from '@/contexts/shared/domain/config';
import type { TokenRepository } from '../domain/token-repository';
import type { UserRepository } from '../domain/user-repository';
import { hashToken } from './hash-token';

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
