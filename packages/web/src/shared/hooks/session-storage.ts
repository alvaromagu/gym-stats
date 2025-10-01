import { useEffect, useState } from 'react';
import { getJsonFromSession } from '../lib/utils';

export function useSessionStorage<T>(
  key: string,
): [T | null, (value: T | null) => void] {
  const [storedValue, setStoredValue] = useState<T | null>(() =>
    getJsonFromSession<T>(key),
  );

  const setValue = (value: T | null) => {
    if (value == null) {
      window.sessionStorage.removeItem(key);
      return;
    }
    window.sessionStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    const handleSessionStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        const newValue = getJsonFromSession<T>(key);
        setStoredValue(newValue);
      }
    };
    window.addEventListener('storage', handleSessionStorageChange);
    return () => {
      window.removeEventListener('storage', handleSessionStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
