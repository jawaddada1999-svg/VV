import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Activity,
  Users,
  Building,
  FileCheck2,
  Plus,
  AlertCircle,
  CreditCard,
  Video,
  UserCheck,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { translations } from '../../translations';
import { IbondaLogo } from '../IbondaLogo';

export const OverviewTab: React.FC = () => {
  const {
    metrics,
    clients,
    meetings,
    invoices,
    campaigns,
    packages,
    setActiveTab,
    setSelectedClientId,
    acceptTrialAndCloseDeal,
    markInvoicePaid,
    language,
    direction,
    setShowAddClientModal,
  } = useAgency();

  const t = translations[language];

  // Time filter for charts: Monthly vs Weekly
  const [chartView, setChartView] = useState<'monthly' | 'weekly'>('weekly');

  // Financial Performance chart controls: 1M (weekly) / 3M / 6M / 12M, chart view mode, and cost scope
  const [financialRange, setFinancialRange] = useState<'1m' | '3m' | '6m' | '12m'>('1m');
  const [financialChartMode, setFinancialChartMode] = useState<'amounts' | 'margin'>('amounts');
  const [includeClientTools, setIncludeClientTools] = useState<boolean>(true);

  // 1. Attendance Rate Calculation (نسبة حضور المواعيد)
  const completedMeetings = meetings.filter((m) => m.status === 'completed').length;
  const attendanceDenominator = meetings.filter((m) => m.status === 'completed' || m.status === 'no_show').length;
  const attendanceRate = attendanceDenominator > 0
    ? Math.round((completedMeetings / attendanceDenominator) * 100)
    : 0;

  // 2. Urgent Alerts:
  const activeTrials = clients.filter((c) => c.stage === 'trial_7_days');
  const unpaidInvoices = invoices.filter((inv) => inv.status === 'pending' || inv.status === 'overdue');

  const now = Date.now();
  const upcomingMeetingsSoon = meetings.filter((m) => {
    if (m.status !== 'scheduled') return false;
    const diffMin = (new Date(m.scheduledTime).getTime() - now) / (1000 * 60);
    return diffMin >= -10 && diffMin <= 60;
  });

  // 3. Weekly & Monthly Historical / Projected Retainer & Deals Data
  // Historical charts must use recorded data only; no illustrative figures are presented as actual results.
  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 5 + index);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthInvoices = invoices.filter((invoice) => {
      const paidDate = invoice.paidDate ? new Date(invoice.paidDate) : null;
      return invoice.status === 'paid' && paidDate && paidDate.getFullYear() === year && paidDate.getMonth() === month;
    });
    const period = date.toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: '2-digit' });
    return {
      period,
      retainerMrr: clients.filter((client) => client.stage === 'active_retainer' && client.maintenanceStartDate && new Date(client.maintenanceStartDate) <= new Date(year, month + 1, 0)).reduce((sum, client) => sum + (client.monthlyRetainer || 0), 0),
      setupCash: monthInvoices.reduce((sum, invoice) => sum + invoice.amount, 0),
      deals: clients.filter((client) => client.contractDate && new Date(client.contractDate).getFullYear() === year && new Date(client.contractDate).getMonth() === month).length,
    };
  });

  const weeklyData = Array.from({ length: 4 }, (_, index) => {
    const start = new Date();
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (3 - index) * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const periodInvoices = invoices.filter((invoice) => {
      const date = invoice.paidDate ? new Date(invoice.paidDate) : null;
      return invoice.status === 'paid' && date && date >= start && date < end;
    });
    return {
      period: start.toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' }),
      retainerMrr: clients.filter((client) => client.stage === 'active_retainer').reduce((sum, client) => sum + (client.monthlyRetainer || 0), 0),
      setupCash: periodInvoices.reduce((sum, invoice) => sum + invoice.amount, 0),
      deals: periodInvoices.filter((invoice) => invoice.type === 'setup_fee').length,
    };
  });

  const currentChartData = chartView === 'weekly' ? weeklyData : monthlyData;

  // 3B. Financial Performance Dataset (1M weekly breakdown + 3M / 6M / 12M monthly trajectory)
  const raw12Months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - 11 + index);
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthInvoices = invoices.filter((invoice) => {
      const paidDate = invoice.paidDate ? new Date(invoice.paidDate) : null;
      return invoice.status === 'paid' && paidDate && paidDate.getFullYear() === year && paidDate.getMonth() === month;
    });
    const monthCampaigns = campaigns.filter((campaign) => {
      const campaignDate = new Date(campaign.startDate);
      return campaignDate.getFullYear() === year && campaignDate.getMonth() === month;
    });
    const monthExpenses = clients.flatMap((client) => client.expenses || []).filter((expense) => {
      const created = new Date(expense.createdAt);
      return expense.isActive && created.getFullYear() === year && created.getMonth() === month;
    });
    return {
      period: date.toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short', year: '2-digit' }),
      retainerRevenue: monthInvoices.filter((invoice) => invoice.type === 'monthly_retainer').reduce((sum, invoice) => sum + invoice.amount, 0),
      adSpend: monthCampaigns.reduce((sum, campaign) => sum + (Number(campaign.spend) || 0), 0),
      toolCosts: monthExpenses.reduce((sum, expense) => sum + (Number(expense.monthlyCost) || 0), 0),
    };
  });

  const rawCurrentMonthWeeks = Array.from({ length: 4 }, (_, index) => {
    const start = new Date();
    start.setDate(1 + index * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const monthInvoices = invoices.filter((invoice) => {
      const paidDate = invoice.paidDate ? new Date(invoice.paidDate) : null;
      return invoice.status === 'paid' && invoice.type === 'monthly_retainer' && paidDate && paidDate >= start && paidDate < end;
    });
    const monthCampaigns = campaigns.filter((campaign) => {
      const date = new Date(campaign.startDate);
      return date >= start && date < end;
    });
    const weekExpenses = clients.flatMap((client) => client.expenses || []).filter((expense) => {
      const date = new Date(expense.createdAt);
      return expense.isActive && date >= start && date < end;
    });
    return {
      period: language === 'ar' ? `الأسبوع ${index + 1}` : language === 'fr' ? `Semaine ${index + 1}` : `Week ${index + 1}`,
      retainerRevenue: monthInvoices.reduce((sum, invoice) => sum + invoice.amount, 0),
      adSpend: monthCampaigns.reduce((sum, campaign) => sum + (Number(campaign.spend) || 0), 0),
      toolCosts: weekExpenses.reduce((sum, expense) => sum + (Number(expense.monthlyCost) || 0), 0),
    };
  });

  const selectedRawFinancial =
    financialRange === '1m'
      ? rawCurrentMonthWeeks
      : financialRange === '3m'
      ? raw12Months.slice(-3)
      : financialRange === '6m'
      ? raw12Months.slice(-6)
      : raw12Months;

  const financialSeries = selectedRawFinancial.map((item) => {
    const totalSpend = includeClientTools ? item.adSpend + item.toolCosts : item.adSpend;
    const netProfit = item.retainerRevenue - totalSpend;
    const profitMarginPct =
      item.retainerRevenue > 0 ? Math.round((netProfit / item.retainerRevenue) * 100) : 0;
    return {
      ...item,
      totalSpend,
      netProfit,
      profitMarginPct,
    };
  });

  // Summary headline KPIs represent the current full month (even when viewing 1M weekly bars)
  const headlineTotalSpend = includeClientTools
    ? metrics.totalAdSpendThisMonth + metrics.totalMonthlyClientExpenses
    : metrics.totalAdSpendThisMonth;
  const headlineNetProfit = metrics.currentMRR - headlineTotalSpend;
  const headlineMarginPct =
    metrics.currentMRR > 0 ? Math.round((headlineNetProfit / metrics.currentMRR) * 100) : 0;

  const firstPeriodMargin = financialSeries[0]?.profitMarginPct ?? 0;
  const lastPeriodMargin = financialSeries[financialSeries.length - 1]?.profitMarginPct ?? 0;
  const marginDeltaPts = lastPeriodMargin - firstPeriodMargin;

  const fpCopy = {
    ar: {
      title: 'الأداء المالي: مقارنة المداخيل، المصاريف وصافي الربح',
      subtitle:
        financialRange === '1m'
          ? 'تفصيل هذا الشهر أسبوعاً بأسبوع: كم دخل من الصيانة، كم صُرف في الإعلانات والأدوات، وكم بقي لك كربح صافي'
          : 'مقارنة واضحة بالدرهم بين عوائد الصيانة الشهرية، مصاريف الإعلانات والأدوات، وصافي الربح الفعلي المتبقي',
      range1m: 'شهر 1',
      range3m: '3 أشهر',
      range6m: '6 أشهر',
      range12m: '12 شهر',
      modeAmounts: 'المبالغ (درهم)',
      modeMargin: 'هامش الربح (%)',
      scopeAll: 'إعلانات + اشتراكات',
      scopeAdsOnly: 'إعلانات فقط',
      statRetainer: 'عوائد الصيانة (الشهر الحالي)',
      statAdSpend: includeClientTools ? 'مصاريف الإعلانات والاشتراكات' : 'الإنفاق الإعلاني الشهري',
      statNetProfit: 'صافي الربح الفعلي المتبقي',
      statMargin: 'نسبة هامش الربح',
      legendRetainer: 'مداخيل الصيانة',
      legendSpend: includeClientTools ? 'الإعلانات + الاشتراكات' : 'الإنفاق الإعلاني',
      legendNetProfit: 'صافي الربح المتبقي',
      legendMargin: 'نسبة الربح الصافي (%)',
      tooltipAds: 'مصاريف الإعلانات',
      tooltipTools: 'اشتراكات أدوات العملاء',
      tooltipNet: 'صافي الربح المتبقي',
      tooltipMargin: 'هامش الربح',
      breakdownTitle: financialRange === '1m' ? 'ملخص أسابيع هذا الشهر:' : 'ملخص صافي الربح لكل شهر:',
      madShort: 'د.م',
    },
    fr: {
      title: 'Performance Financière : Revenus, Dépenses & Bénéfice Net',
      subtitle:
        financialRange === '1m'
          ? 'Détail hebdomadaire du mois en cours : revenus de maintenance, dépenses pubs/outils et bénéfice net réel'
          : 'Comparaison claire en MAD entre revenus mensuels de maintenance, dépenses publicitaires et profit net restant',
      range1m: '1 mois',
      range3m: '3 mois',
      range6m: '6 mois',
      range12m: '12 mois',
      modeAmounts: 'Montants (MAD)',
      modeMargin: 'Marge (%)',
      scopeAll: 'Pubs + Abonnements',
      scopeAdsOnly: 'Pubs uniquement',
      statRetainer: 'Revenus Maintenance (Mois)',
      statAdSpend: includeClientTools ? 'Dépenses Pubs & Outils' : 'Dépenses Pubs (Mois)',
      statNetProfit: 'Bénéfice Net Restant',
      statMargin: 'Marge Bénéficiaire',
      legendRetainer: 'Revenus Maintenance',
      legendSpend: includeClientTools ? 'Pubs + Abonnements' : 'Dépenses Pubs',
      legendNetProfit: 'Bénéfice Net',
      legendMargin: 'Marge Nette (%)',
      tooltipAds: 'Dépenses Pubs',
      tooltipTools: 'Abonnements Outils Clients',
      tooltipNet: 'Bénéfice Net Restant',
      tooltipMargin: 'Marge Nette',
      breakdownTitle: financialRange === '1m' ? 'Détail par semaine (mois actuel) :' : 'Marge nette par mois :',
      madShort: 'MAD',
    },
    en: {
      title: 'Financial Performance: Revenue, Spend & Net Profit',
      subtitle:
        financialRange === '1m'
          ? 'Current month broken down week by week: retainer cash in, ad & tool costs out, and net profit remaining'
          : 'Clear side-by-side MAD comparison of monthly retainer revenue, total ad/tool spend, and actual net profit',
      range1m: '1 Month',
      range3m: '3 Months',
      range6m: '6 Months',
      range12m: '12 Months',
      modeAmounts: 'Amounts (MAD)',
      modeMargin: 'Margin (%)',
      scopeAll: 'Ads + Subscriptions',
      scopeAdsOnly: 'Ad Spend Only',
      statRetainer: 'Retainer Revenue (Month)',
      statAdSpend: includeClientTools ? 'Ads + Tools Spend' : 'Monthly Ad Spend',
      statNetProfit: 'Actual Net Profit',
      statMargin: 'Current Profit Margin',
      legendRetainer: 'Retainer Revenue',
      legendSpend: includeClientTools ? 'Ads + Tool Costs' : 'Ad Spend',
      legendNetProfit: 'Net Profit',
      legendMargin: 'Profit Margin (%)',
      tooltipAds: 'Ad Spend',
      tooltipTools: 'Client Subscriptions',
      tooltipNet: 'Actual Net Profit',
      tooltipMargin: 'Profit Margin',
      breakdownTitle: financialRange === '1m' ? 'Weekly breakdown (this month):' : 'Net profit & margin by month:',
      madShort: 'MAD',
    },
  }[language];

  const badgeLabels = {
    cash: language === 'ar' ? 'تحصيل' : language === 'fr' ? 'Cash' : 'Cash',
    showUp: language === 'ar' ? 'الحضور' : language === 'fr' ? 'Présence' : 'Show-Up',
    channels: language === 'ar' ? 'ميتا وجوجل' : language === 'fr' ? 'Meta & Google' : 'Meta & Google',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Hero Banner with Quick Contract Action */}
      <div className="bg-gradient-to-l from-[#06262B] via-[#0B3A42] to-[#082E35] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex items-start gap-3 sm:gap-4">
          <div className="hidden sm:block shrink-0">
            <IbondaLogo size="xl" variant="dark" showText={false} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-gradient-to-r from-[#FF6600] to-amber-500 text-white shadow-xs">
                {t.brandTitle}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.statusRunningLive}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
              {t.overviewTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t.overviewSub}
            </p>
          </div>
        </div>

        {/* Quick Action: + New Deal + MRR Summary */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full md:w-auto shrink-0 relative z-10 flex-wrap">
          <button
            onClick={() => setShowAddClientModal(true)}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6600] to-[#E65500] hover:from-[#E65500] hover:to-[#CC4A00] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-[0.98]"
          >
            <FileCheck2 className="w-4 h-4 stroke-[2.5]" />
            <span>{t.btnNewContract}</span>
          </button>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl sm:rounded-2xl border border-white/20 font-mono shadow-inner text-center">
            <span className="text-[10px] text-orange-200 block font-sans font-bold">{t.kpiRetainerMRR}</span>
            <span className="text-base sm:text-xl font-extrabold text-orange-400">
              {metrics.currentMRR.toLocaleString()} {t.perMonth}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Operational Metrics Grid (Uniform 2-Column Mobile Grid -> 5-Column Desktop) */}
      <div className="vv-kpi-grid grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {/* Metric 1: Monthly Maintenance MRR */}
        <div className="vv-kpi-card bg-white p-4 sm:p-5 rounded-[22px] border border-[#DCE8EA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span className="p-2 rounded-xl bg-[#FF6600] text-white shadow-xs shrink-0">
                <Zap className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-[10px] font-bold text-orange-900 bg-orange-100 px-2 py-0.5 rounded-full font-mono truncate">
                {metrics.activeRetainerClients} {t.clientsUnit}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">{t.kpiRetainerMRR}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-2xl font-extrabold font-mono tabular-nums text-orange-950">
                {metrics.currentMRR.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">{t.perMonth}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono tabular-nums font-bold text-emerald-700">
              <span>
                {language === 'ar' ? 'الصافي المتبقي:' : language === 'fr' ? 'Net restant :' : 'Net profit:'}{' '}
                {metrics.netRetainerProfit.toLocaleString()} {t.mad}
              </span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-orange-200/60 text-[10px] text-slate-600 flex items-center justify-between gap-1">
            <span className="truncate hidden sm:inline font-mono tabular-nums text-orange-800 font-semibold">
              -{metrics.totalMonthlyClientExpenses.toLocaleString()} {language === 'ar' ? 'مصاريف' : language === 'fr' ? 'outils' : 'tools'}
            </span>
            <button
              onClick={() => setActiveTab('retainers')}
              className="text-[#FF6600] font-extrabold hover:underline cursor-pointer truncate"
            >
              {t.navRetainers} →
            </button>
          </div>
        </div>

        {/* Metric 2: 7-Day Free Trials */}
        <div className="vv-kpi-card bg-white p-4 sm:p-5 rounded-[22px] border border-[#DCE8EA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
                <Clock className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-mono truncate">
                {metrics.trialsInProgress} {t.active}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">{t.kpiActiveTrials}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-2xl font-extrabold font-mono text-amber-700">
                {metrics.trialsInProgress}
              </span>
              <span className="text-[11px] font-bold text-slate-500">{t.clientsUnit}</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-amber-200/60 text-[10px] text-slate-600 flex items-center justify-between gap-1">
            <span className="truncate hidden sm:inline">{t.kpiActiveTrialsSub}</span>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-amber-800 font-extrabold hover:underline cursor-pointer truncate"
            >
              {t.navPipeline} →
            </button>
          </div>
        </div>

        {/* Metric 3: Active Builds */}
        <div className="vv-kpi-card bg-white p-4 sm:p-5 rounded-[22px] border border-[#DCE8EA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span className="p-2 rounded-xl bg-purple-600 text-white shadow-xs shrink-0">
                <Layers className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full font-mono truncate">
                {t.pending}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">{t.cardInBuildTitle}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-2xl font-extrabold font-mono text-purple-950">
                {metrics.buildProjectsActive}
              </span>
              <span className="text-[11px] font-bold text-slate-500">{t.projectsUnit}</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-purple-200/60 text-[10px] text-slate-600 flex items-center justify-between gap-1">
            <span className="truncate hidden sm:inline">{t.cardInBuildSub}</span>
            <button
              onClick={() => setActiveTab('delivery')}
              className="text-purple-700 font-extrabold hover:underline cursor-pointer truncate"
            >
              {t.navDelivery} →
            </button>
          </div>
        </div>

        {/* Metric 4: Total Cash Collected */}
        <div className="vv-kpi-card bg-white p-4 sm:p-5 rounded-[22px] border border-[#DCE8EA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full truncate">
                {badgeLabels.cash}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">{t.kpiSetupCash}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-800">
                {metrics.totalRevenueCash.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-slate-500">{t.mad}</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 text-[10px] text-slate-600 flex items-center justify-between gap-1">
            <span className="truncate hidden sm:inline">{t.kpiSetupCashSub}</span>
            <button
              onClick={() => setActiveTab('retainers')}
              className="text-emerald-700 font-extrabold hover:underline cursor-pointer truncate"
            >
              {t.subtabInvoices} →
            </button>
          </div>
        </div>

        {/* Metric 5: Meeting Attendance Rate */}
        <div className="vv-kpi-card col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-[22px] border border-[#DCE8EA] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-2">
              <span className="p-2 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
                <UserCheck className="w-4 h-4 stroke-[2.5]" />
              </span>
              <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full truncate">
                {badgeLabels.showUp}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">{t.kpiAttendanceRate}</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-2xl font-extrabold font-mono text-blue-900">
                {attendanceRate}%
              </span>
              <span className="text-[11px] font-bold text-slate-500">{t.attended}</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-blue-200/60 text-[10px] text-slate-600 flex items-center justify-between gap-1">
            <span>{completedMeetings} / {totalMeetingsCount} {t.meetingsUnit}</span>
            <button
              onClick={() => setActiveTab('meetings')}
              className="text-blue-700 font-extrabold hover:underline cursor-pointer truncate"
            >
              {t.navMeetings} →
            </button>
          </div>
        </div>
      </div>

      {/* Operational pipeline KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {[{label:language==='ar'?'إجمالي العملاء المحتملين':language==='fr'?'Total des prospects':'Total prospects',value:clients.filter(c=>['ad_lead','meeting_scheduled','meeting_completed'].includes(c.stage)).length},{label:language==='ar'?'عملاء جدد':language==='fr'?'Nouveaux clients':'New leads',value:clients.filter(c=>c.stage==='ad_lead').length},{label:language==='ar'?'المواعيد المحجوزة':language==='fr'?'Rendez-vous réservés':'Scheduled appointments',value:meetings.filter(m=>m.status==='scheduled').length},{label:language==='ar'?'المواعيد المكتملة':language==='fr'?'Rendez-vous effectués':'Completed appointments',value:meetings.filter(m=>m.status==='completed').length},{label:language==='ar'?'حالات عدم الحضور':language==='fr'?'Absences aux rendez-vous':'No-show',value:meetings.filter(m=>m.status==='no_show').length},{label:language==='ar'?'صفقات ناجحة':language==='fr'?'Affaires conclues':'Successful deals',value:clients.filter(c=>['deal_won','active_retainer'].includes(c.stage)).length},{label:language==='ar'?'عملاء مرفوضون':language==='fr'?'Prospects non convertis':'Rejected',value:clients.filter(c=>c.stage==='lost').length},{label:language==='ar'?'في المتابعة':language==='fr'?'En cours de suivi':'In follow-up',value:clients.filter(c=>c.stage==='negotiation_follow_up' || c.stage==='paused').length + meetings.filter(m=>m.meetingOutcome==='follow_up').length},{label:language==='ar'?'حضور المواعيد':language==='fr'?'Présence aux rendez-vous':'Attended',value:meetings.filter(m=>m.status==='completed').length}].map((item,index)=>{const tone=[{"card":"from-sky-50 to-white border-sky-200","label":"text-sky-700","bar":"bg-sky-400"},{"card":"from-emerald-50 to-white border-emerald-200","label":"text-emerald-700","bar":"bg-emerald-400"},{"card":"from-violet-50 to-white border-violet-200","label":"text-violet-700","bar":"bg-violet-400"},{"card":"from-amber-50 to-white border-amber-200","label":"text-amber-700","bar":"bg-amber-400"},{"card":"from-rose-50 to-white border-rose-200","label":"text-rose-700","bar":"bg-rose-400"},{"card":"from-cyan-50 to-white border-cyan-200","label":"text-cyan-700","bar":"bg-cyan-400"}][index % 6];return <div key={item.label} className={`relative overflow-hidden bg-gradient-to-br ${tone.card} rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow`}><span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} /><div className={`text-[11px] font-extrabold ${tone.label}`}>{item.label}</div><div className="text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">{item.value}</div></div>})}
      </div>

      {/* 3. MULTI-ALERT COMMAND CENTER:
          Alert 1: Meeting starting in less than 30 mins
          Alert 2: Unpaid Invoices
          Alert 3: 7-Day Trials ending soon */}
      <div className="space-y-3">
        {/* A: Meeting Starting within 30 Minutes Alert */}
        {upcomingMeetingsSoon.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-md border border-blue-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold bg-white/25 px-2 py-0.5 rounded text-white">
                  {t.alertMeetingIn30}
                </span>
                <h4 className="text-sm font-extrabold mt-0.5">
                  {upcomingMeetingsSoon[0].agencyName} ({upcomingMeetingsSoon[0].clientName})
                </h4>
                <p className="text-xs text-blue-100">
                  {upcomingMeetingsSoon[0].phone} • {new Date(upcomingMeetingsSoon[0].scheduledTime).toLocaleTimeString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <a
                href={`tel:${upcomingMeetingsSoon[0].phone}`}
                className="px-3.5 py-2 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {t.btnDirectCall}
              </a>
              <button
                onClick={() => setActiveTab('meetings')}
                className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t.navMeetings}
              </button>
            </div>
          </div>
        )}

        {/* B: Unpaid Invoices Alert */}
        {unpaidInvoices.length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500 text-white shadow-xs">
                <CreditCard className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase font-mono bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                    {t.overdue}
                  </span>
                  <span className="text-xs font-bold text-rose-950">
                    {unpaidInvoices.length} {t.subtabInvoices} ({unpaidInvoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()} {t.mad})
                  </span>
                </div>
                <p className="text-xs text-rose-700 mt-0.5">
                  {unpaidInvoices[0].agencyName} - {unpaidInvoices[0].amount.toLocaleString()} {t.mad} ({unpaidInvoices[0].invoiceNumber})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => markInvoicePaid(unpaidInvoices[0].id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                ✓ {t.paid}
              </button>
              <button
                onClick={() => setActiveTab('retainers')}
                className="px-3 py-1.5 bg-rose-200 hover:bg-rose-300 text-rose-900 font-bold text-xs rounded-xl cursor-pointer"
              >
                {t.navRetainers}
              </button>
            </div>
          </div>
        )}

        {/* C: 7-Day Trials Expiring Soon */}
        {activeTrials.length > 0 && (
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-amber-200 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-700 stroke-[2.2]" />
                <h3 className="text-sm font-bold text-amber-950">
                  {t.alertTrialUrgent} ({activeTrials.length})
                </h3>
              </div>
              <span className="text-xs font-semibold text-amber-800">
                {t.kpiActiveTrialsSub}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTrials.map((client) => {
                const trialEnd = client.trialEndDate ? new Date(client.trialEndDate).getTime() : Date.now();
                const diffHours = Math.round((trialEnd - Date.now()) / (1000 * 60 * 60));
                const diffDays = Math.ceil(diffHours / 24);
                const isUrgent = diffHours <= 24;

                return (
                  <div
                    key={client.id}
                    className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{client.agencyName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          isUrgent ? 'bg-rose-100 text-rose-800 animate-bounce' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isUrgent ? t.trialUrgentWarning : `${t.trialExpiresIn}: ${diffDays} ${t.days}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-1.5">
                        <span>{client.contactPerson}</span>
                        <span>•</span>
                        <span className="font-mono" dir="ltr">{client.phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="font-mono text-xs">
                        <span className="font-bold text-slate-900">
                          {client.setupFee.toLocaleString()} {t.mad}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${client.phone}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t.call}</span>
                        </a>
                        <button
                          onClick={() => acceptTrialAndCloseDeal(client.id)}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          {t.btnAcceptTrial}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. REVENUE & DEALS GROWTH CHART: WEEKLY vs MONTHLY */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {t.chartRevenueTitle} ({chartView === 'weekly' ? t.btnWeeklyView : t.btnMonthlyView})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.chartRevenueSub}
            </p>
          </div>

          {/* Toggle Button for Weekly vs Monthly */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center">
            <button
              onClick={() => setChartView('weekly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                chartView === 'weekly'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.btnWeeklyView}
            </button>
            <button
              onClick={() => setChartView('monthly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                chartView === 'monthly'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.btnMonthlyView}
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="retainerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5500" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FF5500" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="setupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B434C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0B434C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748B' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any, name: any) => {
                  return [`${Number(val).toLocaleString()} ${t.mad}`, name];
                }}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="retainerMrr"
                name={t.kpiRetainerMRR}
                stroke="#FF5500"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#retainerGradient)"
                dot={{ r: 4, fill: '#FF5500' }}
              />
              <Area
                type="monotone"
                dataKey="setupCash"
                name={t.kpiSetupCash}
                stroke="#0B434C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#setupGradient)"
                dot={{ r: 3, fill: '#0B434C' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Visual End-to-End Pipeline Overview */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.dealsFunnelTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.dealsFunnelSub}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('pipeline')}
            className="text-xs font-bold text-[#FF6600] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{t.navPipeline}</span>
            {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
          {/* Step 1: Ads */}
          <div className={`p-3 sm:p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-bold text-blue-700 block truncate">{t.colAdLeadsTitle}</span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-blue-950 mt-1 block">75 {t.leads}</span>
            <span className="text-[11px] text-blue-800 font-medium">{badgeLabels.channels}</span>
          </div>

          {/* Step 2: Meetings */}
          <div className={`p-3 sm:p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-bold text-indigo-700 block truncate">{t.colMeetingsTitle}</span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-indigo-950 mt-1 block">
              {meetings.length} {t.meetingsUnit}
            </span>
            <span className="text-[11px] text-indigo-800 font-medium">{t.metricAttendedRate}: {attendanceRate}%</span>
          </div>

          {/* Step 3: 7-Day Trial */}
          <div className={`p-3 sm:p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-bold text-amber-800 block truncate">{t.colTrialTitle}</span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-amber-900 mt-1 block">
              {metrics.trialsInProgress} {t.clientsUnit}
            </span>
            <span className="text-[11px] text-amber-800 font-medium">7 {t.days}</span>
          </div>

          {/* Step 4: Build & Delivery */}
          <div className={`p-3 sm:p-3.5 rounded-xl border border-purple-200 bg-purple-50/70 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-bold text-purple-800 block truncate">{t.colDeliveryTitle}</span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-purple-950 mt-1 block">
              {metrics.buildProjectsActive} {t.projectsUnit}
            </span>
            <span className="text-[11px] text-purple-800 font-medium">{t.kpiSetupCash}</span>
          </div>

          {/* Step 5: Active Retainers */}
          <div className={`col-span-2 sm:col-span-1 p-3 sm:p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] font-bold text-emerald-800 block truncate">{t.colRetainerTitle}</span>
            <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-950 mt-1 block">
              {metrics.activeRetainerClients} {t.clientsUnit}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              {metrics.currentMRR.toLocaleString()} {t.perMonth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
