import { useWorkout } from '../hooks/workout';
import { BicepsFlexed, Dumbbell, Pencil } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'wouter';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from '@/shared/components/ui/card';
import { WorkoutNotFound } from '../components/workout-not-found';
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyTitle,
} from '@/shared/components/ui/empty';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/shared/components/ui/item';

export function WorkoutPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const { workout, loading } = useWorkout({ id });

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
        <CardHeader className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Dumbbell />
            <div className='flex flex-col gap-0.5'>
              <CardTitle>{workout.name}</CardTitle>
              <CardDescription>
                Entrenamiento del {new Date(workout.date).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <CardAction>
            <Button asChild variant={'secondary'}>
              <Link href={`/workouts/${id}/edit`}>
                <Pencil />
                Editar
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          {workout.exercises.length === 0 && (
            <NoExercises workoutId={workout.id} />
          )}
          {workout.exercises.length > 0 && (
            <>
              <ItemGroup className='gap-2'>
                {workout.exercises.map((exercise, index) => (
                  <Item
                    key={index}
                    role='listitem'
                    variant={'outline'}
                    size={'sm'}
                  >
                    <ItemMedia>
                      <BicepsFlexed />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{exercise.name}</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Button asChild variant={'outline'} size={'icon'}>
                        <Link
                          to={`/workouts/${workout.id}/exercises/${exercise.id}/edit`}
                        >
                          <Pencil />
                        </Link>
                      </Button>
                    </ItemActions>
                  </Item>
                ))}
              </ItemGroup>
              <AddExerciseLink workoutId={workout.id} />
            </>
          )}
          {workout.notes != null && workout.notes !== '' && (
            <Textarea
              readOnly
              value={workout.notes}
              className='resize-none max-h-60'
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function NoExercises({ workoutId }: { workoutId: string }) {
  return (
    <Empty className='bg-card py-4 md:py-4 gap-4'>
      <EmptyHeader>
        <EmptyTitle>
          Parece que no has añadido ejercicios a este entrenamiento
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <AddExerciseLink workoutId={workoutId} />
      </EmptyContent>
    </Empty>
  );
}

function AddExerciseLink({ workoutId }: { workoutId: string }) {
  return (
    <Button asChild className='w-full'>
      <Link to={`/workouts/${workoutId}/exercises/new`}>
        <BicepsFlexed />
        Añadir ejercicio
      </Link>
    </Button>
  );
}
