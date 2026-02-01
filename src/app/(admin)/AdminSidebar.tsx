"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import * as S from "./AdminSidebar.styles";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/products", label: "Products", icon: "🍹" },
  { href: "/dashboard/ingredients", label: "Ingredients", icon: "🌿" },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <S.Sidebar>
      <S.LogoSection>
        <S.Logo>Mocktails Admin</S.Logo>
      </S.LogoSection>

      <S.Nav>
        {navItems.map((item) => (
          <S.NavItem
            key={item.href}
            $isActive={
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            }
          >
            <Link href={item.href}>
              <S.NavIcon>{item.icon}</S.NavIcon>
              <span>{item.label}</span>
            </Link>
          </S.NavItem>
        ))}
      </S.Nav>

      <S.UserSection>
        <S.UserInfo>
          <S.UserName>{user.name || user.email}</S.UserName>
          <S.UserRole>{user.role}</S.UserRole>
        </S.UserInfo>
        <S.SignOutButton onClick={handleSignOut}>Sign Out</S.SignOutButton>
      </S.UserSection>
    </S.Sidebar>
  );
}
