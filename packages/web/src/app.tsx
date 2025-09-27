import { Toaster } from '@/shared/components/ui/sonner';
import { Routes } from './routes';
import { AuthProvider } from './auth/components/auth-provider';

export function App() {
  return (
    <AuthProvider>
      <div className='max-w-lg mx-auto h-dvh flex flex-col'>
        <Routes />
        <Toaster position='bottom-center' />
      </div>
    </AuthProvider>
  );
}
