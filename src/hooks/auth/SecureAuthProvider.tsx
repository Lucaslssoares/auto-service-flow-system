
import React from "react";
import { SecureAuthContext } from "./SecureAuthContext";
import { useAuthState } from "./useAuthState";
import { useUserProfile } from "./useUserProfile";
import { usePermissions } from "./usePermissions";
import { useUserRoles } from "../useUserRoles";

export const SecureAuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Usar os hooks refatorados
  const { user, session, isLoading: authLoading, refreshSession, signOut } = useAuthState();
  const { profile, isLoading: profileLoading } = useUserProfile(user);
  const { hasPermission } = usePermissions();
  const { loading: rolesLoading } = useUserRoles();

  // Combinação dos estados de loading
  const isLoading = authLoading || profileLoading || rolesLoading;

  const value = {
    user,
    profile,
    session,
    isLoading,
    hasPermission,
    signOut,
    refreshSession,
  };

  return (
    <SecureAuthContext.Provider value={value}>
      {children}
    </SecureAuthContext.Provider>
  );
};
