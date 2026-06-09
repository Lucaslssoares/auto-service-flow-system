
CREATE TABLE IF NOT EXISTS public.business_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  max_per_slot integer NOT NULL DEFAULT 3,
  slot_duration_minutes integer NOT NULL DEFAULT 60,
  working_start text NOT NULL DEFAULT '08:00',
  working_end text NOT NULL DEFAULT '18:00',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.business_config TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_config TO authenticated;
GRANT ALL ON public.business_config TO service_role;
INSERT INTO public.business_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
ALTER TABLE public.business_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read business_config" ON public.business_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update business_config" ON public.business_config FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.cash_registers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  opening_amount numeric(12,2) NOT NULL DEFAULT 0,
  closing_amount_expected numeric(12,2),
  closing_amount_actual numeric(12,2),
  difference numeric(12,2),
  notes text,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cash_registers TO authenticated;
GRANT ALL ON public.cash_registers TO service_role;
ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all registers" ON public.cash_registers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can manage own registers" ON public.cash_registers FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_register_id uuid NOT NULL REFERENCES public.cash_registers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('payment','sangria','suprimento')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_method text CHECK (payment_method IN ('cash','credit','debit','pix','other')),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cash_movements TO authenticated;
GRANT ALL ON public.cash_movements TO service_role;
ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all movements" ON public.cash_movements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Users can manage movements of own registers" ON public.cash_movements FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.cash_registers cr WHERE cr.id = cash_movements.cash_register_id AND cr.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.cash_registers cr WHERE cr.id = cash_movements.cash_register_id AND cr.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_cash_registers_user_status ON public.cash_registers (user_id, status);
CREATE INDEX IF NOT EXISTS idx_cash_movements_register ON public.cash_movements (cash_register_id, created_at);

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email IN ('solareslucas403@gmail.com', 'tibbb@belembioenergia.com.br');
