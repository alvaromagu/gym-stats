import { SupaRepository } from '../../../contexts/shared/infra/persistance/supa-repository.js';
import type { CredentialRequestRepository } from '../domain/credential-request-repository.js';
import { CredentialRequest } from '../domain/credential-request.js';

export class SupaCredentialRequestRepository
  extends SupaRepository
  implements CredentialRequestRepository
{
  async create(credentialRequest: CredentialRequest): Promise<void> {
    const { error } = await this.client
      .from('credential_requests')
      .insert(this.mapToDb(credentialRequest))
      .single();
    if (error != null) {
      throw error;
    }
  }

  async findById(id: string): Promise<CredentialRequest | null> {
    const { data, error } = await this.client
      .from('credential_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (error != null) {
      return null;
    }
    return data == null ? null : this.mapToDomain(data);
  }

  async findByUserId(userId: string): Promise<CredentialRequest | null> {
    const { data, error } = await this.client
      .from('credential_requests')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error != null) {
      return null;
    }
    return data == null ? null : this.mapToDomain(data);
  }

  async deleteById(id: string): Promise<void> {
    const { error } = await this.client
      .from('credential_requests')
      .delete()
      .eq('id', id);
    if (error != null) {
      throw error;
    }
  }

  private mapToDb(credentialRequest: CredentialRequest) {
    const primitives = credentialRequest.toPrimitives();
    return {
      id: primitives.id,
      expires_at: primitives.expiresAt,
      user_id: primitives.userId,
    };
  }

  private mapToDomain(row: {
    expires_at: string;
    id: string;
    user_id: string;
  }): CredentialRequest {
    return new CredentialRequest(row.id, new Date(row.expires_at), row.user_id);
  }
}
