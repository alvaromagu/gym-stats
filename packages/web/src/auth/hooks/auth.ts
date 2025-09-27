import { tokenKey } from '@/shared/constants/session-keys';
import { useEffect, useState } from 'react';
import type { User } from '../types/user';
import { getAuthUserInfo } from '../services/auth-user-info';

export type AuthState =
  | {
      loading: boolean;
      hasToken: boolean;
      authenticated: false;
      user: undefined;
      reloadSession: () => Promise<void>;
    }
  | {
      loading: boolean;
      hasToken: boolean;
      authenticated: true;
      user: User;
      reloadSession: () => Promise<void>;
    };

export interface AuthInternalState {
  loading: boolean;
  user: User | undefined;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthInternalState>({
    loading: true,
    user: undefined,
  });

  async function getUser() {
    const token = sessionStorage.getItem(tokenKey);
    if (token == null) {
      return { user: undefined };
    }
    const user = await getAuthUserInfo().catch(() => undefined);
    return { user };
  }

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
  }, []);

  return {
    loading: authState.loading,
    hasToken: sessionStorage.getItem(tokenKey) != null,
    authenticated: authState.user != null,
    user: authState.user,
    reloadSession,
  } as AuthState;
}
