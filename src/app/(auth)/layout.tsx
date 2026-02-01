import { StyledThemeWrapper } from "@/theme";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyledThemeWrapper>{children}</StyledThemeWrapper>;
}
