"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CartIcon from "@/components/CartIcon/CartIcon";
import {
  NavContainer,
  NavWrapper,
  NavContent,
  DesktopNavLinks,
  NavLink,
  MobileMenuButton,
  LogoContainer,
  Logo,
  LogoImage,
  LogoText,
  LogoAccent,
  MobileMenu,
  MobileMenuLinks,
  MobileNavLink,
  CartIconWrapper,
} from "./Navigation.styles";

// Icons
const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "1.5rem", height: "1.5rem" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "1.5rem", height: "1.5rem" }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "Ingredients", href: "/ingredients" },
    { label: "Community", href: "/your-buddies" },
    { label: "Our Founder", href: "/founders" },
  ];

  return (
    <NavContainer>
      <NavWrapper>
        <NavContent>
          {/* Logo - Left */}
          <LogoContainer>
            <Link href="/" aria-label="Go to home page">
              <Logo>
                <LogoImage>
                  <Image
                    src="/images/motg-logo.png"
                    alt="Mocktails On the Go"
                    width={40}
                    height={40}
                    priority
                    style={{ objectFit: "contain" }}
                  />
                </LogoImage>
                <LogoText>
                  Mocktails <LogoAccent>On the Go</LogoAccent>
                </LogoText>
              </Logo>
            </Link>
          </LogoContainer>

          {/* Center Navigation - Desktop */}
          <DesktopNavLinks>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <NavLink>{link.label}</NavLink>
              </Link>
            ))}
          </DesktopNavLinks>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </MobileMenuButton>

          {/* Cart Icon - Right */}
          <CartIconWrapper>
            <CartIcon />
          </CartIconWrapper>
        </NavContent>

        {/* Mobile Menu */}
        <MobileMenu $isOpen={isMobileMenuOpen}>
          <MobileMenuLinks>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                <MobileNavLink onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </MobileNavLink>
              </Link>
            ))}
            <Link href="/cart">
              <MobileNavLink onClick={() => setIsMobileMenuOpen(false)}>
                Cart
              </MobileNavLink>
            </Link>
          </MobileMenuLinks>
        </MobileMenu>
      </NavWrapper>
    </NavContainer>
  );
};

export default Navigation;
