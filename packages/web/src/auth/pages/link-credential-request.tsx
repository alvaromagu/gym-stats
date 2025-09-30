import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/shared/components/ui/card';
import { useLinkCredentialRequest } from '../hooks/link-credential-request';
import { LucideLoader2 } from 'lucide-react';

export function LinkCredentialRequestPage() {
  const { loading, linkCredentialRequest } = useLinkCredentialRequest();

  return (
    <main className='p-2'>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className='text-3xl font-extrabold text-balance'>
              Vincular credencial
            </h1>
          </CardTitle>
          <CardDescription>
            <p>
              Inicia el proceso para vincular una nueva credencial a tu cuenta.
            </p>
            <p>
              Una vez iniciado el proceso se solicitará la creación de una llave
              de acceso.
            </p>
            <p>
              Al completarlo este enlace expirará y no podrá ser reutilizado.
            </p>
            <p>
              Recuerde que el proceso de vinculación deberá ser verificado por
              alguna de las credenciales ya vinculadas a su cuenta.
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className='w-full'
            onClick={linkCredentialRequest}
            disabled={loading}
          >
            {loading && <LucideLoader2 className='animate-spin size-6' />}
            Iniciar proceso de vinculación
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
