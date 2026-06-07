-- ============================================================
-- Controle de capacidade: configuração de vagas por slot
-- ============================================================

CREATE TABLE IF NOT EXISTS public.business_config (
  id                    integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  max_per_slot          integer NOT NULL DEFAULT 3,
  slot_duration_minutes integer NOT NULL DEFAULT 60,
  working_start         text NOT NULL DEFAULT '08:00',
  working_end           text NOT NULL DEFAULT '18:00',
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Garante que existe exatamente uma linha
INSERT INTO public.business_config DEFAULT VALUES ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.business_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read business_config"
  ON public.business_config FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can update business_config"
  ON public.business_config FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
