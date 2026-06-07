CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  SET LOCAL row_security = off;

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

  IF NEW.email = 'solareslucas403@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES
      (NEW.id, 'admin'::public.app_role),
      (NEW.id, 'manager'::public.app_role),
      (NEW.id, 'employee'::public.app_role),
      (NEW.id, 'user'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
