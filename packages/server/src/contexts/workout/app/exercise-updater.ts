import {
  GSForbiddenError,
  GSNotFoundError,
} from '@/contexts/shared/domain/error.js';
import type { ExerciseRepository } from '../domain/exercise-repository.js';
import type { WorkoutRepository } from '../domain/workout-repository.js';
import type { SetRepository } from '../domain/set-repository.js';
import { Set } from '../domain/set.js';

export class ExerciseUpdater {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly workoutRepository: WorkoutRepository,
    private readonly setRepository: SetRepository,
  ) {}

  async execute({
    id,
    userId,
    name,
    sets,
  }: {
    id: string;
    userId: string;
    name: string;
    sets: Array<{
      id: string | null;
      repetitions: number;
      weightKg: number;
      setNumber: number;
      rpe: number | null;
      toFailure: boolean | null;
      groupId: string | null;
      notes: string | null;
    }>;
  }): Promise<void> {
    const exercise = await this.exerciseRepository.findById(id);
    if (exercise == null) {
      throw new GSNotFoundError('Exercise not found');
    }
    const workout = await this.workoutRepository.findById(exercise.workoutId);
    if (workout == null || workout.userId !== userId) {
      throw new GSForbiddenError('You are not allowed to update this exercise');
    }
    const exerciseUpdated = exercise.with({
      name,
      sortOrder: 0,
    });
    await this.exerciseRepository.update(exerciseUpdated);
    const setsGroup = sets.reduce<{
      toCreate: Array<(typeof sets)[number]>;
      toUpdate: Array<(typeof sets)[number] & { id: string }>;
    }>(
      (acc, cur) => {
        if (cur.id == null) {
          acc.toCreate.push(cur);
        } else {
          acc.toUpdate.push(cur as (typeof sets)[number] & { id: string });
        }
        return acc;
      },
      {
        toCreate: [],
        toUpdate: [],
      },
    );
    await Promise.all(
      setsGroup.toCreate.map(async (set) => {
        const domainSet = Set.fromPrimitives({
          ...set,
          id: crypto.randomUUID(),
          exerciseId: exercise.id,
        });
        await this.setRepository.create(domainSet);
      }),
    );
    await Promise.all(
      setsGroup.toUpdate.map(async (set) => {
        const existingSet = await this.setRepository.findById(set.id);
        if (existingSet == null || existingSet.exerciseId !== exercise.id) {
          throw new GSForbiddenError('You are not allowed to update this set');
        }
        const domainSet = existingSet.with({
          repetitions: set.repetitions,
          weightKg: set.weightKg,
          setNumber: set.setNumber,
          rpe: set.rpe,
          toFailure: set.toFailure,
          groupId: set.groupId,
          notes: set.notes,
        });
        await this.setRepository.update(domainSet);
      }),
    );
  }
}
