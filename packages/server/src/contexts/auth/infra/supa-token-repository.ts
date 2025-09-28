import { SupaRepository } from '../../shared/infra/persistance/supa-repository.js';
import type { TokenRepository } from '../domain/token-repository.js';
import { Token } from '../domain/token.js';

export class SupaTokenRepository
  extends SupaRepository
  implements TokenRepository
{
  async create(token: Token): Promise<void> {
    const { error } = await this.client
      .from('tokens')
      .insert(this.mapToDb(token))
      .single();
    if (error != null) {
      throw error;
    }
  }

  async findByHash(hash: string): Promise<Token | null> {
    const { data, error } = await this.client
      .from('tokens')
      .select('*')
      .eq('hash', hash)
      .single();
    if (error != null) {
      return null;
    }
    return data == null ? null : this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('tokens').delete().eq('id', id);
    if (error != null) {
      throw error;
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    const { error } = await this.client
      .from('tokens')
      .delete()
      .eq('user_id', userId);
    if (error != null) {
      throw error;
    }
  }

  async deleteByHash(hashedToken: string): Promise<void> {
    const { error } = await this.client
      .from('tokens')
      .delete()
      .eq('hash', hashedToken);
    if (error != null) {
      throw error;
    }
  }

  async deleteByCredentialId(credentialId: string): Promise<void> {
    const { error } = await this.client
      .from('tokens')
      .delete()
      .eq('credential_id', credentialId);
    if (error != null) {
      throw error;
    }
  }

  private mapToDomain(data: {
    created_at: string;
    credential_id: string;
    expires_at: string;
    hash: string;
    id: string;
    user_id: string;
  }): Token {
    return new Token(
      data.id,
      data.user_id,
      data.credential_id,
      data.hash,
      new Date(data.expires_at),
      new Date(data.created_at),
    );
  }

  private mapToDb(token: Token) {
    return {
      id: token.id,
      user_id: token.userId,
      credential_id: token.credentialId,
      hash: token.hash,
      expires_at: token.expiresAt.toISOString(),
      created_at: token.createdAt.toISOString(),
    };
  }
}
