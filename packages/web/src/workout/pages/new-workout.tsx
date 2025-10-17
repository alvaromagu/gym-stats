import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/shared/components/ui/popover';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { format } from 'date-fns';
import { useNewWorkout } from '../hooks/new-workout';

export function NewWorkoutPage() {
  const {
    creating,
    date,
    setDate,
    datePickerOpenned,
    setDatePickerOpenned,
    handleSubmit,
  } = useNewWorkout();

  return (
    <main className='p-2 flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Crear nuevo entrenamiento</CardTitle>
          <CardDescription>
            Para empezar introduce el nombre y la fecha de tu entrenamiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <Label className='flex flex-col items-start gap-3'>
              Nombre del entrenamiento
              <Input
                placeholder='Escribe el nombre del entrenamiento aquí'
                type='text'
                name='workoutName'
                required
                disabled={creating}
              />
            </Label>
            <Label className='flex flex-col items-start gap-3'>
              Fecha del entrenamiento
              <div className='relative flex gap-3 w-full'>
                <Input
                  name='date'
                  type='date'
                  placeholder='Selecciona una fecha'
                  required
                  value={format(date, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    setDate(new Date(e.target.value));
                  }}
                  disabled={creating}
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
            </Label>
            <Button type='submit' disabled={creating}>
              {creating && <Loader2Icon className='animate-spin size-6' />}
              Crear entrenamiento
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
