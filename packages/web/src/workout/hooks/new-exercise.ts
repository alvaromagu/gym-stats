import { useState, type FormEvent } from 'react';
import type {
  NewExercise,
  NewExerciseSet,
} from '../types/new-exercise-request';
import { newExercise } from '../services/new-exercise';
import { toast } from 'sonner';
import { useLocation } from 'wouter';
import { delay } from '@/shared/lib/delay';

const buildSet = ({ setNumber } = { setNumber: 1 }) => ({
  id: crypto.randomUUID(),
  repetitions: 10,
  weightKg: 0,
  setNumber,
});

export function useNewExercise({ workoutId }: { workoutId: string }) {
  const [, setLocation] = useLocation();
  const [sets, setSets] = useState<Array<NewExerciseSet & { id: string }>>([
    buildSet(),
  ]);
  const [creating, setCreating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { exerciseName } = Object.fromEntries(formData.entries());
    if (typeof exerciseName !== 'string' || exerciseName.trim().length === 0) {
      throw new Error('Please provide a valid exercise name.');
    }
    const req: NewExercise = {
      workoutId,
      name: exerciseName.trim(),
      sets: sets.map(({ id, ...set }) => set),
    };
    setCreating(true);
    try {
      await newExercise(req);
      await delay(2000);
      setCreating(false);
      toast.success('Exercise created successfully.');
      setLocation(`/workouts/${workoutId}`);
    } catch {
      toast.error('Error creating exercise. Please try again.');
      setCreating(false);
    }
  }

  function addSet() {
    const newSet: NewExerciseSet & { id: string } = buildSet({
      setNumber: sets.length + 1,
    });
    setSets([...sets, newSet]);
  }

  function updateSet({
    id,
    ...updatedSet
  }: Partial<NewExerciseSet> & { id: string }) {
    const newSets = sets.map((set) =>
      set.id === id ? { ...set, ...updatedSet } : set,
    );
    setSets(newSets);
  }

  function removeSet({ id }: { id: string }) {
    const newSets = sets
      .filter((set) => set.id !== id)
      .map((set, index) => ({
        ...set,
        setNumber: index + 1,
      }));
    setSets(newSets);
  }

  return { sets, creating, handleSubmit, addSet, updateSet, removeSet };
}
