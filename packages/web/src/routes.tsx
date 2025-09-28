import { Switch, Link } from 'wouter';
import { Button } from './shared/components/ui/button';
import { useAuthContext } from './auth/hooks/auth-context';
import { Home, User } from 'lucide-react';
import { HomePage } from './dashboard/pages/home';
import { ProfilePage } from './auth/pages/profile';
import { LoginPage } from './auth/pages/login';
import { RegisterPage } from './auth/pages/register';
import { AuthRoute } from './auth/components/auth-route';
import { CredentialsPage } from './auth/pages/credentials';

export function Routes() {
  const { loading, hasToken, authenticated } = useAuthContext();
  const showAuth = (!loading && authenticated) || (loading && hasToken);

  return (
    <>
      {showAuth ? <AuthHeader /> : <NoAuthHeader />}
      <Switch>
        <AuthRoute path='/login' component={LoginPage} />
        <AuthRoute path='/register' component={RegisterPage} />
        <AuthRoute protected path='/' component={HomePage} />
        <AuthRoute protected path='/profile' component={ProfilePage} />
        <AuthRoute
          protected
          path='/profile/credentials'
          component={CredentialsPage}
        />
      </Switch>
    </>
  );
}

function NoAuthHeader() {
  return (
    <header className='p-2 sticky border-b top-0 bg-background'>
      <nav className='flex justify-center'>
        <Button variant={'link'} asChild>
          <Link href='/login'>Iniciar sesión</Link>
        </Button>
        <Button variant={'link'} asChild>
          <Link href='/register'>Crear cuenta</Link>
        </Button>
      </nav>
    </header>
  );
}

function AuthHeader() {
  const { user } = useAuthContext();

  return (
    <header className='p-2 sticky border-b top-0 bg-background flex items-cente justify-between'>
      <Button variant={'ghost'} size={'icon'} asChild>
        <Link href='/'>
          <Home />
        </Link>
      </Button>
      {user != null && (
        <Button variant={'outline'} asChild>
          <Link href='/profile'>
            <User /> {user.fullName}
          </Link>
        </Button>
      )}
    </header>
  );
}
