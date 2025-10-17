import { useEffect, useState } from 'react';
import { getWorkotus } from '../services/get-workouts';
import type { WorkoutListItem } from '../types/workout-list';

export function useWorkouts() {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutListItem[]>([]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) {
        return;
      }
      setLoading(true);
      const workouts = await getWorkotus();
      if (!mounted) {
        return;
      }
      setWorkouts(workouts as []);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    workouts,
  };
}
