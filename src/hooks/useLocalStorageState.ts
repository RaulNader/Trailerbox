import { useEffect, useState } from "react";

export function useLocalStorageState<T>(initialState: T, key: string) {
  const [value, setValue] = useState<T>(function () {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialState;
    } catch {
      return initialState;
    }
  });

  useEffect(
    function () {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage full or unavailable (e.g. private mode): keep in-memory state
      }
    },
    [value, key]
  );

  return [value, setValue] as const;
}
