import { Button } from '@/shared/components/ui/button';
import { useWorkouts } from '../hooks/workouts';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Link } from 'wouter';
import { Dumbbell } from 'lucide-react';

export function WorkoutsPage() {
  const { loading, workouts } = useWorkouts();

  return (
    <main className='p-2 flex flex-col gap-4'>
      {!loading && workouts.length === 0 && (
        <>
          <p className='leading-7 text-center'>
            No se han registrado entrenamientos aún.
          </p>
          <Button asChild className='w-full'>
            <Link to='/workouts/new'>
              <Dumbbell />
              ¡Comienza a registrar tus entrenamientos!
            </Link>
          </Button>
        </>
      )}
      {(loading || workouts.length > 0) && (
        <>
          <ul className='flex flex-col gap-2'>
            {loading &&
              Array.from({ length: Math.max(workouts.length, 2) }).map(
                (_, index) => (
                  <li key={index}>
                    <WorkoutListItemSkeleton />
                  </li>
                ),
              )}

            {!loading &&
              workouts.map((workout) => (
                <li key={workout.id}>{workout.name}</li>
              ))}
          </ul>
          <Button asChild className='w-full'>
            <Link to='/workouts/new'>
              <Dumbbell />
              Registrar nuevo entrenamiento
            </Link>
          </Button>
        </>
      )}
    </main>
  );
}

function WorkoutListItemSkeleton() {
  return <Skeleton className='w-full h-[52px]' />;
}
