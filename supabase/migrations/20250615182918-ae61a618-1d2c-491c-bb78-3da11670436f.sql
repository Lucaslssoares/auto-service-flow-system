
-- Permite que apenas administradores possam visualizar todos os perfis
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin visualiza perfis" 
  ON profiles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permite que apenas admin modifique perfis
CREATE POLICY "Apenas admin edita perfis"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permite que admin insira perfis (opcional, normalmente só o trigger faz isso)
CREATE POLICY "Apenas admin insere perfis"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Permite que apenas admin exclua perfis
CREATE POLICY "Apenas admin exclui perfis"
  ON profiles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Permitir manipulação da tabela user_roles apenas para admin
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin manipula papéis"
  ON user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
