import { SupaRepository } from '@shared/infra/persistance/supa-repository';
import { User } from '@auth/domain/user';
import type { UserRepository } from '@auth/domain/user-repository';

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
    return new User(data.id, data.email, data.full_name);
  }

  async create(user: User): Promise<void> {
    const { error } = await this.client.from('users').insert({
      id: user.id,
      email: user.email,
      full_name: user.fullName,
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
