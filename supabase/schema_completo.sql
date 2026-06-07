-- ============================================================
-- SCHEMA COMPLETO: auto-service-flow-system (lava car)
-- Restauração para novo projeto Supabase bciuykfoinbgkrsiljpg
-- Seção 1: Tabelas base (sem user_id — migration 2 adiciona)
-- ============================================================

-- Profiles (vinculado ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cpf text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Employees
CREATE TABLE IF NOT EXISTS public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  document text NOT NULL,
  role text NOT NULL,
  commission_type text NOT NULL,
  salary numeric NOT NULL DEFAULT 0,
  join_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration integer NOT NULL,
  commission_percentage numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  plate text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  color text NOT NULL,
  type text NOT NULL,
  year integer,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  date timestamptz NOT NULL,
  status text NOT NULL,
  total_price numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Appointment Services
CREATE TABLE IF NOT EXISTS public.appointment_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;

-- Service Executions
CREATE TABLE IF NOT EXISTS public.service_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  profit_percentage numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.service_executions ENABLE ROW LEVEL SECURITY;

-- Employee Commissions
CREATE TABLE IF NOT EXISTS public.employee_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_execution_id uuid REFERENCES public.service_executions(id) ON DELETE CASCADE,
  base_price numeric NOT NULL,
  commission_percentage numeric NOT NULL,
  profit_percentage numeric NOT NULL,
  commission_amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.employee_commissions ENABLE ROW LEVEL SECURITY;

-- Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text NOT NULL,
  status text NOT NULL,
  date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Seção 2: View
-- ============================================================

CREATE OR REPLACE VIEW public.employee_commission_summary AS
SELECT
  ec.id,
  ec.appointment_id,
  ec.employee_id,
  ec.service_id,
  ec.base_price,
  ec.commission_percentage,
  ec.profit_percentage,
  ec.commission_amount,
  ec.created_at,
  e.name AS employee_name,
  s.name AS service_name,
  c.name AS customer_name,
  a.date AS appointment_date
FROM public.employee_commissions ec
LEFT JOIN public.employees e ON e.id = ec.employee_id
LEFT JOIN public.services s ON s.id = ec.service_id
LEFT JOIN public.appointments a ON a.id = ec.appointment_id
LEFT JOIN public.customers c ON c.id = a.customer_id;

-- ============================================================
-- Seção 3: Funções base e trigger de signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.calculate_employee_commission(
  p_service_execution_id uuid,
  p_employee_id uuid,
  p_appointment_id uuid,
  p_service_id uuid,
  p_base_price numeric,
  p_commission_percentage numeric,
  p_profit_percentage numeric
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_commission_amount numeric;
BEGIN
  v_commission_amount := p_base_price * (p_profit_percentage / 100.0) * (p_commission_percentage / 100.0);
  INSERT INTO public.employee_commissions (
    service_execution_id, employee_id, appointment_id, service_id,
    base_price, commission_percentage, profit_percentage, commission_amount
  ) VALUES (
    p_service_execution_id, p_employee_id, p_appointment_id, p_service_id,
    p_base_price, p_commission_percentage, p_profit_percentage, v_commission_amount
  );
  RETURN v_commission_amount;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    CASE WHEN NEW.email = 'solareslucas403@gmail.com' THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Migration 1 (20250612235829): RLS policies + is_admin + get_current_user_role
-- ============================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can view employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can view appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Admins can manage appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Authenticated users can view service executions" ON public.service_executions;
DROP POLICY IF EXISTS "Admins can manage service executions" ON public.service_executions;
DROP POLICY IF EXISTS "Admins can view employee commissions" ON public.employee_commissions;
DROP POLICY IF EXISTS "Admins can manage employee commissions" ON public.employee_commissions;
DROP POLICY IF EXISTS "Authenticated users can view payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can manage payment transactions" ON public.payment_transactions;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(public.get_current_user_role() = 'admin', false);
$$;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

CREATE POLICY "Authenticated users can view customers" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage vehicles" ON public.vehicles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view employees" ON public.employees FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage employees" ON public.employees FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view appointments" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage appointments" ON public.appointments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view appointment services" ON public.appointment_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage appointment services" ON public.appointment_services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view service executions" ON public.service_executions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage service executions" ON public.service_executions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can view employee commissions" ON public.employee_commissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage employee commissions" ON public.employee_commissions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Authenticated users can view payment transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage payment transactions" ON public.payment_transactions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;

-- ============================================================
-- Migration 2 (20250615161201): ADD user_id para customers/vehicles/appointments
-- ============================================================

ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE public.customers ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.vehicles ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.appointments ALTER COLUMN user_id SET DEFAULT auth.uid();

UPDATE public.customers SET user_id = (SELECT id FROM public.profiles WHERE public.profiles.email = public.customers.email) WHERE user_id IS NULL;
UPDATE public.vehicles SET user_id = (SELECT c.user_id FROM public.customers c WHERE c.id = public.vehicles.customer_id) WHERE user_id IS NULL;
UPDATE public.appointments SET user_id = (SELECT c.user_id FROM public.customers c WHERE c.id = public.appointments.customer_id) WHERE user_id IS NULL;

ALTER TABLE public.customers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.vehicles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can manage customers" ON public.customers;
CREATE POLICY "User can view their customers" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can insert their customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can update their customers" ON public.customers FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can delete their customers" ON public.customers FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins can manage vehicles" ON public.vehicles;
CREATE POLICY "User can view their vehicles" ON public.vehicles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can insert their vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can update their vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can delete their vehicles" ON public.vehicles FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins can manage appointments" ON public.appointments;
CREATE POLICY "User can view their appointments" ON public.appointments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can insert their appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can update their appointments" ON public.appointments FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User can delete their appointments" ON public.appointments FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view appointment services" ON public.appointment_services;
DROP POLICY IF EXISTS "Admins can manage appointment services" ON public.appointment_services;
CREATE POLICY "User can view appointment services through owned appointment" ON public.appointment_services FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can insert appointment services through owned appointment" ON public.appointment_services FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can update appointment services through owned appointment" ON public.appointment_services FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can delete appointment services through owned appointment" ON public.appointment_services FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));

DROP POLICY IF EXISTS "Authenticated users can view services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "User can view services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can view service executions" ON public.service_executions;
DROP POLICY IF EXISTS "Admins can manage service executions" ON public.service_executions;
CREATE POLICY "User can view service executions through owned appointment" ON public.service_executions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can insert service executions through owned appointment" ON public.service_executions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can update service executions through owned appointment" ON public.service_executions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can delete service executions through owned appointment" ON public.service_executions FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));

DROP POLICY IF EXISTS "Authenticated users can view payment transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can manage payment transactions" ON public.payment_transactions;
CREATE POLICY "User can view payment transactions through owned appointment" ON public.payment_transactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = payment_transactions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can insert payment transactions through owned appointment" ON public.payment_transactions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = payment_transactions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can update payment transactions through owned appointment" ON public.payment_transactions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = payment_transactions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "User can delete payment transactions through owned appointment" ON public.payment_transactions FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments AS a WHERE a.id = payment_transactions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));

