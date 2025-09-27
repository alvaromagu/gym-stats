import { createContext, useContext } from 'react';
import type { AuthState } from './auth';

export type AuthContextState = AuthState;

export const AuthContext = createContext<AuthContextState>({
  loading: true,
  hasToken: false,
  authenticated: false,
  user: undefined,
  reloadSession: async () => {
    throw new Error('reloadSession not implemented');
  },
});

export function useAuthContext() {
  const context = useContext(AuthContext);
  return context;
}

export function useAuthUser() {
  const context = useAuthContext();
  if (context.user == null) {
    throw new Error('useAuthUser must be used in a protected route');
  }
  return context as AuthContextState & {
    user: NonNullable<AuthContextState['user']>;
  };
}
