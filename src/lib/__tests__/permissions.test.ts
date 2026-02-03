import {
  ROLES,
  hasPermission,
  canManageUsers,
  canDelete,
  canEdit,
  getEditorRoles,
  getDeleterRoles,
} from "../permissions";

describe("permissions", () => {
  describe("ROLES", () => {
    it("exports all role constants", () => {
      expect(ROLES.SUPERADMIN).toBe("SUPERADMIN");
      expect(ROLES.ADMIN).toBe("ADMIN");
      expect(ROLES.EDITOR).toBe("EDITOR");
    });
  });

  describe("hasPermission", () => {
    it("returns true when user role is in allowed roles", () => {
      expect(hasPermission("ADMIN", ["ADMIN", "EDITOR"])).toBe(true);
      expect(hasPermission("EDITOR", ["ADMIN", "EDITOR"])).toBe(true);
      expect(hasPermission("SUPERADMIN", ["SUPERADMIN"])).toBe(true);
    });

    it("returns false when user role is not in allowed roles", () => {
      expect(hasPermission("EDITOR", ["ADMIN", "SUPERADMIN"])).toBe(false);
      expect(hasPermission("ADMIN", ["SUPERADMIN"])).toBe(false);
    });

    it("returns false for empty allowed roles array", () => {
      expect(hasPermission("ADMIN", [])).toBe(false);
    });
  });

  describe("canManageUsers", () => {
    it("returns true for SUPERADMIN", () => {
      expect(canManageUsers("SUPERADMIN")).toBe(true);
    });

    it("returns false for ADMIN", () => {
      expect(canManageUsers("ADMIN")).toBe(false);
    });

    it("returns false for EDITOR", () => {
      expect(canManageUsers("EDITOR")).toBe(false);
    });

    it("returns false for unknown role", () => {
      expect(canManageUsers("UNKNOWN")).toBe(false);
    });
  });

  describe("canDelete", () => {
    it("returns true for SUPERADMIN", () => {
      expect(canDelete("SUPERADMIN")).toBe(true);
    });

    it("returns true for ADMIN", () => {
      expect(canDelete("ADMIN")).toBe(true);
    });

    it("returns false for EDITOR", () => {
      expect(canDelete("EDITOR")).toBe(false);
    });

    it("returns false for unknown role", () => {
      expect(canDelete("UNKNOWN")).toBe(false);
    });
  });

  describe("canEdit", () => {
    it("returns true for SUPERADMIN", () => {
      expect(canEdit("SUPERADMIN")).toBe(true);
    });

    it("returns true for ADMIN", () => {
      expect(canEdit("ADMIN")).toBe(true);
    });

    it("returns true for EDITOR", () => {
      expect(canEdit("EDITOR")).toBe(true);
    });

    it("returns false for unknown role", () => {
      expect(canEdit("UNKNOWN")).toBe(false);
    });
  });

  describe("getEditorRoles", () => {
    it("returns all roles that can edit", () => {
      const roles = getEditorRoles();
      expect(roles).toEqual(["SUPERADMIN", "ADMIN", "EDITOR"]);
      expect(roles).toContain("SUPERADMIN");
      expect(roles).toContain("ADMIN");
      expect(roles).toContain("EDITOR");
    });

    it("returns array with correct length", () => {
      expect(getEditorRoles()).toHaveLength(3);
    });
  });

  describe("getDeleterRoles", () => {
    it("returns all roles that can delete", () => {
      const roles = getDeleterRoles();
      expect(roles).toEqual(["SUPERADMIN", "ADMIN"]);
      expect(roles).toContain("SUPERADMIN");
      expect(roles).toContain("ADMIN");
    });

    it("does not include EDITOR", () => {
      expect(getDeleterRoles()).not.toContain("EDITOR");
    });

    it("returns array with correct length", () => {
      expect(getDeleterRoles()).toHaveLength(2);
    });
  });
});
