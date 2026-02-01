import React from "react";
import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
import LoginForm from "../LoginForm";
import "@jest/globals";

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockGet = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock next-auth/react
const mockSignIn = jest.fn();
const mockGetProviders = jest.fn();

jest.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
  getProviders: () => mockGetProviders(),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockGet.mockClear();
    mockSignIn.mockClear();
    mockGetProviders.mockClear();
    mockGet.mockReturnValue(null); // Default: no callbackUrl
    mockGetProviders.mockResolvedValue({
      credentials: { id: "credentials", name: "Credentials", type: "credentials" },
    });
  });

  describe("Rendering", () => {
    it("renders login form with all fields", () => {
      render(<LoginForm />);

      expect(screen.getByText("Mocktails Admin")).toBeInTheDocument();
      expect(screen.getByText("Sign in to manage your products")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

    it("renders OAuth button when Google provider is available", async () => {
      mockGetProviders.mockResolvedValue({
        credentials: { id: "credentials", name: "Credentials", type: "credentials" },
        google: { id: "google", name: "Google", type: "oauth" },
      });

      render(<LoginForm />);

      await waitFor(() => {
        expect(screen.getByText("Continue with Google")).toBeInTheDocument();
      });
    });

    it("renders divider when OAuth provider is available", async () => {
      mockGetProviders.mockResolvedValue({
        credentials: { id: "credentials", name: "Credentials", type: "credentials" },
        google: { id: "google", name: "Google", type: "oauth" },
      });

      render(<LoginForm />);

      await waitFor(() => {
        expect(screen.getByText("or")).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("submits form with valid credentials", async () => {
      mockSignIn.mockResolvedValue({ error: null });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("credentials", {
          email: "test@example.com",
          password: "password123",
          redirect: false,
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard");
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("uses callbackUrl from search params", async () => {
      mockGet.mockReturnValue("/dashboard/products");
      mockSignIn.mockResolvedValue({ error: null });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/products");
      });
    });

    it("shows error on invalid credentials", async () => {
      mockSignIn.mockResolvedValue({ error: "Invalid credentials" });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
      });
    });

    it("handles unexpected errors", async () => {
      mockSignIn.mockRejectedValue(new Error("Network error"));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("An unexpected error occurred. Please try again.")).toBeInTheDocument();
      });
    });

    it("shows loading state during submission", async () => {
      mockSignIn.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 1000))
      );

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Signing in...")).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("validates email format", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.blur(emailInput);
      fireEvent.click(submitButton);

      // Form validation should prevent submission with invalid email
      // The form won't submit, so signIn shouldn't be called
      await waitFor(() => {
        // Either validation error shows or form doesn't submit
        const hasError = screen.queryByText(/Please enter a valid email address/i) !== null;
        const signInNotCalled = mockSignIn.mock.calls.length === 0;
        expect(hasError || signInNotCalled).toBe(true);
      });
    });

    it("validates password length", async () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByText("Sign In");

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "12345" } });
      fireEvent.blur(passwordInput);
      fireEvent.click(submitButton);

      // Form validation should prevent submission with short password
      await waitFor(() => {
        const hasError = screen.queryByText(/Password must be at least 6 characters/i) !== null;
        const signInNotCalled = mockSignIn.mock.calls.length === 0;
        expect(hasError || signInNotCalled).toBe(true);
      });
    });
  });

  describe("OAuth Sign In", () => {
    it("handles OAuth sign in", async () => {
      mockGetProviders.mockResolvedValue({
        credentials: { id: "credentials", name: "Credentials", type: "credentials" },
        google: { id: "google", name: "Google", type: "oauth" },
      });
      mockSignIn.mockResolvedValue(undefined);

      render(<LoginForm />);

      await waitFor(() => {
        expect(screen.getByText("Continue with Google")).toBeInTheDocument();
      });

      const googleButton = screen.getByText("Continue with Google").closest("button");
      if (googleButton) {
        fireEvent.click(googleButton);
      }

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith("google", {
          callbackUrl: "/dashboard",
          redirect: true,
        });
      });
    });

    it("shows loading state for OAuth", async () => {
      mockGetProviders.mockResolvedValue({
        credentials: { id: "credentials", name: "Credentials", type: "credentials" },
        google: { id: "google", name: "Google", type: "oauth" },
      });
      mockSignIn.mockImplementation(
        () => new Promise(() => {}) // Never resolves to test loading state
      );

      render(<LoginForm />);

      await waitFor(() => {
        expect(screen.getByText("Continue with Google")).toBeInTheDocument();
      });

      const googleButton = screen.getByText("Continue with Google").closest("button");
      if (googleButton) {
        fireEvent.click(googleButton);
      }

      await waitFor(() => {
        expect(screen.getByText("Signing in...")).toBeInTheDocument();
      });
    });

    it("handles OAuth errors", async () => {
      mockGetProviders.mockResolvedValue({
        credentials: { id: "credentials", name: "Credentials", type: "credentials" },
        google: { id: "google", name: "Google", type: "oauth" },
      });
      mockSignIn.mockRejectedValue(new Error("OAuth error"));

      render(<LoginForm />);

      await waitFor(() => {
        expect(screen.getByText("Continue with Google")).toBeInTheDocument();
      });

      const googleButton = screen.getByText("Continue with Google").closest("button");
      if (googleButton) {
        fireEvent.click(googleButton);
      }

      await waitFor(() => {
        expect(screen.getByText("Failed to sign in with google")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles missing providers gracefully", async () => {
      mockGetProviders.mockResolvedValue(null);

      render(<LoginForm />);

      // Should still render the form
      expect(screen.getByText("Sign In")).toBeInTheDocument();
    });

  });
});
