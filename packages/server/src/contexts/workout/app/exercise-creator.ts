import type { ExerciseRepository } from '../domain/exercise-repository.js';
import { Exercise } from '../domain/exercise.js';
import type { SetRepository } from '../domain/set-repository.js';
import { Set } from '../domain/set.js';

export class ExerciseCreator {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly setRepository: SetRepository,
  ) {}

  async execute({
    workoutId,
    name,
    sets,
  }: {
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
