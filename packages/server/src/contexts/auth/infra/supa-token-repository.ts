import { SupaRepository } from '@/contexts/shared/infra/persistance/supa-repository';
import type { TokenRepository } from '../domain/token-repository';
import { Token } from '../domain/token';

export class SupaTokenRepository
  extends SupaRepository
  implements TokenRepository
{
  async create(token: Token): Promise<void> {
    const { error } = await this.client
      .from('tokens')
      .insert({
        id: token.id,
        user_id: token.userId,
        hash: token.hash,
        expires_at: token.expiresAt.toISOString(),
        created_at: token.createdAt.toISOString(),
      })
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
    return new Token(
      data.id,
      data.user_id,
      data.hash,
      new Date(data.expires_at),
      new Date(data.created_at),
    );
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
}
