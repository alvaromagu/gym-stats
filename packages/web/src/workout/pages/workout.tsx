import { useWorkout } from '../hooks/workout';
import { Dumbbell, Pencil } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'wouter';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/shared/components/ui/card';
import { WorkoutNotFound } from '../components/workout-not-found';

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

  console.log({ workout, loading });

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
      </Card>
    </main>
  );
}
