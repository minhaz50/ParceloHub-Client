"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  readStoredTheme,
  type Theme,
} from "@/lib/theme";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(callback: () => void) {
  listeners.add(callback);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");

  const onSystemChange = () => {
    if (readStoredTheme() === "system") {
      applyTheme("system");
      callback();
    }
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(readStoredTheme());
      callback();
    }
  };

  mq.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    mq.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    readStoredTheme,
    () => "system",
  );
  const resolvedTheme = useSyncExternalStore<"light" | "dark">(
    subscribe,
    () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    () => "light",
  );

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode etc.) — still apply for this session.
    }
    applyTheme(next);
    emit();
  }, []);

  return { theme, resolvedTheme, setTheme };
}
