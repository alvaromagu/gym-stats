export interface UpdateWorkoutRequest {
  id: string;
  name: string;
  date: string;
  notes?: string | null;
}
