import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(undefined);

const colorThemes = {
  green: { name: "Green", primary: "34 197 94", preview: "#22c55e" },
  blue: { name: "Blue", primary: "59 130 246", preview: "#3b82f6" },
  red: { name: "Red", primary: "239 68 68", preview: "#ef4444" },
  purple: { name: "Purple", primary: "139 92 246", preview: "#8b5cf6" },
  orange: { name: "Orange", primary: "249 115 22", preview: "#f97316" },
  pink: { name: "Pink", primary: "236 72 153", preview: "#ec4899" },
  cyan: { name: "Cyan", primary: "6 182 212", preview: "#06b6d4" },
  yellow: { name: "Yellow", primary: "234 179 8", preview: "#eab308" },
  indigo: { name: "Indigo", primary: "99 102 241", preview: "#6366f1" },
  emerald: { name: "Emerald", primary: "16 185 129", preview: "#10b981" },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme-mode") || "light";
    }
    return "light";
  });

  const [resolvedTheme, setResolvedTheme] = useState("light");

  // Update resolved theme when mode changes
  useEffect(() => {
    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const updateResolvedTheme = () => {
      const newResolvedTheme = mode === "system" ? getSystemTheme() : mode;
      setResolvedTheme(newResolvedTheme);
    };

    updateResolvedTheme();

    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateResolvedTheme);
      return () => mediaQuery.removeEventListener("change", updateResolvedTheme);
    }
  }, [mode]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove old classes and add new one
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);

    // Force body to inherit theme
    body.className = `${resolvedTheme} min-h-screen transition-colors duration-300`;

    // Apply dark/light theme
    if (resolvedTheme === "dark") {
      root.style.backgroundColor = "rgb(15 23 42)";
      root.style.color = "white";
      body.style.backgroundColor = "rgb(15 23 42)";
      body.style.color = "white";

      // Dark theme variables
      root.style.setProperty("--background", "15 23 42");
      root.style.setProperty("--foreground", "255 255 255");
      root.style.setProperty("--card", "30 41 59");
      root.style.setProperty("--card-foreground", "255 255 255");
      root.style.setProperty("--border", "51 65 85");
      root.style.setProperty("--muted", "51 65 85");
      root.style.setProperty("--muted-foreground", "148 163 184");
      root.style.setProperty("--primary", "34 197 94");
      root.style.setProperty("--ring", "34 197 94");
    } else {
      root.style.backgroundColor = "white";
      root.style.color = "rgb(15 23 42)";
      body.style.backgroundColor = "white";
      body.style.color = "rgb(15 23 42)";

      // Light theme variables
      root.style.setProperty("--background", "255 255 255");
      root.style.setProperty("--foreground", "15 23 42");
      root.style.setProperty("--card", "255 255 255");
      root.style.setProperty("--card-foreground", "15 23 42");
      root.style.setProperty("--border", "226 232 240");
      root.style.setProperty("--muted", "241 245 249");
      root.style.setProperty("--muted-foreground", "100 116 139");
      root.style.setProperty("--primary", "34 197 94");
      root.style.setProperty("--ring", "34 197 94");
    }

    // Force all elements to update
    const event = new Event('themechange');
    window.dispatchEvent(event);
  }, [resolvedTheme]);

  const handleSetMode = (newMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        setMode: handleSetMode,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
