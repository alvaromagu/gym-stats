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
  ShieldPlus,
  Trash2,
} from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { useCredentials } from '../hooks/credentials';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

export function CredentialsPage() {
  const {
    email,
    fullName,
    loadingCredentials,
    credentials,
    verifyingCredentialId,
    deletingCredentialId,
    creatingCredentialRequest,
    credentialRequestUrl,
    verifyCredential,
    deleteCredential,
    createCredentialRequest,
    resetCredentialRequestUrl,
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
              readOnly
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
                    onClick={
                      credential.verified
                        ? undefined
                        : async () => {
                            await verifyCredential(credential.id);
                          }
                    }
                  >
                    {verifyingCredentialId === credential.id ? (
                      <LucideLoader2 className='animate-spin' />
                    ) : credential.verified ? (
                      <ShieldCheck />
                    ) : (
                      <ShieldOff />
                    )}
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
            <li>
              <Dialog
                onOpenChange={(open) => {
                  if (!open) {
                    resetCredentialRequestUrl();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className='w-full'
                    variant={'secondary'}
                    onClick={async () => {
                      console.log('hola');
                      await createCredentialRequest();
                    }}
                    disabled={creatingCredentialRequest}
                  >
                    {creatingCredentialRequest ? (
                      <LucideLoader2 className='animate-spin' />
                    ) : (
                      <ShieldPlus />
                    )}
                    Registrar nueva credencial
                  </Button>
                </DialogTrigger>
                {credentialRequestUrl != null && (
                  <DialogContent>
                    <DialogTitle>Enlace para la vinculación</DialogTitle>
                    <DialogDescription>
                      Escanea este código QR con tu dispositivo
                    </DialogDescription>
                    <div className='mx-auto my-4 bg-white p-2 py-4 rounded'>
                      <QRCode
                        value={credentialRequestUrl}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          credentialRequestUrl,
                        );
                        toast.success('Enlace copiado al portapapeles');
                      }}
                      className='my-4'
                    >
                      Copiar enlace de vinculación
                    </Button>
                  </DialogContent>
                )}
              </Dialog>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
