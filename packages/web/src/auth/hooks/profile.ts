import { useState, type FormEvent } from 'react';
import { useAuthUser } from './auth-context';
import { delay } from '@/shared/lib/delay';
import { logout } from '../services/logout';
import { tokenKey } from '@/shared/constants/session-keys';

export function useProfile() {
  const { reloadSession } = useAuthUser();
  const { user } = useAuthUser();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    await delay(1000);
    setSaving(false);
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
