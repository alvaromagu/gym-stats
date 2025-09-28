import { SupaRepository } from '../../shared/infra/persistance/supa-repository.js';
import { User } from '../domain/user.js';
import type { UserRepository } from '../domain/user-repository.js';
import { Credential } from '../domain/credential.js';
import type { Json } from '@/contexts/shared/infra/persistance/supabase.js';
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';

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
    return this.mapToDomain(data);
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error != null) {
      return null;
    }
    return this.mapToDomain(data);
  }

  async create(user: User): Promise<void> {
    const { error } = await this.client
      .from('users')
      .insert(this.mapToDb(user));
    if (error != null) {
      throw error;
    }
  }

  async update(user: User): Promise<void> {
    const dbObject = this.mapToDb(user);
    const updateData = {
      ...dbObject,
      id: undefined,
    };
    const { error } = await this.client
      .from('users')
      .update(updateData)
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

  private mapToDomain(user: {
    credentials: Json;
    current_challenge: string | null;
    email: string;
    full_name: string;
    id: string;
  }): User {
    return new User(
      user.id,
      user.email,
      user.full_name,
      (user.credentials as any[]).map(
        (cred) =>
          new Credential(
            cred.id as string,
            Buffer.from(cred.publicKey as string, 'base64'),
            cred.counter as number,
            cred.deviceName as string,
            cred.transports as AuthenticatorTransportFuture[],
          ),
      ) ?? [],
      user.current_challenge,
    );
  }

  private mapToDb(user: User) {
    const primitives = user.toPrimitives();
    return {
      id: primitives.id,
      email: primitives.email,
      full_name: primitives.fullName,
      credentials: primitives.credentials,
      current_challenge: user.currentChallenge,
    };
  }
}
