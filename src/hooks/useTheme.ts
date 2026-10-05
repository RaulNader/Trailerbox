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
      document.documentElement.classList.toggle("light", theme === "light");
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", theme === "light" ? "#f4f4f5" : "#141414");
    },
    [theme]
  );

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
