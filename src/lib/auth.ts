import { useEffect, useState } from 'react';

// Types for users, permissions, and roles
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Permission = 
  // Job management
  | 'jobs.view'
  | 'jobs.create'
  | 'jobs.edit'
  | 'jobs.delete'
  | 'jobs.assignOperator'
  | 'jobs.changeStatus'
  | 'jobs.viewPricing'
  | 'jobs.editPricing'
  
  // Print queue
  | 'printQueue.view'
  | 'printQueue.manage'
  | 'printQueue.reorder'
  
  // Approval queue
  | 'approvalQueue.view'
  | 'approvalQueue.approve'
  | 'approvalQueue.reject'
  
  // Customer management
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  
  // Settings
  | 'settings.view'
  | 'settings.users'
  | 'settings.roles'
  | 'settings.pricing'
  | 'settings.system'
  
  // Reports
  | 'reports.view'
  | 'reports.export';

export type Role = {
  name: string;
  permissions: Permission[];
};

// Mock roles with their permissions
const roles: Record<string, Role> = {
  'Administrator': {
    name: 'Administrator',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete', 'jobs.assignOperator', 'jobs.changeStatus', 'jobs.viewPricing', 'jobs.editPricing',
      'printQueue.view', 'printQueue.manage', 'printQueue.reorder',
      'approvalQueue.view', 'approvalQueue.approve', 'approvalQueue.reject',
      'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
      'settings.view', 'settings.users', 'settings.roles', 'settings.pricing', 'settings.system',
      'reports.view', 'reports.export'
    ],
  },
  'Manager': {
    name: 'Manager',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.assignOperator', 'jobs.changeStatus', 'jobs.viewPricing',
      'printQueue.view', 'printQueue.manage', 'printQueue.reorder',
      'approvalQueue.view', 'approvalQueue.approve', 'approvalQueue.reject',
      'customers.view', 'customers.create', 'customers.edit',
      'settings.view', 'settings.users',
      'reports.view', 'reports.export'
    ],
  },
  'Print Operator': {
    name: 'Print Operator',
    permissions: [
      'jobs.view', 'jobs.changeStatus',
      'printQueue.view', 'printQueue.manage',
      'approvalQueue.view'
    ],
  },
  'Customer Service': {
    name: 'Customer Service',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.viewPricing',
      'approvalQueue.view',
      'customers.view', 'customers.create', 
      'reports.view'
    ],
  },
  'Finance': {
    name: 'Finance',
    permissions: [
      'jobs.view', 'jobs.viewPricing', 'jobs.editPricing',
      'customers.view',
      'reports.view', 'reports.export'
    ],
  }
};

// Mock current user - in a real app, this would come from your auth provider
const currentUser: User = {
  id: 'admin-user-id',
  name: 'Admin User',
  email: 'admin@zynkprint.com',
  role: 'Administrator'
};

// Helper function to check if the current user has a specific permission
export function hasPermission(permission: Permission): boolean {
  const userRole = roles[currentUser.role];
  if (!userRole) return false;
  
  return userRole.permissions.includes(permission);
}

// Helper function to check if the current user has ANY of the specified permissions
export function hasAnyPermission(permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(permission));
}

// Helper function to check if the current user has ALL of the specified permissions
export function hasAllPermissions(permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(permission));
}

// Get the current user
export function getCurrentUser(): User {
  return currentUser;
}

// Custom hook for checking if a user has access to a particular page
export function usePageAccess(requiredPermissions: Permission | Permission[]): boolean {
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    if (Array.isArray(requiredPermissions)) {
      setHasAccess(hasAnyPermission(requiredPermissions));
    } else {
      setHasAccess(hasPermission(requiredPermissions));
    }
  }, [requiredPermissions]);
  
  return hasAccess;
}

/**
 * Get all permissions for the current user
 * @returns Array of permission IDs the user has
 */
export function getUserPermissions(): string[] {
  const user = getCurrentUser();
  
  if (!user) {
    return [];
  }
  
  return roles[user.role]?.permissions || [];
}

/**
 * Check if a user can access a specific page based on required permissions
 * @param requiredPermissions - Permissions needed to access the page
 * @returns boolean indicating if the user can access the page
 */
export function canAccessPage(requiredPermissions: string[]): boolean {
  return hasAnyPermission(requiredPermissions as Permission[]);
}

/**
 * Helper to conditionally render UI elements based on permissions
 * @param permissionCheck - Function to determine if the content should be rendered
 * @param children - React children to render if allowed
 * @param fallback - Optional content to render if permission check fails
 */
export function withPermission(
  permissionCheck: () => boolean,
  children: React.ReactNode,
  fallback: React.ReactNode = null
): React.ReactNode {
  return permissionCheck() ? children : fallback;
}

/**
 * Check if the current user is an administrator
 * @returns boolean indicating if the user is an admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "Administrator";
}

/**
 * Generate a simplified view of permissions for UI display
 * @returns Array of permission categories with included permissions
 */
export function getUserPermissionsForDisplay() {
  const permissions = getUserPermissions();
  
  // Group permissions by category (first part of the permission ID)
  const groupedPermissions: Record<string, string[]> = {};
  
  permissions.forEach(perm => {
    const [category] = perm.split('.');
    if (!groupedPermissions[category]) {
      groupedPermissions[category] = [];
    }
    groupedPermissions[category].push(perm);
  });
  
  return Object.entries(groupedPermissions).map(([category, perms]) => ({
    category,
    permissions: perms
  }));
} 