import { SupaRepository } from '@/contexts/shared/infra/persistance/supa-repository.js';
import type { ExerciseRepository } from '../domain/exercise-repository.js';
import { Exercise } from '../domain/exercise.js';

export class SupaExerciseRepository
  extends SupaRepository
  implements ExerciseRepository
{
  async create(exercise: Exercise): Promise<void> {
    const { error } = await this.client
      .from('exercises')
      .insert(this.mapToDb(exercise))
      .single();
    if (error != null) {
      throw error;
    }
  }

  async update(exercise: Exercise): Promise<void> {
    const dbObject = this.mapToDb(exercise);
    const updateData = {
      ...dbObject,
      id: undefined,
    };
    const { error } = await this.client
      .from('exercises')
      .update(updateData)
      .eq('id', exercise.id)
      .single();
    if (error != null) {
      throw error;
    }
  }

  async delete(exerciseId: string): Promise<void> {
    const { error } = await this.client
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
      .single();
    if (error != null) {
      throw error;
    }
  }

  async findById(exerciseId: string): Promise<Exercise | null> {
    const { data, error } = await this.client
      .from('exercises')
      .select()
      .eq('id', exerciseId)
      .single();
    if (error != null) {
      throw error;
    }
    return this.mapToDomain(data);
  }

  async findByWorkoutId(workoutId: string): Promise<Exercise[]> {
    const { data, error } = await this.client
      .from('exercises')
      .select()
      .eq('workout_id', workoutId)
      .order('sort_order', { ascending: true });
    if (error != null) {
      throw error;
    }
    return data.map((item) => this.mapToDomain(item));
  }

  private mapToDb(exercise: Exercise) {
    const primitives = exercise.toPrimitives();
    return {
      id: primitives.id,
      workout_id: primitives.workoutId,
      name: primitives.name,
      sort_order: primitives.sortOrder,
    };
  }

  private mapToDomain(data: {
    id: string;
    name: string;
    sort_order: number;
    workout_id: string;
  }): Exercise {
    return Exercise.fromPrimitives({
      id: data.id,
      workoutId: data.workout_id,
      name: data.name,
      sortOrder: data.sort_order,
    });
  }
}
