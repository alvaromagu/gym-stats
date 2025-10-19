import { Card, CardContent } from '@/shared/components/ui/card';
import { Calendar } from '@/shared/components/ui/calendar';
import { Button } from '@/shared/components/ui/button';
import { WorkoutNotFound } from '../components/workout-not-found';
import { useEditWorkout } from '../hooks/edit-workout';
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/shared/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Textarea } from '@/shared/components/ui/textarea';
import { Spinner } from '@/shared/components/ui/spinner';

export function EditWorkoutPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const {
    workout,
    loading,
    saving,
    date,
    datePickerOpenned,
    setDate,
    setDatePickerOpenned,
    handleSubmit,
  } = useEditWorkout({ id });

  if (workout == null && !loading) {
    return (
      <main className='p-2'>
        <WorkoutNotFound />
      </main>
    );
  }

  if (loading || workout == null) {
    return (
      <main className='p-2'>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className='p-2'>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <FieldLegend>Editar entrenamiento</FieldLegend>
              <FieldDescription>
                Edita los detalles de tu entrenamiento aquí.
              </FieldDescription>
              <Field>
                <FieldLabel htmlFor='workout-name'>
                  Nombre del entrenamiento
                </FieldLabel>
                <Input
                  id='workout-name'
                  name='workoutName'
                  placeholder='Escribe el nombre del entrenamiento aquí'
                  type='text'
                  defaultValue={workout.name}
                  required
                  disabled={saving}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='workout-date'>
                  Fecha del entrenamiento
                </FieldLabel>
                <div className='relative flex gap-3 w-full'>
                  <Input
                    name='date'
                    type='date'
                    placeholder='Selecciona una fecha'
                    required
                    value={
                      date == null ? undefined : format(date, 'yyyy-MM-dd')
                    }
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                    }}
                    disabled={saving}
                  />
                  <Popover
                    open={datePickerOpenned}
                    onOpenChange={setDatePickerOpenned}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        id='date-picker'
                        variant='ghost'
                        className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
                        disabled={saving}
                      >
                        <CalendarIcon className='size-3.5' />
                        <span className='sr-only'>Select date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='w-auto overflow-hidden p-0'
                      align='end'
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode='single'
                        captionLayout='dropdown'
                        onSelect={(date) => {
                          if (date != null) {
                            setDate(date);
                          }
                          setDatePickerOpenned(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor='workout-notes'>Notas</FieldLabel>
                <Textarea
                  id='workout-notes'
                  name='workoutNotes'
                  placeholder='Escribe cualquier nota adicional sobre el entrenamiento aquí'
                  className='max-h-30'
                  defaultValue={workout.notes ?? ''}
                  disabled={saving}
                />
              </Field>
            </FieldSet>
            <Button type='submit' className='mt-4 w-full' disabled={saving}>
              {saving && <Spinner />}
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
