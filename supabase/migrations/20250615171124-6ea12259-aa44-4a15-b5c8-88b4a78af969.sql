
-- Adiciona política para que admins possam visualizar todos os papéis na tabela user_roles

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can view all user roles"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() = user_id     -- Usuário vê seus próprios papéis
    OR
    public.has_role(auth.uid(), 'admin') -- Ou se for admin, vê tudo
  );
