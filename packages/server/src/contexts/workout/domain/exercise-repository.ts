import type { Exercise } from './exercise.js';

export interface ExerciseRepository {
  create: (exercise: Exercise) => Promise<void>;
  update: (exercise: Exercise) => Promise<void>;
  delete: (exerciseId: string) => Promise<void>;
  findById: (exerciseId: string) => Promise<Exercise | null>;
  findByWorkoutId: (workoutId: string) => Promise<Exercise[]>;
}
