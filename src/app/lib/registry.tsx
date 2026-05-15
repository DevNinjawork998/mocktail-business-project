"use client";

import React from "react";
import { ThemeProvider } from "styled-components";
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
  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
}
