import {
  GSForbiddenError,
  GSNotFoundError,
} from '@/contexts/shared/domain/error.js';
import type { ExerciseRepository } from '../domain/exercise-repository.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';

export class WorkoutDetailFinder {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute({ workoutId, userId }: { workoutId: string; userId: string }) {
    const workout = await this.workoutRepository.findById(workoutId);
    if (workout == null) {
      throw new GSNotFoundError('Workout not found');
    }
    if (workout.userId !== userId) {
      throw new GSForbiddenError('You do not have access to this workout');
    }
    const exercises = await this.exerciseRepository
      .findByWorkoutId(workoutId)
      .then((list) => list.map((exercise) => exercise.toPrimitives()));
    return {
      ...workout.toPrimitives(),
      exercises,
    };
  }
}
