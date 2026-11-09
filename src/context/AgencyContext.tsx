import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  PackageTier,
  ClientStage,
  PackageConfig,
  AgencyClient,
  MeetingItem,
  AdCampaignMetric,
  MaintenanceInvoice,
  MaintenanceTicket,
  AgencyMetricsSummary,
  AutomationWorkflowType,
  AgencyTask,
} from '../types/agency';
import {
  initialPackages,
  initialClients,
  initialMeetings,
  initialCampaigns,
  initialInvoices,
  initialTickets,
  initialTasks,
} from '../data/agencyData';

interface AgencyContextType {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Language & Internationalization
  language: 'ar' | 'fr' | 'en';
  setLanguage: (lang: 'ar' | 'fr' | 'en') => void;
  direction: 'rtl' | 'ltr';

  // Data Collections
  packages: PackageConfig[];
  clients: AgencyClient[];
  meetings: MeetingItem[];
  campaigns: AdCampaignMetric[];
  invoices: MaintenanceInvoice[];
  tickets: MaintenanceTicket[];
  tasks: AgencyTask[];

  // Global Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dateFilter: string;
  setDateFilter: (d: string) => void;
  stageFilter: string;
  setStageFilter: (s: string) => void;
  packageFilter: string;
  setPackageFilter: (p: string) => void;

  // Selected Client Deep-Dive Drawer
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  selectedClient: AgencyClient | null;

  // Modals
  showAddClientModal: boolean;
  setShowAddClientModal: (show: boolean) => void;

  // Actions on Clients & Pipeline
  addClient: (data: Omit<AgencyClient, 'id' | 'createdAt'>) => AgencyClient;
  updateClient: (id: string, updates: Partial<AgencyClient>) => void;
  moveClientStage: (id: string, newStage: ClientStage) => void;
  start7DayTrial: (id: string) => void;
  acceptTrialAndCloseDeal: (id: string) => void;
  updateDeliveryProgress: (id: string, pct: number, workflows?: AutomationWorkflowType[]) => void;
  activateMonthlyRetainer: (id: string) => void;
  replaceClientsFromSheet: (newClients: AgencyClient[]) => void;

  // Meetings & Agenda
  addMeeting: (meeting: Omit<MeetingItem, 'id'>) => void;
  updateMeeting: (id: string, updates: Partial<MeetingItem>) => void;
  updateMeetingStatus: (id: string, status: MeetingItem['status'], outcome?: MeetingItem['meetingOutcome']) => void;
  toggleMeetingReminder: (id: string) => void;
  toggleMeetingConfirmation: (id: string) => void;
  toggleMeetingConverted: (id: string) => void;

