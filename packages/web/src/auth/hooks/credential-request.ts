import { useState } from 'react';
import { authUserCreateCredentialRequest } from '../services/auth-user-create-credential-request';
import { toast } from 'sonner';

export function useCredentialRequest() {
  const [loading, setLoading] = useState(false);
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

  function reset() {
    setUrl(null);
  }

  return {
    loading,
    url,
    create,
    reset,
  };
}
