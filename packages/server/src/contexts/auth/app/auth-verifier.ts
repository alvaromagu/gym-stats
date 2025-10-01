import type { UserRepository } from '../domain/user-repository.js';
import type { Config } from '../../shared/domain/config.js';
import { GSApiError } from '../../../contexts/shared/domain/error.js';
import {
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import { User } from '../domain/user.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { Token } from '../domain/token.js';
import { hashToken } from './hash-token.js';
import type { TokenRepository } from '../domain/token-repository.js';
import { Credential } from '../domain/credential.js';

type AuthVerifierResponse =
  | {
      verified: false;
      token: undefined;
    }
  | {
      verified: true;
      token: string;
    };

export class AuthVerifier {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly config: Config,
  ) {}

  async execute({
    email,
    authResponse,
  }: {
    email: string;
    authResponse: AuthenticationResponseJSON;
  }): Promise<AuthVerifierResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (user == null) {
      throw new GSApiError('User not found', 404);
    }
    if (user.currentChallenge == null) {
      throw new GSApiError('No authentication challenge found', 400);
    }
    const credential = user.credentials.find(
      (cred: { id: string }) => cred.id === authResponse.id,
    );
    if (credential == null) {
      throw new GSApiError(
        'Authenticator is not registered with this site',
        400,
      );
    }
    if (!credential.verified) {
      throw new GSApiError('Authenticator is not verified', 400);
    }
    let verification: VerifiedAuthenticationResponse | undefined = undefined;
    try {
      const opts = {
        response: authResponse,
        expectedChallenge: user.currentChallenge,
        expectedOrigin: this.config.origins,
        expectedRPID: this.config.rpID,
        credential: {
          id: credential.id,
          publicKey: credential.publicKey,
          counter: credential.counter,
          transports: credential.transports,
        },
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
      const updatedCredential = new Credential(
        credential.id,
        credential.publicKey,
        authenticationInfo.newCounter,
        credential.deviceName,
        credential.verified,
        credential.createdAt,
        credential.transports,
      );
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
      const payload = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
      };
      const options: SignOptions = {
        expiresIn: '2h',
        issuer: this.config.rpID,
        subject: user.id,
      };
      let tokenStr: string | undefined = undefined;
      try {
        tokenStr = jwt.sign(payload, this.config.jwtSecret, options);
      } catch (error) {
        const _error = error as Error;
        throw new GSApiError(`JWT sign error: ${_error.message}`, 500);
      }
      const token = this.getToken({
        user,
        tokenStr,
        credentialId: credential.id,
      });
      await this.tokenRepository.create(token);
      return { verified: true, token: tokenStr };
    }
    return { verified: false, token: undefined };
  }

  private getToken({
    user,
    tokenStr,
    credentialId,
  }: {
    user: User;
    tokenStr: string;
    credentialId: string;
  }): Token {
    const decoded = jwt.decode(tokenStr) as jwt.JwtPayload | null;
    if (decoded?.exp == null) {
      throw new GSApiError(
        'JWT generated without a valid expiration time.',
        400,
      );
    }
    const expiresAt = new Date(decoded.exp * 1000);
    return new Token(
      crypto.randomUUID(),
      user.id,
      credentialId,
      hashToken(tokenStr),
      expiresAt,
      new Date(),
    );
  }
}
