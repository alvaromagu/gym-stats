import { useEffect, useState, type FormEvent } from 'react';
import { useWorkout } from './workout';
import { toast } from 'sonner';
import { updateWorkout } from '../services/update-workout';
import { useLocation } from 'wouter';

export function useEditWorkout({ id }: { id: string }) {
  const { workout, loading } = useWorkout({ id });
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [datePickerOpenned, setDatePickerOpenned] = useState(false);

  useEffect(() => {
    if (workout != null) {
      setDate(new Date(workout.date));
    }
  }, [workout]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const {
      workoutName,
      date: formDate,
      workoutNotes,
    } = Object.fromEntries(formData.entries());
    if (typeof workoutName !== 'string' || workoutName.trim().length === 0) {
      toast.error('Por favor, introduce un nombre válido.');
      return;
    }
    if (
      formDate == null ||
      typeof formDate !== 'string' ||
      isNaN(new Date(formDate).getTime())
    ) {
      toast.error('Por favor, introduce una fecha válida.');
      return;
    }
    const obj = {
      id,
      name: workoutName.trim(),
      date: formDate,
      notes: typeof workoutNotes === 'string' ? workoutNotes.trim() : '',
    };
    setSaving(true);
    try {
      await updateWorkout(obj);
      toast.success('Entrenamiento actualizado correctamente.');
      setLocation(`/workouts/${id}`);
    } catch {
      toast.error('Error al actualizar el entrenamiento. Inténtalo de nuevo.');
    }
    setSaving(false);
  }

  return {
    workout,
    loading,
    saving,
    date,
    datePickerOpenned,
    setDate,
    setDatePickerOpenned,
    handleSubmit,
  };
}
