
-- 1. Achar o id do usuário pelo email na tabela profiles
-- 2. Inserir a role "admin" na tabela user_roles para esse usuário (ignora se já existe)

WITH target_user AS (
  SELECT id FROM profiles WHERE email = 'solareslucas403@gmail.com'
)
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM target_user
ON CONFLICT (user_id, role) DO NOTHING;
