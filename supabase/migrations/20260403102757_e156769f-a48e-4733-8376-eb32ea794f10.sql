
-- Add created_by_admin column to profiles to track which admin created the client
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_by_admin uuid;

-- Create table to store client credentials (so super admin can see passwords)
CREATE TABLE public.client_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  plain_password text NOT NULL,
  created_by_admin uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.client_credentials ENABLE ROW LEVEL SECURITY;

-- Only super_admin can view client credentials
CREATE POLICY "Super admins can view credentials"
  ON public.client_credentials FOR SELECT
  USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Admins can view their own created client credentials
CREATE POLICY "Admins can view own client credentials"
  ON public.client_credentials FOR SELECT
  USING (created_by_admin = auth.uid());

-- No insert/update/delete from client side - only edge function with service role
