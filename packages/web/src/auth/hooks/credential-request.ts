import { useState } from 'react';
import { authUserCreateCredentialRequest } from '../services/auth-user-create-credential-request';
import { toast } from 'sonner';
import { authUserRemoveCredentialRequest } from '../services/auth-user-remove-credential-request';

export function useCredentialRequest() {
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  async function create() {
    setLoading(true);
    const credentialRequest = await authUserCreateCredentialRequest().catch(
      () => undefined,
    );
    if (credentialRequest == null) {
      toast.error('Error al crear la solicitud de credencial');
      setLoading(false);
    } else {
      const id = credentialRequest.id;
      const url = `${window.location.origin}/link-credential-request/${id}`;
      setUrl(url);
      toast.success(
        'Se ha creado una nueva solicitud de credencial. Completa el proceso en tu dispositivo.',
      );
    }
    setLoading(false);
  }

  async function remove() {
    setRemoving(true);
    try {
      await authUserRemoveCredentialRequest();
      toast.success('Se ha eliminado la solicitud de credencial');
      setUrl(null);
    } catch {
      toast.error('Error al eliminar la solicitud de credencial');
    }
    setRemoving(false);
  }

  function reset() {
    setUrl(null);
  }

  return {
    loading,
    removing,
    url,
    create,
    remove,
    reset,
  };
}
