export interface NewExercise {
  workoutId: string;
  name: string;
  sets: NewExerciseSet[];
}

export interface NewExerciseSet {
  repetitions: number;
  weightKg: number;
  setNumber: number;
}
