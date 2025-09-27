import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2Icon } from 'lucide-react';
import { useLogin } from '@/auth/hooks/login';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

export function LoginPage() {
  const { loading, handleSubmit } = useLogin();

  return (
    <main className='p-2'>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className='text-3xl font-extrabold text-balance'>
              Iniciar sesión
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </main>
  );
}
