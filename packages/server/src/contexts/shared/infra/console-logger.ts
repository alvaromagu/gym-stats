import type { Logger } from '@shared/domain/logger.ts';

export class ConsoleLogger implements Logger {
  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(message, ...optionalParams);
  }

  info(message: unknown, ...optionalParams: unknown[]): void {
    console.info(message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(message, ...optionalParams);
  }

  warning(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(message, ...optionalParams);
  }
}
