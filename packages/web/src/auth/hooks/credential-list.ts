import { useState, useEffect } from 'react';
import { getAuthUserCredentials } from '../services/auth-user-credentials';
import type { Credential } from '../types/credential';

export function useCredentialList() {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) {
        return;
      }
      setLoading(true);
      const credentials = await getAuthUserCredentials();
      if (!mounted) {
        return;
      }
      setCredentials(credentials);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function reload() {
    const credentials = await getAuthUserCredentials();
    setCredentials(credentials);
  }

  return {
    loading,
    credentials,
    reload,
  };
}
