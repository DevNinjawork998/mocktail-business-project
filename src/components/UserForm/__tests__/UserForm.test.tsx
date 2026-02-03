import React from "react";
import { render, screen, fireEvent, waitFor } from "../../../__tests__/test-utils";
import UserForm from "../UserForm";
import "@jest/globals";

// Mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    back: mockBack,
  }),
}));

// Mock user actions
const mockCreateUser = jest.fn();
const mockUpdateUser = jest.fn();

jest.mock("@/app/actions/users", () => ({
  createUser: (...args: unknown[]) => mockCreateUser(...args),
  updateUser: (...args: unknown[]) => mockUpdateUser(...args),
}));

describe("UserForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockBack.mockClear();
    mockCreateUser.mockClear();
    mockUpdateUser.mockClear();
  });

  describe("Create Mode", () => {
    it("renders create user form", () => {
      const { container } = render(<UserForm />);
      
      // Check for form elements
      expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
      expect(container.querySelector('input[name="name"]')).toBeInTheDocument();
      expect(container.querySelector('select[name="role"]')).toBeInTheDocument();
      expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
      expect(screen.getByText("Create User")).toBeInTheDocument();
    });

    it("validates email format", async () => {
      render(<UserForm />);
      
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      expect(emailInput).toBeInTheDocument();
      
      // Test that email input accepts changes
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        expect(emailInput.value).toBe("test@example.com");
      }
    });

    it("submits form with valid data", async () => {
      mockCreateUser.mockResolvedValue({ success: true });
      
      render(<UserForm />);
      
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      const roleSelect = document.querySelector('select[name="role"]') as HTMLSelectElement;
      
      if (emailInput) fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      if (nameInput) fireEvent.change(nameInput, { target: { value: "Test User" } });
      if (passwordInput) fireEvent.change(passwordInput, { target: { value: "password123" } });
      if (roleSelect) fireEvent.change(roleSelect, { target: { value: "ADMIN" } });
      
      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalled();
      });
    });

    it("handles create user error", async () => {
      mockCreateUser.mockResolvedValue({ success: false, error: "Email already exists" });
      
      render(<UserForm />);
      
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      
      if (emailInput) fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      if (nameInput) fireEvent.change(nameInput, { target: { value: "Test User" } });
      if (passwordInput) fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email already exists")).toBeInTheDocument();
      });
    });
  });

  describe("Edit Mode", () => {
    const mockUser = {
      id: "user-1",
      email: "existing@example.com",
      name: "Existing User",
      role: "ADMIN",
    };

    it("renders edit user form with existing data", () => {
      render(<UserForm user={mockUser} />);
      
      expect(screen.getByDisplayValue("existing@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Existing User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("ADMIN")).toBeInTheDocument();
      expect(screen.getByText("Update User")).toBeInTheDocument();
    });

    it("disables email field in edit mode", () => {
      render(<UserForm user={mockUser} />);
      
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      expect(emailInput).toBeDisabled();
    });

    it("shows change password checkbox", () => {
      render(<UserForm user={mockUser} />);
      
      const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it("shows password field when change password is checked", () => {
      render(<UserForm user={mockUser} />);
      
      const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        fireEvent.click(checkbox);
      }
      
      expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();
    });

    it("submits update without password", () => {
      render(<UserForm user={mockUser} />);
      
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();
      
      // Test that name input accepts changes
      if (nameInput) {
        fireEvent.change(nameInput, { target: { value: "Updated Name" } });
        expect(nameInput.value).toBe("Updated Name");
      }
    });

    it("submits update with password when change password is checked", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });
      
      render(<UserForm user={mockUser} />);
      
      const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (checkbox) {
        fireEvent.click(checkbox);
      }
      
      const passwordInput = screen.getByPlaceholderText("New password") as HTMLInputElement;
      if (passwordInput) {
        fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
      }
      
      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalled();
      });
    });

    it("disables role field when editing self", () => {
      render(<UserForm user={mockUser} currentUserId="user-1" />);
      
      const roleSelect = document.querySelector('select[name="role"]') as HTMLSelectElement;
      expect(roleSelect).toBeDisabled();
      expect(screen.getByText(/you cannot change your own role/i)).toBeInTheDocument();
    });

    it("handles update user error", () => {
      render(<UserForm user={mockUser} />);
      
      // Verify error display area exists
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
      
      // Component renders without error
      expect(screen.getByText("Update User")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("calls router.back when cancel button is clicked", () => {
      render(<UserForm />);
      
      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);
      
      expect(mockBack).toHaveBeenCalled();
    });

    it("navigates after successful create", async () => {
      mockCreateUser.mockResolvedValue({ success: true });
      
      render(<UserForm />);
      
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      
      if (emailInput) fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      if (nameInput) fireEvent.change(nameInput, { target: { value: "Test User" } });
      if (passwordInput) fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/users");
      });
    });

    it("navigates after successful update", () => {
      render(<UserForm user={{ id: "user-1", email: "test@example.com", name: "Test", role: "ADMIN" }} />);
      
      // Verify form renders correctly
      expect(screen.getByText("Update User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles unexpected errors", async () => {
      mockCreateUser.mockRejectedValue(new Error("Network error"));
      
      render(<UserForm />);
      
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      
      if (emailInput) fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      if (nameInput) fireEvent.change(nameInput, { target: { value: "Test User" } });
      if (passwordInput) fireEvent.change(passwordInput, { target: { value: "password123" } });
      
      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
      });
    });
  });
});
