import { useEffect, useState } from 'react';
import { getWorkoutDetail } from '../services/get-workout-detail';
import type { WorkoutDetail } from '../types/workout-detail';

export function useWorkout({ id }: { id: string }) {
  const [workout, setWorkout] = useState<null | WorkoutDetail>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id == null) {
      return;
    }
    let mounted = true;
    void (async () => {
      if (!mounted) {
        return;
      }
      setLoading(true);
      const workouts = await getWorkoutDetail({ id }).catch(() => null);
      if (!mounted) {
        return;
      }
      setWorkout(workouts);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function reload() {
    if (id == null) {
      return;
    }
    const workout = await getWorkoutDetail({ id });
    setWorkout(workout);
  }

  return { workout, loading, reload };
}
