import { GSNotFoundError } from '../../shared/domain/error.js';
import { User } from '../domain/user.js';
import type { UserRepository } from '../domain/user-repository.js';
import {
  generateAuthenticationOptions,
  type GenerateAuthenticationOptionsOpts,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/server';
import type { Config } from '../../shared/domain/config.js';

export class AuthOptsCreator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    email,
  }: {
    email: string;
  }): Promise<PublicKeyCredentialRequestOptionsJSON> {
    const user = await this.userRepository.findByEmail(email);
    if (user == null) {
      throw new GSNotFoundError('User not found');
    }
    const opts = this.getAuthOpts(user);
    const optionsJSON = await generateAuthenticationOptions(opts);
    const updatedUser = new User(
      user.id,
      user.email,
      user.fullName,
      user.credentials,
      optionsJSON.challenge,
    );
    await this.userRepository.update(updatedUser);
    return optionsJSON;
  }

  private getAuthOpts(user: User): GenerateAuthenticationOptionsOpts {
    return {
      timeout: 60000,
      allowCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        type: 'public-key',
        transports: cred.transports,
      })),
      userVerification: 'preferred',
      rpID: this.config.rpID,
    };
  }
}
