import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { useNewExercise } from '../hooks/new-exercise';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/ui/spinner';
import type { NewExerciseSet } from '../types/new-exercise-request';
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/shared/components/ui/item';
import { Trash2 } from 'lucide-react';
import { WorkoutNotFound } from '../components/workout-not-found';

export function NewExercisePage({
  params: { id: workoutId },
}: {
  params: {
    id: string;
  };
}) {
  const {
    workout,
    loading,
    sets,
    creating,
    handleSubmit,
    addSet,
    updateSet,
    removeSet,
  } = useNewExercise({ workoutId });

  if (workout == null && !loading) {
    return (
      <main className='p-2'>
        <WorkoutNotFound />
      </main>
    );
  }

  if (loading || workout == null) {
    return <p>loading...</p>;
  }

  return (
    <main className='p-2'>
      <Card>
        <CardHeader>
          <CardTitle>{workout.name} - Nuevo Ejercicio</CardTitle>
          <CardDescription>
            Añade un nuevo ejercicio a tu entrenamiento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel htmlFor='exercise-name'>
                    Nombre del ejercicio
                  </FieldLabel>
                  <Input
                    id='exercise-name'
                    name='exerciseName'
                    placeholder='Escribe el nombre del ejercicio'
                    type='text'
                    required
                    disabled={creating}
                  />
                </Field>
              </FieldSet>

              <FieldSeparator />

              <FieldSet>
                <FieldLegend>Series</FieldLegend>

                <ItemGroup className='gap-2'>
                  {sets.map((set) => (
                    <SetListItem
                      key={set.id}
                      set={set}
                      creating={creating}
                      update={updateSet}
                      remove={removeSet}
                    />
                  ))}
                </ItemGroup>

                <Button
                  type='button'
                  onClick={addSet}
                  variant={'outline'}
                  disabled={creating}
                >
                  Añadir Serie
                </Button>
              </FieldSet>

              <FieldSeparator />
            </FieldGroup>

            <Button type='submit' disabled={creating} className='mt-4 w-full'>
              {creating && <Spinner />}
              Crear Ejercicio
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function SetListItem({
  set,
  creating,
  update,
  remove,
}: {
  set: NewExerciseSet & { id: string };
  creating: boolean;
  update: (props: Partial<NewExerciseSet> & { id: string }) => void;
  remove: (props: { id: string }) => void;
}) {
  return (
    <Item
      role='listitem'
      variant={'outline'}
      size={'sm'}
      className='items-start'
    >
      <ItemContent>
        <ItemTitle className='w-full flex justify-between'>
          Serie {set.setNumber}
          <Button
            variant={'destructive'}
            size={'icon'}
            type='button'
            onClick={() => {
              remove({ id: set.id });
            }}
            disabled={creating}
          >
            <Trash2 />
          </Button>
        </ItemTitle>
        <FieldGroup className='flex-row'>
          <Field>
            <FieldLabel htmlFor={`repetitions-${set.id}`}>
              Repeticiones
            </FieldLabel>
            <Input
              id={`repetitions-${set.id}`}
              name={`repetitions-${set.id}`}
              type='number'
              min={0}
              value={set.repetitions}
              onChange={(e) => {
                update({ id: set.id, repetitions: Number(e.target.value) });
              }}
              required
              disabled={creating}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`weightKg-${set.id}`}>Peso (kg)</FieldLabel>
            <Input
              id={`weightKg-${set.id}`}
              name={`weightKg-${set.id}`}
              type='number'
              min={0}
              step={2.5}
              value={set.weightKg}
              onChange={(e) => {
                update({ id: set.id, weightKg: Number(e.target.value) });
              }}
              required
              disabled={creating}
            />
          </Field>
        </FieldGroup>
      </ItemContent>
    </Item>
  );
}
