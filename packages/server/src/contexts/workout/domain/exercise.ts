import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';
import type { Primitives } from '../../../contexts/shared/domain/primitives.js';

function validateId(id: string): void {
  if (typeof id !== 'string') {
    throw new Error('Invalid id: must be a string');
  }
  if (id.trim().length === 0) {
    throw new Error('Invalid id: cannot be empty');
  }
}

function validateWorkoutId(workoutId: string): void {
  if (typeof workoutId !== 'string') {
    throw new Error('Invalid workoutId: must be a string');
  }
  if (workoutId.trim().length === 0) {
    throw new Error('Invalid workoutId: cannot be empty');
  }
}

function validateName(name: string): void {
  if (typeof name !== 'string') {
    throw new Error('Invalid name: must be a string');
  }
  if (name.trim().length === 0) {
    throw new Error('Invalid name: cannot be empty');
  }
}

function validateSortOrder(sortOrder: number): void {
  if (typeof sortOrder !== 'number' || !Number.isInteger(sortOrder)) {
    throw new Error('Invalid sortOrder: must be an integer');
  }
  if (sortOrder < 0) {
    throw new Error('Invalid sortOrder: must be non-negative');
  }
}

export class Exercise extends Aggregate {
  constructor(
    readonly id: string,
    readonly workoutId: string,
    readonly name: string,
    readonly sortOrder: number,
  ) {
    super();
    validateId(id);
    validateWorkoutId(workoutId);
    validateName(name);
    validateSortOrder(sortOrder);
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
