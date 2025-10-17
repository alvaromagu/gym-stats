import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { newWorkout } from '../services/new-workout';
import { useLocation } from 'wouter';

export function useNewWorkout() {
  const [, setLocation] = useLocation();
  const [creating, setCreating] = useState(false);
  const [date, setDate] = useState(new Date());
  const [datePickerOpenned, setDatePickerOpenned] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { date: formDate, workoutName } = Object.fromEntries(
      formData.entries(),
    );
    console.log({ formDate, workoutName });
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
      name: workoutName.trim(),
      date: formDate,
    };
    setCreating(true);
    try {
      const { id } = await newWorkout(obj);
      console.log({ id });
      toast.success('Entrenamiento creado correctamente.');
      setLocation('/workouts');
    } catch {
      toast.error('Error al crear el entrenamiento. Inténtalo de nuevo.');
    }
    setCreating(false);
  }

  return {
    creating,
    date,
    setDate,
    datePickerOpenned,
    setDatePickerOpenned,
    handleSubmit,
  };
}
