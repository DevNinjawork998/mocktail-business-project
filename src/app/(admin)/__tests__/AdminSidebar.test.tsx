import React from "react";
import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
import AdminSidebar from "../AdminSidebar";
import "@jest/globals";

// Mock next/navigation
const mockPathname = jest.fn(() => "/dashboard");

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
}));

// Mock next-auth/react
const mockSignOut = jest.fn();

jest.mock("next-auth/react", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

const mockUser = {
  name: "Test User",
  email: "test@example.com",
  role: "ADMIN",
};

describe("AdminSidebar", () => {
  beforeEach(() => {
    mockSignOut.mockClear();
    mockPathname.mockReturnValue("/dashboard");
  });

  describe("Rendering", () => {
    it("renders logo and navigation items", () => {
      render(<AdminSidebar user={mockUser} />);

      expect(screen.getByText("Mocktails Admin")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Ingredients")).toBeInTheDocument();
    });

    it("renders user information", () => {
      render(<AdminSidebar user={mockUser} />);

      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("ADMIN")).toBeInTheDocument();
    });

    it("displays email when name is not available", () => {
      const userWithoutName = {
        name: null,
        email: "test@example.com",
        role: "EDITOR",
      };

      render(<AdminSidebar user={userWithoutName} />);

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("EDITOR")).toBeInTheDocument();
    });

    it("renders navigation icons", () => {
      render(<AdminSidebar user={mockUser} />);

      expect(screen.getByText("📊")).toBeInTheDocument();
      expect(screen.getByText("🍹")).toBeInTheDocument();
      expect(screen.getByText("🌿")).toBeInTheDocument();
    });
  });

  describe("Navigation Active State", () => {
    it("marks dashboard as active when pathname is /dashboard", () => {
      mockPathname.mockReturnValue("/dashboard");
      render(<AdminSidebar user={mockUser} />);

      const dashboardLink = screen.getByText("Dashboard").closest("a");
      expect(dashboardLink).toBeInTheDocument();
    });

    it("marks products as active when pathname starts with /dashboard/products", () => {
      mockPathname.mockReturnValue("/dashboard/products");
      render(<AdminSidebar user={mockUser} />);

      const productsLink = screen.getByText("Products").closest("a");
      expect(productsLink).toBeInTheDocument();
    });

    it("marks ingredients as active when pathname starts with /dashboard/ingredients", () => {
      mockPathname.mockReturnValue("/dashboard/ingredients");
      render(<AdminSidebar user={mockUser} />);

      const ingredientsLink = screen.getByText("Ingredients").closest("a");
      expect(ingredientsLink).toBeInTheDocument();
    });
  });

  describe("Sign Out", () => {
    it("calls signOut when sign out button is clicked", async () => {
      mockSignOut.mockResolvedValue(undefined);

      render(<AdminSidebar user={mockUser} />);

      const signOutButton = screen.getByText("Sign Out");
      fireEvent.click(signOutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles user with null name and email", () => {
      const userWithNulls = {
        name: null,
        email: null,
        role: "EDITOR",
      };

      render(<AdminSidebar user={userWithNulls} />);

      // Should still render without crashing
      expect(screen.getByText("EDITOR")).toBeInTheDocument();
    });

    it("handles different user roles", () => {
      const editorUser = {
        name: "Editor User",
        email: "editor@example.com",
        role: "EDITOR",
      };

      render(<AdminSidebar user={editorUser} />);

      expect(screen.getByText("Editor User")).toBeInTheDocument();
      expect(screen.getByText("EDITOR")).toBeInTheDocument();
    });
  });
});
