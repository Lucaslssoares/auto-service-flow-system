
-- Garantir que o usuário solareslucas403@gmail.com tenha todos os papéis no sistema
WITH target_user AS (
  SELECT id FROM profiles WHERE email = 'solareslucas403@gmail.com'
)
INSERT INTO user_roles (user_id, role)
SELECT id, role_value
FROM target_user
CROSS JOIN (
  VALUES 
    ('admin'::app_role),
    ('manager'::app_role),
    ('employee'::app_role),
    ('user'::app_role)
) AS roles(role_value)
ON CONFLICT (user_id, role) DO NOTHING;
