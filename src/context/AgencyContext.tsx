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
  ClientNoteEntry,
  ClientExpenseItem,
  BookingAvailabilitySettings,
  DayOfWeekKey,
  DayScheduleConfig,
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
import {
  localizeClient,
  localizeMeeting,
  localizeTask,
  localizePackage,
  localizeCampaign,
  localizeInvoice,
  localizeTicket,
} from '../utils/entityLocalization';
import { DAY_ORDER, generateAvailableSlotsForDate } from '../utils/bookingSlots';

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
  newClientInitialStage: ClientStage;
  setNewClientInitialStage: (stage: ClientStage) => void;

  // Actions on Clients & Pipeline
  addClient: (data: Omit<AgencyClient, 'id' | 'createdAt'>) => AgencyClient;
  updateClient: (id: string, updates: Partial<AgencyClient>) => void;
  moveClientStage: (id: string, newStage: ClientStage) => void;
  start7DayTrial: (id: string) => void;
  acceptTrialAndCloseDeal: (id: string) => void;
  updateDeliveryProgress: (id: string, pct: number, workflows?: AutomationWorkflowType[]) => void;
  activateMonthlyRetainer: (id: string) => void;
  replaceClientsFromSheet: (newClients: AgencyClient[]) => void;

  // Notes & Follow-up History
  addClientNote: (clientId: string, note: Omit<ClientNoteEntry, 'id' | 'createdAt'>) => void;
  deleteClientNote: (clientId: string, noteId: string) => void;
  togglePinNote: (clientId: string, noteId: string) => void;

  // Client Subscriptions & Tool Expenses (Deducted from Maintenance)
  addClientExpense: (clientId: string, expense: Omit<ClientExpenseItem, 'id' | 'createdAt'>) => void;
  updateClientExpense: (clientId: string, expenseId: string, updates: Partial<ClientExpenseItem>) => void;
  toggleClientExpenseActive: (clientId: string, expenseId: string) => void;
  deleteClientExpense: (clientId: string, expenseId: string) => void;

  // Meetings & Agenda
  addMeeting: (meeting: Omit<MeetingItem, 'id'>) => boolean;
  updateMeeting: (id: string, updates: Partial<MeetingItem>) => void;
  updateMeetingStatus: (id: string, status: MeetingItem['status'], outcome?: MeetingItem['meetingOutcome']) => void;
  toggleMeetingReminder: (id: string) => void;
  toggleMeetingConfirmation: (id: string) => void;
  toggleMeetingConverted: (id: string) => void;

  // Agency Tasks / To-Do List
  addTask: (task: Omit<AgencyTask, 'id' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<AgencyTask>) => void;
  deleteTask: (id: string) => void;

  // Invoices & Retainers
  markInvoicePaid: (id: string) => void;
  addInvoice: (inv: Omit<MaintenanceInvoice, 'id'>) => void;

  // Tickets
  addTicket: (t: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => void;
  updateTicketStatus: (id: string, status: MaintenanceTicket['status']) => void;

  // Package Pricing Update
  updatePackagePricing: (tier: PackageTier, setupFee: number, monthlyRetainer: number) => void;

  // Ad Campaigns & ROAS/ROI Tracking
  updateCampaign: (id: string, updates: Partial<AdCampaignMetric>) => void;
  addCampaign: (campaign: Omit<AdCampaignMetric, 'id'>) => void;

  // Booking Availability & Working Hours (Landing Page Booking Control)
  bookingSettings: BookingAvailabilitySettings;
  updateBookingSettings: (updates: Partial<BookingAvailabilitySettings>) => void;
  updateDaySchedule: (day: DayOfWeekKey, updates: Partial<DayScheduleConfig>) => void;
  applyDayScheduleToAllActive: (sourceDay: DayOfWeekKey) => void;
  applySchedulePreset: (preset: 'morocco_standard' | 'extended_sat' | 'continuous' | 'evening') => void;
  addBlockedDate: (date: string, reason: string) => void;
  removeBlockedDate: (id: string) => void;
  resetBookingSettings: () => void;

  // Reset
  resetToInitialData: () => void;

  // Computed Metrics
  metrics: AgencyMetricsSummary;
}

const STORAGE_PREFIX = 'ibonda_agency_ops_v1_';

