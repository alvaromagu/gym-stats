import * as dotenv from 'dotenv';
import type { Config } from '@shared/domain/config.ts';

const DEFAULT_PORT = 8080;
dotenv.config();

if (process.env.SUPABASE_KEY == null || process.env.SUPABASE_KEY === '') {
  throw new Error('Missing SUPABASE_KEY environment variable');
}

const origin = process.env.ORIGIN;
const origins = origin?.split(',') ?? [];

export const config: Config = {
  port: process.env.PORT ?? DEFAULT_PORT,
  supabaseKey: process.env.SUPABASE_KEY,
  origins,
};
