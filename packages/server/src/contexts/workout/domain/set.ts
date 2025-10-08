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

function validateExerciseId(exerciseId: string): void {
  if (typeof exerciseId !== 'string') {
    throw new Error('Invalid exerciseId: must be a string');
  }
  if (exerciseId.trim().length === 0) {
    throw new Error('Invalid exerciseId: cannot be empty');
  }
}

function validateSetNumber(setNumber: number): void {
  if (typeof setNumber !== 'number' || !Number.isInteger(setNumber)) {
    throw new Error('Invalid setNumber: must be an integer');
  }
  if (setNumber < 1) {
    throw new Error('Invalid setNumber: must be positive');
  }
}

function validateWeightKg(weightKg: number): void {
  if (typeof weightKg !== 'number') {
    throw new Error('Invalid weightKg: must be a number');
  }
  if (weightKg < 0) {
    throw new Error('Invalid weightKg: must be non-negative');
  }
}

function validateRepetitions(repetitions: number): void {
  if (typeof repetitions !== 'number' || !Number.isInteger(repetitions)) {
    throw new Error('Invalid repetitions: must be an integer');
  }
  if (repetitions < 1) {
    throw new Error('Invalid repetitions: must be positive');
  }
}

function validateGroupId(groupId: string | null): void {
  if (groupId !== null && typeof groupId !== 'string') {
    throw new Error('Invalid groupId: must be a string or null');
  }
}

function validateRpe(rpe: number | null): void {
  if (rpe !== null && (typeof rpe !== 'number' || !Number.isInteger(rpe))) {
    throw new Error('Invalid rpe: must be an integer or null');
  }
  if (rpe !== null && (rpe < 1 || rpe > 10)) {
    throw new Error('Invalid rpe: must be between 1 and 10');
  }
}

function validateToFailure(toFailure: boolean | null): void {
  if (toFailure !== null && typeof toFailure !== 'boolean') {
    throw new Error('Invalid toFailure: must be a boolean or null');
  }
}

function validateNotes(notes: string | null): void {
  if (notes !== null && typeof notes !== 'string') {
    throw new Error('Invalid notes: must be a string or null');
  }
}

export class Set extends Aggregate {
  constructor(
    readonly id: string,
    readonly exerciseId: string,
    readonly setNumber: number,
    readonly weightKg: number,
    readonly repetitions: number,
    readonly groupId: string | null,
    readonly rpe: number | null,
    readonly toFailure: boolean | null,
    readonly notes: string | null,
  ) {
    super();
    validateId(id);
    validateExerciseId(exerciseId);
    validateSetNumber(setNumber);
    validateWeightKg(weightKg);
    validateRepetitions(repetitions);
    validateGroupId(groupId);
    validateRpe(rpe);
    validateToFailure(toFailure);
    validateNotes(notes);
  }

  static fromPrimitives(primitives: Primitives<Set>): Set {
    return new Set(
      primitives.id,
      primitives.exerciseId,
      primitives.setNumber,
      primitives.weightKg,
      primitives.repetitions,
      primitives.groupId,
      primitives.rpe,
      primitives.toFailure,
      primitives.notes,
    );
  }

  with(changes: Partial<Omit<Set, 'id' | 'exerciseId'>>): Set {
    return new Set(
      this.id,
      this.exerciseId,
      changes.setNumber ?? this.setNumber,
      changes.weightKg ?? this.weightKg,
      changes.repetitions ?? this.repetitions,
      changes.groupId ?? this.groupId,
      changes.rpe ?? this.rpe,
      changes.toFailure ?? this.toFailure,
      changes.notes ?? this.notes,
    );
  }

  toPrimitives(): Primitives<Set> {
    return {
      id: this.id,
      exerciseId: this.exerciseId,
      setNumber: this.setNumber,
      weightKg: this.weightKg,
      repetitions: this.repetitions,
      groupId: this.groupId,
      rpe: this.rpe,
      toFailure: this.toFailure,
      notes: this.notes,
    };
  }
}
