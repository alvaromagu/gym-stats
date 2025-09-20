import type { Config } from '@shared/domain/config';
import type { Database } from '@shared/infra/persistance/supabase';
import { createClient } from '@supabase/supabase-js';

export type SupaClient = ReturnType<typeof createClient<Database>>;

export const createSupaClient = async (config: Config): Promise<SupaClient> => {
  const supabaseUrl = 'https://opsmrdftftmhaiecfyrj.supabase.co';
  const { supabaseKey } = config;
  return createClient<Database>(supabaseUrl, supabaseKey);
};
