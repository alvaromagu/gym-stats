import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Fingerprint,
  KeyRound,
  LucideLoader2,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { useCredentials } from '../hooks/credentials';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

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
                  <div className='flex-1 flex flex-col w-full overflow-hidden'>
                    <p className='text-sm overflow-hidden text-ellipsis text-nowrap'>
                      {credential.deviceName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {new Date(credential.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        },
                      )}
                    </p>
                  </div>
                  <Button
                    size={'icon'}
                    variant={'outline'}
                    className={cn(
                      credential.verified &&
                        'text-success hover:text-success pointer-events-none',
                    )}
                    onClick={credential.verified ? undefined : undefined}
                  >
                    {credential.verified ? <ShieldCheck /> : <ShieldOff />}
                  </Button>
                  <Button
                    size={'icon'}
                    variant={'destructive'}
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
