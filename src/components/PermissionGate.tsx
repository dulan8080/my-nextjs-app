"use client";

import { ReactNode } from "react";
import { hasPermission, hasAnyPermission, hasAllPermissions, Permission } from "@/lib/auth";

type PermissionCheckType = "single" | "any" | "all";

interface PermissionGateProps {
  permission?: Permission;
  permissions?: Permission[];
  type?: PermissionCheckType;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * PermissionGate - Component for conditionally rendering content based on user permissions
 * 
 * @example
 * // Render content if user has the 'jobs.create' permission
 * <PermissionGate permission="jobs.create">
 *   <CreateJobButton />
 * </PermissionGate>
 * 
 * @example
 * // Render content if user has ANY of the specified permissions
 * <PermissionGate permissions={["jobs.edit", "jobs.view"]} type="any">
 *   <JobActions />
 * </PermissionGate>
 * 
 * @example
 * // Render content if user has ALL of the specified permissions
 * <PermissionGate permissions={["jobs.price", "jobs.editPrice"]} type="all">
 *   <PricingEditor />
 * </PermissionGate>
 * 
 * @example
 * // Provide fallback content for users without permission
 * <PermissionGate permission="settings.roles" fallback={<AccessDeniedMessage />}>
 *   <RoleSettings />
 * </PermissionGate>
 */
export default function PermissionGate({
  permission,
  permissions = [],
  type = "single",
  children,
  fallback = null
}: PermissionGateProps) {
  // Check if the user has the required permissions
  const hasAccess = () => {
    if (permission) {
      return hasPermission(permission);
    }
    
    if (permissions.length === 0) {
      return true; // No permissions required
    }
    
    switch (type) {
      case "any":
        return hasAnyPermission(permissions);
      case "all":
        return hasAllPermissions(permissions);
      default:
        return false;
    }
  };
  
  // Render children if the user has access, otherwise render fallback
  return hasAccess() ? <>{children}</> : <>{fallback}</>;
} 