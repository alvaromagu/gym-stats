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

interface Dependencies {
  logger: Logger;
  config: Config;
  server: Server;
  supaClient: SupaClient;
  userRepository: UserRepository;
  userCreator: UserCreator;
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
      userCreator: asClass(UserCreator).singleton(),
    });
  }

  get<T extends keyof Dependencies>(name: T): Dependencies[T] {
    return this.container.resolve(name);
  }
}
