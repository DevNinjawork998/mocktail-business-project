"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import {
  ServerStyleSheet,
  StyleSheetManager,
  ThemeProvider,
} from "styled-components";
import { styledTheme } from "@/theme/styled-theme";
import { semanticColors } from "@/theme/colors";

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
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window === "undefined") {
    return (
      <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
        <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
      </StyleSheetManager>
    );
  }

  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
}
