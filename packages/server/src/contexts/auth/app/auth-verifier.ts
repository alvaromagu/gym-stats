import type { UserRepository } from '../domain/user-repository.js';
import type { Config } from '../../shared/domain/config.js';
import {
  GSError,
  GSNotFoundError,
  GSPreconditionFailedError,
} from '../../../contexts/shared/domain/error.js';
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
      throw new GSNotFoundError('User not found');
    }
    if (user.currentChallenge == null) {
      throw new GSNotFoundError('No authentication challenge found');
    }
    const credential = user.credentials.find(
      (cred: { id: string }) => cred.id === authResponse.id,
    );
    if (credential == null) {
      throw new GSNotFoundError(
        'Authenticator is not registered with this site',
      );
    }
    if (!credential.verified) {
      throw new GSPreconditionFailedError('Authenticator is not verified');
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
      throw new GSError(`Registration verification failed: ${_error.message}`);
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
        throw new GSError(`JWT sign error: ${_error.message}`);
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
      throw new GSError('JWT generated without a valid expiration time.');
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
