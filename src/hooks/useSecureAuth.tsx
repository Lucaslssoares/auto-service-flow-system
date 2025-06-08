
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { checkPermission, rateLimiter, maskSensitiveData } from "@/utils/security";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SecureAuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', maskSensitiveData(error));
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Erro ao buscar perfil:', maskSensitiveData(error));
      return null;
    }
  }, []);

  // Função para verificar permissões
  const hasPermission = useCallback((permission: string): boolean => {
    if (!profile?.role) return false;
    return checkPermission(profile.role, permission);
  }, [profile]);

  // Função para refresh da sessão
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Erro ao atualizar sessão:', maskSensitiveData(error));
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Erro ao atualizar sessão:', maskSensitiveData(error));
      throw error;
    }
  }, []);

  // Configuração do listener de autenticação
  useEffect(() => {
    let mounted = true;

    // Rate limiting para tentativas de autenticação
    const identifier = `auth_${Date.now()}`;
    
    if (!rateLimiter.isAllowed(identifier)) {
      toast.error('Muitas tentativas de autenticação. Tente novamente em alguns minutos.');
      setIsLoading(false);
      return;
    }

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth event:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Buscar perfil do usuário após login
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(session.user.id);
            if (mounted) {
              setProfile(userProfile);
            }
          }, 0);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Buscar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão inicial:', maskSensitiveData(error));
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', maskSensitiveData(error));
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Função de logout segura
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Erro ao fazer logout:', maskSensitiveData(error));
        throw error;
      }

      // Limpar dados locais
      setUser(null);
      setProfile(null);
      setSession(null);
      
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', maskSensitiveData(error));
      toast.error('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
