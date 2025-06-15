
-- 1. Crie uma enumeração com os tipos de usuário permitidos
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee', 'user');

-- 2. Crie a tabela de papéis de usuários
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role)
);

-- 3. Adicione FK para garantir integridade (mas não use ON DELETE CASCADE devido à limitação do Supabase)
-- A referência é lógica; evite FK direta em auth.users!
-- (Se sua tabela de usuários for 'profiles', use: REFERENCES public.profiles(id))
-- Senão deixe como está, pois apenas UUID é usado para ligação!

-- 4. Habilite RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de RLS
-- Usuário só pode ver os próprios papéis
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário só pode inserir papel para si mesmo (admin poderá escalar isso depois)
CREATE POLICY "Users can grant themselves roles (temporário - depois restrinja)"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário só pode deletar seu próprio papel
CREATE POLICY "Users can delete their own roles"
  ON public.user_roles
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Função para checar se o usuário tem um papel específico (evita problemas de recursão nas policies!)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;
