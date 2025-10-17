import type { Set } from './set.js';

export interface SetRepository {
  create: (set: Set) => Promise<void>;
  update: (set: Set) => Promise<void>;
  delete: (setId: string) => Promise<void>;
  findById: (setId: string) => Promise<Set | null>;
  findByExerciseId: (exerciseId: string) => Promise<Set[]>;
}
