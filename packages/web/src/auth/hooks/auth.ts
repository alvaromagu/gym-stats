import { tokenKey } from '@/shared/constants/session-keys';
import { useCallback, useEffect, useState } from 'react';
import type { User } from '../types/user';
import { getAuthUserInfo } from '../services/auth-user-info';
import { useSessionStorage } from '@/shared/hooks/session-storage';

export type AuthState =
  | {
      loading: boolean;
      hasToken: boolean;
      authenticated: false;
      user: undefined;
      reloadSession: () => Promise<void>;
      setToken: (value: string | null) => void;
    }
  | {
      loading: boolean;
      hasToken: boolean;
      authenticated: true;
      user: User;
      reloadSession: () => Promise<void>;
      setToken: (value: string | null) => void;
    };

export interface AuthInternalState {
  loading: boolean;
  user: User | undefined;
}

export function useAuth(): AuthState {
  const [token, setToken] = useSessionStorage<string | null>(tokenKey);
  const [authState, setAuthState] = useState<AuthInternalState>({
    loading: true,
    user: undefined,
  });

  console.log({ token });

  const getUser = useCallback(async () => {
    if (token == null) {
      return { user: undefined };
    }
    const user = await getAuthUserInfo().catch(() => undefined);
    return { user };
  }, [token]);

  async function reloadSession() {
    const { user } = await getUser();
    setAuthState({ loading: false, user });
  }

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) {
        return;
      }
      const { user } = await getUser();
      if (!mounted) {
        return;
      }
      setAuthState({ loading: false, user });
    })();

    return () => {
      mounted = false;
    };
  }, [getUser]);

  return {
    loading: authState.loading,
    hasToken: token != null,
    authenticated: authState.user != null,
    user: authState.user,
    reloadSession,
    setToken,
  } as AuthState;
}
