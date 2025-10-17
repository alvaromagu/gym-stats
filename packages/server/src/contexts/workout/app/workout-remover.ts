import {
  GSForbiddenError,
  GSNotFoundError,
} from '../../../contexts/shared/domain/error.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';

export class WorkoutRemover {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute({ id, userId }: { id: string; userId: string }): Promise<void> {
    const workout = await this.workoutRepository.findById(id);
    if (workout == null) {
      throw new GSNotFoundError('Workout not found');
    }
    if (workout.userId !== userId) {
      throw new GSForbiddenError(
        'You do not have permission to delete this workout',
      );
    }
    await this.workoutRepository.delete(id);
  }
}