DROP POLICY IF EXISTS "Admins can view employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage employees" ON public.employees;
CREATE POLICY "Only admins can view employees" ON public.employees FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Only admins can manage employees" ON public.employees FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view employee commissions" ON public.employee_commissions;
DROP POLICY IF EXISTS "Admins can manage employee commissions" ON public.employee_commissions;
CREATE POLICY "Only admins can view employee commissions" ON public.employee_commissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Only admins can manage employee commissions" ON public.employee_commissions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- Migration 3 (20250615162727): user_settings
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  settings jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_settings ADD CONSTRAINT user_settings_user_id_unique UNIQUE(user_id);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own settings" ON public.user_settings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own settings" ON public.user_settings FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- Migration 4 (20250615165206): app_role enum + user_roles + has_role
-- ============================================================

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can grant themselves roles (temporário - depois restrinja)" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own roles" ON public.user_roles FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- ============================================================
-- Migration 5 (20250615170212): INSERT admin role (solareslucas403@gmail.com)
-- ============================================================

WITH target_user AS (SELECT id FROM profiles WHERE email = 'solareslucas403@gmail.com')
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM target_user
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================
-- Migration 6 (20250615171124): Fix user_roles SELECT policy
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Admins can view all user roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- Migration 7 (20250615212400): INSERT all 4 roles for solareslucas403@gmail.com
-- ============================================================

