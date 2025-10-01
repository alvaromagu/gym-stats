import { useAuthUser } from './auth-context';

export function useCredentials() {
  const {
    user: { fullName, email },
  } = useAuthUser();

  return {
    fullName,
    email,
  };
}
