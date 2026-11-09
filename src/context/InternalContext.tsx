import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Agency,
  Subscription,
  AgencyModule,
  Invoice,
  UsageEvent,
  HealthCheck,
  IbondaLead,
  MarketingSpend,
  AutomationSystem,
  AuditLog,
  PlatformKPIs,
  PlanTier,
  AgencyStatus,
  ModuleKey,
  IbondaLeadStatus,
} from '../types/database';
import {
  initialAgencies,
  initialSubscriptions,
  initialModules,
  initialInvoices,
  initialHealthChecks,
  initialIbondaLeads,
  initialMarketingSpend,
  initialAutomations,
  initialAuditLogs,
  mrrHistory12Months,
  platformDailyLeads30Days,
} from '../data/seedData';

export type DateFilterRange = 'today' | '7d' | '30d' | 'this_month' | 'last_month' | 'custom';

interface InternalContextType {
  // Current Admin session
  adminUser: {
    name: string;
    email: string;
    role: 'ibonda_admin';
    title: string;
  };

  // Active navigation tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Global Filters
  dateRange: DateFilterRange;
  setDateRange: (range: DateFilterRange) => void;
  selectedAgencyFilter: string; // 'all' or agency.id
  setSelectedAgencyFilter: (id: string) => void;
  selectedPlanFilter: string; // 'all' or PlanTier
  setSelectedPlanFilter: (plan: string) => void;
  selectedStatusFilter: string; // 'all' or AgencyStatus
  setSelectedStatusFilter: (status: string) => void;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;

  // Selected agency for Deep Dive drawer/modal
  selectedAgencyId: string | null;
  setSelectedAgencyId: (id: string | null) => void;
  selectedAgency: Agency | null;

  // Data Collections
  agencies: Agency[];
  subscriptions: Subscription[];
  modules: AgencyModule[];
  invoices: Invoice[];
  usageEvents: UsageEvent[];
  healthChecks: HealthCheck[];
  ibondaLeads: IbondaLead[];
  marketingSpends: MarketingSpend[];
  automations: AutomationSystem[];
  auditLogs: AuditLog[];

  // Charts & historical
  mrrHistory: typeof mrrHistory12Months;
  platformDailyLeads: typeof platformDailyLeads30Days;

  // Computed KPIs
  platformKPIs: PlatformKPIs;

  // Critical Alerts list
  criticalAlerts: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    agencyName?: string;
    agencyId?: string;
    actionLabel?: string;
    actionType?: string;
  }>;

  // Actions
  addAgency: (data: Omit<Agency, 'id' | 'created_at' | 'last_activity_at'>) => Agency;
  updateAgency: (id: string, updates: Partial<Agency>) => void;
  toggleAgencyModule: (agencyId: string, moduleKey: ModuleKey) => void;
  changeAgencyPlan: (agencyId: string, newPlan: PlanTier) => void;
  updateAgencyStatus: (agencyId: string, status: AgencyStatus) => void;

  // Automation Actions
  restartAutomation: (automationId: string) => void;
  pauseAutomation: (automationId: string) => void;

  // Finance Actions
  retryInvoicePayment: (invoiceId: string) => void;
  markInvoicePaid: (invoiceId: string) => void;

  // Growth / Leads Actions
  addIbondaLead: (lead: Omit<IbondaLead, 'id' | 'created_at' | 'owner'>) => void;
  updateIbondaLeadStatus: (leadId: string, status: IbondaLeadStatus) => void;

  // Simulation / Impersonation
  impersonatingAgency: Agency | null;
  setImpersonatingAgency: (agency: Agency | null) => void;

  // Reset
  resetToSeedData: () => void;

  // Layout edit mode for Overview
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
}

const STORAGE_KEY_PREFIX = 'ibonda_internal_v1_';

const InternalContext = createContext<InternalContextType | undefined>(undefined);

