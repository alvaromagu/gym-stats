import type { Config } from '../../domain/config.js';
import type { Database } from './supabase.js';
import { createClient } from '@supabase/supabase-js';

export type SupaClient = ReturnType<typeof createClient<Database>>;

export const createSupaClient = async (config: Config): Promise<SupaClient> => {
  const supabaseUrl = 'https://opsmrdftftmhaiecfyrj.supabase.co';
  const { supabaseKey } = config;
  return createClient<Database>(supabaseUrl, supabaseKey);
};
