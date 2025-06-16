
import { useState, useEffect, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { maskSensitiveData } from "@/utils/security";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useUserProfile = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id).then(setProfile);
    } else {
      setProfile(null);
    }
  }, [user?.id, fetchUserProfile]);

  return {
    profile,
    isLoading
  };
};
