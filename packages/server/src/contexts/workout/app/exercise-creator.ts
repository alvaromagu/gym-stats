import {
  GSForbiddenError,
  GSNotFoundError,
} from '@/contexts/shared/domain/error.js';
import type { ExerciseRepository } from '../domain/exercise-repository.js';
import { Exercise } from '../domain/exercise.js';
import type { SetRepository } from '../domain/set-repository.js';
import { Set } from '../domain/set.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';

export class ExerciseCreator {
  constructor(
    private readonly workoutRepository: WorkoutRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly setRepository: SetRepository,
  ) {}

  async execute({
    userId,
    workoutId,
    name,
    sets,
  }: {
    userId: string;
    workoutId: string;
    name: string;
    sets: Array<{
      repetitions: number;
      weightKg: number;
      setNumber: number;
      rpe: number | null;
      toFailure: boolean | null;
      groupId: string | null;
      notes: string | null;
    }>;
  }): Promise<{ id: string }> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (workout == null) {
      throw new GSNotFoundError('Workout not found');
    }
    if (workout.userId !== userId) {
      throw new GSForbiddenError(
        'You do not have permission to add an exercise to this workout',
      );
    }
    const exercise = Exercise.fromPrimitives({
      id: crypto.randomUUID(),
      workoutId,
      name,
      sortOrder: 0,
    });
    await this.exerciseRepository.create(exercise);
    const domainSets = sets.map((set) =>
      Set.fromPrimitives({
        ...set,
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
      }),
    );
    await Promise.all(
      domainSets.map(async (set) => {
        await this.setRepository.create(set);
      }),
    );
    return { id: exercise.id };
  }
}
