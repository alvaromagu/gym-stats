import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Fingerprint, KeyRound, LucideLoader2, Trash2 } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { useCredentials } from '../hooks/credentials';
import { Button } from '@/shared/components/ui/button';

export function CredentialsPage() {
  const {
    email,
    fullName,
    loadingCredentials,
    credentials,
    deletingCredentialId,
    deleteCredential,
  } = useCredentials();

  return (
    <main className='p-2'>
      <Card>
        <CardHeader className='flex'>
          <Fingerprint size={32} />
          <div>
            <CardTitle>{fullName}</CardTitle>
            <CardDescription>Gestiona tus credenciales</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Label className='flex flex-col items-start gap-3'>
            Correo electrónico
            <Input
              placeholder='Escribe tu correo electrónico aquí'
              type='email'
              name='email'
              defaultValue={email}
              disabled
            />
          </Label>
          <Label className='mt-4'>Dispositivos registrados</Label>
          <ul className='flex flex-col gap-2 mt-3'>
            {loadingCredentials && (
              <li className='w-full flex items-center justify-center'>
                <LucideLoader2 className='animate-spin' />
              </li>
            )}
            {!loadingCredentials && credentials.length === 0 && (
              <Button asChild variant={'ghost'}>
                <li>No tienes credenciales registradas.</li>
              </Button>
            )}
            {!loadingCredentials &&
              credentials.map((credential) => (
                <li
                  key={credential.id}
                  className='flex gap-2 items-center bg-secondary text-secondary-foreground rounded-md p-2'
                >
                  <KeyRound size={'16'} />
                  <p className='flex-1'>{credential.deviceName}</p>
                  <Button
                    size={'sm'}
                    variant={'outline'}
                    className='hover:text-destructive'
                    onClick={async () => {
                      await deleteCredential(credential.id);
                    }}
                    disabled={deletingCredentialId === credential.id}
                  >
                    {deletingCredentialId === credential.id ? (
                      <LucideLoader2 className='animate-spin' />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
