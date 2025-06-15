
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Representação mínima do usuário/profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAdminUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Busca todos os perfis (apenas para admins)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, role")
      .order("name", { ascending: true });

    if (error) {
      toast({
        title: "Erro ao buscar usuários",
        description: error.message,
        variant: "destructive",
      });
      setUsers([]);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Promover para admin
  const promoteToAdmin = async (user_id: string) => {
    const { error } = await supabase
      .from("user_roles")
      .insert([{ user_id, role: "admin" }]);

    if (error) {
      toast({
        title: "Erro ao promover usuário",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Usuário promovido a admin",
      });
      fetchUsers();
    }
  };

  // Rebaixar (remover admin)
  const demoteFromAdmin = async (user_id: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user_id)
      .eq("role", "admin");

    if (error) {
      toast({
        title: "Erro ao remover admin",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Privilégio de admin removido",
      });
      fetchUsers();
    }
  };

  return { users, loading, promoteToAdmin, demoteFromAdmin, refetch: fetchUsers };
}
