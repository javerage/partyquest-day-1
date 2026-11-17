import { useState } from "react";
import { chooseTheme, currentThemePreference, type ThemePreference } from "./theme";

const choices: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Oscuro" },
  { value: "system", label: "Sistema" },
];

export function ThemeSelector() {
  const [selected, setSelected] = useState<ThemePreference>(currentThemePreference);

  return (
    <section role="group" aria-labelledby="appearance-label" className="px-3 pb-1 pt-2">
      <h2 id="appearance-label" className="mb-2 text-small font-bold text-text">Apariencia</h2>
      <div className="grid grid-cols-3 gap-1 rounded-md bg-surface-sunken p-1">
        {choices.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="menuitemradio"
            aria-checked={selected === value}
            onClick={() => {
              setSelected(value);
              chooseTheme(value);
            }}
            className={`min-h-11 rounded-sm border text-small font-bold transition-colors duration-[120ms] ${
              selected === value
                ? "border-border-strong bg-surface text-action"
                : "border-transparent bg-transparent text-text-muted hover:text-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
