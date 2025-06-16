
import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { rateLimiter, maskSensitiveData } from "@/utils/security";
import { toast } from "sonner";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  // Função para refresh da sessão
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Erro ao atualizar sessão:', maskSensitiveData(error));
        throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar sessão:', maskSensitiveData(error));
      throw error;
    }
  }, []);

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
      setSession(null);
      
      toast.success('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', maskSensitiveData(error));
      toast.error('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    session,
    isLoading,
    refreshSession,
    signOut
  };
};
