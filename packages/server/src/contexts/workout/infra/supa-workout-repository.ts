import { SupaRepository } from '@/contexts/shared/infra/persistance/supa-repository.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';
import { Workout } from '../domain/workout.js';
import type { ISODateTime } from '@/contexts/shared/domain/primitives.js';

export class SupaWorkoutRepository
  extends SupaRepository
  implements WorkoutRepository
{
  async create(workout: Workout): Promise<void> {
    const { error } = await this.client
      .from('workouts')
      .insert(this.mapToDb(workout))
      .single();
    if (error != null) {
      throw error;
    }
  }

  async update(workout: Workout): Promise<void> {
    const dbObject = this.mapToDb(workout);
    const updateData = {
      ...dbObject,
      id: undefined,
    };
    const { error } = await this.client
      .from('workouts')
      .update(updateData)
      .eq('id', workout.id)
      .single();
    if (error != null) {
      throw error;
    }
  }

  async delete(workoutId: string): Promise<void> {
    const { error } = await this.client
      .from('workouts')
      .delete()
      .eq('id', workoutId)
      .single();
    if (error != null) {
      throw error;
    }
  }

  async findById(workoutId: string): Promise<Workout | null> {
    const { data, error } = await this.client
      .from('workouts')
      .select()
      .eq('id', workoutId)
      .single();
    if (error != null) {
      throw error;
    }
    return this.mapToDomain(data);
  }

  private mapToDb(workout: Workout) {
    const primitives = workout.toPrimitives();
    return {
      id: primitives.id,
      user_id: primitives.userId,
      date: primitives.date,
      notes: primitives.notes,
    };
  }

  private mapToDomain(data: {
    date: string;
    id: string;
    notes: string | null;
    user_id: string;
  }): Workout {
    return Workout.fromPrimitives({
      id: data.id,
      userId: data.user_id,
      date: data.date as ISODateTime,
      notes: data.notes,
    });
  }
}
