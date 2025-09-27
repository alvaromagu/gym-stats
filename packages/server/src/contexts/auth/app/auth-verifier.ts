import type { UserRepository } from '../domain/user-repository';
import type { Config } from '@/contexts/shared/domain/config';
import { GSApiError } from '@/contexts/shared/domain/error';
import {
  verifyAuthenticationResponse,
  type AuthenticationResponseJSON,
  type VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import { User } from '../domain/user';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { Token } from '../domain/token';
import { hashToken } from './hash-token';
import type { TokenRepository } from '../domain/token-repository';

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
      const payload = {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
      };
      const options: SignOptions = {
        expiresIn: '1d',
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
      const token = this.getToken({ user, tokenStr });
      await this.tokenRepository.create(token);
      return { verified: true, token: tokenStr };
    }
    return { verified: false, token: undefined };
  }

  private getToken({
    user,
    tokenStr,
  }: {
    user: User;
    tokenStr: string;
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
      hashToken(tokenStr),
      expiresAt,
      new Date(),
    );
  }
}
