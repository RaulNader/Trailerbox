import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialState;
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

  return [value, setValue];
}
