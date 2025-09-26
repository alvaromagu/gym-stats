import { GSApiError } from '@/contexts/shared/domain/error';
import type { UserRepository } from '../domain/user-repository';
import type { Config } from '@/contexts/shared/domain/config';
import {
  verifyRegistrationResponse,
  type RegistrationResponseJSON,
  type VerifiedRegistrationResponse,
  type VerifyRegistrationResponseOpts,
} from '@simplewebauthn/server';
import { User } from '../domain/user';

export class UserRegistrationVerifier {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    email,
    registrationResponse,
  }: {
    email: string;
    registrationResponse: RegistrationResponseJSON;
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
      const existingCredential = user.credentials.find(
        (c) => c.id === credential.id,
      );
      if (existingCredential == null) {
        const updatedUser = new User(
          user.id,
          user.email,
          user.fullName,
          [...user.credentials, credential],
          null, // Clear the current challenge
        );
        await this.userRepository.update(updatedUser);
      }
    }
    return { verified };
  }
}
