import { GSApiError } from '../../shared/domain/error.js';
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
      throw new GSApiError('User not found', 404);
    }
    const currentChallenge = user.currentChallenge;
    if (currentChallenge == null) {
      throw new GSApiError('No registration challenge found', 400);
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
      throw new GSApiError(
        `Registration verification failed: ${_error.message}`,
        400,
      );
    }
    const { verified, registrationInfo } = verification;
    if (verified) {
      const { credential } = registrationInfo;
      const domainCredential = new Credential(
        credential.id,
        credential.publicKey,
        credential.counter,
        deviceName,
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
