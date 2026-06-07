
-- ============= TABLES =============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  cpf text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.employees (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  duration integer NOT NULL,
  commission_percentage numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  plate text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  color text NOT NULL,
  type text NOT NULL,
  year integer,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  date timestamptz NOT NULL,
  status text NOT NULL,
  total_price numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.appointment_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_services TO authenticated;
GRANT ALL ON public.appointment_services TO service_role;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.service_executions (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_executions TO authenticated;
GRANT ALL ON public.service_executions TO service_role;
ALTER TABLE public.service_executions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.employee_commissions (
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employee_commissions TO authenticated;
GRANT ALL ON public.employee_commissions TO service_role;
ALTER TABLE public.employee_commissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text NOT NULL,
  status text NOT NULL,
  date date NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  settings jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============= ENUM + user_roles =============
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'employee', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============= FUNCTIONS =============
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(public.has_role(auth.uid(), 'admin'), false);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email IN ('solareslucas403@gmail.com', 'solareslucas403@gmail.com') THEN 'admin' ELSE 'user' END
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email IN ('solareslucas403@gmail.com', 'solareslucas403@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'manager') ON CONFLICT DO NOTHING;
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'employee') ON CONFLICT DO NOTHING;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.calculate_employee_commission(
  p_service_execution_id uuid, p_employee_id uuid, p_appointment_id uuid,
  p_service_id uuid, p_base_price numeric, p_commission_percentage numeric, p_profit_percentage numeric
) RETURNS numeric LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_commission_amount numeric;
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

CREATE OR REPLACE FUNCTION public.create_public_appointment(
  customer_data jsonb, vehicle_data jsonb, appointment_data jsonb
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_customer_id uuid; v_vehicle_id uuid; v_appointment_id uuid; v_service_id uuid; v_user_id uuid;
BEGIN
  v_user_id := COALESCE(auth.uid(), gen_random_uuid());

  SELECT id INTO v_customer_id FROM public.customers WHERE email = customer_data->>'email' LIMIT 1;
  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (name, email, phone, cpf, user_id) VALUES (
      customer_data->>'name', customer_data->>'email', customer_data->>'phone',
      COALESCE(customer_data->>'cpf', ''), v_user_id
    ) RETURNING id INTO v_customer_id;
  END IF;

  SELECT id INTO v_vehicle_id FROM public.vehicles WHERE UPPER(plate) = UPPER(vehicle_data->>'plate') LIMIT 1;
  IF v_vehicle_id IS NULL THEN
    INSERT INTO public.vehicles (customer_id, plate, brand, model, color, type, year, user_id) VALUES (
      v_customer_id, UPPER(vehicle_data->>'plate'), vehicle_data->>'brand', vehicle_data->>'model',
      vehicle_data->>'color', vehicle_data->>'type',
      CASE WHEN vehicle_data->>'year' IS NOT NULL THEN (vehicle_data->>'year')::integer ELSE NULL END,
      v_user_id
    ) RETURNING id INTO v_vehicle_id;
  END IF;

  INSERT INTO public.appointments (customer_id, vehicle_id, date, status, total_price, notes, user_id) VALUES (
    v_customer_id, v_vehicle_id, (appointment_data->>'date')::timestamptz, 'pending',
    (appointment_data->>'totalPrice')::numeric, COALESCE(appointment_data->>'notes', ''), v_user_id
  ) RETURNING id INTO v_appointment_id;

  IF appointment_data->'services' IS NOT NULL THEN
    FOR v_service_id IN SELECT (jsonb_array_elements_text(appointment_data->'services'))::uuid LOOP
      INSERT INTO public.appointment_services (appointment_id, service_id) VALUES (v_appointment_id, v_service_id);
    END LOOP;
  END IF;

  RETURN v_appointment_id;
END;
$$;

-- ============= VIEW =============
CREATE OR REPLACE VIEW public.employee_commission_summary AS
SELECT ec.id, ec.appointment_id, ec.employee_id, ec.service_id, ec.base_price,
  ec.commission_percentage, ec.profit_percentage, ec.commission_amount, ec.created_at,
  e.name AS employee_name, s.name AS service_name, c.name AS customer_name, a.date AS appointment_date
FROM public.employee_commissions ec
LEFT JOIN public.employees e ON e.id = ec.employee_id
LEFT JOIN public.services s ON s.id = ec.service_id
LEFT JOIN public.appointments a ON a.id = ec.appointment_id
LEFT JOIN public.customers c ON c.id = a.customer_id;
GRANT SELECT ON public.employee_commission_summary TO authenticated;

-- ============= RLS POLICIES =============
-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- customers (per-user)
CREATE POLICY "User view their customers" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User insert their customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User update their customers" ON public.customers FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User delete their customers" ON public.customers FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- vehicles (per-user)
CREATE POLICY "User view their vehicles" ON public.vehicles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User insert their vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User update their vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User delete their vehicles" ON public.vehicles FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- appointments (per-user)
CREATE POLICY "User view their appointments" ON public.appointments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User insert their appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User update their appointments" ON public.appointments FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "User delete their appointments" ON public.appointments FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- appointment_services (through appointment)
CREATE POLICY "View appt services via owned appt" ON public.appointment_services FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Insert appt services via owned appt" ON public.appointment_services FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Update appt services via owned appt" ON public.appointment_services FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Delete appt services via owned appt" ON public.appointment_services FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_services.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));

-- services (all auth read, admin manage)
CREATE POLICY "Auth view services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- service_executions (through appointment)
CREATE POLICY "View svc exec via owned appt" ON public.service_executions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Insert svc exec via owned appt" ON public.service_executions FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Update svc exec via owned appt" ON public.service_executions FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));
CREATE POLICY "Delete svc exec via owned appt" ON public.service_executions FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = service_executions.appointment_id AND (a.user_id = auth.uid() OR public.is_admin())));

-- payment_transactions (admin/manager only — financial)
CREATE POLICY "Admin/mgr view payments" ON public.payment_transactions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Admin/mgr manage payments" ON public.payment_transactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- employees (admin only)
CREATE POLICY "Admins view employees" ON public.employees FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins manage employees" ON public.employees FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- employee_commissions (admin/manager only)
CREATE POLICY "Admin/mgr view commissions" ON public.employee_commissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));
CREATE POLICY "Admin/mgr manage commissions" ON public.employee_commissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'manager'));

-- user_settings
CREATE POLICY "User view own settings" ON public.user_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "User insert own settings" ON public.user_settings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "User update own settings" ON public.user_settings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "User delete own settings" ON public.user_settings FOR DELETE USING (user_id = auth.uid());

-- user_roles
CREATE POLICY "View own roles or admin" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
