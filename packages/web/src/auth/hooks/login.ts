import { useState } from 'react';
import { toast } from 'sonner';
import { generateAuthOptions } from '../services/generate-auth-options';
import { startAuthentication } from '@simplewebauthn/browser';
import { verifyAuth } from '../services/verify-auth';
import { useAuthContext } from './auth-context';

export function useLogin() {
  const { reloadSession, setToken } = useAuthContext();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (loading) {
      return;
    }
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { email } = Object.fromEntries(formData.entries());
    if (typeof email !== 'string' || email.trim().length === 0) {
      toast.error('Por favor, introduce un correo electrónico válido.');
      return;
    }
    const emailTrimmed = email.trim();
    setLoading(true);
    await generateAuthOptions({ email: emailTrimmed })
      .then(async (opts) => await startAuthentication({ optionsJSON: opts }))
      .then(
        async (authResponse) =>
          await verifyAuth({ email: emailTrimmed, authResponse }),
      )
      .then(async (res) => {
        if (res.verified) {
          setToken(res.token);
          toast.success('¡Su inicio de sesión ha sido verificado!');
          await reloadSession();
        } else {
          toast.error('No se ha podido verificar su inicio de sesión.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { loading, handleSubmit };
}
