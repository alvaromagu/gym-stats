import type { ISODateTime } from '@/contexts/shared/domain/primitives.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';
import { Workout } from '../domain/workout.js';

export class WorkoutCreator {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute({
    userId,
    name,
    date,
  }: {
    userId: string;
    name: string;
    date: string;
  }): Promise<{
    id: string;
  }> {
    const workout = Workout.fromPrimitives({
      id: crypto.randomUUID(),
      userId,
      name,
      date: date as ISODateTime,
      notes: null,
    });
    await this.workoutRepository.create(workout);
    return { id: workout.id };
  }
}
