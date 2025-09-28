import type { SupaClient } from './supa-client.js';

export abstract class SupaRepository {
  protected readonly client: SupaClient;

  constructor(supaClient: SupaClient) {
    this.client = supaClient;
  }
}
