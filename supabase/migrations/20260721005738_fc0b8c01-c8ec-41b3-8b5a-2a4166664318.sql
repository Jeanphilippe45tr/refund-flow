
-- Add bank fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS iban text UNIQUE,
  ADD COLUMN IF NOT EXISTS swift_bic text,
  ADD COLUMN IF NOT EXISTS sort_code text,
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS account_type text DEFAULT 'checking';

-- Helper: generate a random numeric string
CREATE OR REPLACE FUNCTION public.gen_numeric(len int)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  result text := '';
  i int;
BEGIN
  FOR i IN 1..len LOOP
    result := result || floor(random()*10)::int::text;
  END LOOP;
  RETURN result;
END;
$$;

-- Helper: generate IBAN-like string (GB + 2 check + 4 bank + 14 account)
CREATE OR REPLACE FUNCTION public.gen_iban()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'GB' || public.gen_numeric(2) || ' RPAY ' || public.gen_numeric(4) || ' ' || public.gen_numeric(4) || ' ' || public.gen_numeric(6);
END;
$$;

-- Backfill existing profiles
UPDATE public.profiles
SET
  account_number = COALESCE(account_number, public.gen_numeric(10)),
  iban = COALESCE(iban, public.gen_iban()),
  swift_bic = COALESCE(swift_bic, 'RPAYGB2L'),
  sort_code = COALESCE(sort_code, public.gen_numeric(2) || '-' || public.gen_numeric(2) || '-' || public.gen_numeric(2)),
  bank_name = COALESCE(bank_name, 'RefundPay Bank'),
  account_type = COALESCE(account_type, 'checking')
WHERE account_number IS NULL OR iban IS NULL;

-- Update handle_new_user trigger to generate bank details for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, account_number, iban, swift_bic, sort_code, bank_name, account_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    public.gen_numeric(10),
    public.gen_iban(),
    'RPAYGB2L',
    public.gen_numeric(2) || '-' || public.gen_numeric(2) || '-' || public.gen_numeric(2),
    'RefundPay Bank',
    'checking'
  );
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$;
