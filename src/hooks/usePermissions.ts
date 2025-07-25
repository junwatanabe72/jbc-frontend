import { useMemo, type FC, type ReactNode, createElement } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  DEFAULT_ROLE_PERMISSIONS,
  type Permission,
  type PermissionCheck,
} from "../types/permissions";

export const usePermissions = (): PermissionCheck => {
  const { user } = useAuthStore();

  const userPermissions = useMemo<Permission[]>(() => {
    if (!user) return [];

    // デフォルトのロール権限を取得
    const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];

    // TODO: ここで個別のユーザー権限も考慮する
    // const customPermissions = getUserCustomPermissions(user.id);
    // return [...rolePermissions, ...customPermissions];

    return rolePermissions;
  }, [user]);

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const canAccess = (resource: string, action: string): boolean => {
    const permission = `${resource}.${action}` as Permission;
    return hasPermission(permission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
  };
};

// 権限チェック用のコンポーネント
interface PermissionGuardProps {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export const PermissionGuard: FC<PermissionGuardProps> = ({
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess
    ? createElement("div", null, children)
    : createElement("div", null, fallback);
};
