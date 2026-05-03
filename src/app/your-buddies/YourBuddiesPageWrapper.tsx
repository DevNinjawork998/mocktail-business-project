"use client";

import type { ReactNode } from "react";
import * as S from "./page.styles";

export default function YourBuddiesPageWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <S.PageContainer>{children}</S.PageContainer>;
}
