import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/shared/components/ui/dialog';
import { LucideLoader2, ShieldPlus, XIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { useCredentialRequest } from '../hooks/credential-request';

export function CredentialRequest() {
  const { loading, removing, url, create, remove, reset } =
    useCredentialRequest();

  return (
    <Dialog
      open={url != null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
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
        <DialogContent showCloseButton={false}>
          <DialogClose
            onClick={reset}
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className='sr-only'>Close</span>
          </DialogClose>
          <DialogTitle>Enlace para la vinculación</DialogTitle>
          <DialogDescription>
            Escanea este código QR con tu dispositivo
          </DialogDescription>
          <div className='mx-auto bg-white p-2 py-4 rounded'>
            <QRCode value={url} viewBox={`0 0 256 256`} />
          </div>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              toast.success('Enlace copiado al portapapeles');
            }}
          >
            Copiar enlace de vinculación
          </Button>
          <Button onClick={remove} variant='destructive' disabled={removing}>
            {removing && <LucideLoader2 className='animate-spin' />}
            Eliminar enlace de vinculación
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}
