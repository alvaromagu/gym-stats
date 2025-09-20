import type { SupaClient } from '@/contexts/shared/infra/persistance/supa-client';

export abstract class SupaRepository {
  protected readonly client: SupaClient;

  constructor(supaClient: SupaClient) {
    this.client = supaClient;
  }
}
