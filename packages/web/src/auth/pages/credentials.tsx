import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Fingerprint } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { useCredentials } from '../hooks/credentials';
import { CredentialRequest } from '../components/credential-request';
import { CredentialList } from '../components/credential-list';

export function CredentialsPage() {
  const { email, fullName } = useCredentials();

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
          <p className='mt-4'>Dispositivos registrados</p>
          <CredentialList />
          <CredentialRequest />
        </CardContent>
      </Card>
    </main>
  );
}
