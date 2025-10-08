import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';
import type { Primitives } from '../../../contexts/shared/domain/primitives.js';

export class Exercise extends Aggregate {
  constructor(
    readonly id: string,
    readonly workoutId: string,
    readonly name: string,
    readonly sortOrder: number,
  ) {
    super();
  }

  static fromPrimitives(primitives: Primitives<Exercise>): Exercise {
    return new Exercise(
      primitives.id,
      primitives.workoutId,
      primitives.name,
      primitives.sortOrder,
    );
  }

  with(changes: Partial<Omit<Exercise, 'id' | 'workoutId'>>): Exercise {
    return new Exercise(
      this.id,
      this.workoutId,
      changes.name ?? this.name,
      changes.sortOrder ?? this.sortOrder,
    );
  }

  toPrimitives(): Primitives<Exercise> {
    return {
      id: this.id,
      workoutId: this.workoutId,
      name: this.name,
      sortOrder: this.sortOrder,
    };
  }
}
