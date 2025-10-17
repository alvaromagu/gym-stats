import type { Workout } from './workout.js';

export interface WorkoutRepository {
  create: (workout: Workout) => Promise<void>;
  update: (workout: Workout) => Promise<void>;
  delete: (workoutId: string) => Promise<void>;
  findById: (workoutId: string) => Promise<Workout | null>;
  findByUserId: (userId: string) => Promise<Workout[]>;
}
