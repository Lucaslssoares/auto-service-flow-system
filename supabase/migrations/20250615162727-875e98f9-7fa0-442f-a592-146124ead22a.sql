
-- Create the user_settings table
CREATE TABLE public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  settings jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a unique constraint so a user only has one row
ALTER TABLE public.user_settings
ADD CONSTRAINT user_settings_user_id_unique UNIQUE(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policy: users can select their own settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: users can insert their own settings (on first use)
CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy: users can update their own settings
CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (user_id = auth.uid());

-- Policy: users can delete their own settings
CREATE POLICY "Users can delete their own settings"
  ON public.user_settings
  FOR DELETE
  USING (user_id = auth.uid());
