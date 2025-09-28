import * as dotenv from 'dotenv';
import type { Config } from '../domain/config.js';

const DEFAULT_PORT = 8080;
dotenv.config();

if (process.env.SUPABASE_KEY == null || process.env.SUPABASE_KEY === '') {
  throw new Error('Missing SUPABASE_KEY environment variable');
}

if (process.env.JWT_SECRET == null || process.env.JWT_SECRET === '') {
  throw new Error('Missing JWT_SECRET environment variable');
}

const origin = process.env.ORIGIN;
const origins = origin?.split(',') ?? [];

export const config: Config = {
  port: process.env.PORT ?? DEFAULT_PORT,
  supabaseKey: process.env.SUPABASE_KEY,
  origins,
  rpName: process.env.RP_NAME ?? 'Gym Stats',
  rpID: process.env.RP_ID ?? 'localhost',
  jwtSecret: process.env.JWT_SECRET,
};
