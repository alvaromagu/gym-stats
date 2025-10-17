import type { WorkoutRepository } from '../domain/workout-repository.js';

export class WorkoutFinder {
  constructor(private readonly workoutRepository: WorkoutRepository) {}

  async execute({ userId }: { userId: string }) {
    const workouts = await this.workoutRepository.findByUserId(userId);
    return workouts.map((workout) => workout.toPrimitives());
  }
}
