"use client";

import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { useTheme } from "./theme-provider";
import { styledTheme } from "./styled-theme";
import { semanticColors } from "./colors";

interface StyledThemeWrapperProps {
  children: React.ReactNode;
}

export function StyledThemeWrapper({ children }: StyledThemeWrapperProps) {
  // Always call useTheme hook unconditionally (React Hooks rule)
  const { theme } = useTheme();
  const themeMode: "light" | "dark" = theme || "light";

  // Ensure semantic colors are always available, with fallback
  const semantic = styledTheme.semantic || semanticColors;

  // Create theme object with light theme mode only
  const themeWithMode = {
    ...styledTheme,
    mode: themeMode,
    // Always use light theme semantic colors with fallback
    currentSemantic: {
      ...semantic,
    },
  };

  return (
    <StyledThemeProvider theme={themeWithMode}>{children}</StyledThemeProvider>
  );
}
