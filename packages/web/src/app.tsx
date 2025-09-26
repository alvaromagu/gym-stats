import { Button } from '@/shared/components/ui/button';
import { Toaster } from '@/shared/components/ui/sonner';
import { Link } from 'wouter';
import { Routes } from './routes';

export function App() {
  return (
    <div className='max-w-lg mx-auto h-dvh flex flex-col'>
      <header className='p-2 sticky border-b top-0 bg-background'>
        <nav className='flex justify-center'>
          <Button variant={'link'} asChild>
            <Link href='/register'>Crear cuenta</Link>
          </Button>
        </nav>
      </header>
      <Routes />
      <Toaster position='bottom-center' />
    </div>
  );
}
