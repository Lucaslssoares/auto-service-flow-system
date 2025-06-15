
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignupProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  async function signup({ name, email, password, confirmPassword }: SignupProps) {
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { name },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const { user } = data;
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert([
            {
              user_id: user.id,
              role: "user",
            },
          ]);

        if (roleError) {
          toast({
            title: "Cadastrado (mas houve erro ao registrar papel)!",
            description: roleError.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Você foi logado automaticamente",
          });
        }

        navigate("/");
        return;
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message === "User already registered"
          ? "Este email já está cadastrado"
          : error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return { signup, isLoading };
}
