import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { LucideLoader2, ShieldPlus } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { useCredentialRequest } from '../hooks/credential-request';

export function CredentialRequest() {
  const { loading, url, create, reset } = useCredentialRequest();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className='w-full'
          variant={'secondary'}
          onClick={async () => {
            await create();
          }}
          disabled={loading}
        >
          {loading ? (
            <LucideLoader2 className='animate-spin' />
          ) : (
            <ShieldPlus />
          )}
          Registrar nueva credencial
        </Button>
      </DialogTrigger>
      {url != null && (
        <DialogContent>
          <DialogTitle>Enlace para la vinculación</DialogTitle>
          <DialogDescription>
            Escanea este código QR con tu dispositivo
          </DialogDescription>
          <div className='mx-auto my-4 bg-white p-2 py-4 rounded'>
            <QRCode value={url} viewBox={`0 0 256 256`} />
          </div>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              toast.success('Enlace copiado al portapapeles');
            }}
            className='my-4'
          >
            Copiar enlace de vinculación
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}
