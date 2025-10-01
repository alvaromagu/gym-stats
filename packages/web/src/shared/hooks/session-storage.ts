import { useCallback, useEffect, useState } from 'react';
import { getJsonFromSession } from '../lib/utils';

export function useSessionStorage<T>(
  key: string,
): [T | null, (value: T | null) => void] {
  const [storedValue, setStoredValue] = useState<T | null>(() =>
    getJsonFromSession<T>(key),
  );

  const setValue = useCallback((value: T | null) => {
    setStoredValue(value);
  }, []);

  useEffect(() => {
    if (storedValue == null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
