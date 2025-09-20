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

export class Container {
  private readonly container: AwilixContainer;

  constructor() {
    this.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });
  }

  async register(): Promise<void> {
    this.container.register({
      logger: asClass(ConsoleLogger).singleton(),
      config: asValue(config),
      server: asClass(Server).singleton(),
    });
  }

  get<T>(name: string): T {
    return this.container.resolve<T>(name);
  }
}
