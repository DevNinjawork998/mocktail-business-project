"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from "styled-components";
import { styledTheme } from "@/theme/styled-theme";
import { semanticColors } from "@/theme/colors";

// Default theme - ensures theme is always available during SSR and initial client render
const defaultTheme = {
  ...styledTheme,
  mode: "light" as const,
  currentSemantic: {
    ...semanticColors,
  },
};

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // During SSR, wrap with StyleSheetManager and ThemeProvider
  if (typeof window === "undefined") {
    return (
      <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
        <ThemeProvider theme={defaultTheme}>
          {children}
        </ThemeProvider>
      </StyleSheetManager>
    );
  }

  // On client, provide default theme as fallback
  // StyledThemeWrapper will override this once it initializes
  return (
    <ThemeProvider theme={defaultTheme}>
      {children}
    </ThemeProvider>
  );
}
