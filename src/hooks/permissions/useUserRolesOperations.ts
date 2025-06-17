
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppRole } from "@/hooks/useUserRoles";

interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  roles: AppRole[];
}

export const useUserRolesOperations = () => {
  const queryClient = useQueryClient();

  // Buscar todos os usuários com seus papéis
  const { data: users, isLoading } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async (): Promise<UserWithRoles[]> => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email");

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combinar perfis com seus papéis
      const usersWithRoles: UserWithRoles[] = profiles.map(profile => {
        const roles = userRoles
          .filter(ur => ur.user_id === profile.id)
          .map(ur => ur.role as AppRole);
        
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          roles
        };
      });

      return usersWithRoles;
    }
  });

  // Mutation para atualizar papéis do usuário
  const updateUserRolesMutation = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: AppRole[] }) => {
      // Remover todos os papéis existentes do usuário
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Adicionar os novos papéis
      if (roles.length > 0) {
        const { error: insertError } = await supabase
          .from("user_roles")
          .insert(roles.map(role => ({ user_id: userId, role })));

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Papéis do usuário atualizados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar papéis:", error);
      toast.error("Erro ao atualizar papéis do usuário");
    }
  });

  const handleRoleToggle = (userId: string, role: AppRole, currentRoles: AppRole[]) => {
    const hasRole = currentRoles.includes(role);
    const newRoles = hasRole 
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];

    updateUserRolesMutation.mutate({ userId, roles: newRoles });
  };

  return {
    users,
    isLoading,
    handleRoleToggle,
    isUpdating: updateUserRolesMutation.isPending
  };
};
