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

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const newClientsThisMonth = clients.filter((client) => {
    const createdAt = new Date(client.createdAt);
    return !Number.isNaN(createdAt.getTime()) && createdAt >= monthStart;
  }).length;
  const scheduledMeetingsCount = meetings.filter((meeting) => meeting.status === 'scheduled').length;
  const completedMeetingsCount = meetings.filter((meeting) => meeting.status === 'completed').length;
  const attendedMeetingsCount = meetings.filter(
    (meeting) => meeting.status === 'completed' && Boolean(meeting.meetingOutcome)
  ).length;
  const noShowMeetingsCount = meetings.filter((meeting) => meeting.status === 'no_show').length;
  const successfulDealsCount = clients.filter(
    (client) => ['deal_won', 'delivery_in_progress', 'active_retainer'].includes(client.stage)
  ).length;
  const rejectedClientsCount = clients.filter((client) => client.stage === 'lost').length;
  const followUpClientIds = new Set([
    ...clients.filter((client) => client.stage === 'meeting_completed').map((client) => client.id),
    ...meetings.filter((meeting) => meeting.meetingOutcome === 'follow_up').map((meeting) => meeting.clientId),
  ]);
  const followUpCount = followUpClientIds.size;

  const overviewStats = [
    { label: language === 'ar' ? 'إجمالي العملاء المحتملين' : language === 'fr' ? 'Total des prospects' : 'Total prospects', value: clients.length, tone: 'teal' },
    { label: language === 'ar' ? 'العملاء الجدد هذا الشهر' : language === 'fr' ? 'Nouveaux clients ce mois' : 'New clients this month', value: newClientsThisMonth, tone: 'blue' },
    { label: language === 'ar' ? 'المواعيد المجدولة' : language === 'fr' ? 'Rendez-vous planifiés' : 'Scheduled appointments', value: scheduledMeetingsCount, tone: 'indigo' },
    { label: language === 'ar' ? 'المواعيد المكتملة' : language === 'fr' ? 'Rendez-vous terminés' : 'Completed appointments', value: completedMeetingsCount, tone: 'purple' },
    { label: language === 'ar' ? 'حضر الموعد' : language === 'fr' ? 'Présences confirmées' : 'Attended appointments', value: attendedMeetingsCount, tone: 'green' },
    { label: language === 'ar' ? 'غاب عن الموعد' : language === 'fr' ? 'Absences' : 'No-shows', value: noShowMeetingsCount, tone: 'rose' },
    { label: language === 'ar' ? 'الصفقات الناجحة' : language === 'fr' ? 'Affaires conclues' : 'Successful deals', value: successfulDealsCount, tone: 'emerald' },
    { label: language === 'ar' ? 'الرافضون' : language === 'fr' ? 'Refus' : 'Rejected', value: rejectedClientsCount, tone: 'orange' },
    { label: language === 'ar' ? 'قيد المتابعة' : language === 'fr' ? 'À suivre' : 'In follow-up', value: followUpCount, tone: 'amber' },
  ];

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

      {/* Operational overview statistics */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
            {language === 'ar' ? 'مؤشرات العملاء والمواعيد والصفقات' : language === 'fr' ? 'Indicateurs clients, rendez-vous et affaires' : 'Client, appointment & deal metrics'}
          </h2>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-500">
            {language === 'ar' ? 'محدثة حسب البيانات المسجلة' : language === 'fr' ? 'Selon les données enregistrées' : 'Based on recorded data'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#DCE8EA] shadow-sm min-w-0">
              <span className="block text-[11px] sm:text-xs font-bold text-slate-600 leading-relaxed min-h-[34px]">{stat.label}</span>
              <strong className="block mt-1 text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-[#082E35]">{stat.value.toLocaleString()}</strong>
            </div>
          ))}
        </div>
      </section>

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
                  {upcomingMeetingsSoon[0].phone} • {new Date(upcomingMeetingsSoon[0].scheduledTime).toLocaleTimeString(language === 'ar' ? 'ar-MA' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
