import { useState, type FormEvent } from 'react';
import { useAuthUser } from './auth-context';
import { logout } from '../services/logout';
import { toast } from 'sonner';
import { updateUser } from '../services/update-user';
import { logoutAll } from '../services/logout-all';

export function useProfile() {
  const { reloadSession, user, setToken } = useAuthUser();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

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
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleLogoutAll() {
    setLoggingOutAll(true);
    try {
      await logoutAll();
      setToken(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOutAll(false);
    }
  }

  return {
    email: user.email,
    fullName: user.fullName,
    saving,
    loggingOut,
    loggingOutAll,
    handleSubmit,
    handleLogout,
    handleLogoutAll,
  };
}
