import type {
  ISODateTime,
  Primitives,
} from '../../../contexts/shared/domain/primitives.js';
import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';

export class Workout extends Aggregate {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly date: Date,
    readonly notes: string | null,
  ) {
    super();
  }

  static fromPrimitives(primitives: Primitives<Workout>): Workout {
    return new Workout(
      primitives.id,
      primitives.userId,
      new Date(primitives.date),
      primitives.notes,
    );
  }

  with(changes: Partial<Omit<Workout, 'id' | 'userId'>>): Workout {
    return new Workout(
      this.id,
      this.userId,
      changes.date ?? this.date,
      changes.notes ?? this.notes,
    );
  }

  toPrimitives(): Primitives<Workout> {
    return {
      id: this.id,
      userId: this.userId,
      date: this.date.toISOString() as ISODateTime,
      notes: this.notes,
    };
  }
}
