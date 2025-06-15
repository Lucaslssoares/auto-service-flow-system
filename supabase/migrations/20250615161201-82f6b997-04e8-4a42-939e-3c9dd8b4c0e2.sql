
-- Customers table: Each customer should be isolated by owner user_id, but current schema lacks it.
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id uuid;

-- Vehicles table: Add owner user_id for linking
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS user_id uuid;

-- Appointments table: Add user_id to link to owner
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS user_id uuid;

-- Ensure new columns are always set (default to auth.uid())
ALTER TABLE public.customers ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.vehicles ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.appointments ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Backfill user_id for existing data where possible (link using profiles)
UPDATE public.customers SET user_id = (SELECT id FROM public.profiles WHERE public.profiles.email = public.customers.email) WHERE user_id IS NULL;
UPDATE public.vehicles SET user_id = (SELECT c.user_id FROM public.customers c WHERE c.id = public.vehicles.customer_id) WHERE user_id IS NULL;
UPDATE public.appointments SET user_id = (SELECT c.user_id FROM public.customers c WHERE c.id = public.appointments.customer_id) WHERE user_id IS NULL;

-- Make user_id non-null
ALTER TABLE public.customers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.vehicles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN user_id SET NOT NULL;

-- Policy for customers: users can see only their own customers, admins can see all
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;

CREATE POLICY "User can view their customers" ON public.customers
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can insert their customers" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can update their customers" ON public.customers
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can delete their customers" ON public.customers
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Vehicles: ensure strict linking
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON public.vehicles;

CREATE POLICY "User can view their vehicles" ON public.vehicles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can insert their vehicles" ON public.vehicles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can update their vehicles" ON public.vehicles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can delete their vehicles" ON public.vehicles
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- Appointments: user data isolation
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;

CREATE POLICY "User can view their appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can insert their appointments" ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can update their appointments" ON public.appointments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "User can delete their appointments" ON public.appointments
  FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

-- appointment_services: link via appointment
DROP POLICY IF EXISTS "Authenticated users can view appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Admins can manage appointment services" ON public.appointment_services;

CREATE POLICY "User can view appointment services through owned appointment" ON public.appointment_services
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = appointment_services.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can insert appointment services through owned appointment" ON public.appointment_services
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = appointment_services.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can update appointment services through owned appointment" ON public.appointment_services
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = appointment_services.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can delete appointment services through owned appointment" ON public.appointment_services
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = appointment_services.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

-- services: all authenticated users can view, but only admins can manage
DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

CREATE POLICY "User can view services" ON public.services
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage services" ON public.services
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- service_executions: via appointment isolation
DROP POLICY IF EXISTS "Authenticated users can view service executions" ON public.service_executions;
DROP POLICY IF EXISTS "Admins can manage service executions" ON public.service_executions;

CREATE POLICY "User can view service executions through owned appointment" ON public.service_executions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = service_executions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can insert service executions through owned appointment" ON public.service_executions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = service_executions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can update service executions through owned appointment" ON public.service_executions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = service_executions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can delete service executions through owned appointment" ON public.service_executions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = service_executions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Payment transactions: isolated via appointment
DROP POLICY IF EXISTS "Authenticated users can view payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can manage payment transactions" ON public.payment_transactions;

CREATE POLICY "User can view payment transactions through owned appointment" ON public.payment_transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = payment_transactions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can insert payment transactions through owned appointment" ON public.payment_transactions
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = payment_transactions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can update payment transactions through owned appointment" ON public.payment_transactions
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = payment_transactions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "User can delete payment transactions through owned appointment" ON public.payment_transactions
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.appointments AS a
      WHERE a.id = payment_transactions.appointment_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

-- Employees: admins only (as already set)
DROP POLICY IF EXISTS "Admins can view employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage employees" ON public.employees;

CREATE POLICY "Only admins can view employees" ON public.employees
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can manage employees" ON public.employees
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- employee_commissions, employee_commission_summary: admins only (as before)
DROP POLICY IF EXISTS "Admins can view employee commissions" ON public.employee_commissions;
DROP POLICY IF EXISTS "Admins can manage employee commissions" ON public.employee_commissions;

CREATE POLICY "Only admins can view employee commissions" ON public.employee_commissions
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Only admins can manage employee commissions" ON public.employee_commissions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Done: strict user isolation for nearly all data; only admins can access full data
