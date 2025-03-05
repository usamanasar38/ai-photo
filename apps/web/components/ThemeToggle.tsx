"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useMemo } from "react";

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const isDark = useMemo(() => {
    const selectedTheme = theme === "system" ? systemTheme : theme;
    return selectedTheme === "dark";
  }, [theme, systemTheme]);

  return (
    <div className="flex items-center gap-2">
      <Sun className={`h-5 w-5 ${!isDark ? "text-pink-500" : ""}`} />
      <Switch
        checked={isDark}
        onCheckedChange={() => setTheme(isDark ? "light" : "dark")}
      />
      <Moon className={`h-5 w-5 ${isDark ? "text-pink-500" : ""}`} />
    </div>
  );
}
