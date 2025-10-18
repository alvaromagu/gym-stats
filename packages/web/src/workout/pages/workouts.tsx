import { Button } from '@/shared/components/ui/button';
import { useWorkouts } from '../hooks/workouts';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Link } from 'wouter';
import { BicepsFlexed, Dumbbell } from 'lucide-react';
import { ItemGroup } from '@/shared/components/ui/item';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/shared/components/ui/empty';
import { WorkoutListItem } from '../components/workout-list-item';

export function WorkoutsPage() {
  const { loading, workouts, reload } = useWorkouts();

  return (
    <main className='p-2 flex flex-col gap-4'>
      {!loading && workouts.length === 0 && (
        <Empty className='bg-card'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Dumbbell />
            </EmptyMedia>
            <EmptyTitle>No tienes entrenamientos registrados</EmptyTitle>
            <EmptyDescription>
              Comienza a registrar tus entrenamientos para llevar un seguimiento
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className='w-full'>
              <Link to='/workouts/new'>
                <BicepsFlexed />
                Crear primer entrenamiento
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
      {(loading || workouts.length > 0) && (
        <>
          <ItemGroup className='gap-2'>
            {loading &&
              Array.from({ length: Math.max(workouts.length, 2) }).map(
                (_, index) => <WorkoutListItemSkeleton key={index} />,
              )}
            {!loading &&
              workouts.map((workout) => (
                <WorkoutListItem
                  key={workout.id}
                  workout={workout}
                  onRemove={reload}
                />
              ))}
          </ItemGroup>
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
  return <Skeleton role='listitem' className='w-full h-[70px]' />;
}
