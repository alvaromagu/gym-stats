import { lazy } from 'react';
import { Switch, Route, Link, Redirect } from 'wouter';
import { Button } from './shared/components/ui/button';
import { useAuthContext } from './auth/hooks/auth-context';
import { LucideLoader2 } from 'lucide-react';

const RegisterPage = lazy(
  async () =>
    await import('./auth/pages/register').then((mod) => ({
      default: mod.Register,
    })),
);

const LoginPage = lazy(
  async () =>
    await import('./auth/pages/login').then((mod) => ({
      default: mod.LoginPage,
    })),
);

const HomePage = lazy(
  async () =>
    await import('./dashboard/pages/home').then((mod) => ({
      default: mod.HomePage,
    })),
);

export function Routes() {
  const { loading, hasToken, authenticated } = useAuthContext();
  const showNoAuth = (!loading && !authenticated) || (loading && !hasToken);
  const showAuth = (!loading && authenticated) || (loading && hasToken);

  return (
    <>
      <header className='p-2 sticky border-b top-0 bg-background'>
        <nav className='flex justify-center'>
          {showNoAuth && <NoAuthLinks />}
          {showAuth && <AuthLinks />}
        </nav>
      </header>
      <Switch>
        {loading ? (
          <main className='p-2'>
            <LucideLoader2 className='animate-spin mx-auto' />
          </main>
        ) : !authenticated ? (
          <NoAuthRoutes />
        ) : (
          <AuthRoutes />
        )}
      </Switch>
    </>
  );
}

function NoAuthLinks() {
  return (
    <>
      <Button variant={'link'} asChild>
        <Link href='/login'>Iniciar sesión</Link>
      </Button>
      <Button variant={'link'} asChild>
        <Link href='/register'>Crear cuenta</Link>
      </Button>
    </>
  );
}

function AuthLinks() {
  return (
    <>
      <Button variant={'link'} asChild>
        <Link href='/'>Home</Link>
      </Button>
      <Button variant={'link'} asChild>
        <Link href='/about'>About</Link>
      </Button>
    </>
  );
}

function NoAuthRoutes() {
  return (
    <Switch>
      <Route path='/login' component={LoginPage} />
      <Route path='/register' component={RegisterPage} />
      <Route component={() => <Redirect to='/login' />} />
    </Switch>
  );
}

function AuthRoutes() {
  return (
    <Switch>
      <Route path='/' component={HomePage} />
      <Route path='/about' component={() => <div>About</div>} />
      <Route component={() => <Redirect to='/' />} />
    </Switch>
  );
}
