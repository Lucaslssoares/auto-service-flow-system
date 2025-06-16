
import { useContext } from "react";
import { SecureAuthContext, SecureAuthContextType } from "./auth/SecureAuthContext";

export const useSecureAuth = (): SecureAuthContextType => {
  const context = useContext(SecureAuthContext);
  if (!context) {
    throw new Error("useSecureAuth must be used within a SecureAuthProvider");
  }
  return context;
};

// Export the provider for convenience
export { SecureAuthProvider } from "./auth/SecureAuthProvider";
