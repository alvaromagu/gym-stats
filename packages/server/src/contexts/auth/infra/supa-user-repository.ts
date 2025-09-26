import { SupaRepository } from '@shared/infra/persistance/supa-repository';
import { User } from '@auth/domain/user';
import type { UserRepository } from '@auth/domain/user-repository';
import type { WebAuthnCredential } from '@simplewebauthn/server';

export class SupaUserRepository
  extends SupaRepository
  implements UserRepository
{
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error != null) {
      return null;
    }
    return new User(
      data.id,
      data.email,
      data.full_name,
      (data.credentials as any[]).map((cred) => {
        const publicKey = JSON.parse(cred.pubblicKey as string);
        return {
          ...cred,
          publicKey,
        } as WebAuthnCredential;
      }),
      data.current_challenge,
    );
  }

  async create(user: User): Promise<void> {
    const { error } = await this.client.from('users').insert({
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      credentials: user.credentials.map((cred) => ({
        ...cred,
        publicKey: Buffer.from(cred.publicKey).toString('base64'),
      })),
      current_challenge: user.currentChallenge,
    });
    if (error != null) {
      throw error;
    }
  }

  async update(user: User): Promise<void> {
    const { error } = await this.client
      .from('users')
      .update({
        email: user.email,
        full_name: user.fullName,
        credentials: user.credentials.map((cred) => ({
          ...cred,
          publicKey: Buffer.from(cred.publicKey).toString('base64'),
        })),
        current_challenge: user.currentChallenge,
      })
      .eq('id', user.id);
    if (error != null) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('users').delete().eq('id', id);
    if (error != null) {
      throw error;
    }
  }
}
