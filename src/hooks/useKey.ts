import { useEffect, useRef } from "react";

// Runs `action` whenever the given key (KeyboardEvent.code) is pressed
export function useKey(key: string, action: (e: KeyboardEvent) => void) {
  const actionRef = useRef(action);

  useEffect(function () {
    actionRef.current = action;
  });

  useEffect(
    function () {
      function callback(e: KeyboardEvent) {
        if (e.code.toLowerCase() === key.toLowerCase()) actionRef.current(e);
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [key]
  );
}
