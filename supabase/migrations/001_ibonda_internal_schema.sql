-- ====================================================================
-- IBONDA INTERNAL DASHBOARD - DATABASE SCHEMA MIGRATION (Supabase / Postgres)
-- Version: 1.0.0
-- Role Guard: ibonda_admin
-- ====================================================================

-- 1. AGENCIES (وكالات العقار المشتركة في منصة IBONDA)
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Casablanca',
  owner_name TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  owner_phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'at_risk', 'trial')) DEFAULT 'trial',
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'growth', 'enterprise')) DEFAULT 'starter',
  mrr NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agencies_status ON public.agencies(status);
CREATE INDEX IF NOT EXISTS idx_agencies_plan ON public.agencies(plan);
CREATE INDEX IF NOT EXISTS idx_agencies_last_activity ON public.agencies(last_activity_at);

-- 2. SUBSCRIPTIONS (الاشتراكات والدورات المالية للوكالات)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'growth', 'enterprise')),
  price NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')) DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  renewed_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_agency_id ON public.subscriptions(agency_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- 3. AGENCY MODULES (الموديولات والخصائص المفتوحة لكل وكالة)
CREATE TABLE IF NOT EXISTS public.agency_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL CHECK (module_key IN ('crm', 'automation', 'appointments', 'analytics', 'landing_pages', 'whatsapp_bot')),
  enabled BOOLEAN NOT NULL DEFAULT FALSE,
  activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_agency_module UNIQUE (agency_id, module_key)
);

CREATE INDEX IF NOT EXISTS idx_agency_modules_lookup ON public.agency_modules(agency_id, module_key, enabled);

-- 4. INVOICES (فواتير الاشتراكات الشهرية والسنوية لـ IBONDA)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'failed')) DEFAULT 'pending',
  failure_reason TEXT,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_invoices_agency_status ON public.invoices(agency_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_issued_at ON public.invoices(issued_at);

-- 5. USAGE EVENTS (أحداث التتبع التراكمي بدون كشف بيانات الزبناء الحساسة)
CREATE TABLE IF NOT EXISTS public.usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('lead_received', 'appointment_booked', 'automation_run', 'webhook_triggered', 'message_sent')),
  module_key TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_events_agency_event ON public.usage_events(agency_id, event_type);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON public.usage_events(created_at);

-- 6. HEALTH CHECKS (المراقبة التقنية للربط والخدمات السحابية)
CREATE TABLE IF NOT EXISTS public.health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  service TEXT NOT NULL CHECK (service IN ('supabase', 'google_apis', 'whatsapp', 'webhooks', 'meta_ads')),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down', 'token_expired')) DEFAULT 'healthy',
  response_time_ms INTEGER DEFAULT 45,
  error_message TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_checks_status ON public.health_checks(status);
CREATE INDEX IF NOT EXISTS idx_health_checks_service ON public.health_checks(service);

-- 7. IBONDA LEADS (ليدات ومسار تسويق منصة IBONDA نفسها)
CREATE TABLE IF NOT EXISTS public.ibonda_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_name TEXT NOT NULL,
  agency_name TEXT NOT NULL,
  city TEXT DEFAULT 'Casablanca',
  phone TEXT,
  email TEXT,
  source_campaign TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'linkedin', 'referral', 'organic')),
  status TEXT NOT NULL CHECK (status IN ('new_lead', 'demo_scheduled', 'trial_active', 'converted', 'lost')) DEFAULT 'new_lead',
  deal_potential_mrr NUMERIC(12, 2) DEFAULT 4000,
  converted_agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  owner TEXT NOT NULL DEFAULT 'Founder',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ibonda_leads_status ON public.ibonda_leads(status);
CREATE INDEX IF NOT EXISTS idx_ibonda_leads_platform ON public.ibonda_leads(platform);

-- 8. MARKETING SPEND (ميزانية حملات الإعلانات لـ IBONDA)
CREATE TABLE IF NOT EXISTS public.marketing_spend (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'linkedin', 'referral', 'organic')),
  amount NUMERIC(12, 2) NOT NULL,
  period TEXT NOT NULL, -- e.g. '2026-11'
  leads_generated INTEGER DEFAULT 0,
  agencies_converted INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AUDIT LOG (سجل التدقيق والتعديلات الإدارية لـ IBONDA Admin)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_name TEXT NOT NULL DEFAULT 'IBONDA Founder',
  actor_role TEXT NOT NULL DEFAULT 'ibonda_admin',
  action TEXT NOT NULL,
  target_agency TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Only users with claim/role 'ibonda_admin' can access internal dashboard
-- ====================================================================
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibonda_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access agencies" ON public.agencies
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'ibonda_admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'ibonda_admin');

CREATE POLICY "Admin full access subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'ibonda_admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'ibonda_admin');

CREATE POLICY "Admin full access usage_events" ON public.usage_events
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'ibonda_admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'ibonda_admin');

-- RPC helper for Client Portal & Automations to log events
CREATE OR REPLACE FUNCTION public.track_usage_event(
  p_agency_id UUID,
  p_event_type TEXT,
  p_module_key TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.usage_events (agency_id, event_type, module_key, metadata, created_at)
  VALUES (p_agency_id, p_event_type, p_module_key, p_metadata, NOW())
  RETURNING id INTO v_id;

  -- Update agency last activity
  UPDATE public.agencies
  SET last_activity_at = NOW()
  WHERE id = p_agency_id;

  RETURN v_id;
END;
$$;
