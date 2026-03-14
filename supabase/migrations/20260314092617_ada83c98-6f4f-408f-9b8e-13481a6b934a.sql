
-- Document verifications table
CREATE TABLE public.document_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_type text NOT NULL DEFAULT 'receipt',
  file_url text NOT NULL,
  file_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.document_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can upload own documents" ON public.document_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own documents" ON public.document_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents" ON public.document_verifications FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update documents" ON public.document_verifications FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_document_verifications_updated_at BEFORE UPDATE ON public.document_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- OTP codes table
CREATE TABLE public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can verify own OTP" ON public.otp_codes FOR SELECT USING (auth.uid() = user_id);

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can view all documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND has_role(auth.uid(), 'admin'));
