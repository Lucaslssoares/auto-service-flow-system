
-- Drop all existing policies first, then recreate them
-- This ensures we have a clean slate

-- Drop all existing policies for each table
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

-- Enable Row Level Security on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create or replace security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(public.get_current_user_role() = 'admin', false);
$$;

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- Customers table policies
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage customers" ON public.customers
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Vehicles table policies
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage vehicles" ON public.vehicles
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Employees table policies (only admins can access employee data)
CREATE POLICY "Admins can view employees" ON public.employees
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can manage employees" ON public.employees
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Services table policies
CREATE POLICY "Authenticated users can view services" ON public.services
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Appointments table policies
CREATE POLICY "Authenticated users can view appointments" ON public.appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage appointments" ON public.appointments
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Appointment services table policies
CREATE POLICY "Authenticated users can view appointment services" ON public.appointment_services
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage appointment services" ON public.appointment_services
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Service executions table policies
CREATE POLICY "Authenticated users can view service executions" ON public.service_executions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage service executions" ON public.service_executions
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Employee commissions table policies (only admins can access)
CREATE POLICY "Admins can view employee commissions" ON public.employee_commissions
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can manage employee commissions" ON public.employee_commissions
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Payment transactions table policies
CREATE POLICY "Authenticated users can view payment transactions" ON public.payment_transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage payment transactions" ON public.payment_transactions
  FOR ALL TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Update the profiles table to ensure role column is not nullable and has a default
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- Ensure all existing profiles have a role assigned
UPDATE public.profiles SET role = 'user' WHERE role IS NULL;