// Browser storage can contain stale or malformed JSON (or be unavailable in
// privacy-restricted browsers). Never let that prevent the dashboard mounting.
const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStored = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Keep the in-memory dashboard usable when browser storage is unavailable.
  }
};

const createDefaultBookingSettings = (): BookingAvailabilitySettings => ({
  isBookingOpen: true,
  timezone: 'Africa/Casablanca',
  slotDurationMinutes: 30,
  bufferMinutes: 15,
  minNoticeHours: 2,
  maxAdvanceDays: 14,
  maxBookingsPerDay: 8,
  schedule: {
    monday: { day: 'monday', enabled: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:30' },
    tuesday: { day: 'tuesday', enabled: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:30' },
    wednesday: { day: 'wednesday', enabled: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:30' },
    thursday: { day: 'thursday', enabled: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:30' },
    friday: { day: 'friday', enabled: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStart: '13:00', breakEnd: '14:30' },
    saturday: { day: 'saturday', enabled: true, startTime: '10:00', endTime: '14:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
    sunday: { day: 'sunday', enabled: false, startTime: '09:00', endTime: '17:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  },
  blockedDates: [],
});

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export const AgencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Language & i18n
  const [language, setLanguage] = useState<'ar' | 'fr' | 'en'>(() => {
    const saved = readStored<string>('lang', 'ar');
    return (['ar', 'fr', 'en'].includes(saved) ? saved : 'ar') as 'ar' | 'fr' | 'en';
  });

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    writeStored('lang', language);
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
  const [newClientInitialStage, setNewClientInitialStage] = useState<ClientStage>('ad_lead');

  // State with LocalStorage
  const [packages, setPackages] = useState<PackageConfig[]>(() => {
    return readStored<PackageConfig[]>('packages', initialPackages);
  });

  const [clients, setClients] = useState<AgencyClient[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}clients`);
    if (!saved) return initialClients;
    try {
      const parsed: AgencyClient[] = JSON.parse(saved);
      return parsed.map((c) => {
        if (c.expenses !== undefined) return c;
        const seeded = initialClients.find((init) => init.id === c.id);
        return { ...c, expenses: seeded?.expenses || [] };
      });
    } catch {
      return initialClients;
    }
  });

  const [meetings, setMeetings] = useState<MeetingItem[]>(() => {
    return readStored<MeetingItem[]>('meetings', initialMeetings);
  });

  const [campaigns, setCampaigns] = useState<AdCampaignMetric[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}campaigns`);
    if (!saved) return initialCampaigns;
    try {
      const parsed: AdCampaignMetric[] = JSON.parse(saved);
      return parsed.map((c) => {
        if (c.revenueGenerated !== undefined) return c;
        const seeded = initialCampaigns.find((init) => init.id === c.id);
        return { ...c, revenueGenerated: seeded?.revenueGenerated ?? 0 };
      });
    } catch {
      return initialCampaigns;
    }
  });

  const [invoices, setInvoices] = useState<MaintenanceInvoice[]>(() => {
    return readStored<MaintenanceInvoice[]>('invoices', initialInvoices);
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    return readStored<MaintenanceTicket[]>('tickets', initialTickets);
  });

  const [tasks, setTasks] = useState<AgencyTask[]>(() => {
    return readStored<AgencyTask[]>('tasks', initialTasks);
  });

  const [bookingSettings, setBookingSettings] = useState<BookingAvailabilitySettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}booking_settings`);
    if (!saved) return createDefaultBookingSettings();
    try {
      const parsed = JSON.parse(saved);
      const defaults = createDefaultBookingSettings();
      return {
        ...defaults,
        ...parsed,
        schedule: {
          ...defaults.schedule,
          ...(parsed.schedule || {}),
        },
        blockedDates: Array.isArray(parsed.blockedDates) ? parsed.blockedDates : [],
      };
    } catch {
      return createDefaultBookingSettings();
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    writeStored('packages', packages);
  }, [packages]);

  useEffect(() => {
    writeStored('clients', clients);
  }, [clients]);

  useEffect(() => {
    writeStored('meetings', meetings);
  }, [meetings]);

  useEffect(() => {
    writeStored('campaigns', campaigns);
  }, [campaigns]);

  useEffect(() => {
    writeStored('invoices', invoices);
  }, [invoices]);

  useEffect(() => {
    writeStored('tickets', tickets);
  }, [tickets]);

  useEffect(() => {
    writeStored('tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    writeStored('booking_settings', bookingSettings);
  }, [bookingSettings]);

  const localizedPackages = useMemo(() => {
    return packages.map((p) => localizePackage(p, language));
  }, [packages, language]);

  const localizedCampaigns = useMemo(() => {
    return campaigns.map((c) => localizeCampaign(c, language));
  }, [campaigns, language]);

  const localizedInvoices = useMemo(() => {
    return invoices.map((inv) => localizeInvoice(inv, language));
  }, [invoices, language]);

  const localizedTickets = useMemo(() => {
    return tickets.map((tkt) => localizeTicket(tkt, language));
  }, [tickets, language]);

  const localizedClients = useMemo(() => {
    return clients.map((c) => localizeClient(c, language));
  }, [clients, language]);

  const localizedMeetings = useMemo(() => {
    return meetings.map((m) => localizeMeeting(m, language));
  }, [meetings, language]);

  const localizedTasks = useMemo(() => {
    return tasks.map((t) => localizeTask(t, language));
  }, [tasks, language]);

  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    const raw = clients.find((c) => c.id === selectedClientId);
    return raw ? localizeClient(raw, language) : null;
  }, [clients, selectedClientId, language]);

  // Client CRUD
  const addClient = (data: Omit<AgencyClient, 'id' | 'createdAt'>): AgencyClient => {
    const normalizedPhone = (data.phone || '').replace(/\\D/g, '');
    const normalizedEmail = (data.email || '').trim().toLowerCase();
    const duplicate = clients.find((client) => {
      const phone = (client.phone || '').replace(/\\D/g, '');
      const email = (client.email || '').trim().toLowerCase();
      return (normalizedPhone.length >= 8 && phone === normalizedPhone) ||
        (normalizedEmail && email && email === normalizedEmail);
    });
    if (duplicate) return duplicate;
    const newClient: AgencyClient = {
      ...data,
      id: `cli-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<AgencyClient>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    if (updates.agencyName) {
      setInvoices((prev) => prev.map((item) => item.clientId === id ? { ...item, agencyName: updates.agencyName! } : item));
      setMeetings((prev) => prev.map((item) => item.clientId === id ? { ...item, agencyName: updates.agencyName! } : item));
      setTickets((prev) => prev.map((item) => item.clientId === id ? { ...item, agencyName: updates.agencyName! } : item));
    }
  };

  const replaceClientsFromSheet = (newClients: AgencyClient[]) => {
    setClients(newClients);
  };

  const moveClientStage = (id: string, newStage: ClientStage) => {
    // Financially meaningful stage transitions must go through their dedicated actions.
    if (newStage === 'trial_7_days') {
      start7DayTrial(id);
      return;
    }
    if (newStage === 'delivery_in_progress') {
      acceptTrialAndCloseDeal(id);
      return;
    }
    if (newStage === 'active_retainer') {
      activateMonthlyRetainer(id);
      return;
    }
    setClients((prev) =>
      prev.map((c) => c.id === id ? { ...c, stage: newStage } : c)
    );
  };

  // Notes & Follow-up History
  const addClientNote = (clientId: string, noteData: Omit<ClientNoteEntry, 'id' | 'createdAt'>) => {
    const newNote: ClientNoteEntry = {
      ...noteData,
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const existingHistory = c.noteHistory || [];
          return {
            ...c,
            noteHistory: [newNote, ...existingHistory],
          };
        }
        return c;
      })
    );
  };

  const deleteClientNote = (clientId: string, noteId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            noteHistory: (c.noteHistory || []).filter((n) => n.id !== noteId),
          };
        }
        return c;
      })
    );
  };

  const togglePinNote = (clientId: string, noteId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          return {
            ...c,
            noteHistory: (c.noteHistory || []).map((n) =>
              n.id === noteId ? { ...n, isPinned: !n.isPinned } : n
            ),
          };
        }
        return c;
      })
    );
  };

  // Client Subscriptions & Tool Expenses CRUD
  const addClientExpense = (clientId: string, expenseData: Omit<ClientExpenseItem, 'id' | 'createdAt'>) => {
    const newExpense: ClientExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, expenses: [newExpense, ...(c.expenses || [])] }
          : c
      )
    );
  };

  const updateClientExpense = (clientId: string, expenseId: string, updates: Partial<ClientExpenseItem>) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              expenses: (c.expenses || []).map((exp) =>
                exp.id === expenseId ? { ...exp, ...updates } : exp
              ),
            }
          : c
      )
    );
  };

  const toggleClientExpenseActive = (clientId: string, expenseId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              expenses: (c.expenses || []).map((exp) =>
                exp.id === expenseId ? { ...exp, isActive: !exp.isActive } : exp
              ),
            }
          : c
      )
    );
  };

  const deleteClientExpense = (clientId: string, expenseId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              expenses: (c.expenses || []).filter((exp) => exp.id !== expenseId),
            }
          : c
      )
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
    const targetClient = clients.find((client) => client.id === id);
    if (!targetClient || targetClient.stage === 'delivery_in_progress' || targetClient.stage === 'active_retainer' ||
        invoices.some((invoice) => invoice.clientId === id && invoice.type === 'setup_fee')) return;
    if (!tasks.some((task) => task.relatedClientId === id && task.category === 'build')) {
      const checklistTitles = [
        'تأكيد بيانات الوكالة ومتطلبات الربط',
        'إعداد استقبال العملاء من الإعلانات',
        'إعداد رسائل واتساب والتأهيل',
        'إعداد التقويم وحجز المواعيد',
        'اختبار شامل وتسليم النظام',
      ];
      const dueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      setTasks((prev) => [
        ...checklistTitles.map((title, index) => ({
          id: `build-${id}-${index + 1}`,
          title,
          priority: index === 4 ? 'high' as const : 'medium' as const,
          dueDate,
          completed: false,
          relatedAgencyName: targetClient.agencyName,
          relatedClientId: id,
          assignee: targetClient.agencyManager || 'فريق التنفيذ',
          category: 'build' as const,
          createdAt: new Date().toISOString(),
        })),
        ...prev,
      ]);
    }
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          // Create setup invoice once only
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
            deliveryStartDate: new Date().toISOString().slice(0, 10),
            deliveryDelayReason: '',
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
            stage: c.stage,
          };
        }
        return c;
      })
    );
  };

  // Activate Monthly Retainer
  const activateMonthlyRetainer = (id: string) => {
    const targetClient = clients.find((client) => client.id === id);
    if (!targetClient || targetClient.stage === 'active_retainer' ||
        invoices.some((invoice) => invoice.clientId === id && invoice.type === 'monthly_retainer' && invoice.status !== 'paid')) return;
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
    const linkedClient = clients.find((client) => client.id === data.clientId);
    if (!linkedClient) return false;
    const meetingDate = data.scheduledTime.slice(0, 10);
    const meetingTime = data.scheduledTime.includes('T') ? data.scheduledTime.split('T')[1].slice(0, 5) : '';
    const availableDay = generateAvailableSlotsForDate(meetingDate, bookingSettings, meetings);
    if (!meetingTime || !availableDay.slots.some((slot) => slot.time === meetingTime && slot.status === 'available')) return false;
    const duplicate = meetings.some((meeting) =>
      meeting.clientId === data.clientId && meeting.scheduledTime === data.scheduledTime &&
      meeting.status === 'scheduled'
    );
    if (duplicate) return false;
    const newMeeting: MeetingItem = {
      ...data,
      clientName: linkedClient.contactPerson,
      agencyName: linkedClient.agencyName,
      phone: linkedClient.phone,
      city: linkedClient.city,
      id: `meet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    updateClient(data.clientId, { stage: 'meeting_scheduled' });
    return true;
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
    const linkedMeeting = meetings.find((meeting) => meeting.id === id);
    if (linkedMeeting) {
      if (outcome === 'accepted_trial') {
        start7DayTrial(linkedMeeting.clientId);
      } else if (outcome === 'follow_up') {
        moveClientStage(linkedMeeting.clientId, 'negotiation_follow_up');
      } else if (outcome === 'rejected') {
        moveClientStage(linkedMeeting.clientId, 'lost');
      } else if (status === 'completed') {
        moveClientStage(linkedMeeting.clientId, 'meeting_completed');
      } else if (status === 'no_show') {
        moveClientStage(linkedMeeting.clientId, 'meeting_no_show');
      } else if (status === 'scheduled') {
        moveClientStage(linkedMeeting.clientId, 'meeting_scheduled');
      }
    }

    setMeetings((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status, meetingOutcome: outcome || m.meetingOutcome }
          : m
      )
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

  const updateTask = (id: string, updates: Partial<AgencyTask>) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, ...updates } : task));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Invoices
  const markInvoicePaid = (id: string) => {
    const invoice = invoices.find((item) => item.id === id);
    if (!invoice || invoice.status === 'paid') return;
    const paidDate = new Date().toISOString().slice(0, 10);
    setInvoices((prev) => prev.map((item) =>
      item.id === id ? { ...item, status: 'paid', paidDate } : item
    ));
    if (invoice.type === 'setup_fee') {
      updateClient(invoice.clientId, { setupPaymentStatus: 'paid' });
    } else {
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);
      updateClient(invoice.clientId, {
        maintenanceStatus: 'up_to_date',
        nextBillingDate: nextBilling.toISOString().slice(0, 10),
      });
    }
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

  // Ad Campaigns & ROAS/ROI Updates
  const updateCampaign = (id: string, updates: Partial<AdCampaignMetric>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addCampaign = (data: Omit<AdCampaignMetric, 'id'>) => {
    const newCampaign: AdCampaignMetric = {
      ...data,
      id: `camp-${Date.now()}`,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  // Booking Availability & Working Hours Actions
  const updateBookingSettings = (updates: Partial<BookingAvailabilitySettings>) => {
    setBookingSettings((prev) => ({
      ...prev,
      ...updates,
      schedule: updates.schedule ? { ...prev.schedule, ...updates.schedule } : prev.schedule,
    }));
  };

  const updateDaySchedule = (day: DayOfWeekKey, updates: Partial<DayScheduleConfig>) => {
    setBookingSettings((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          ...updates,
        },
      },
    }));
  };

  const applyDayScheduleToAllActive = (sourceDay: DayOfWeekKey) => {
    setBookingSettings((prev) => {
      const source = prev.schedule[sourceDay];
      const nextSchedule = { ...prev.schedule };
      DAY_ORDER.forEach((d) => {
        if (nextSchedule[d].enabled) {
          nextSchedule[d] = {
            ...nextSchedule[d],
            startTime: source.startTime,
            endTime: source.endTime,
            hasBreak: source.hasBreak,
            breakStart: source.breakStart,
            breakEnd: source.breakEnd,
          };
        }
      });
      return { ...prev, schedule: nextSchedule };
    });
  };

  const applySchedulePreset = (preset: 'morocco_standard' | 'extended_sat' | 'continuous' | 'evening') => {
    setBookingSettings((prev) => {
      const nextSchedule = { ...prev.schedule };
      if (preset === 'morocco_standard') {
        DAY_ORDER.forEach((d) => {
          const isWeekday = d !== 'saturday' && d !== 'sunday';
          nextSchedule[d] = {
            day: d,
            enabled: isWeekday,
            startTime: '09:00',
            endTime: '18:00',
            hasBreak: true,
            breakStart: '13:00',
            breakEnd: '14:30',
          };
        });
      } else if (preset === 'extended_sat') {
        DAY_ORDER.forEach((d) => {
          const isWorking = d !== 'sunday';
          nextSchedule[d] = {
            day: d,
            enabled: isWorking,
            startTime: d === 'saturday' ? '10:00' : '09:30',
            endTime: d === 'saturday' ? '15:00' : '19:00',
            hasBreak: d !== 'saturday',
            breakStart: '13:00',
            breakEnd: '14:30',
          };
        });
      } else if (preset === 'continuous') {
        DAY_ORDER.forEach((d) => {
          const isWeekday = d !== 'saturday' && d !== 'sunday';
          nextSchedule[d] = {
            day: d,
            enabled: isWeekday,
            startTime: '09:00',
            endTime: '17:00',
            hasBreak: false,
            breakStart: '13:00',
            breakEnd: '14:00',
          };
        });
      } else if (preset === 'evening') {
        DAY_ORDER.forEach((d) => {
          const isWorking = d !== 'sunday';
          nextSchedule[d] = {
            day: d,
            enabled: isWorking,
            startTime: '14:00',
            endTime: '21:00',
            hasBreak: false,
            breakStart: '17:00',
            breakEnd: '17:30',
          };
        });
      }
      return { ...prev, schedule: nextSchedule };
    });
  };

  const addBlockedDate = (date: string, reason: string) => {
    if (!date) return;
    setBookingSettings((prev) => {
      if (prev.blockedDates.some((b) => b.date === date)) return prev;
      return {
        ...prev,
        blockedDates: [
          ...prev.blockedDates,
          { id: `blk-${Date.now()}`, date, reason: reason.trim() },
        ].sort((a, b) => a.date.localeCompare(b.date)),
      };
    });
  };

  const removeBlockedDate = (id: string) => {
    setBookingSettings((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((b) => b.id !== id),
    }));
  };

  const resetBookingSettings = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}booking_settings`);
    setBookingSettings(createDefaultBookingSettings());
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
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();
    const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
    const totalRevenueCash = paidInvoices.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0);

    const activeRetainerList = clients.filter((client) => client.stage === 'active_retainer');
    const currentMRR = activeRetainerList.reduce((sum, client) => sum + (Number(client.monthlyRetainer) || 0), 0);
    const totalMonthlyClientExpenses = activeRetainerList.reduce((sum, client) =>
      sum + (client.expenses || []).filter((expense) => expense.isActive)
        .reduce((expenseSum, expense) => expenseSum + (Number(expense.monthlyCost) || 0), 0), 0);
    const netRetainerProfit = currentMRR - totalMonthlyClientExpenses;

    const trialsInProgress = clients.filter((client) => client.stage === 'trial_7_days').length;
    const buildProjectsActive = clients.filter((client) => client.stage === 'delivery_in_progress').length;
    const totalAdSpend = campaigns.reduce((sum, campaign) => {
      const start = new Date(campaign.startDate).getTime();
      return start >= monthStart && start < nextMonthStart ? sum + (Number(campaign.spend) || 0) : sum;
    }, 0);
    const totalDealsClosed = clients.filter((client) =>
      ['deal_won', 'delivery_in_progress', 'active_retainer'].includes(client.stage)
    ).length;
    const averageCAC = totalDealsClosed > 0 ? Math.round(totalAdSpend / totalDealsClosed) : 0;
    const meetingsBookedThisMonth = meetings.filter((meeting) => {
      const date = new Date(meeting.scheduledTime).getTime();
      return Number.isFinite(date) && date >= monthStart && date < nextMonthStart;
    }).length;

    return {
      totalRevenueCash,
      currentMRR,
      activeRetainerClients: activeRetainerList.length,
      trialsInProgress,
      buildProjectsActive,
      meetingsBookedThisMonth,
      totalAdSpendThisMonth: totalAdSpend,
      averageCAC,
      totalMonthlyClientExpenses,
      netRetainerProfit,
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
        packages: localizedPackages,
        clients: localizedClients,
        meetings: localizedMeetings,
        campaigns: localizedCampaigns,
        invoices: localizedInvoices,
        tickets: localizedTickets,
        tasks: localizedTasks,
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
        newClientInitialStage,
        setNewClientInitialStage,
        addClient,
        updateClient,
        moveClientStage,
        start7DayTrial,
        acceptTrialAndCloseDeal,
        updateDeliveryProgress,
        activateMonthlyRetainer,
        replaceClientsFromSheet,
        addClientNote,
        deleteClientNote,
        togglePinNote,
        addClientExpense,
        updateClientExpense,
        toggleClientExpenseActive,
        deleteClientExpense,
        addMeeting,
        updateMeeting,
        updateMeetingStatus,
        toggleMeetingReminder,
        toggleMeetingConfirmation,
        toggleMeetingConverted,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        markInvoicePaid,
        addInvoice,
        addTicket,
        updateTicketStatus,
        updatePackagePricing,
        updateCampaign,
        addCampaign,
        bookingSettings,
        updateBookingSettings,
        updateDaySchedule,
        applyDayScheduleToAllActive,
        applySchedulePreset,
        addBlockedDate,
        removeBlockedDate,
        resetBookingSettings,
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
