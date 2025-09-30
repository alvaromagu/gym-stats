import { useEffect, useState } from 'react';
import { useAuthUser } from './auth-context';
import { getAuthUserCredentials } from '../services/auth-user-credentials';
import { authUserDeleteCredential } from '../services/auth-user-delete-credentials';
import { authUserCreateCredentialRequest } from '../services/auth-user-create-credential-request';
import { toast } from 'sonner';
import { authUserVerifyCredential } from '../services/auth-user-verify-credential';

export interface CredentialsState {
  fullName: string;
  email: string;
  loadingCredentials: boolean;
  credentials: Credential[];
  verifyingCredentialId: string | null;
  deletingCredentialId: string | null;
  creatingCredentialRequest: boolean;
  credentialRequestUrl: string | null;
  verifyCredential: (id: string) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  createCredentialRequest: () => Promise<void>;
  resetCredentialRequestUrl: () => void;
}

export interface Credential {
  id: string;
  deviceName: string;
  createdAt: string;
  verified: boolean;
}

export function useCredentials(): CredentialsState {
  const {
    user: { fullName, email },
  } = useAuthUser();
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [deletingCredentialId, setDeletingCredentialId] = useState<
    string | null
  >(null);
  const [verifyingCredentialId, setVerifyingCredentialId] = useState<
    string | null
  >(null);
  const [creatingCredentialRequest, setCreatingCredentialRequest] =
    useState(false);
  const [credentialRequestUrl, setCredentialRequestUrl] = useState<
    string | null
  >(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) {
        return;
      }
      setLoadingCredentials(true);
      const credentials = await getAuthUserCredentials();
      if (!mounted) {
        return;
      }
      setCredentials(credentials);
      setLoadingCredentials(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function verifyCredential(id: string) {
    setVerifyingCredentialId(id);
    await authUserVerifyCredential({ id }).catch(() => undefined);
    const credentials = await getAuthUserCredentials();
    setCredentials(credentials);
    setVerifyingCredentialId(null);
  }

  async function deleteCredential(id: string) {
    setDeletingCredentialId(id);
    await authUserDeleteCredential(id).catch(() => undefined);
    const credentials = await getAuthUserCredentials();
    setCredentials(credentials);
    setDeletingCredentialId(null);
  }

  async function createCredentialRequest() {
    setCreatingCredentialRequest(true);
    const credentialRequest = await authUserCreateCredentialRequest().catch(
      () => undefined,
    );
    if (credentialRequest == null) {
      toast.error('Error al crear la solicitud de credencial');
      setCreatingCredentialRequest(false);
    } else {
      const id = credentialRequest.id;
      const url = `${window.location.origin}/link-credential-request/${id}`;
      setCredentialRequestUrl(url);
      toast.success(
        'Se ha creado una nueva solicitud de credencial. Completa el proceso en tu dispositivo.',
      );
    }
    setCreatingCredentialRequest(false);
  }

  function resetCredentialRequestUrl() {
    setCredentialRequestUrl(null);
  }

  return {
    fullName,
    email,
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
  };
}
