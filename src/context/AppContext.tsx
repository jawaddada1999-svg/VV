import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Currency,
  Language,
  Lead,
  LeadStage,
  MetaCampaign,
  FunnelStageData,
  DiagnosticAlert,
  IntegrationSettings,
} from '../types';
import { initialCampaigns, initialLeads } from '../data/mockData';
import { translations } from '../utils/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  leads: Lead[];
  campaigns: MetaCampaign[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadStatus: (id: string, status: LeadStage) => void;
  addCampaign: (campaign: Omit<MetaCampaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<MetaCampaign>) => void;
  resetToMockData: () => void;
  importLeadsJSON: (data: Lead[]) => void;
  exportToCSV: () => void;
  formatMoney: (amount: number) => string;
  t: typeof translations.fr;
  funnelStages: FunnelStageData[];
  diagnosticAlerts: DiagnosticAlert[];
  totalSpend: number;
  totalRevenue: number;
  overallROAS: number;
  overallCAC: number;
  totalLeadsCount: number;
  totalMeetingsBooked: number;
  totalMeetingsHeld: number;
  totalDealsWon: number;
  showLeadModal: boolean;
  setShowLeadModal: (show: boolean) => void;
  selectedLeadForEdit: Lead | null;
  setSelectedLeadForEdit: (lead: Lead | null) => void;
  showWebhookModal: boolean;
  setShowWebhookModal: (show: boolean) => void;
  integrationSettings: IntegrationSettings;
  updateIntegrationSettings: (settings: Partial<IntegrationSettings>) => void;
  clearAllData: () => void;
  setCampaignDirectMetrics: (campaignId: string, metrics: Partial<MetaCampaign>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_LEADS_KEY = 'immo_metrics_leads_v1';
const LOCAL_STORAGE_CAMPAIGNS_KEY = 'immo_metrics_campaigns_v1';
const LOCAL_STORAGE_LANG_KEY = 'immo_metrics_language';
const LOCAL_STORAGE_CURR_KEY = 'immo_metrics_currency';
const LOCAL_STORAGE_THEME_KEY = 'immo_metrics_theme';
const LOCAL_STORAGE_INTEGRATIONS_KEY = 'immo_metrics_integrations_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as Language) || 'ar';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_CURR_KEY) as Currency) || 'MAD';
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as 'dark' | 'light') || 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('overview');

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading leads from storage', e);
      }
    }
    return initialLeads;
  });

  const [campaigns, setCampaigns] = useState<MetaCampaign[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading campaigns from storage', e);
      }
    }
    return initialCampaigns;
  });

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_INTEGRATIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading integration settings', e);
      }
    }
    return {
      metaAdAccountId: '',
      metaAccessToken: '',
      metaPixelId: '',
      landingPageUrl: 'https://immo-mandats.ma',
      calendlyWebhookSecret: '',
      isLiveConnected: false,
    };
  });

  const updateIntegrationSettings = (updates: Partial<IntegrationSettings>) => {
    setIntegrationSettings((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(LOCAL_STORAGE_INTEGRATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllData = () => {
    setLeads([]);
    setCampaigns([
      {
        id: 'c-live-1',
        name: 'Campagne Meta Ads Principale (Live)',
        status: 'active',
        platform: 'Meta Combined',
        spend: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        meetingsBooked: 0,
        meetingsHeld: 0,
        clientsClosed: 0,
        revenue: 0,
        startDate: new Date().toISOString().slice(0, 10),
      },
    ]);
    localStorage.removeItem(LOCAL_STORAGE_LEADS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
  };

  const setCampaignDirectMetrics = (campaignId: string, metrics: Partial<MetaCampaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, ...metrics } : c))
    );
  };

  // Sync theme with html root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Sync language and RTL direction
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem(LOCAL_STORAGE_CURR_KEY, curr);
  };

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }, [campaigns]);

  const t = translations[language];

  // Currency exchange rates for display (MAD is base)
  const currencyRates = {
    MAD: 1,
    EUR: 0.093, // 100 MAD ~ 9.3 EUR
    USD: 0.10,  // 100 MAD ~ 10 USD
  };

  const formatMoney = (amountInMAD: number): string => {
    const rate = currencyRates[currency];
    const converted = amountInMAD * rate;
    const formatted = Math.round(converted).toLocaleString();
    if (currency === 'MAD') {
      return language === 'ar' ? `${formatted} د.م.` : `${formatted} DH`;
    }
    if (currency === 'EUR') return `${formatted} €`;
    return `$${formatted}`;
  };

  // Funnel and KPI Aggregations
  const totalSpend = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + c.spend, 0);
  }, [campaigns]);

  const totalImpressions = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + c.impressions, 0);
  }, [campaigns]);

  const totalClicks = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + c.clicks, 0);
  }, [campaigns]);

  // Landing page visits is estimated from clicks (typical drop of 10-15% during page load)
  const totalLPVisits = useMemo(() => {
    return Math.round(totalClicks * 0.88);
  }, [totalClicks]);

  const totalLeadsCount = leads.length;

  const totalMeetingsBooked = useMemo(() => {
    return leads.filter((l) =>
      ['meeting_scheduled', 'meeting_held', 'proposal_sent', 'won'].includes(l.status)
    ).length;
  }, [leads]);

  const totalMeetingsHeld = useMemo(() => {
    return leads.filter(
      (l) =>
        ['meeting_held', 'proposal_sent', 'won'].includes(l.status) ||
        l.meetingOutcome === 'showed'
    ).length;
  }, [leads]);

  const totalDealsWon = useMemo(() => {
    return leads.filter((l) => l.status === 'won').length;
  }, [leads]);

  const totalRevenue = useMemo(() => {
    return leads
      .filter((l) => l.status === 'won')
      .reduce((acc, l) => acc + (l.dealValue || 15000), 0);
  }, [leads]);

  const overallROAS = useMemo(() => {
    if (totalSpend === 0) return 0;
    return parseFloat((totalRevenue / totalSpend).toFixed(2));
  }, [totalRevenue, totalSpend]);

  const overallCAC = useMemo(() => {
    if (totalDealsWon === 0) return totalSpend;
    return Math.round(totalSpend / totalDealsWon);
  }, [totalSpend, totalDealsWon]);

  // Stage-by-stage Funnel computation
  const funnelStages: FunnelStageData[] = useMemo(() => {
    // Stage 1: Impressions -> Clicks (CTR)
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cpc = totalClicks > 0 ? totalSpend / totalClicks : 0;

    // Stage 2: Clicks -> LP Visits (Page Load / Land rate)
    const landRate = totalClicks > 0 ? (totalLPVisits / totalClicks) * 100 : 0;

    // Stage 3: LP Visits -> Form Submitted (Leads)
    const lpConvRate = totalLPVisits > 0 ? (totalLeadsCount / totalLPVisits) * 100 : 0;
    const cpl = totalLeadsCount > 0 ? totalSpend / totalLeadsCount : 0;

    // Stage 4: Form Submitted -> Meeting Booked
    const bookRate = totalLeadsCount > 0 ? (totalMeetingsBooked / totalLeadsCount) * 100 : 0;
    const costPerBooked = totalMeetingsBooked > 0 ? totalSpend / totalMeetingsBooked : 0;

    // Stage 5: Meeting Booked -> Meeting Held (Show-Up Rate)
    const showUpRate = totalMeetingsBooked > 0 ? (totalMeetingsHeld / totalMeetingsBooked) * 100 : 0;
    const costPerHeld = totalMeetingsHeld > 0 ? totalSpend / totalMeetingsHeld : 0;

    // Stage 6: Meeting Held -> Deal Won (Closing Rate)
    const closeRate = totalMeetingsHeld > 0 ? (totalDealsWon / totalMeetingsHeld) * 100 : 0;
    const cac = totalDealsWon > 0 ? totalSpend / totalDealsWon : 0;

    return [
      {
        id: 'impressions',
        name: t.funnel.stageImpressions,
        count: totalImpressions,
        previousCount: totalImpressions,
        conversionRate: 100,
        benchmarkRate: 100,
        unitCost: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0, // CPM
        dropOffRate: 0,
      },
      {
        id: 'clicks',
        name: t.funnel.stageClicks,
        count: totalClicks,
        previousCount: totalImpressions,
        conversionRate: parseFloat(ctr.toFixed(2)),
        benchmarkRate: 2.2, // Benchmark CTR ~ 2.2%
        unitCost: parseFloat(cpc.toFixed(2)),
        dropOffRate: parseFloat((100 - ctr).toFixed(2)),
      },
      {
        id: 'visitors',
        name: t.funnel.stageVisitors,
        count: totalLPVisits,
        previousCount: totalClicks,
        conversionRate: parseFloat(landRate.toFixed(1)),
        benchmarkRate: 88, // 88% land rate
        unitCost: totalLPVisits > 0 ? totalSpend / totalLPVisits : 0,
        dropOffRate: parseFloat((100 - landRate).toFixed(1)),
      },
      {
        id: 'leads',
        name: t.funnel.stageLeads,
        count: totalLeadsCount,
        previousCount: totalLPVisits,
        conversionRate: parseFloat(lpConvRate.toFixed(1)),
        benchmarkRate: 4.8, // Benchmark LP conversion ~ 4.8%
        unitCost: parseFloat(cpl.toFixed(1)),
        dropOffRate: parseFloat((100 - lpConvRate).toFixed(1)),
      },
      {
        id: 'booked',
        name: t.funnel.stageBooked,
        count: totalMeetingsBooked,
        previousCount: totalLeadsCount,
        conversionRate: parseFloat(bookRate.toFixed(1)),
        benchmarkRate: 35.0, // Benchmark Lead-to-Booked ~ 35%
        unitCost: parseFloat(costPerBooked.toFixed(1)),
        dropOffRate: parseFloat((100 - bookRate).toFixed(1)),
      },
      {
        id: 'held',
        name: t.funnel.stageHeld,
        count: totalMeetingsHeld,
        previousCount: totalMeetingsBooked,
        conversionRate: parseFloat(showUpRate.toFixed(1)),
        benchmarkRate: 75.0, // Benchmark Show-Up ~ 75%
        unitCost: parseFloat(costPerHeld.toFixed(1)),
        dropOffRate: parseFloat((100 - showUpRate).toFixed(1)),
      },
      {
        id: 'won',
        name: t.funnel.stageWon,
        count: totalDealsWon,
        previousCount: totalMeetingsHeld,
        conversionRate: parseFloat(closeRate.toFixed(1)),
        benchmarkRate: 25.0, // Benchmark Close rate ~ 25%
        unitCost: parseFloat(cac.toFixed(1)),
        dropOffRate: parseFloat((100 - closeRate).toFixed(1)),
      },
    ];
  }, [
    totalImpressions,
    totalClicks,
    totalLPVisits,
    totalLeadsCount,
    totalMeetingsBooked,
    totalMeetingsHeld,
    totalDealsWon,
    totalSpend,
    t,
  ]);

  // Bottleneck Diagnostic Alerts
  const diagnosticAlerts: DiagnosticAlert[] = useMemo(() => {
    const alerts: DiagnosticAlert[] = [];
    if (funnelStages.length < 7) return alerts;

    const clicksStage = funnelStages[1];
    const leadsStage = funnelStages[3];
    const bookedStage = funnelStages[4];
    const heldStage = funnelStages[5];
    const wonStage = funnelStages[6];

    // Check 1: Show-Up Rate (Held / Booked)
    if (heldStage.conversionRate < 65) {
      alerts.push({
        id: 'alert-showup-leak',
        stageKey: 'held',
        stageName: t.funnel.stageHeld,
        severity: 'critical',
        metric: t.kpis.showUpRate,
        currentRate: heldStage.conversionRate,
        benchmarkRate: 75.0,
        problemSummary:
          language === 'ar'
            ? 'تسريب حرج في الميزانية: نسبة الحضور الفعلي للمواعيد أقل من 65%'
            : language === 'en'
            ? 'Critical Drop-off: Show-Up Rate is below 65%'
            : 'Fuite critique : Le taux de présence aux rendez-vous est inférieur à 65%',
        impactExplanation:
          language === 'ar'
            ? 'أنت تنفق ميزانية إعلانية لحجز مواعيد مع وكالات عقارية، ولكن أكثر من ثلث المديرين لا يحضرون المكالمة المجدولة.'
            : language === 'en'
            ? 'You are spending ad dollars generating calls, but real estate managers are not showing up to the scheduled pitch.'
            : 'Vous dépensez du budget Meta Ads pour booker des appels, mais près d\'une agence sur deux ne se présente pas.',
        actionRecommendation:
          language === 'ar'
            ? 'تفعيل رسائل تذكير آلية عبر واتساب قبل الموعد بساعتين و15 دقيقة مع فيديو تمهيدي مدته 60 ثانية.'
            : language === 'en'
            ? 'Deploy automated WhatsApp & SMS reminders 2h and 15min prior, including a 60s warm-up case study video.'
            : 'Mettez en place des rappels WhatsApp automatisés à H-2 et H-15min avec une vidéo Loom de pré-qualification.',
        actionItems: [
          language === 'ar'
            ? 'إرسال رسالة تذكير واتساب مخصصة تلقائياً قبل الموعد بساعتين.'
            : 'Envoyez un message WhatsApp personnalisé automatique 2h avant le RDV.',
          language === 'ar'
            ? 'إجراء اتصال هاتفي سريع لتأكيد رغبة العميل وجديته قبل المكالمة الرئيسية.'
            : 'Appelez rapidement le lead pour confirmer son créneau et poser 2 questions de filtre.',
          language === 'ar'
            ? 'تقليص نافذة الحجز في التقويم إلى 3 أيام كحد أقصى لتقليل احتمالية النسيان.'
            : 'Limitez le calendrier à 3 jours ouvrés maximum pour éviter que le prospect n\'oublie.',
        ],
      });
    }

    // Check 2: Form Completion / LP Conversion
    if (leadsStage.conversionRate < 4.0) {
      alerts.push({
        id: 'alert-lp-leak',
        stageKey: 'leads',
        stageName: t.funnel.stageLeads,
        severity: 'warning',
        metric: t.kpis.lpConvRate,
        currentRate: leadsStage.conversionRate,
        benchmarkRate: 4.8,
        problemSummary:
          language === 'ar'
            ? 'ضعف تحويل صفحة الهبوط: نسبة ملء الاستمارة أقل من 4%'
            : language === 'en'
            ? 'Landing Page friction: Conversion below 4%'
            : 'Friction sur la Landing Page : Taux de conversion inférieur à 4%',
        impactExplanation:
          language === 'ar'
            ? 'الزوار من مسؤولي الوكالات العقارية يدخلون صفحة الهبوط ولكنهم يغادرون دون استكمال النموذج.'
            : language === 'en'
            ? 'Real estate brokers land on your page but bounce without submitting contact information.'
            : 'Le trafic payé Meta arrive sur votre page d\'atterrissage mais repart avant de soumettre le formulaire.',
        actionRecommendation:
          language === 'ar'
            ? 'تقليص حقول النموذج إلى 3 أسئلة جوهرية وإبراز شهادات وكالات حققت نتائج سابقة.'
            : language === 'en'
            ? 'Reduce form fields to 3 essential questions and feature local agency social proof testimonials.'
            : 'Réduisez le formulaire à 3 questions essentielles et intégrez des témoignages avec chiffres concrets.',
        actionItems: [
          language === 'ar'
            ? 'تجربة نماذج ميتا الفورية (Meta Lead Forms) لسهولة استخدامها الفائقة على الهواتف.'
            : 'Testez les formulaires natifs Meta Lead Forms (taux de conversion souvent 2x supérieur sur mobile).',
          language === 'ar'
            ? 'صياغة عنوان مباشر وواضح في أعلى الصفحة يركز على نتيجة محددة (مثل: كيف تحصل وكالتك على 5 تفويضات حصرية شهرياً).'
            : 'Clarifiez la promesse au-dessus de la ligne de flottaison : "Comment signer 5 mandats exclusifs en 30j".',
        ],
      });
    }

    // Check 3: CTR / Ad Creatives
    if (clicksStage.conversionRate < 1.8) {
      alerts.push({
        id: 'alert-ctr-leak',
        stageKey: 'clicks',
        stageName: t.funnel.stageClicks,
        severity: 'warning',
        metric: 'CTR (نسبة النقر إلى الظهور)',
        currentRate: clicksStage.conversionRate,
        benchmarkRate: 2.2,
        problemSummary:
          language === 'ar'
            ? 'إرهاق إعلاني: نسبة النقر على الإعلان أقل من 1.8%'
            : language === 'en'
            ? 'Ad Creative Fatigue: CTR is below 1.8%'
            : 'Fatigue publicitaire : CTR inférieur à 1.8%',
        impactExplanation:
          language === 'ar'
            ? 'التصميمات والرسائل الإعلانية الحالية لم تعد تجذب انتباه أصحاب ومديري الوكالات العقارية بالقدر الكافي.'
            : language === 'en'
            ? 'Your ad creatives and video hooks are not capturing the attention of real estate agency decision makers.'
            : 'Vos créatifs Meta Ads ne captent plus suffisamment l\'attention des gérants d\'agences immobilières.',
        actionRecommendation:
          language === 'ar'
            ? 'تجديد التصاميم الإعلانية وإطلاق فيديوهات تتضمن دراسة حالة واقعية وأرقاماً ملموسة.'
            : language === 'en'
            ? 'Refresh creatives with direct Facecam breakdown of real case studies and agency revenue numbers.'
            : 'Lancez 3 nouveaux créatifs vidéo format UGC / Facecam montrant des résultats d\'acquisition de mandats.',
        actionItems: [
          language === 'ar'
            ? 'استخدام افتتاحية مباشرة: "إلى مديري وملاك الوكالات العقارية..."'
            : 'Tester un hook direct : "Propriétaires d\'agences immobilières au Maroc..."',
          language === 'ar'
            ? 'عرض لقطات شاشة حقيقية لصفقات وتفويضات تم إغلاقها كإثبات واقعي.'
            : 'Utiliser des captures d\'écran de CRM et de mandats signés comme preuve visuelle.',
        ],
      });
    }

    // Check 4: Closing Rate
    if (wonStage.conversionRate >= 20) {
      alerts.push({
        id: 'alert-close-healthy',
        stageKey: 'won',
        stageName: t.funnel.stageWon,
        severity: 'healthy',
        metric: t.kpis.closeRate,
        currentRate: wonStage.conversionRate,
        benchmarkRate: 20.0,
        problemSummary:
          language === 'ar'
            ? 'كفاءة بيعية عالية: نسبة إغلاق الصفقات تفوق 20%'
            : language === 'en'
            ? 'Strong Closing Performance (Above 20%)'
            : 'Excellente conversion commerciale (Supérieure à 20%)',
        impactExplanation:
          language === 'ar'
            ? 'عندما يحضر العميل المحتمل المكالمة، فإن عرضك وقدرتك على الإقناع تحقق نسبة نجاح ممتازة.'
            : language === 'en'
            ? 'When prospects actually attend the call, your sales pitch and offer structure are highly compelling.'
            : 'Votre offre et votre structure d\'appel convertissent très bien une fois le prospect en ligne.',
        actionRecommendation:
          language === 'ar'
            ? 'المشكلة ليست في المبيعات، بل في زيادة عدد الحاضرين للمكالمات وتدفق العملاء المؤهلين.'
            : language === 'en'
            ? 'Focus your budget on fixing show-up rate and landing page to flood this high-converting sales process.'
            : 'Votre priorité absolue doit être de maximiser la présence aux RDV pour alimenter ce closing performant.',
        actionItems: [
          language === 'ar'
            ? 'زيادة الميزانية في الحملات الأكثر تحقيقاً للمواعيد المؤهلة.'
            : 'Augmenter le budget des campagnes Meta les plus rentables.',
          language === 'ar'
            ? 'الحفاظ على نفس طريقة العرض مع تقديم حافز للتعاقد الفوري في نفس المكالمة.'
            : 'Conserver la même trame de vente tout en proposant un acompte immédiat.',
        ],
      });
    }

    return alerts;
  }, [funnelStages, language, t]);

  // Lead CRUD
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const updateLeadStatus = (id: string, newStatus: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          const updatedOutcome =
            newStatus === 'meeting_held' || newStatus === 'proposal_sent' || newStatus === 'won'
              ? 'showed'
              : lead.meetingOutcome;
          return { ...lead, status: newStatus, meetingOutcome: updatedOutcome };
        }
        return lead;
      })
    );
  };

  // Campaign CRUD
  const addCampaign = (campaignData: Omit<MetaCampaign, 'id'>) => {
    const newCampaign: MetaCampaign = {
      ...campaignData,
      id: `camp-${Date.now()}`,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<MetaCampaign>) => {
    setCampaigns((prev) =>
      prev.map((camp) => (camp.id === id ? { ...camp, ...updates } : camp))
    );
  };

  const resetToMockData = () => {
    setLeads(initialLeads);
    setCampaigns(initialCampaigns);
    localStorage.removeItem(LOCAL_STORAGE_LEADS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
  };

  const importLeadsJSON = (data: Lead[]) => {
    if (Array.isArray(data) && data.length > 0) {
      setLeads(data);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Agency Name',
      'City',
      'Contact',
      'Phone',
      'Email',
      'Status',
      'Deal Value',
      'Ad Source',
      'Created At',
      'Meeting Date',
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.agencyName}"`,
      `"${l.city}"`,
      `"${l.contactPerson}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.status}"`,
      l.dealValue,
      `"${l.adSource}"`,
      `"${l.createdAt}"`,
      `"${l.meetingDate || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `immo_metrics_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        theme,
        setTheme,
        activeTab,
        setActiveTab,
        leads,
        campaigns,
        addLead,
        updateLead,
        deleteLead,
        updateLeadStatus,
        addCampaign,
        updateCampaign,
        resetToMockData,
        importLeadsJSON,
        exportToCSV,
        formatMoney,
        t,
        funnelStages,
        diagnosticAlerts,
        totalSpend,
        totalRevenue,
        overallROAS,
        overallCAC,
        totalLeadsCount,
        totalMeetingsBooked,
        totalMeetingsHeld,
        totalDealsWon,
        showLeadModal,
        setShowLeadModal,
        selectedLeadForEdit,
        setSelectedLeadForEdit,
        showWebhookModal,
        setShowWebhookModal,
        integrationSettings,
        updateIntegrationSettings,
        clearAllData,
        setCampaignDirectMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
