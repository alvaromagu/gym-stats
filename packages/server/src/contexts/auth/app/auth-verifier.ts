import type { UserRepository } from '../domain/user-repository';
import type { Config } from '@/contexts/shared/domain/config';
import { GSApiError } from '@/contexts/shared/domain/error';
import {
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import { User } from '../domain/user';

export class AuthVerifier {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    email,
    authResponse,
  }: {
    email: string;
    authResponse: AuthenticationResponseJSON;
  }): Promise<{
    verified: boolean;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (user == null) {
      throw new GSApiError('User not found', 404);
    }
    if (user.currentChallenge == null) {
      throw new GSApiError('No authentication challenge found', 400);
    }
    const credential = user.credentials.find(
      (cred) => cred.id === authResponse.id,
    );
    if (credential == null) {
      throw new GSApiError(
        'Authenticator is not registered with this site',
        400,
      );
    }
    let verification: VerifiedAuthenticationResponse | undefined = undefined;
    try {
      const opts = {
        response: authResponse,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: this.config.origins,
        expectedRPID: this.config.rpID,
        credential,
        requireUserVerification: false,
      };
      verification = await verifyAuthenticationResponse(opts);
    } catch (error) {
      const _error = error as Error;
      throw new GSApiError(
        `Registration verification failed: ${_error.message}`,
        400,
      );
    }
    const { verified, authenticationInfo } = verification;
    if (verified) {
      const updatedCredential = {
        ...credential,
        counter: authenticationInfo.newCounter,
      };
      const updatedUser = new User(
        user.id,
        user.email,
        user.fullName,
        user.credentials.map((c) =>
          c.id === updatedCredential.id ? updatedCredential : c,
        ),
        null,
      );
      await this.userRepository.update(updatedUser);
    }
    return { verified };
  }
}