  // Agency Tasks / To-Do List
  addTask: (task: Omit<AgencyTask, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Invoices & Retainers
  markInvoicePaid: (id: string) => void;
  addInvoice: (inv: Omit<MaintenanceInvoice, 'id'>) => void;

  // Tickets
  addTicket: (t: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: MaintenanceTicket['status']) => void;

  // Package Pricing Update
  updatePackagePricing: (tier: PackageTier, setupFee: number, monthlyRetainer: number) => void;

  // Reset
  resetToInitialData: () => void;

  // Computed Metrics
  metrics: AgencyMetricsSummary;
}

const STORAGE_PREFIX = 'ibonda_agency_ops_v1_';

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Language & i18n
  const [language, setLanguage] = useState<'ar' | 'fr' | 'en'>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}lang`);
    return (saved as 'ar' | 'fr' | 'en') || 'ar';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}lang`, language);
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language, direction]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('this_month');
  const [stageFilter, setStageFilter] = useState('all');
  const [packageFilter, setPackageFilter] = useState('all');

  // Modals & Drawers
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // State with LocalStorage
  const [packages, setPackages] = useState<PackageConfig[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}packages`);
    return saved ? JSON.parse(saved) : initialPackages;
  });

  const [clients, setClients] = useState<AgencyClient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}clients`);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [meetings, setMeetings] = useState<MeetingItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}meetings`);
    return saved ? JSON.parse(saved) : initialMeetings;
  });

  const [campaigns, setCampaigns] = useState<AdCampaignMetric[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}campaigns`);
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [invoices, setInvoices] = useState<MaintenanceInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}tickets`);
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [tasks, setTasks] = useState<AgencyTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}packages`, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}clients`, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}meetings`, JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}campaigns`, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}tickets`, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}tasks`, JSON.stringify(tasks));
  }, [tasks]);

  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // Client CRUD
  const addClient = (data: Omit<AgencyClient, 'id' | 'createdAt'>): AgencyClient => {
    const newId = `cli-${Date.now()}`;
    const newClient: AgencyClient = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<AgencyClient>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const replaceClientsFromSheet = (newClients: AgencyClient[]) => {
    setClients(newClients);
  };

  const moveClientStage = (id: string, newStage: ClientStage) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated: AgencyClient = { ...c, stage: newStage };
          return updated;
        }
        return c;
      })
    );
  };

  // Start 7-Day Free Trial
  const start7DayTrial = (id: string) => {
    const now = new Date();
    const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            stage: 'trial_7_days',
            trialStartDate: now.toISOString(),
            trialEndDate: endDate.toISOString(),
            trialAccepted: undefined,
          };
        }
        return c;
      })
    );
  };

  // Accept Trial and Close Deal
  const acceptTrialAndCloseDeal = (id: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          // Create setup invoice
          const setupInv: MaintenanceInvoice = {
            id: `inv-${Date.now()}`,
            invoiceNumber: `INV-SET-${Math.floor(100 + Math.random() * 900)}`,
            clientId: c.id,
            agencyName: c.agencyName,
            amount: c.setupFee,
            type: 'setup_fee',
            issuedDate: new Date().toISOString().slice(0, 10),
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            status: 'pending',
          };
          setInvoices((invs) => [setupInv, ...invs]);

          return {
            ...c,
            stage: 'delivery_in_progress',
            trialAccepted: true,
            deliveryProgressPct: 20,
            targetDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          };
        }
        return c;
      })
    );
  };

  // Update Delivery Progress
  const updateDeliveryProgress = (id: string, pct: number, workflows?: AutomationWorkflowType[]) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            deliveryProgressPct: pct,
            workflowsEnabled: workflows || c.workflowsEnabled,
            stage: pct >= 100 ? 'active_retainer' : c.stage,
          };
        }
        return c;
      })
    );
  };

  // Activate Monthly Retainer
  const activateMonthlyRetainer = (id: string) => {
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          // Generate first monthly retainer invoice
          const retainerInv: MaintenanceInvoice = {
            id: `inv-${Date.now()}`,
            invoiceNumber: `INV-RET-${Math.floor(100 + Math.random() * 900)}`,
            clientId: c.id,
            agencyName: c.agencyName,
            amount: c.monthlyRetainer,
            type: 'monthly_retainer',
            issuedDate: today.toISOString().slice(0, 10),
            dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            status: 'pending',
          };
          setInvoices((invs) => [retainerInv, ...invs]);

          return {
            ...c,
            stage: 'active_retainer',
            maintenanceStartDate: today.toISOString(),
            nextBillingDate: nextMonth.toISOString(),
            maintenanceStatus: 'up_to_date',
            deliveryProgressPct: 100,
          };
        }
        return c;
      })
    );
  };

  // Meetings
  const addMeeting = (data: Omit<MeetingItem, 'id'>) => {
    const newMeeting: MeetingItem = {
      ...data,
      id: `meet-${Date.now()}`,
    };
    setMeetings((prev) => [newMeeting, ...prev]);

    // Also update or link client stage to meeting_scheduled if exists
    if (data.clientId) {
      updateClient(data.clientId, { stage: 'meeting_scheduled' });
    }
  };

  const updateMeeting = (id: string, updates: Partial<MeetingItem>) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const updateMeetingStatus = (
    id: string,
    status: MeetingItem['status'],
    outcome?: MeetingItem['meetingOutcome']
  ) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, status, meetingOutcome: outcome || m.meetingOutcome };
          if (outcome === 'accepted_trial') {
            start7DayTrial(m.clientId);
          }
          return updated;
        }
        return m;
      })
    );
  };

  const toggleMeetingReminder = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reminderSent: !m.reminderSent } : m))
    );
  };

  const toggleMeetingConfirmation = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reminderConfirmed: !m.reminderConfirmed } : m))
    );
  };

  const toggleMeetingConverted = (id: string) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextVal = !m.convertedToDeal;
          if (nextVal) {
            start7DayTrial(m.clientId);
          }
          return {
            ...m,
            convertedToDeal: nextVal,
            status: nextVal ? 'completed' : m.status,
            trialResult: nextVal ? 'accepted' : m.trialResult,
          };
        }
        return m;
      })
    );
  };

  // Agency Tasks CRUD
  const addTask = (data: Omit<AgencyTask, 'id' | 'createdAt'>) => {
    const newTask: AgencyTask = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Invoices
  const markInvoicePaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'paid', paidDate: new Date().toISOString().slice(0, 10) } : inv
      )
    );
  };

  const addInvoice = (data: Omit<MaintenanceInvoice, 'id'>) => {
    const newInv: MaintenanceInvoice = {
      ...data,
      id: `inv-${Date.now()}`,
    };
    setInvoices((prev) => [newInv, ...prev]);
  };

  // Tickets
  const addTicket = (data: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...data,
      id: `tkt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: MaintenanceTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  };

  // Package Pricing Update
  const updatePackagePricing = (tier: PackageTier, setupFee: number, monthlyRetainer: number) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === tier ? { ...p, setupFee, monthlyRetainer } : p))
    );
  };

  const resetToInitialData = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}packages`);
    localStorage.removeItem(`${STORAGE_PREFIX}clients`);
    localStorage.removeItem(`${STORAGE_PREFIX}meetings`);
    localStorage.removeItem(`${STORAGE_PREFIX}campaigns`);
    localStorage.removeItem(`${STORAGE_PREFIX}invoices`);
    localStorage.removeItem(`${STORAGE_PREFIX}tickets`);
    localStorage.removeItem(`${STORAGE_PREFIX}tasks`);

    setPackages(initialPackages);
    setClients(initialClients);
    setMeetings(initialMeetings);
    setCampaigns(initialCampaigns);
    setInvoices(initialInvoices);
    setTickets(initialTickets);
    setTasks(initialTasks);
  };

  // Computed Agency Metrics
  const metrics: AgencyMetricsSummary = useMemo(() => {
    const paidInvoices = invoices.filter((i) => i.status === 'paid');
    const totalRevenueCash = paidInvoices.reduce((sum, i) => sum + i.amount, 0);

    const activeRetainerList = clients.filter((c) => c.stage === 'active_retainer');
    const currentMRR = activeRetainerList.reduce((sum, c) => sum + (c.monthlyRetainer || 0), 0);

    const trialsInProgress = clients.filter((c) => c.stage === 'trial_7_days').length;
    const buildProjectsActive = clients.filter((c) => c.stage === 'delivery_in_progress').length;

    const totalAdSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalDealsClosed = clients.filter(
      (c) => c.stage === 'deal_won' || c.stage === 'delivery_in_progress' || c.stage === 'active_retainer'
    ).length;

    const averageCAC = totalDealsClosed > 0 ? Math.round(totalAdSpend / totalDealsClosed) : 0;

    return {
      totalRevenueCash,
      currentMRR,
      activeRetainerClients: activeRetainerList.length,
      trialsInProgress,
      buildProjectsActive,
      meetingsBookedThisMonth: meetings.length,
      totalAdSpendThisMonth: totalAdSpend,
      averageCAC,
    };
  }, [invoices, clients, campaigns, meetings]);

  return (
    <AgencyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        direction,
        packages,
        clients,
        meetings,
        campaigns,
        invoices,
        tickets,
        tasks,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter,
        stageFilter,
        setStageFilter,
        packageFilter,
        setPackageFilter,
        selectedClientId,
        setSelectedClientId,
        selectedClient,
        showAddClientModal,
        setShowAddClientModal,
        addClient,
        updateClient,
        moveClientStage,
        start7DayTrial,
        acceptTrialAndCloseDeal,
        updateDeliveryProgress,
        activateMonthlyRetainer,
        replaceClientsFromSheet,
        addMeeting,
        updateMeeting,
        updateMeetingStatus,
        toggleMeetingReminder,
        toggleMeetingConfirmation,
        toggleMeetingConverted,
        addTask,
        toggleTask,
        deleteTask,
        markInvoicePaid,
        addInvoice,
        addTicket,
        updateTicketStatus,
        updatePackagePricing,
        resetToInitialData,
        metrics,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
};

export const useAgency = () => {
  const context = useContext(AgencyContext);
  if (!context) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
};
