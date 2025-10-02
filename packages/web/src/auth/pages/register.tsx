import { Loader2Icon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useRegister } from '@/auth/hooks/register';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/shared/components/ui/card';

export function RegisterPage() {
  const { loading, handleSubmit } = useRegister();

  return (
    <main className='p-2'>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className='text-3xl font-extrabold text-balance'>
              Crear cuenta
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className='flex flex-col gap-2'>
              <Button type='submit' disabled={loading}>
                {loading && <Loader2Icon className='animate-spin size-6' />}
                Registrar cuenta
              </Button>
              <p className='text-sm text-center text-muted-foreground'>
                Al registrarte una nueva cuenta, se solicitará una clave de
                acceso.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
