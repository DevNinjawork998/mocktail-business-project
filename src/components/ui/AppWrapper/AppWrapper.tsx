"use client";

import React from "react";
import StyledComponentsRegistry from "@/app/lib/registry";
import { ThemeProvider } from "@/theme/theme-provider";
import { StyledThemeWrapper } from "@/theme/styled-theme-provider";
import { CartProvider } from "@/contexts/CartContext";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider>
        <StyledThemeWrapper>
          <CartProvider>{children}</CartProvider>
        </StyledThemeWrapper>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
