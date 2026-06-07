-- ============================================================
-- Security Hardening: REVOKE EXECUTE em funções SECURITY DEFINER
-- Por padrão, PostgreSQL concede EXECUTE a PUBLIC (inclui anon).
-- Aqui restringimos cada função ao menor privilégio necessário.
-- ============================================================

-- handle_new_user: trigger interno — nenhum role externo precisa chamar
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- get_current_user_role: só usuários autenticados precisam
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;

-- is_admin: só usuários autenticados precisam
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- has_role: só usuários autenticados precisam
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- calculate_employee_commission: operação financeira — só autenticados
REVOKE EXECUTE ON FUNCTION public.calculate_employee_commission(uuid, uuid, uuid, uuid, numeric, numeric, numeric) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.calculate_employee_commission(uuid, uuid, uuid, uuid, numeric, numeric, numeric) TO authenticated;

-- create_public_appointment: formulário público de agendamento
-- anon precisa acessar (clientes sem login), mas controlamos via RLS internamente
REVOKE EXECUTE ON FUNCTION public.create_public_appointment(jsonb, jsonb, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.create_public_appointment(jsonb, jsonb, jsonb) TO anon, authenticated;
