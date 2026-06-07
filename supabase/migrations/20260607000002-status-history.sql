-- ============================================================
-- Histórico de status dos agendamentos + confirmação + check-in
-- ============================================================

-- Tabela de histórico de transições de status
CREATE TABLE IF NOT EXISTS public.appointment_status_history (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  from_status  text,
  to_status    text NOT NULL,
  changed_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes        text,
  changed_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view history of own appointments"
  ON public.appointment_status_history FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE a.id = appointment_status_history.appointment_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert status history"
  ON public.appointment_status_history FOR INSERT TO authenticated
  WITH CHECK (true);

-- Trigger que registra automaticamente toda mudança de status
CREATE OR REPLACE FUNCTION public.log_appointment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.appointment_status_history (
      appointment_id, from_status, to_status, changed_by
    ) VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_appointment_status_change ON public.appointments;
CREATE TRIGGER on_appointment_status_change
  AFTER UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.log_appointment_status_change();

-- REVOKE na nova função
REVOKE EXECUTE ON FUNCTION public.log_appointment_status_change() FROM PUBLIC;
