import { Button } from '@/shared/components/ui/button';
import { useCredentialList } from '../hooks/credential-list';
import { CredentialListItem } from './credential-list-item';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function CredentialList() {
  const { loading, credentials, reload } = useCredentialList();

  return (
    <ul className='flex flex-col gap-2'>
      {loading &&
        Array.from({ length: Math.max(credentials.length, 2) }).map(
          (_, index) => (
            <li key={index}>
              <CredentialListItemSkeleton />
            </li>
          ),
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

function CredentialListItemSkeleton() {
  return <Skeleton className='w-full h-[52px]' />;
}
