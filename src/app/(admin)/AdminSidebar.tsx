"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ROLES } from "@/lib/permissions";
import * as S from "./AdminSidebar.styles";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

const baseNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/products", label: "Products", icon: "🍹" },
  { href: "/dashboard/ingredients", label: "Ingredients", icon: "🌿" },
  { href: "/dashboard/community", label: "Community", icon: "👥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

const superAdminNavItems = [
  { href: "/dashboard/users", label: "Users", icon: "👥" },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const isSuperAdmin = user.role === ROLES.SUPERADMIN;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navItems = isSuperAdmin
    ? [...baseNavItems, ...superAdminNavItems]
    : baseNavItems;

  return (
    <S.Sidebar>
      <S.LogoSection>
        <S.Logo>Mocktails Admin</S.Logo>
      </S.LogoSection>

      <S.Nav>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard/community" &&
              (pathname.startsWith("/dashboard/testimonials") ||
                pathname.startsWith("/dashboard/instagram-posts"))) ||
            (item.href !== "/dashboard" &&
              item.href !== "/dashboard/community" &&
              pathname.startsWith(item.href));

          return (
            <S.NavItem key={item.href} $isActive={isActive}>
              <Link href={item.href}>
                <S.NavIcon>
                  {typeof item.icon === "string" ? item.icon : item.icon}
                </S.NavIcon>
                <span>{item.label}</span>
              </Link>
            </S.NavItem>
          );
        })}
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
