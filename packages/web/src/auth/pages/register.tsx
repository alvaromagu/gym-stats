import { Loader2Icon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useRegister } from '@/auth/hooks/register';

export function RegisterPage() {
  const { loading, handleSubmit } = useRegister();

  return (
    <main className='p-2'>
      <h1 className='text-center text-4xl font-extrabold text-balance mb-5'>
        Crear cuenta
      </h1>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
        <Label className='flex flex-col items-start gap-3'>
          Correo electrónico (se solicitará al iniciar sesión)
          <Input
            placeholder='Escribe tu correo electrónico aquí'
            type='email'
            name='email'
            required
          />
        </Label>
        <Label className='flex flex-col items-start gap-3'>
          Nombre completo
          <Input
            placeholder='Escribe tu nombre completo aquí'
            type='text'
            name='fullName'
            required
          />
        </Label>
        <Button type='submit' disabled={loading}>
          {loading && <Loader2Icon className='animate-spin size-6' />}
          Registrar cuenta (se solicitará una clave de acceso)
        </Button>
      </form>
    </main>
  );
}
