import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/shared/components/ui/item';
import { Spinner } from '@/shared/components/ui/spinner';
import { Dumbbell, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'wouter';
import { useWorkoutListItem } from '../hooks/workout-list-item';
import type { Workout } from '../types/workout-list';

export function WorkoutListItem({
  workout,
  onRemove,
}: {
  workout: Workout;
  onRemove?: () => void;
}) {
  const { removing, remove } = useWorkoutListItem({ workout });

  return (
    <Item key={workout.id} role='listitem' variant={'muted'} size={'sm'}>
      <ItemMedia variant={'icon'}>
        <Dumbbell />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{workout.name}</ItemTitle>
        <ItemDescription>
          {new Date(workout.date).toLocaleDateString()}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          size={'icon'}
          variant={'destructive'}
          onClick={async () => {
            await remove();
            onRemove?.();
          }}
        >
          {removing ? <Spinner /> : <Trash2 />}
        </Button>
        <Button asChild size={'icon'} variant={'outline'}>
          <Link to={`/workouts/${workout.id}`}>
            <ChevronRight />
          </Link>
        </Button>
      </ItemActions>
    </Item>
  );
}
