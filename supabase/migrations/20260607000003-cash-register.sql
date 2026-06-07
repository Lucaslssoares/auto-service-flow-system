-- ============================================================
-- Controle de Caixa: sessões de abertura/fechamento + movimentações
-- ============================================================

-- Sessões de caixa (abertura e fechamento por turno)
CREATE TABLE IF NOT EXISTS public.cash_registers (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status                    text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  opening_amount            numeric(12,2) NOT NULL DEFAULT 0,
  closing_amount_expected   numeric(12,2),
  closing_amount_actual     numeric(12,2),
  difference                numeric(12,2),
  notes                     text,
  opened_at                 timestamptz NOT NULL DEFAULT now(),
  closed_at                 timestamptz,
  created_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all registers"
  ON public.cash_registers FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can manage own registers"
  ON public.cash_registers FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Movimentações de caixa (entradas, sangrias, suprimentos)
CREATE TABLE IF NOT EXISTS public.cash_movements (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cash_register_id  uuid NOT NULL REFERENCES public.cash_registers(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type              text NOT NULL CHECK (type IN ('payment', 'sangria', 'suprimento')),
  amount            numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_method    text CHECK (payment_method IN ('cash', 'credit', 'debit', 'pix', 'other')),
  appointment_id    uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  description       text,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cash_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all movements"
  ON public.cash_movements FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Users can manage movements of own registers"
  ON public.cash_movements FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cash_registers cr
      WHERE cr.id = cash_movements.cash_register_id
        AND cr.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cash_registers cr
      WHERE cr.id = cash_movements.cash_register_id
        AND cr.user_id = auth.uid()
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_cash_registers_user_status ON public.cash_registers (user_id, status);
CREATE INDEX IF NOT EXISTS idx_cash_movements_register ON public.cash_movements (cash_register_id, created_at);
