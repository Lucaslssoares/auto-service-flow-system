
import { useCallback } from "react";
import { useUserRoles, AppRole } from "@/hooks/useUserRoles";

export const usePermissions = () => {
  const { roles } = useUserRoles();

  // Função para verificar permissões (baseada em user_roles + mapeamento)
  const hasPermission = useCallback((permission: string): boolean => {
    // Map permission → required role(s)
    const permissionRoleMap: Record<string, AppRole[]> = {
      read: ["admin", "manager", "employee", "user"],
      write: ["admin", "manager", "employee"],
      delete: ["admin", "manager"],
      manage_users: ["admin"],
      view_finance: ["admin", "manager"],
      // add more as needed
    };
    const requiredRoles = permissionRoleMap[permission] ?? [];
    return roles.some((role) => requiredRoles.includes(role));
  }, [roles]);

  return {
    hasPermission,
    roles
  };
};
