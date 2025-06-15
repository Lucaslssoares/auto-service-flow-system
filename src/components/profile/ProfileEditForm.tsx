
import React, { useState } from "react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ProfileEditForm() {
  const { user, profile, refreshSession } = useSecureAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let errorMsg = "";

    // Atualiza no profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name, email })
      .eq("id", user?.id)
      .single();

    if (profileError) {
      errorMsg = "Erro ao atualizar perfil: " + profileError.message;
      setLoading(false);
      toast.error(errorMsg);
      return;
    }

    // Se o email mudou, atualizar no auth também
    if (user && email !== user.email) {
      const { error: authError } = await supabase.auth.updateUser({ email });
      if (authError) {
        errorMsg = "Erro ao atualizar email de login: " + authError.message;
        setLoading(false);
        toast.error(errorMsg);
        return;
      }
      // Como o supabase pode solicitar confirmação por email, avisamos o usuário.
      toast.info(
        "Email de login alterado, confira sua caixa de entrada para confirmar."
      );
      await refreshSession();
    }

    toast.success("Perfil atualizado com sucesso!");
    setLoading(false);
  }

  return (
    <form className="space-y-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 text-sm font-medium" htmlFor="name">
          Nome
        </label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium" htmlFor="email">
          E-mail
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <Button type="submit" className="w-full" loading={loading}>
        Salvar alterações
      </Button>
    </form>
  );
}

