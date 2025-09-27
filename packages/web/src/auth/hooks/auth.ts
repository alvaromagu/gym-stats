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
    }
  | {
      loading: boolean;
      hasToken: boolean;
      authenticated: true;
      user: User;
    };

export function useAuth(): AuthState {
  const hasToken = sessionStorage.getItem(tokenKey) != null;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      if (!isMounted) {
        return;
      }
      const user = await getAuthUserInfo().catch(() => undefined);
      if (!isMounted) {
        return;
      }
      setUser(user);
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (user == null) {
    return { loading, hasToken, authenticated: false, user: undefined };
  }

  return {
    loading,
    hasToken,
    authenticated: true,
    user,
  };
}
