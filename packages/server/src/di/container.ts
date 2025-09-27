import { ConsoleLogger } from '@shared/infra/console-logger';
import { config } from '@shared/infra/config-loader';
import {
  createContainer,
  type AwilixContainer,
  InjectionMode,
  asClass,
  asValue,
} from 'awilix';
import { Server } from '@/server';
import {
  createSupaClient,
  type SupaClient,
} from '@shared/infra/persistance/supa-client';
import type { UserRepository } from '@auth/domain/user-repository';
import { SupaUserRepository } from '@auth/infra/supa-user-repository';
import type { Logger } from '@/contexts/shared/domain/logger';
import type { Config } from '@/contexts/shared/domain/config';
import { UserCreator } from '@/contexts/auth/app/user-creator';
import { UserRegistrationVerifier } from '@/contexts/auth/app/user-registration-verifier';
import { AuthVerifier } from '@/contexts/auth/app/auth-verifier';
import { AuthOptsCreator } from '@/contexts/auth/app/auth-opts-creator';
import type { TokenRepository } from '@/contexts/auth/domain/token-repository';
import { SupaTokenRepository } from '@/contexts/auth/infra/supa-token-repository';

interface Dependencies {
  logger: Logger;
  config: Config;
  server: Server;
  supaClient: SupaClient;
  userRepository: UserRepository;
  tokenRepository: TokenRepository;
  userCreator: UserCreator;
  userRegistrationVerifier: UserRegistrationVerifier;
  authOptsCreator: AuthOptsCreator;
  authVerifier: AuthVerifier;
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
      server: asClass(Server).singleton(),
      supaClient: asValue(supaClient),
      userRepository: asClass<UserRepository>(SupaUserRepository).singleton(),
      tokenRepository:
        asClass<TokenRepository>(SupaTokenRepository).singleton(),
      userCreator: asClass(UserCreator).singleton(),
      userRegistrationVerifier: asClass(UserRegistrationVerifier).singleton(),
      authOptsCreator: asClass(AuthOptsCreator).singleton(),
      authVerifier: asClass(AuthVerifier).singleton(),
    });
  }

  get<T extends keyof Dependencies>(name: T): Dependencies[T] {
    return this.container.resolve(name);
  }
}
