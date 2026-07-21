
CREATE OR REPLACE FUNCTION public.gen_numeric(len int)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.gen_iban()
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN 'GB' || public.gen_numeric(2) || ' RPAY ' || public.gen_numeric(4) || ' ' || public.gen_numeric(4) || ' ' || public.gen_numeric(6);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.gen_numeric(int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.gen_iban() FROM PUBLIC, anon, authenticated;
