import { SupaRepository } from '@/contexts/shared/infra/persistance/supa-repository.js';
import type { SetRepository } from '../domain/set-repository.js';
import { Set } from '../domain/set.js';

export class SupaSetRepository extends SupaRepository implements SetRepository {
  async create(set: Set): Promise<void> {
    const { error } = await this.client
      .from('sets')
      .insert(this.mapToDb(set))
      .single();
    if (error != null) {
      throw error;
    }
  }

  async update(set: Set): Promise<void> {
    const dbObject = this.mapToDb(set);
    const updateData = {
      ...dbObject,
      id: undefined,
    };
    const { error } = await this.client
      .from('sets')
      .update(updateData)
      .eq('id', set.id);
    if (error != null) {
      throw error;
    }
  }

  async delete(setId: string): Promise<void> {
    const { error } = await this.client.from('sets').delete().eq('id', setId);
    if (error != null) {
      throw error;
    }
  }

  async findById(setId: string): Promise<Set | null> {
    const { data, error } = await this.client
      .from('sets')
      .select()
      .eq('id', setId)
      .single();
    if (error != null) {
      throw error;
    }
    return this.mapToDomain(data);
  }

  private mapToDb(set: Set) {
    const primitives = set.toPrimitives();
    return {
      id: primitives.id,
      exercise_id: primitives.exerciseId,
      set_number: primitives.setNumber,
      weight_kg: primitives.weightKg,
      repetitions: primitives.repetitions,
      group_id: primitives.groupId,
      rpe: primitives.rpe,
      to_failure: primitives.toFailure,
      notes: primitives.notes,
    };
  }

  private mapToDomain(data: {
    exercise_id: string;
    group_id: string | null;
    id: string;
    notes: string | null;
    repetitions: number;
    rpe: number | null;
    set_number: number;
    to_failure: boolean | null;
    weight_kg: number;
  }): Set {
    return Set.fromPrimitives({
      id: data.id,
      exerciseId: data.exercise_id,
      setNumber: data.set_number,
      weightKg: data.weight_kg,
      repetitions: data.repetitions,
      groupId: data.group_id,
      rpe: data.rpe,
      toFailure: data.to_failure,
      notes: data.notes,
    });
  }
}
