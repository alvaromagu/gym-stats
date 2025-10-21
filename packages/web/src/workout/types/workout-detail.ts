export interface WorkoutDetail {
  id: string;
  userId: string;
  name: string;
  date: string;
  notes: string | null;
  exercises: Array<{
    id: string;
    workoutId: string;
    name: string;
    sortOrder: number;
  }>;
}
