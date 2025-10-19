import { useEffect, useState } from 'react';
import { getWorkotus } from '../services/get-workouts';
import type { Workout } from '../types/workout-list';

export function useWorkoutList() {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

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
      setWorkouts(workouts);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function reload() {
    const workouts = await getWorkotus();
    setWorkouts(workouts);
  }

  return {
    loading,
    workouts,
    reload,
  };
}
