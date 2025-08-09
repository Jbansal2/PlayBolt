import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, Palette, X, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext.jsx";

export function ThemeSwitcher() {
  const { mode, setMode, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const modeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const modeLabels = {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      if (!event.target.closest("[data-theme-panel]")) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="relative" data-theme-panel>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-lg transition-all duration-200 ${
          isOpen
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-card hover:bg-primary hover:text-primary-foreground text-muted-foreground border border-border"
        }`}
        aria-label="Theme settings"
        aria-expanded={isOpen}
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Theme Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Current: {modeLabels[mode]}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Appearance
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(modeLabels).map((modeOption) => {
                  const Icon = modeIcons[modeOption];
                  const isSelected = mode === modeOption;

                  return (
                    <button
                      key={modeOption}
                      onClick={() => handleModeChange(modeOption)}
                      className={`relative flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      aria-label={`Select ${modeLabels[modeOption]} mode`}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">{modeLabels[modeOption]}</span>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {mode === "system" && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Following system preference: {resolvedTheme}
                </p>
              )}
            </div>


            <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary" />
                <span className="text-sm font-medium text-foreground">Current Theme</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Mode: {resolvedTheme}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
