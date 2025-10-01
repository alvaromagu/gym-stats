import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Loader2Icon, User } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useProfile } from '../hooks/profile';
import { Link } from 'wouter';

export function ProfilePage() {
  const {
    email,
    fullName,
    saving,
    loggingOut,
    loggingOutAll,
    handleSubmit,
    handleLogout,
    handleLogoutAll,
  } = useProfile();
  const disabled = saving || loggingOut || loggingOutAll;

  return (
    <main className='p-2'>
      <Card>
        <CardHeader className='flex'>
          <User size={32} />
          <div>
            <CardTitle>Tu perfil</CardTitle>
            <CardDescription>
              Gestiona la información de tu cuenta
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <Label className='flex flex-col items-start gap-3'>
              Correo electrónico
              <Input
                placeholder='Escribe tu correo electrónico aquí'
                type='email'
                name='email'
                defaultValue={email}
                disabled
                readOnly
              />
            </Label>

            <Label className='flex flex-col items-start gap-3'>
              Nombre completo
              <Input
                placeholder='Escribe tu nombre completo aquí'
                type='text'
                name='fullName'
                defaultValue={fullName}
                disabled={disabled}
                required
              />
            </Label>

            <Button type='submit' className='mt-6' disabled={disabled}>
              {saving && <Loader2Icon className='animate-spin size-6' />}
              Guardar cambios
            </Button>
            <Button
              variant='destructive'
              type='button'
              onClick={handleLogout}
              disabled={disabled}
            >
              {loggingOut && <Loader2Icon className='animate-spin size-6' />}
              Cerrar sesión
            </Button>
            <Button
              variant='destructive'
              type='button'
              onClick={handleLogoutAll}
              disabled={disabled}
            >
              {loggingOutAll && <Loader2Icon className='animate-spin size-6' />}
              Cerrar sesión en todos los dispositivos
            </Button>
            <Button asChild variant={'link'}>
              <Link href='/profile/credentials'>Gestionar credenciales</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
