-- IBONDA: secure Super Admin access bootstrap
-- Apply after 001_ibonda_internal_schema.sql.
-- Add the intended Auth user to public.platform_admins to grant platform access.

CREATE TABLE IF NOT EXISTS public.platform_admins (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins can read their own admin record" ON public.platform_admins;
CREATE POLICY "Platform admins can read their own admin record"
  ON public.platform_admins
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.platform_admins
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;

-- Replace the earlier JWT-claim-only policies with a database-backed admin check.
DROP POLICY IF EXISTS "Admin full access agencies" ON public.agencies;
DROP POLICY IF EXISTS "Admin full access subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Admin full access usage_events" ON public.usage_events;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'agencies',
    'subscriptions',
    'agency_modules',
    'invoices',
    'usage_events',
    'health_checks',
    'ibonda_leads',
    'marketing_spend',
    'audit_logs'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Platform admin full access" ON public.%I', tbl);
    EXECUTE format(
      'CREATE POLICY "Platform admin full access" ON public.%I FOR ALL TO authenticated USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin())',
      tbl
    );
  END LOOP;
END;
$$;
