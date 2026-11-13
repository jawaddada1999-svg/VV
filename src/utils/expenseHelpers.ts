import { AgencyClient, ExpenseCategory } from '../types/agency';
import { Language } from '../translations';

export interface ExpensePreset {
  id: string;
  category: ExpenseCategory;
  monthlyCost: number;
  provider: string;
  label: Record<Language, string>;
  notes: Record<Language, string>;
}

export const EXPENSE_PRESETS: ExpensePreset[] = [
  {
    id: 'preset-wa',
    category: 'whatsapp_api',
    monthlyCost: 300,
    provider: '360dialog / Meta Cloud',
    label: {
      ar: 'واتساب API الرسمي',
      fr: 'API WhatsApp Officielle',
      en: 'Official WhatsApp API',
    },
    notes: {
      ar: 'خط إرسال فوري وإشعارات المعاينات',
      fr: 'Ligne d’envoi instantané et rappels RDV',
      en: 'Instant messaging & appointment reminders line',
    },
  },
  {
    id: 'preset-make',
    category: 'automation_platform',
    monthlyCost: 190,
    provider: 'Make.com / n8n',
    label: {
      ar: 'منصة الأوتوميشن (Make / n8n)',
      fr: 'Plateforme Automation (Make / n8n)',
      en: 'Automation Engine (Make / n8n)',
    },
    notes: {
      ar: 'تشغيل السيناريوهات وربط النماذج',
      fr: 'Exécution des scénarios et webhooks',
      en: 'Workflow runs and ad lead webhooks',
    },
  },
  {
    id: 'preset-ai',
    category: 'ai_tokens',
    monthlyCost: 250,
    provider: 'OpenAI API',
    label: {
      ar: 'رصيد الذكاء الاصطناعي (OpenAI)',
      fr: 'Crédits IA (OpenAI Tokens)',
      en: 'OpenAI AI Tokens',
    },
    notes: {
      ar: 'تأهيل المشترين والرد التلقائي الذكي',
      fr: 'Qualification des acheteurs par bot IA',
      en: 'Smart buyer qualification chatbot usage',
    },
  },
  {
    id: 'preset-host',
    category: 'hosting_domain',
    monthlyCost: 120,
    provider: 'Hetzner / Cloudflare',
    label: {
      ar: 'الاستضافة والنطاق والسيرفر',
      fr: 'Hébergement VPS & Domaine',
      en: 'VPS Hosting & Domain',
    },
    notes: {
      ar: 'صفحة الهبوط وسيرفر الويب هوك',
      fr: 'Landing page et serveur webhook dédié',
      en: 'Dedicated landing page & webhook server',
    },
  },
  {
    id: 'preset-crm',
    category: 'crm_calendar',
    monthlyCost: 180,
    provider: 'Calendly / CRM',
    label: {
      ar: 'نظام المواعيد والـ CRM',
      fr: 'Outil Calendrier & CRM',
      en: 'Booking & CRM Suite',
    },
    notes: {
      ar: 'تأكيد المواعيد ومزامنة التقويم',
      fr: 'Confirmation des visites et synchro CRM',
      en: 'Appointment scheduling & CRM sync',
    },
  },
];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, Record<Language, string>> = {
  whatsapp_api: {
    ar: 'واتساب API',
    fr: 'API WhatsApp',
    en: 'WhatsApp API',
  },
  automation_platform: {
    ar: 'منصة أوتوميشن',
    fr: 'Automation',
    en: 'Automation',
  },
  ai_tokens: {
    ar: 'ذكاء اصطناعي',
    fr: 'Crédits IA',
    en: 'AI Tokens',
  },
  hosting_domain: {
    ar: 'استضافة وسيرفر',
    fr: 'Hébergement',
    en: 'Hosting & VPS',
  },
  crm_calendar: {
    ar: 'تقويم و CRM',
    fr: 'CRM & Agenda',
    en: 'CRM & Calendar',
  },
  other: {
    ar: 'مصاريف أخرى',
    fr: 'Autre charge',
    en: 'Other Tool',
  },
};

export interface ClientFinancialBreakdown {
  retainer: number;
  activeExpenses: number;
  pausedExpenses: number;
  netProfit: number;
  marginPct: number;
  expensePct: number;
  activeCount: number;
  totalCount: number;
}

export function calcClientExpenseStats(client: AgencyClient): ClientFinancialBreakdown {
  const expenses = client.expenses || [];
  const retainer = client.monthlyRetainer || 0;
  const activeExpenses = expenses
    .filter((e) => e.isActive)
    .reduce((sum, e) => sum + (e.monthlyCost || 0), 0);
  const pausedExpenses = expenses
    .filter((e) => !e.isActive)
    .reduce((sum, e) => sum + (e.monthlyCost || 0), 0);
  const netProfit = retainer - activeExpenses;
  const marginPct = retainer > 0 ? Math.round((netProfit / retainer) * 100) : 0;
  const expensePct = retainer > 0 ? Math.min(100, Math.round((activeExpenses / retainer) * 100)) : 0;

  return {
    retainer,
    activeExpenses,
    pausedExpenses,
    netProfit,
    marginPct,
    expensePct,
    activeCount: expenses.filter((e) => e.isActive).length,
    totalCount: expenses.length,
  };
}
