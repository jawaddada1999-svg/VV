export type Currency = 'MAD' | 'EUR' | 'USD';
export type Language = 'fr' | 'en' | 'ar';

export type LeadStage =
  | 'new'
  | 'qualified'
  | 'meeting_scheduled'
  | 'meeting_held'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  agencyName: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: LeadStage;
  dealValue: number; // Value in base currency
  adSource: string;
  createdAt: string;
  meetingDate?: string;
  meetingOutcome?: 'pending' | 'showed' | 'no_show' | 'rescheduled';
  notes: string;
  qualificationCriteria: {
    hasBudget: boolean;
    activeAgentsCount: number;
    wantsExclusiveMandates: boolean;
  };
  lostReason?: string;
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused';
  platform: 'Facebook' | 'Instagram' | 'Meta Combined';
  spend: number;
  impressions: number;
  clicks: number;
  leads: number;
  meetingsBooked: number;
  meetingsHeld: number;
  clientsClosed: number;
  revenue: number;
  startDate: string;
}

export interface FunnelStageData {
  id: string;
  name: string;
  count: number;
  previousCount: number;
  conversionRate: number; // percentage (0 - 100)
  benchmarkRate: number; // industry standard percentage
  unitCost: number; // e.g. Cost per click, cost per lead, cost per meeting
  dropOffRate: number; // percentage lost
}

export interface DiagnosticAlert {
  id: string;
  stageKey: string;
  stageName: string;
  severity: 'critical' | 'warning' | 'healthy';
  metric: string;
  currentRate: number;
  benchmarkRate: number;
  problemSummary: string;
  impactExplanation: string;
  actionRecommendation: string;
  actionItems: string[];
}

export interface BudgetSimulationInput {
  targetRevenue?: number;
  targetClients?: number;
  averageDealValue: number;
  simulatedBudget?: number;
}

export interface IntegrationSettings {
  metaAdAccountId: string;
  metaAccessToken: string;
  metaPixelId: string;
  landingPageUrl: string;
  calendlyWebhookSecret: string;
  isLiveConnected: boolean;
  lastSyncTimestamp?: string;
}
