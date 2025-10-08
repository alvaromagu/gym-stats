import { Aggregate } from '../../../contexts/shared/domain/aggregate.js';
import type { Primitives } from '../../../contexts/shared/domain/primitives.js';

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
