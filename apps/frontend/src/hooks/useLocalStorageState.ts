import { useEffect, useState } from 'react';

export const useLocalStorageState = <T,>(key: string, initial: T): [T, (next: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    if (!raw) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};
