import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { register } from '@/auth/services/register';
import { startRegistration } from '@simplewebauthn/browser';
import { verifyRegistration } from '../services/verify-registration';

export function useRegister() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
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
    const { fullName } = Object.fromEntries(formData.entries());
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      toast.error('Por favor, introduce un nombre completo válido.');
      return;
    }
    const emailTrimmed = email.trim();
    setLoading(true);
    await register({
      email: emailTrimmed,
      fullName: fullName.trim(),
    })
      .then(async (opts) => await startRegistration({ optionsJSON: opts }))
      .then(
        async (registrationResponse) =>
          await verifyRegistration({
            email: emailTrimmed,
            registrationResponse,
          }),
      )
      .finally(() => {
        setLoading(false);
      });
  }

  return { loading, handleSubmit };
}
