export type AgencyStatus = 'active' | 'paused' | 'at_risk' | 'trial';
export type PlanTier = 'starter' | 'growth' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing';
export type InvoiceStatus = 'paid' | 'pending' | 'failed';
export type ModuleKey = 'crm' | 'automation' | 'appointments' | 'analytics' | 'landing_pages' | 'whatsapp_bot';
export type ServiceName = 'supabase' | 'google_apis' | 'whatsapp' | 'webhooks' | 'meta_ads';
export type ServiceStatus = 'healthy' | 'degraded' | 'down' | 'token_expired';
export type IbondaLeadStatus = 'new_lead' | 'demo_scheduled' | 'trial_active' | 'converted' | 'lost';
export type CampaignPlatform = 'meta' | 'google' | 'linkedin' | 'referral' | 'organic';

export interface Agency {
  id: string;
  name: string;
  city: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  status: AgencyStatus;
  plan: PlanTier;
  mrr: number;
  created_at: string;
  last_activity_at: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  agency_id: string;
  plan: PlanTier;
  price: number;
  currency: string;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;
  started_at: string;
  renewed_at?: string;
  ended_at?: string;
}

export interface AgencyModule {
  id: string;
  agency_id: string;
  module_key: ModuleKey;
  enabled: boolean;
  activated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  agency_id: string;
  agency_name: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_at: string;
  paid_at?: string;
  failure_reason?: string;
}

export interface UsageEvent {
  id: string;
  agency_id: string;
  event_type: 'lead_received' | 'appointment_booked' | 'automation_run' | 'webhook_triggered' | 'message_sent';
  module_key: ModuleKey;
  metadata: Record<string, any>;
  created_at: string;
}

export interface HealthCheck {
  id: string;
  agency_id?: string;
  agency_name?: string;
  service: ServiceName;
  status: ServiceStatus;
  checked_at: string;
  error?: string;
  response_time_ms?: number;
  metadata?: Record<string, any>;
}

export interface IbondaLead {
  id: string;
  contact_name: string;
  agency_name: string;
  phone: string;
  email: string;
  city: string;
  source_campaign: string;
  platform: CampaignPlatform;
  status: IbondaLeadStatus;
  deal_potential_mrr: number;
  converted_agency_id?: string;
  created_at: string;
  owner: string;
}

export interface MarketingSpend {
  id: string;
  campaign_name: string;
  platform: CampaignPlatform;
  amount: number;
  period: string; // YYYY-MM
  leads_generated: number;
  agencies_converted: number;
}

export interface AutomationSystem {
  id: string;
  agency_id: string;
  agency_name: string;
  name: string;
  type: 'instant_whatsapp' | 'google_calendar_sync' | 'lead_notification' | 'crm_stage_move';
  status: 'active' | 'paused' | 'error';
  last_run_at: string;
  total_runs: number;
  error_count: number;
  avg_duration_ms: number;
  last_error_message?: string;
}

export interface AuditLog {
  id: string;
  actor_name: string;
  actor_role: 'ibonda_admin';
  action: string;
  target_agency: string;
  details: string;
  created_at: string;
}

export interface PlatformKPIs {
  currentMRR: number;
  mrrChangePct: number;
  activeAgenciesCount: number;
  activeAgenciesChangePct: number;
  newAgenciesThisMonth: number;
  churnRate: number;
  totalLeadsThisMonth: number;
  totalLeadsToday: number;
  totalAppointmentsThisMonth: number;
  totalAppointmentsToday: number;
  activeAutomationsCount: number;
  failingAutomationsCount: number;
  arpu: number;
  nrr: number; // Net Revenue Retention
}
