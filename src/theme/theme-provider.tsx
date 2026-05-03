"use client";

import React, { createContext, useContext, ReactNode } from "react";

export type Theme = "light";

export interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always use light theme
  const value: ThemeContextType = {
    theme: "light",
  };

  // Ensure document root has only 'light' class
  if (typeof window !== "undefined") {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
  }

  return (
    <ThemeContext value={value}>{children}</ThemeContext>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
