import { useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

export type Theme = "dark" | "light";

// Must match the inline script in index.html that applies the theme before first paint
export const THEME_KEY = "theme";

function preferredTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorageState<Theme>(preferredTheme(), THEME_KEY);

  useEffect(
    function () {
      const root = document.documentElement;
      // Switch colors instantly, then turn transitions back on next frame
      root.classList.add("no-transitions");
      root.classList.toggle("light", theme === "light");
      getComputedStyle(root).getPropertyValue("color"); // force the browser to apply the new colors now
      const frame = requestAnimationFrame(() => root.classList.remove("no-transitions"));
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "light" ? "#f4f4f5" : "#141414");
      return () => cancelAnimationFrame(frame);
    },
    [theme]
  );

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
