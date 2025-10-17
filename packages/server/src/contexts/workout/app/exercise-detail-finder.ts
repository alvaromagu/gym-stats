import {
  GSForbiddenError,
  GSNotFoundError,
} from '@/contexts/shared/domain/error.js';
import type { ExerciseRepository } from '../domain/exercise-repository.js';
import type { SetRepository } from '../domain/set-repository.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';

export class ExerciseDetailFinder {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly setRepository: SetRepository,
  ) {}

  async execute({
    userId,
    exerciseId,
  }: {
    userId: string;
    exerciseId: string;
  }) {
    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (exercise == null) {
      throw new GSNotFoundError('Exercise not found');
    }
    const workout = await this.workoutRepository.findById(exercise.workoutId);
    if (workout == null || workout.userId !== userId) {
      throw new GSForbiddenError('You do not have access to this exercise');
    }
    const sets = await this.setRepository.findByExerciseId(exerciseId);
    return {
      ...exercise.toPrimitives(),
      sets: sets.map((set) => set.toPrimitives()),
    };
  }
}
