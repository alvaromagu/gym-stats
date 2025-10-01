import { Button } from '@/shared/components/ui/button';
import { LucideLoader2 } from 'lucide-react';
import { useCredentialList } from '../hooks/credential-list';
import { CredentialListItem } from './credential-list-item';

export function CredentialList() {
  const { loading, credentials, reload } = useCredentialList();

  return (
    <ul className='flex flex-col gap-2 mt-3'>
      {loading && (
        <li className='w-full flex items-center justify-center'>
          <LucideLoader2 className='animate-spin' />
        </li>
      )}
      {!loading && credentials.length === 0 && (
        <Button asChild variant={'ghost'}>
          <li>No tienes credenciales registradas.</li>
        </Button>
      )}
      {!loading &&
        credentials.map((credential) => (
          <CredentialListItem
            credential={credential}
            reload={reload}
            key={credential.id}
          />
        ))}
    </ul>
  );
}
