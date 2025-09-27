import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2Icon } from 'lucide-react';
import { useLogin } from '@/auth/hooks/login';

export function LoginPage() {
  const { loading, handleSubmit } = useLogin();

  return (
    <main className='p-2'>
      <h1 className='text-center text-4xl font-extrabold text-balance mb-5'>
        Iniciar sesión
      </h1>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
        <Label className='flex flex-col items-start gap-3'>
          Correo electrónico
          <Input
            placeholder='Escribe tu correo electrónico aquí'
            type='email'
            name='email'
            required
          />
        </Label>
        <Button type='submit' disabled={loading}>
          {loading && <Loader2Icon className='animate-spin size-6' />}
          Iniciar sesión
        </Button>
      </form>
    </main>
  );
}
