import { useEffect, useState } from 'react';
import { useAuthUser } from './auth-context';
import { getAuthUserCredentials } from '../services/auth-user-credentials';
import { authUserDeleteCredential } from '../services/auth-user-delete-credentials';

export interface CredentialsState {
  fullName: string;
  email: string;
  loadingCredentials: boolean;
  credentials: Credential[];
  deletingCredentialId: string | null;
  deleteCredential: (id: string) => Promise<void>;
}

export interface Credential {
  id: string;
  deviceName: string;
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

  async function deleteCredential(id: string) {
    setDeletingCredentialId(id);
    await authUserDeleteCredential(id).catch(() => undefined);
    const credentials = await getAuthUserCredentials();
    setCredentials(credentials);
    setDeletingCredentialId(null);
  }

  return {
    fullName,
    email,
    loadingCredentials,
    credentials,
    deletingCredentialId,
    deleteCredential,
  };
}
