import * as dotenv from 'dotenv';
import type { Config } from '@shared/domain/config.ts';

const DEFAULT_PORT = 8080;
dotenv.config();

export const config: Config = {
  port: process.env.PORT ?? DEFAULT_PORT,
};
