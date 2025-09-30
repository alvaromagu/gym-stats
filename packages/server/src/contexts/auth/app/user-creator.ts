import { GSError } from '../../shared/domain/error.js';
import { User } from '../domain/user.js';
import type { UserRepository } from '../domain/user-repository.js';
import {
  generateRegistrationOptions,
  type PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/server';
import type { Config } from '../../shared/domain/config.js';
import { getRegistrationOptions } from './get-registration-options.js';

export class UserCreator {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    email,
    fullName,
  }: {
    email: string;
    fullName: string;
  }): Promise<PublicKeyCredentialCreationOptionsJSON> {
    await this.ensureEmailIsUnique(email);
    const id = crypto.randomUUID();
    const options = await generateRegistrationOptions(
      getRegistrationOptions({ email, config: this.config }),
    );
    const user = new User(id, email, fullName, [], options.challenge);
    await this.userRepository.create(user);
    return options;
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user != null) {
      throw new GSError('Email already in use');
    }
  }
}
