
import { createContext } from "react";

export interface SecureAuthContextType {
  user: any;
  profile: any;
  session: any;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const SecureAuthContext = createContext<SecureAuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  hasPermission: () => false,
  signOut: async () => {},
  refreshSession: async () => {},
});
