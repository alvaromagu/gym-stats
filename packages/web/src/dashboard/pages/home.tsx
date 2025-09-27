import { useAuthUser } from '@/auth/hooks/auth-context';

export function HomePage() {
  const { user } = useAuthUser();
  console.log({ user });
  return <div>Home Page</div>;
}
