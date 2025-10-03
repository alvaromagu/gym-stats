import {
  GSGoneError,
  GSNotFoundError,
} from '../../../contexts/shared/domain/error.js';
import type { CredentialRequestRepository } from '../domain/credential-request-repository.js';
import type { UserRepository } from '../domain/user-repository.js';
import type { Config } from '../../../contexts/shared/domain/config.js';
import { getRegistrationOptions } from './get-registration-options.js';
import { User } from '../domain/user.js';
import {
  generateRegistrationOptions,
  type PublicKeyCredentialCreationOptionsJSON,
} from '@simplewebauthn/server';

export class CredentialRequestOptionsCreator {
  constructor(
    private readonly credentialRequestRepository: CredentialRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    id,
  }: {
    id: string;
  }): Promise<PublicKeyCredentialCreationOptionsJSON> {
    const credentialRequest =
      await this.credentialRequestRepository.findById(id);
    if (credentialRequest == null) {
      throw new GSNotFoundError('No se encontró la solicitud de credencial');
    }
    const user = await this.userRepository.findById(credentialRequest.userId);
    if (user == null) {
      throw new GSNotFoundError('No se encontró el usuario asociado');
    }
    const now = new Date();
    if (credentialRequest.expiresAt < now) {
      throw new GSGoneError('La solicitud de credencial ha expirado');
    }
    const options = await generateRegistrationOptions({
      ...getRegistrationOptions({ email: user.email, config: this.config }),
      excludeCredentials: user.credentials.map((cred) => ({
        id: cred.id,
        transports: cred.transports,
      })),
    });
    const updatedUser = new User(
      user.id,
      user.email,
      user.fullName,
      user.credentials,
      options.challenge,
    );
    await this.userRepository.update(updatedUser);
    return options;
  }
}
