import { delay } from '@/shared/lib/delay';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { register } from '@/auth/services/register';

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
    setLoading(true);
    await register({
      email: email.trim(),
      fullName: fullName.trim(),
    })
      .then(async () => {
        await delay(500);
        toast.success(
          'Cuenta creada correctamente. Revisa tu correo electrónico para obtener la clave de acceso.',
        );
        event.currentTarget.reset();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return { loading, handleSubmit };
}
