import { GSError, GSNotFoundError } from '../../shared/domain/error.js';
import type { UserRepository } from '../domain/user-repository.js';
import type { Config } from '../../shared/domain/config.js';
import {
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
  type VerifiedRegistrationResponse,
  type VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';
import { User } from '../domain/user.js';
import { Credential } from '../domain/credential.js';

export class UserRegistrationVerifier {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    email,
    registrationResponse,
    deviceName,
  }: {
    email: string;
    registrationResponse: RegistrationResponseJSON;
    deviceName: string;
  }): Promise<{
    verified: boolean;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (user == null) {
      throw new GSNotFoundError('User not found');
    }
    const currentChallenge = user.currentChallenge;
    if (currentChallenge == null) {
      throw new GSNotFoundError('No registration challenge found');
    }
    let verification: VerifiedRegistrationResponse | undefined = undefined;
    try {
      const opts: VerifyRegistrationResponseOpts = {
        response: registrationResponse,
        expectedChallenge: currentChallenge,
        expectedOrigin: this.config.origins,
        expectedRPID: this.config.rpID,
        requireUserVerification: false,
      };
      verification = await verifyRegistrationResponse(opts);
    } catch (error) {
      const _error = error as Error;
      throw new GSError(`Registration verification failed: ${_error.message}`);
    }
    const { verified, registrationInfo } = verification;
    if (verified) {
      const { credential } = registrationInfo;
      const domainCredential = new Credential(
        credential.id,
        credential.publicKey,
        credential.counter,
        deviceName,
        true,
        new Date(),
        credential.transports,
      );
      const existingCredential = user.credentials.find(
        (c) => c.id === credential.id,
      );
      if (existingCredential == null) {
        const updatedUser = new User(
          user.id,
          user.email,
          user.fullName,
          [...user.credentials, domainCredential],
          null, // Clear the current challenge
        );
        await this.userRepository.update(updatedUser);
      }
    }
    return { verified };
  }
}
