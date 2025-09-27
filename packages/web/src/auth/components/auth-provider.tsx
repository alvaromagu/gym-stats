import { useAuth } from '../hooks/auth';
import { AuthContext } from '../hooks/auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuth();
  return <AuthContext value={authState}>{children}</AuthContext>;
}
