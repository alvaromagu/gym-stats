import {
  createContainer,
  type AwilixContainer,
  InjectionMode,
  asClass,
  asValue,
} from 'awilix';
import { ConsoleLogger } from '../contexts/shared/infra/console-logger.js';
import { config } from '../contexts/shared/infra/config-loader.js';
import {
  createSupaClient,
  type SupaClient,
} from '../contexts/shared/infra/persistance/supa-client.js';
import type { UserRepository } from '../contexts/auth/domain/user-repository.js';
import { SupaUserRepository } from '../contexts/auth/infra/supa-user-repository.js';
import type { Logger } from '../contexts/shared/domain/logger.js';
import type { Config } from '../contexts/shared/domain/config.js';
import { UserCreator } from '../contexts/auth/app/user-creator.js';
import { UserRegistrationVerifier } from '../contexts/auth/app/user-registration-verifier.js';
import { AuthVerifier } from '../contexts/auth/app/auth-verifier.js';
import { AuthOptsCreator } from '../contexts/auth/app/auth-opts-creator.js';
import type { TokenRepository } from '../contexts/auth/domain/token-repository.js';
import { SupaTokenRepository } from '../contexts/auth/infra/supa-token-repository.js';
import { SessionCloser } from '../contexts/auth/app/session-closer.js';
import { UserUpdater } from '../contexts/auth/app/user-updater.js';
import { UserFinder } from '../contexts/auth/app/user-finder.js';
import { CredentialRemover } from '../contexts/auth/app/credential-remover.js';
import { CredentialFinder } from '../contexts/auth/app/credential-finder.js';
import { CredentialVerifier } from '@/contexts/auth/app/credential-verifier.js';
import { CredentialRequestCreator } from '@/contexts/auth/app/credential-request-creator.js';
import type { CredentialRequestRepository } from '@/contexts/auth/domain/credential-request-repository.js';
import { SupaCredentialRequestRepository } from '@/contexts/auth/infra/supa-credential-request-repository.js';
import { CredentialRequestOptionsCreator } from '@/contexts/auth/app/credential-request-options-creator.js';
import { CredentialRequestOptionsVerifier } from '@/contexts/auth/app/credential-request-options-verifier.js';

interface Dependencies {
  logger: Logger;
  config: Config;
  supaClient: SupaClient;
  userRepository: UserRepository;
  tokenRepository: TokenRepository;
  credentialRequestRepository: CredentialRequestRepository;
  userCreator: UserCreator;
  userRegistrationVerifier: UserRegistrationVerifier;
  authOptsCreator: AuthOptsCreator;
  authVerifier: AuthVerifier;
  sessionCloser: SessionCloser;
  userUpdater: UserUpdater;
  userFinder: UserFinder;
  credentialFinder: CredentialFinder;
  credentialRemover: CredentialRemover;
  credentialVerifier: CredentialVerifier;
  credentialRequestCreator: CredentialRequestCreator;
  credentialRequestOptionsCreator: CredentialRequestOptionsCreator;
  credentialRequestOptionsVerifier: CredentialRequestOptionsVerifier;
}

export class Container {
  private readonly container: AwilixContainer<Dependencies> =
    createContainer<Dependencies>({
      injectionMode: InjectionMode.CLASSIC,
    });

  async register(): Promise<void> {
    const supaClient = await createSupaClient(config);

    this.container.register({
      logger: asClass(ConsoleLogger).singleton(),
      config: asValue(config),
      supaClient: asValue(supaClient),
      userRepository: asClass<UserRepository>(SupaUserRepository).singleton(),
      tokenRepository:
        asClass<TokenRepository>(SupaTokenRepository).singleton(),
      credentialRequestRepository: asClass<CredentialRequestRepository>(
        SupaCredentialRequestRepository,
      ).singleton(),
      userCreator: asClass(UserCreator).singleton(),
      userRegistrationVerifier: asClass(UserRegistrationVerifier).singleton(),
      authOptsCreator: asClass(AuthOptsCreator).singleton(),
      authVerifier: asClass(AuthVerifier).singleton(),
      sessionCloser: asClass(SessionCloser).singleton(),
      userUpdater: asClass(UserUpdater).singleton(),
      userFinder: asClass(UserFinder).singleton(),
      credentialFinder: asClass(CredentialFinder).singleton(),
      credentialRemover: asClass(CredentialRemover).singleton(),
      credentialVerifier: asClass(CredentialVerifier).singleton(),
      credentialRequestCreator: asClass(CredentialRequestCreator).singleton(),
      credentialRequestOptionsCreator: asClass(
        CredentialRequestOptionsCreator,
      ).singleton(),
      credentialRequestOptionsVerifier: asClass(
        CredentialRequestOptionsVerifier,
      ).singleton(),
    });
  }

  get<T extends keyof Dependencies>(name: T): Dependencies[T] {
    return this.container.resolve(name);
  }
}
