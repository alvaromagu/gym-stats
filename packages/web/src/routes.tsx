import { lazy } from 'react';
import { Switch, Route } from 'wouter';

const RegisterPage = lazy(
  async () =>
    await import('./auth/pages/register').then((mod) => ({
      default: mod.Register,
    })),
);

export function Routes() {
  return (
    <Switch>
      <Route path='/register' component={RegisterPage} />
      <Route>404: No such page!</Route>
    </Switch>
  );
}