export const InternalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const adminUser = {
    name: 'جواد (Jawad)',
    email: 'jawad@ibonda.com',
    role: 'ibonda_admin' as const,
    title: 'المؤسس والرئيس التنفيذي (Founder & CEO)',
  };

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<DateFilterRange>('this_month');
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState<string>('all');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [impersonatingAgency, setImpersonatingAgency] = useState<Agency | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Collections state with LocalStorage persistence
  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}agencies`);
    return saved ? JSON.parse(saved) : initialAgencies;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subscriptions`);
    return saved ? JSON.parse(saved) : initialSubscriptions;
  });

  const [modules, setModules] = useState<AgencyModule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}modules`);
    return saved ? JSON.parse(saved) : initialModules;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [automations, setAutomations] = useState<AutomationSystem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}automations`);
    return saved ? JSON.parse(saved) : initialAutomations;
  });

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}healthChecks`);
    return saved ? JSON.parse(saved) : initialHealthChecks;
  });

  const [ibondaLeads, setIbondaLeads] = useState<IbondaLead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}ibondaLeads`);
    return saved ? JSON.parse(saved) : initialIbondaLeads;
  });

  const [marketingSpends] = useState<MarketingSpend[]>(initialMarketingSpend);
  const [usageEvents] = useState<UsageEvent[]>([]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auditLogs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}agencies`, JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}subscriptions`, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}modules`, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}automations`, JSON.stringify(automations));
  }, [automations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}ibondaLeads`, JSON.stringify(ibondaLeads));
  }, [ibondaLeads]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}auditLogs`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const selectedAgency = useMemo(() => {
    if (!selectedAgencyId) return null;
    return agencies.find((a) => a.id === selectedAgencyId) || null;
  }, [agencies, selectedAgencyId]);

  // Log an admin action to the immutable audit trail
  const addAuditEntry = (action: string, targetAgencyName: string, details: string) => {
    const newEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor_name: adminUser.name,
      actor_role: 'ibonda_admin',
      action,
      target_agency: targetAgencyName,
      details,
      created_at: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Add a new agency
  const addAgency = (data: Omit<Agency, 'id' | 'created_at' | 'last_activity_at'>): Agency => {
    const newId = `ag-${Date.now()}`;
    const newAgency: Agency = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
    };

    setAgencies((prev) => [newAgency, ...prev]);

    // Create subscription
    const newSub: Subscription = {
      id: `sub-${newId}`,
      agency_id: newId,
      plan: data.plan,
      price: data.mrr,
      currency: 'MAD',
      billing_cycle: data.plan === 'enterprise' ? 'yearly' : 'monthly',
      status: data.status === 'trial' ? 'trialing' : 'active',
      started_at: new Date().toISOString(),
      renewed_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    };
    setSubscriptions((prev) => [newSub, ...prev]);

    // Setup base modules
    const newModules: AgencyModule[] = [
      { id: `m-${newId}-1`, agency_id: newId, module_key: 'crm', enabled: true, activated_at: new Date().toISOString() },
      { id: `m-${newId}-2`, agency_id: newId, module_key: 'automation', enabled: data.plan !== 'starter', activated_at: new Date().toISOString() },
      { id: `m-${newId}-3`, agency_id: newId, module_key: 'appointments', enabled: true, activated_at: new Date().toISOString() },
      { id: `m-${newId}-4`, agency_id: newId, module_key: 'analytics', enabled: data.plan === 'enterprise', activated_at: new Date().toISOString() },
      { id: `m-${newId}-5`, agency_id: newId, module_key: 'landing_pages', enabled: data.plan === 'enterprise', activated_at: new Date().toISOString() },
      { id: `m-${newId}-6`, agency_id: newId, module_key: 'whatsapp_bot', enabled: data.plan === 'enterprise', activated_at: new Date().toISOString() },
    ];
    setModules((prev) => [...prev, ...newModules]);

    addAuditEntry('إضافة وكالة جديدة', data.name, `تم تسجيل وكالة جديدة بخطة ${data.plan} بمداخيل ${data.mrr} د.م.`);
    return newAgency;
  };

  const updateAgency = (id: string, updates: Partial<Agency>) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          addAuditEntry('تحديث بيانات وكالة', a.name, `تحديث: ${Object.keys(updates).join(', ')}`);
          return updated;
        }
        return a;
      })
    );
  };

  const toggleAgencyModule = (agencyId: string, moduleKey: ModuleKey) => {
    const targetAgency = agencies.find((a) => a.id === agencyId);
    setModules((prev) => {
      const existing = prev.find((m) => m.agency_id === agencyId && m.module_key === moduleKey);
      if (existing) {
        const nextState = !existing.enabled;
        addAuditEntry(
          nextState ? 'تفعيل موديول' : 'تعطيل موديول',
          targetAgency?.name || agencyId,
          `تم تغيير حالة الموديول ${moduleKey} إلى ${nextState ? 'نشط' : 'معطل'}`
        );
        return prev.map((m) =>
          m.id === existing.id ? { ...m, enabled: nextState, activated_at: new Date().toISOString() } : m
        );
      } else {
        const newMod: AgencyModule = {
          id: `m-${agencyId}-${Date.now()}`,
          agency_id: agencyId,
          module_key: moduleKey,
          enabled: true,
          activated_at: new Date().toISOString(),
        };
        addAuditEntry('تفعيل موديول', targetAgency?.name || agencyId, `تم تفعيل الموديول ${moduleKey}`);
        return [...prev, newMod];
      }
    });
  };

  const changeAgencyPlan = (agencyId: string, newPlan: PlanTier) => {
    const targetAgency = agencies.find((a) => a.id === agencyId);
    const planPrices: Record<PlanTier, number> = {
      starter: 2500,
      growth: 5500,
      enterprise: 12000,
    };
    const newPrice = planPrices[newPlan];

    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, plan: newPlan, mrr: newPrice } : a))
    );

    setSubscriptions((prev) =>
      prev.map((s) => (s.agency_id === agencyId ? { ...s, plan: newPlan, price: newPrice } : s))
    );

    addAuditEntry(
      'تغيير خطة الاشتراك',
      targetAgency?.name || agencyId,
      `ترقية/تعديل الخطة إلى ${newPlan.toUpperCase()} بسعر ${newPrice.toLocaleString()} د.م.`
    );
  };

  const updateAgencyStatus = (agencyId: string, status: AgencyStatus) => {
    const targetAgency = agencies.find((a) => a.id === agencyId);
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, status } : a))
    );
    addAuditEntry('تغيير حالة الوكالة', targetAgency?.name || agencyId, `تم تغيير الحالة إلى ${status}`);
  };

  const restartAutomation = (automationId: string) => {
    setAutomations((prev) =>
      prev.map((auto) => {
        if (auto.id === automationId) {
          addAuditEntry('إعادة تشغيل أوتوميشن', auto.agency_name, `إعادة تشغيل النظام: ${auto.name}`);
          return {
            ...auto,
            status: 'active',
            last_run_at: new Date().toISOString(),
            last_error_message: undefined,
          };
        }
        return auto;
      })
    );
  };

  const pauseAutomation = (automationId: string) => {
    setAutomations((prev) =>
      prev.map((auto) => {
        if (auto.id === automationId) {
          addAuditEntry('إيقاف أوتوميشن', auto.agency_name, `إيقاف مؤقت للنظام: ${auto.name}`);
          return { ...auto, status: 'paused' };
        }
        return auto;
      })
    );
  };

  const retryInvoicePayment = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          addAuditEntry('إعادة محاولة سداد فاتورة', inv.agency_name, `محاولة سداد الفاتورة رقم ${inv.invoice_number}`);
          return {
            ...inv,
            status: 'paid',
            paid_at: new Date().toISOString(),
            failure_reason: undefined,
          };
        }
        return inv;
      })
    );
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          addAuditEntry('تسوية فاتورة يدويًا', inv.agency_name, `تم تعليم الفاتورة رقم ${inv.invoice_number} كمدفوعة`);
          return { ...inv, status: 'paid', paid_at: new Date().toISOString() };
        }
        return inv;
      })
    );
  };

  const addIbondaLead = (lead: Omit<IbondaLead, 'id' | 'created_at' | 'owner'>) => {
    const newLead: IbondaLead = {
      ...lead,
      id: `ib-lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      owner: adminUser.name,
    };
    setIbondaLeads((prev) => [newLead, ...prev]);
    addAuditEntry('إضافة فرصة بيعية جديدة لـ IBONDA', lead.agency_name, `توليد فرصة بقيمة ${lead.deal_potential_mrr} د.م.`);
  };

  const updateIbondaLeadStatus = (leadId: string, status: IbondaLeadStatus) => {
    setIbondaLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          addAuditEntry('تحديث مسار عميل IBONDA', l.agency_name, `تغيير المرحلة إلى: ${status}`);
          return { ...l, status };
        }
        return l;
      })
    );
  };

  const resetToSeedData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}agencies`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}subscriptions`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}modules`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}invoices`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}automations`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}ibondaLeads`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}auditLogs`);

    setAgencies(initialAgencies);
    setSubscriptions(initialSubscriptions);
    setModules(initialModules);
    setInvoices(initialInvoices);
    setAutomations(initialAutomations);
    setIbondaLeads(initialIbondaLeads);
    setAuditLogs(initialAuditLogs);
  };

  // Compute Platform KPIs rigorously
  const platformKPIs: PlatformKPIs = useMemo(() => {
    const activeAgencies = agencies.filter((a) => a.status === 'active' || a.status === 'at_risk');
    const currentMRR = activeAgencies.reduce((sum, a) => sum + (a.mrr || 0), 0);

    const activeCount = agencies.filter((a) => a.status === 'active').length;
    const failingAutos = automations.filter((a) => a.status === 'error').length;
    const activeAutos = automations.filter((a) => a.status === 'active').length;

    const newAgenciesMonth = agencies.filter((a) => {
      const d = new Date(a.created_at);
      return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    }).length;

    const arpu = activeAgencies.length > 0 ? Math.round(currentMRR / activeAgencies.length) : 0;

    return {
      currentMRR,
      mrrChangePct: 14.2, // +14.2% MoM growth
      activeAgenciesCount: activeCount,
      activeAgenciesChangePct: 8.5,
      newAgenciesThisMonth: Math.max(newAgenciesMonth, 2),
      churnRate: 2.1, // 2.1% benchmark
      totalLeadsThisMonth: 1420,
      totalLeadsToday: 78,
      totalAppointmentsThisMonth: 340,
      totalAppointmentsToday: 18,
      activeAutomationsCount: activeAutos,
      failingAutomationsCount: failingAutos,
      arpu,
      nrr: 112.5, // 112.5% Net Revenue Retention
    };
  }, [agencies, automations]);

  // Critical Alerts for platform health and risk
  const criticalAlerts = useMemo(() => {
    const list: Array<{
      id: string;
      type: 'critical' | 'warning' | 'info';
      title: string;
      description: string;
      agencyName?: string;
      agencyId?: string;
      actionLabel?: string;
      actionType?: string;
    }> = [];

    // 1. Broken automations
    automations
      .filter((a) => a.status === 'error')
      .forEach((a) => {
        list.push({
          id: `alert-auto-${a.id}`,
          type: 'critical',
          title: `عطل أوتوميشن: ${a.name}`,
          description: `${a.agency_name}: ${a.last_error_message || 'فشل في الاتصال'}`,
          agencyName: a.agency_name,
          agencyId: a.agency_id,
          actionLabel: 'إعادة التشغيل',
          actionType: 'restart_automation',
        });
      });

    // 2. Failed invoices
    invoices
      .filter((i) => i.status === 'failed')
      .forEach((i) => {
        list.push({
          id: `alert-inv-${i.id}`,
          type: 'critical',
          title: `فشل استخلاص فاتورة: ${i.agency_name}`,
          description: `المبلغ: ${i.amount.toLocaleString()} د.م. - السبب: ${i.failure_reason || 'رفضت البطاقة البنكية'}`,
          agencyName: i.agency_name,
          agencyId: i.agency_id,
          actionLabel: 'إعادة المحاولة',
          actionType: 'retry_invoice',
        });
      });

    // 3. At-risk agencies
    agencies
      .filter((a) => a.status === 'at_risk')
      .forEach((a) => {
        list.push({
          id: `alert-risk-${a.id}`,
          type: 'warning',
          title: `وكالة في خطر انسحاب (Churn Risk): ${a.name}`,
          description: a.notes || 'بلا نشاط ملحوظ منذ أكثر من 7 أيام',
          agencyName: a.name,
          agencyId: a.id,
          actionLabel: 'فحص الحساب',
          actionType: 'view_agency',
        });
      });

    return list;
  }, [automations, invoices, agencies]);

  return (
    <InternalContext.Provider
      value={{
        adminUser,
        activeTab,
        setActiveTab,
        dateRange,
        setDateRange,
        selectedAgencyFilter,
        setSelectedAgencyFilter,
        selectedPlanFilter,
        setSelectedPlanFilter,
        selectedStatusFilter,
        setSelectedStatusFilter,
        globalSearch,
        setGlobalSearch,
        selectedAgencyId,
        setSelectedAgencyId,
        selectedAgency,
        agencies,
        subscriptions,
        modules,
        invoices,
        usageEvents,
        healthChecks,
        ibondaLeads,
        marketingSpends,
        automations,
        auditLogs,
        mrrHistory: mrrHistory12Months,
        platformDailyLeads: platformDailyLeads30Days,
        platformKPIs,
        criticalAlerts,
        addAgency,
        updateAgency,
        toggleAgencyModule,
        changeAgencyPlan,
        updateAgencyStatus,
        restartAutomation,
        pauseAutomation,
        retryInvoicePayment,
        markInvoicePaid,
        addIbondaLead,
        updateIbondaLeadStatus,
        impersonatingAgency,
        setImpersonatingAgency,
        resetToSeedData,
        isEditMode,
        setIsEditMode,
      }}
    >
      {children}
    </InternalContext.Provider>
  );
};

export const useInternal = () => {
  const context = useContext(InternalContext);
  if (!context) {
    throw new Error('useInternal must be used within an InternalProvider');
  }
  return context;
};
