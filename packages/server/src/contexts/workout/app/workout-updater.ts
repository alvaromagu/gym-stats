import {
  GSForbiddenError,
  GSNotFoundError,
} from '../../../contexts/shared/domain/error.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';

export class WorkoutUpdater {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute({
    id,
    userId,
    name,
    date,
    notes,
  }: {
    id: string;
    userId: string;
    name: string;
    date: string;
    notes: string | null;
  }): Promise<void> {
    const workout = await this.workoutRepository.findById(id);
    if (workout == null) {
      throw new GSNotFoundError('Workout not found');
    }
    if (workout.userId !== userId) {
      throw new GSForbiddenError('You are not allowed to update this workout');
    }
    const updatedWorkout = workout.with({
      name,
      date: new Date(date),
      notes,
    });
    await this.workoutRepository.update(updatedWorkout);
  }
}
