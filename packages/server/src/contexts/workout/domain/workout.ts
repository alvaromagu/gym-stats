import type {
  ISODateTime,
  Primitives,
} from '../../../contexts/shared/domain/primitives.js';
import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';

function validateId(id: string): void {
  if (typeof id !== 'string') {
    throw new Error('Invalid id: must be a string');
  }
  if (id.trim().length === 0) {
    throw new Error('Invalid id: cannot be empty');
  }
}

function validateUserId(userId: string): void {
  if (typeof userId !== 'string') {
    throw new Error('Invalid userId: must be a string');
  }
  if (userId.trim().length === 0) {
    throw new Error('Invalid userId: cannot be empty');
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

function validateDate(date: Date): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date: must be a valid Date object');
  }
}

function validateNotes(notes: string | null): void {
  if (notes !== null && typeof notes !== 'string') {
    throw new Error('Invalid notes: must be a string or null');
  }
}

export class Workout extends Aggregate {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly name: string,
    readonly date: Date,
    readonly notes: string | null,
  ) {
    super();
    validateId(id);
    validateUserId(userId);
    validateName(name);
    validateDate(date);
    validateNotes(notes);
  }

  static fromPrimitives(primitives: Primitives<Workout>): Workout {
    return new Workout(
      primitives.id,
      primitives.userId,
      primitives.name,
      new Date(primitives.date),
      primitives.notes,
    );
  }

  with(changes: Partial<Omit<Workout, 'id' | 'userId'>>): Workout {
    return new Workout(
      this.id,
      this.userId,
      changes.name ?? this.name,
      changes.date ?? this.date,
      changes.notes ?? this.notes,
    );
  }

  toPrimitives(): Primitives<Workout> {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      date: this.date.toISOString() as ISODateTime,
      notes: this.notes,
    };
  }
}
