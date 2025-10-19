import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/shared/components/ui/empty';
import { Home } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'wouter';

export function WorkoutNotFound() {
  return (
    <Empty className='bg-card'>
      <EmptyHeader>
        <EmptyTitle>No se ha encontrado el entrenamiento</EmptyTitle>
        <EmptyDescription>
          El entrenamiento que buscas no existe o ha sido eliminado
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className='w-full'>
          <Link to='/'>
            <Home />
            Volver al inicio
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
