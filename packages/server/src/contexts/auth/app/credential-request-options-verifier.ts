import {
  type VerifiedRegistrationResponse,
  verifyRegistrationResponse,
  type VerifyRegistrationResponseOpts,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import type { CredentialRequestRepository } from '../domain/credential-request-repository.js';
import type { UserRepository } from '../domain/user-repository.js';
import { GSApiError } from '@/contexts/shared/domain/error.js';
import type { Config } from '@/contexts/shared/domain/config.js';
import { Credential } from '../domain/credential.js';
import { User } from '../domain/user.js';

export class CredentialRequestOptionsVerifier {
  constructor(
    private readonly credentialRequestRepository: CredentialRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly config: Config,
  ) {}

  async execute({
    id,
    registrationResponse,
    deviceName,
  }: {
    id: string;
    registrationResponse: RegistrationResponseJSON;
    deviceName: string;
  }): Promise<{
    verified: boolean;
  }> {
    const credentialRequest =
      await this.credentialRequestRepository.findById(id);
    if (credentialRequest == null) {
      throw new GSApiError('No se encontró la solicitud de credencial', 404);
    }
    const user = await this.userRepository.findById(credentialRequest.userId);
    if (user == null) {
      throw new GSApiError('No se encontró el usuario asociado', 404);
    }
    const currentChallenge = user.currentChallenge;
    if (currentChallenge == null) {
      throw new GSApiError('No se encontró un desafío de registro', 400);
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
        false,
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
      await this.credentialRequestRepository.deleteById(credentialRequest.id);
    }
    return { verified };
  }
}
