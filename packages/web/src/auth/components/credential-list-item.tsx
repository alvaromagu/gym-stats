import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  KeyRound,
  LucideLoader2,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from 'lucide-react';
import type { Credential } from '../types/credential';
import { useState } from 'react';
import { toast } from 'sonner';
import { authUserDeleteCredential } from '../services/auth-user-delete-credentials';
import { authUserVerifyCredential } from '../services/auth-user-verify-credential';

export function CredentialListItem({
  credential,
  reload,
}: {
  credential: Credential;
  reload: () => Promise<void>;
}) {
  const [removing, setRemoving] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);

  async function verify(id: string) {
    setVerifying(true);
    await authUserVerifyCredential({ id })
      .then(() => {
        toast.success('Credencial verificada correctamente');
      })
      .catch(() => {
        toast.error('Error al verificar la credencial');
      });
    await reload();
    setVerifying(false);
  }

  async function remove(id: string) {
    setRemoving(true);
    await authUserDeleteCredential(id)
      .then(() => {
        toast.success('Credencial eliminada correctamente');
      })
      .catch(() => {
        toast.error('Error al eliminar la credencial');
      });
    await reload();
    setRemoving(false);
  }

  return (
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
          {new Date(credential.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
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
                await verify(credential.id);
              }
        }
        disabled={verifying}
      >
        {verifying ? (
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
          await remove(credential.id);
        }}
        disabled={removing}
      >
        {removing ? <LucideLoader2 className='animate-spin' /> : <Trash2 />}
      </Button>
    </li>
  );
}