WITH target_user AS (SELECT id FROM profiles WHERE email = 'solareslucas403@gmail.com')
INSERT INTO user_roles (user_id, role)
SELECT id, role_value FROM target_user
CROSS JOIN (VALUES ('admin'::app_role), ('manager'::app_role), ('employee'::app_role), ('user'::app_role)) AS roles(role_value)
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================
-- Migration 8 (20250617113500): GRANT full access — same as migration 7
-- ============================================================

WITH target_user AS (SELECT id FROM profiles WHERE email = 'solareslucas403@gmail.com')
INSERT INTO user_roles (user_id, role)
SELECT id, role_value FROM target_user
CROSS JOIN (VALUES ('admin'::app_role), ('manager'::app_role), ('employee'::app_role), ('user'::app_role)) AS roles(role_value)
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================
-- Seção final: create_public_appointment (precisa do user_id existir)
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_public_appointment(
  customer_data jsonb,
  vehicle_data jsonb,
  appointment_data jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
  v_vehicle_id uuid;
  v_appointment_id uuid;
  v_service_id uuid;
  v_user_id uuid;
BEGIN
  v_user_id := COALESCE(auth.uid(), gen_random_uuid());

  SELECT id INTO v_customer_id FROM public.customers WHERE email = customer_data->>'email' LIMIT 1;
  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (name, email, phone, cpf, user_id)
    VALUES (
      customer_data->>'name',
      customer_data->>'email',
      customer_data->>'phone',
      COALESCE(customer_data->>'cpf', ''),
      v_user_id
    ) RETURNING id INTO v_customer_id;
  END IF;

  SELECT id INTO v_vehicle_id FROM public.vehicles WHERE UPPER(plate) = UPPER(vehicle_data->>'plate') LIMIT 1;
  IF v_vehicle_id IS NULL THEN
    INSERT INTO public.vehicles (customer_id, plate, brand, model, color, type, year, user_id)
    VALUES (
      v_customer_id,
      UPPER(vehicle_data->>'plate'),
      vehicle_data->>'brand',
      vehicle_data->>'model',
      vehicle_data->>'color',
      vehicle_data->>'type',
      CASE WHEN vehicle_data->>'year' IS NOT NULL THEN (vehicle_data->>'year')::integer ELSE NULL END,
      v_user_id
    ) RETURNING id INTO v_vehicle_id;
  END IF;

  INSERT INTO public.appointments (customer_id, vehicle_id, date, status, total_price, notes, user_id)
  VALUES (
    v_customer_id,
    v_vehicle_id,
    (appointment_data->>'date')::timestamptz,
    'pending',
    (appointment_data->>'totalPrice')::numeric,
    COALESCE(appointment_data->>'notes', ''),
    v_user_id
  ) RETURNING id INTO v_appointment_id;

  IF appointment_data->'services' IS NOT NULL THEN
    FOR v_service_id IN
      SELECT (jsonb_array_elements_text(appointment_data->'services'))::uuid
    LOOP
      INSERT INTO public.appointment_services (appointment_id, service_id)
      VALUES (v_appointment_id, v_service_id);
    END LOOP;
  END IF;

  RETURN v_appointment_id;
END;
$$;
