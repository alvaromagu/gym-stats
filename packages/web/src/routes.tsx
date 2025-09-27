import { lazy } from 'react';
import { Switch, Route } from 'wouter';

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

export function Routes() {
  return (
    <Switch>
      <Route path='/register' component={RegisterPage} />
      <Route path='/login' component={LoginPage} />
      <Route>404: No such page!</Route>
    </Switch>
  );
}
