import {
  Redirect,
  Route,
  type DefaultParams,
  type PathPattern,
  type RouteProps,
} from 'wouter';
import { useAuthContext } from '../hooks/auth-context';

export type AuthRouteProps<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends PathPattern = PathPattern,
> = RouteProps<T, RoutePath> & {
  protected?: boolean;
};

export function AuthRoute<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends PathPattern = PathPattern,
>(props: AuthRouteProps<T, RoutePath>) {
  const { loading, authenticated } = useAuthContext();
  if (loading) {
    return null;
  }
  if (!authenticated && props.protected === true) {
    return <Redirect to='/login' />;
  }
  if (authenticated && props.protected !== true) {
    return <Redirect to='/' />;
  }
  return <Route {...props} />;
}
