import chalk from 'chalk';
import type { Logger } from '../domain/logger.js';

export class ConsoleLogger implements Logger {
  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(chalk.gray(message, ...optionalParams));
  }

  info(message: unknown, ...optionalParams: unknown[]): void {
    console.info(chalk.blue(message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(chalk.red(message, ...optionalParams));
  }

  warning(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(chalk.yellow(message, ...optionalParams));
  }
}
