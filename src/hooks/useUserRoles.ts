
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSecureAuth } from "@/hooks/useSecureAuth";

export type AppRole = "admin" | "manager" | "employee" | "user";

export function useUserRoles() {
  const { user } = useSecureAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user?.id) {
        setRoles([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        setRoles([]);
      } else {
        setRoles((data ?? []).map((row) => row.role as AppRole));
      }
      setLoading(false);
    };

    fetchRoles();
  }, [user?.id]);

  const hasRole = (role: AppRole) => roles.includes(role);

  return { roles, hasRole, loading };
}
