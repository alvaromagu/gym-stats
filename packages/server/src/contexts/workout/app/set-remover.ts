import {
  GSForbiddenError,
  GSNotFoundError,
} from '../../../contexts/shared/domain/error.js';
import type { ExerciseRepository } from '../domain/exercise-repository.js';
import type { SetRepository } from '../domain/set-repository.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';

export class SetRemover {
  constructor(
    private readonly setRepository: SetRepository,
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute({ userId, setId }: { userId: string; setId: string }) {
    const set = await this.setRepository.findById(setId);
    if (set == null) {
      throw new GSNotFoundError('Set not found');
    }
    const exercise = await this.exerciseRepository.findById(set.exerciseId);
    if (exercise == null) {
      throw new GSNotFoundError('Exercise not found');
    }
    const workout = await this.workoutRepository.findById(exercise.workoutId);
    if (workout == null || workout.userId !== userId) {
      throw new GSForbiddenError(
        'You do not have permission to delete this set',
      );
    }
    await this.setRepository.delete(setId);
  }
}
