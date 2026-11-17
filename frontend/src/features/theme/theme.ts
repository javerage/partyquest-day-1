import { useEffect } from "react";

export type ThemePreference = "light" | "dark" | "system";
const KEY = "partyquest.theme";
const QUERY = "(prefers-color-scheme: dark)";
let unsavedPreference: ThemePreference | null = null;

export function currentThemePreference(): ThemePreference {
  if (unsavedPreference !== null) return unsavedPreference;
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(preference: ThemePreference = currentThemePreference()): void {
  const dark = preference === "dark" ||
    (preference === "system" && typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function chooseTheme(preference: ThemePreference): void {
  try {
    if (preference === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, preference);
    unsavedPreference = null;
  } catch {
    // A blocked storage choice still applies for this page.
    unsavedPreference = preference;
  }
  applyTheme(preference);
  window.dispatchEvent(new Event("partyquest-theme-change"));
}

export function useThemeSync(): void {
  useEffect(() => {
    applyTheme();
    const media = typeof window.matchMedia === "function" ? window.matchMedia(QUERY) : undefined;
    const refresh = () => applyTheme();
    const onPreferenceChange = () => refresh();
    media?.addEventListener("change", refresh);
    window.addEventListener("partyquest-theme-change", onPreferenceChange);
    return () => {
      media?.removeEventListener("change", refresh);
      window.removeEventListener("partyquest-theme-change", onPreferenceChange);
    };
  }, []);
}
