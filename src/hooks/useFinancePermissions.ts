
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";

export const useFinancePermissions = () => {
  const { user } = useSecureAuth();

  const { data: permissionData, isLoading } = useQuery({
    queryKey: ['finance_permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return {
          hasAccess: false,
          userRoles: [],
          profile: null,
          reason: 'Usuário não autenticado'
        };
      }

      console.log('Verificando permissões financeiras para usuário:', user.id);

      // Buscar roles do usuário
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) {
        console.error('Erro ao buscar roles:', rolesError);
        return {
          hasAccess: false,
          userRoles: [],
          profile: null,
          reason: 'Erro ao verificar permissões'
        };
      }

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
      }

      const userRoles = (roles || []).map(r => r.role);
      const hasFinanceAccess = userRoles.some(role => 
        ['admin', 'manager'].includes(role)
      );

      console.log('Resultado da verificação:', {
        userId: user.id,
        userRoles,
        hasFinanceAccess,
        profile: profile?.email
      });

      return {
        hasAccess: hasFinanceAccess,
        userRoles,
        profile,
        reason: hasFinanceAccess 
          ? 'Acesso liberado'
          : 'Necessário papel de admin ou manager'
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 2
  });

  return {
    hasAccess: permissionData?.hasAccess || false,
    userRoles: permissionData?.userRoles || [],
    profile: permissionData?.profile,
    reason: permissionData?.reason || 'Carregando...',
    isLoading
  };
};
