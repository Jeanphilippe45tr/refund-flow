
-- Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

-- Invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  admin_id UUID NOT NULL,
  company_name TEXT NOT NULL DEFAULT 'RefundPayPro',
  company_website TEXT DEFAULT 'refundpaypro.com',
  logo_url TEXT,
  signature_url TEXT,
  signatory_name TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_country TEXT,
  refund_amount NUMERIC NOT NULL DEFAULT 0,
  fees JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_fees NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'paid',
  notes TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto invoice number
CREATE OR REPLACE FUNCTION public.set_invoice_number()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := 'INV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_invoice_number BEFORE INSERT ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.set_invoice_number();

CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all invoices" ON public.invoices
  FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create invoices" ON public.invoices
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update invoices" ON public.invoices
  FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Super admins can delete invoices" ON public.invoices
  FOR DELETE USING (has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

-- Improve support_tickets
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS priority TEXT NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS assigned_admin_id UUID;

-- Allow admins to create tickets on behalf of users
DROP POLICY IF EXISTS "Admins can create tickets" ON public.support_tickets;
CREATE POLICY "Admins can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admin signatures
CREATE TABLE public.admin_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL UNIQUE,
  signature_url TEXT NOT NULL,
  signatory_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage own signature" ON public.admin_signatures
  FOR ALL USING (admin_id = auth.uid()) WITH CHECK (admin_id = auth.uid());
CREATE POLICY "Admins view all signatures" ON public.admin_signatures
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_admin_signatures_updated_at BEFORE UPDATE ON public.admin_signatures
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for signatures (public)
INSERT INTO storage.buckets (id, name, public) VALUES ('signatures', 'signatures', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view signatures" ON storage.objects
  FOR SELECT USING (bucket_id = 'signatures');
CREATE POLICY "Admins can upload signatures" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'signatures' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update own signatures" ON storage.objects
  FOR UPDATE USING (bucket_id = 'signatures' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete signatures" ON storage.objects
  FOR DELETE USING (bucket_id = 'signatures' AND has_role(auth.uid(), 'admin'));
