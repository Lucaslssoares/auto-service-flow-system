
import { createContext, useContext } from "react";
import { useAuthState } from "./auth/useAuthState";
import { useUserProfile } from "./auth/useUserProfile";
import { usePermissions } from "./auth/usePermissions";
import { useUserRoles } from "./useUserRoles";

interface SecureAuthContextType {
  user: any;
  profile: any;
  session: any;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SecureAuthContext = createContext<SecureAuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  hasPermission: () => false,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error("useSecureAuth must be used within a SecureAuthProvider");
  }
  return context;
};

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
