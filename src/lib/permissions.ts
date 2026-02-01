export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Check if a user role has permission based on allowed roles
 */
export function hasPermission(
  userRole: string,
  allowedRoles: string[]
): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user can manage other users (only SUPERADMIN)
 */
export function canManageUsers(userRole: string): boolean {
  return userRole === ROLES.SUPERADMIN;
}

/**
 * Check if a user can delete resources (ADMIN and SUPERADMIN)
 */
export function canDelete(userRole: string): boolean {
  return userRole === ROLES.ADMIN || userRole === ROLES.SUPERADMIN;
}

/**
 * Check if a user can edit resources (ADMIN, SUPERADMIN, and EDITOR)
 */
export function canEdit(userRole: string): boolean {
  return (
    userRole === ROLES.SUPERADMIN ||
    userRole === ROLES.ADMIN ||
    userRole === ROLES.EDITOR
  );
}

/**
 * Get all roles that can edit (for permission checks)
 */
export function getEditorRoles(): string[] {
  return [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.EDITOR];
}

/**
 * Get all roles that can delete (for permission checks)
 */
export function getDeleterRoles(): string[] {
  return [ROLES.SUPERADMIN, ROLES.ADMIN];
}
