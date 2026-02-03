import React from "react";
import { render, screen, fireEvent, waitFor } from "@/__tests__/test-utils";
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

// Mock user data
const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  role: "EDITOR",
};

const mockSuperAdminUser = {
  id: "superadmin-id",
  email: "superadmin@example.com",
  name: "Super Admin",
  role: "SUPERADMIN",
};

// Helper to get form inputs by name attribute
const getInputByName = (name: string) => {
  return document.querySelector(
    `input[name="${name}"], select[name="${name}"]`
  ) as HTMLInputElement | HTMLSelectElement;
};

describe("UserForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockBack.mockClear();
    mockCreateUser.mockClear();
    mockUpdateUser.mockClear();
  });

  describe("Form Rendering", () => {
    it("renders create form with all required fields", () => {
      render(<UserForm />);

      expect(screen.getByText("User Information")).toBeInTheDocument();
      expect(getInputByName("email")).toBeInTheDocument();
      expect(getInputByName("name")).toBeInTheDocument();
      expect(getInputByName("role")).toBeInTheDocument();
      expect(getInputByName("password")).toBeInTheDocument();
      expect(screen.getByText("Create User")).toBeInTheDocument();
    });

    it("renders edit form when user prop is provided", () => {
      render(<UserForm user={mockUser} />);

      expect(screen.getByText("Update User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
      expect(screen.getByText("Change Password")).toBeInTheDocument();
    });

    it("pre-fills form fields when editing existing user", () => {
      render(<UserForm user={mockUser} />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      const nameInput = getInputByName("name") as HTMLInputElement;
      const roleSelect = getInputByName("role") as HTMLSelectElement;

      expect(emailInput.value).toBe("test@example.com");
      expect(nameInput.value).toBe("Test User");
      expect(roleSelect.value).toBe("EDITOR");
    });

    it("disables email field when editing", () => {
      render(<UserForm user={mockUser} />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      expect(emailInput.disabled).toBe(true);
      expect(
        screen.getByText("Email cannot be changed after user creation")
      ).toBeInTheDocument();
    });

    it("renders role select with all options", () => {
      render(<UserForm />);

      const roleSelect = getInputByName("role") as HTMLSelectElement;
      expect(roleSelect.options[0].value).toBe("EDITOR");
      expect(roleSelect.options[1].value).toBe("ADMIN");
      expect(roleSelect.options[2].value).toBe("SUPERADMIN");
    });

    it("disables role select when editing own user", () => {
      render(<UserForm user={mockSuperAdminUser} currentUserId="superadmin-id" />);

      const roleSelect = getInputByName("role") as HTMLSelectElement;
      expect(roleSelect.disabled).toBe(true);
      expect(
        screen.getByText("You cannot change your own role from SUPERADMIN")
      ).toBeInTheDocument();
    });
  });

  describe("Create User Flow", () => {
    it("calls createUser with correct data", async () => {
      mockCreateUser.mockResolvedValue({ success: true, data: { id: "new-id" } });

      render(<UserForm />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      const nameInput = getInputByName("name") as HTMLInputElement;
      const passwordInput = getInputByName("password") as HTMLInputElement;
      const roleSelect = getInputByName("role") as HTMLSelectElement;

      fireEvent.change(emailInput, { target: { value: "new@example.com" } });
      fireEvent.change(nameInput, { target: { value: "New User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(roleSelect, { target: { value: "ADMIN" } });

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalledWith({
          email: "new@example.com",
          name: "New User",
          password: "password123",
          role: "ADMIN",
        });
      });
    });

    it("redirects to users list on successful creation", async () => {
      mockCreateUser.mockResolvedValue({ success: true, data: { id: "new-id" } });

      render(<UserForm />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      const nameInput = getInputByName("name") as HTMLInputElement;
      const passwordInput = getInputByName("password") as HTMLInputElement;
      const roleSelect = getInputByName("role") as HTMLSelectElement;

      fireEvent.change(emailInput, { target: { value: "new@example.com" } });
      fireEvent.change(nameInput, { target: { value: "New User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(roleSelect, { target: { value: "ADMIN" } });

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/users");
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("displays error message on creation failure", async () => {
      mockCreateUser.mockResolvedValue({
        success: false,
        error: "User already exists",
      });

      render(<UserForm />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      const nameInput = getInputByName("name") as HTMLInputElement;
      const passwordInput = getInputByName("password") as HTMLInputElement;
      const roleSelect = getInputByName("role") as HTMLSelectElement;

      fireEvent.change(emailInput, { target: { value: "new@example.com" } });
      fireEvent.change(nameInput, { target: { value: "New User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(roleSelect, { target: { value: "ADMIN" } });

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("User already exists")).toBeInTheDocument();
      });
    });
  });

  describe("Update User Flow", () => {
    it("calls updateUser with role when role is changed", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      const roleSelect = getInputByName("role") as HTMLSelectElement;
      fireEvent.change(roleSelect, { target: { value: "ADMIN" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "Test User",
          role: "ADMIN",
        });
      });
    });

    it("always includes role in update payload even if unchanged", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      // Don't change anything, just submit
      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "Test User",
          role: "EDITOR", // Role should always be included
        });
      });
    });

    it("includes name in update when name is changed", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      const nameInput = getInputByName("name") as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: "Updated Name" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "Updated Name",
          role: "EDITOR",
        });
      });
    });

    it("does not include password when change password checkbox is unchecked", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const callArgs = mockUpdateUser.mock.calls[0];
        expect(callArgs[1]).not.toHaveProperty("password");
      });
    });

    it("includes password when change password checkbox is checked and password provided", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      // Check the change password checkbox
      const checkbox = screen.getByLabelText("Change Password");
      fireEvent.click(checkbox);

      // Wait for password field to appear
      await waitFor(() => {
        const passwordInput = getInputByName("password") as HTMLInputElement;
        expect(passwordInput).toBeInTheDocument();
      });

      const passwordInput = getInputByName("password") as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: "newpassword123" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "Test User",
          role: "EDITOR",
          password: "newpassword123",
        });
      });
    });

    it("shows error when password is required but not provided", async () => {
      render(<UserForm user={mockUser} />);

      // Check the change password checkbox
      const checkbox = screen.getByLabelText("Change Password");
      fireEvent.click(checkbox);

      // Submit without entering password
      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Password is required when changing password")
        ).toBeInTheDocument();
      });

      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it("shows error when password is too short", async () => {
      render(<UserForm user={mockUser} />);

      // Check the change password checkbox
      const checkbox = screen.getByLabelText("Change Password");
      fireEvent.click(checkbox);

      await waitFor(() => {
        const passwordInput = getInputByName("password") as HTMLInputElement;
        expect(passwordInput).toBeInTheDocument();
      });

      const passwordInput = getInputByName("password") as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: "12345" } }); // Too short

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters")
        ).toBeInTheDocument();
      });

      expect(mockUpdateUser).not.toHaveBeenCalled();
    });

    it("redirects to users list on successful update", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/dashboard/users");
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    it("displays error message on update failure", async () => {
      mockUpdateUser.mockResolvedValue({
        success: false,
        error: "Failed to update user",
      });

      render(<UserForm user={mockUser} />);

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Failed to update user")).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("prevents submission when email is invalid in create mode", async () => {
      render(<UserForm />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      const nameInput = getInputByName("name") as HTMLInputElement;
      const passwordInput = getInputByName("password") as HTMLInputElement;
      const roleSelect = getInputByName("role") as HTMLSelectElement;

      // Fill other required fields to trigger email validation
      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.change(roleSelect, { target: { value: "EDITOR" } });
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      // Wait a bit to ensure validation runs
      await waitFor(() => {
        // Form should not submit with invalid email
        expect(mockCreateUser).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });

    it("shows error when name is empty in create mode", async () => {
      render(<UserForm />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeInTheDocument();
      });
    });

    it("shows error when password is too short in create mode", async () => {
      render(<UserForm />);

      const emailInput = getInputByName("email") as HTMLInputElement;
      const nameInput = getInputByName("name") as HTMLInputElement;
      const passwordInput = getInputByName("password") as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(nameInput, { target: { value: "Test User" } });
      fireEvent.change(passwordInput, { target: { value: "12345" } }); // Too short

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters")
        ).toBeInTheDocument();
      });
    });

    it("shows validation error message when form has errors", async () => {
      render(<UserForm />);

      const submitButton = screen.getByText("Create User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Please fix the form errors before submitting")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Role Updates", () => {
    it("updates role from EDITOR to ADMIN", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      const roleSelect = getInputByName("role") as HTMLSelectElement;
      fireEvent.change(roleSelect, { target: { value: "ADMIN" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "Test User",
          role: "ADMIN",
        });
      });
    });

    it("updates role from ADMIN to SUPERADMIN", async () => {
      const adminUser = { ...mockUser, role: "ADMIN" };
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={adminUser} />);

      const roleSelect = getInputByName("role") as HTMLSelectElement;
      fireEvent.change(roleSelect, { target: { value: "SUPERADMIN" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "Test User",
          role: "SUPERADMIN",
        });
      });
    });

    it("includes role even when only name is changed", async () => {
      mockUpdateUser.mockResolvedValue({ success: true });

      render(<UserForm user={mockUser} />);

      const nameInput = getInputByName("name") as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: "New Name" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith("test-user-id", {
          name: "New Name",
          role: "EDITOR", // Role should always be included
        });
      });
    });
  });

  describe("Password Change Flow", () => {
    it("shows password field when change password checkbox is checked", async () => {
      render(<UserForm user={mockUser} />);

      const checkbox = screen.getByLabelText("Change Password");
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);

      await waitFor(() => {
        const passwordInput = getInputByName("password") as HTMLInputElement;
        expect(passwordInput).toBeInTheDocument();
        expect(passwordInput.type).toBe("password");
      });
    });

    it("hides password field when change password checkbox is unchecked", async () => {
      render(<UserForm user={mockUser} />);

      const checkbox = screen.getByLabelText("Change Password");
      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(getInputByName("password")).toBeInTheDocument();
      });

      fireEvent.click(checkbox);

      await waitFor(() => {
        expect(getInputByName("password")).not.toBeInTheDocument();
      });
    });

    it("validates password length when changing password", async () => {
      render(<UserForm user={mockUser} />);

      const checkbox = screen.getByLabelText("Change Password");
      fireEvent.click(checkbox);

      await waitFor(() => {
        const passwordInput = getInputByName("password") as HTMLInputElement;
        expect(passwordInput).toBeInTheDocument();
      });

      const passwordInput = getInputByName("password") as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: "short" } });

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cancel Button", () => {
    it("calls router.back when cancel is clicked", () => {
      render(<UserForm />);

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe("Loading States", () => {
    it("disables submit button while submitting", async () => {
      mockUpdateUser.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ success: true }), 1000)
          )
      );

      render(<UserForm user={mockUser} />);

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Saving...")).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles user with null name", () => {
      const userWithNullName = { ...mockUser, name: null };
      render(<UserForm user={userWithNullName} />);

      const nameInput = getInputByName("name") as HTMLInputElement;
      expect(nameInput.value).toBe("");
    });

    it("defaults role to EDITOR when not provided", () => {
      render(<UserForm />);

      const roleSelect = getInputByName("role") as HTMLSelectElement;
      expect(roleSelect.value).toBe("EDITOR");
    });

    it("handles update error gracefully", async () => {
      mockUpdateUser.mockResolvedValue({
        success: false,
        error: "Network error",
      });

      render(<UserForm user={mockUser} />);

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      });
    });

    it("handles unexpected errors", async () => {
      mockUpdateUser.mockRejectedValue(new Error("Unexpected error"));

      render(<UserForm user={mockUser} />);

      const submitButton = screen.getByText("Update User");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("An unexpected error occurred")
        ).toBeInTheDocument();
      });
    });
  });
});
