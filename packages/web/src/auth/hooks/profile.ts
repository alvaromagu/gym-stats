import { useState, type FormEvent } from 'react';
import { useAuthUser } from './auth-context';
import { logout } from '../services/logout';
import { tokenKey } from '@/shared/constants/session-keys';
import { toast } from 'sonner';
import { updateUser } from '../services/update-user';

export function useProfile() {
  const { reloadSession } = useAuthUser();
  const { user } = useAuthUser();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const formData = new FormData(event.currentTarget);
    const { fullName } = Object.fromEntries(formData.entries());
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      toast.error('Por favor, introduce un nombre completo válido.');
      return;
    }
    try {
      await updateUser({ fullName: fullName.trim() });
      await reloadSession();
      toast.success('Perfil actualizado correctamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      sessionStorage.removeItem(tokenKey);
      await reloadSession();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  }

  return {
    email: user.email,
    fullName: user.fullName,
    saving,
    loggingOut,
    handleSubmit,
    handleLogout,
  };
}
