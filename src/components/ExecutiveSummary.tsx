import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Users,
  CalendarCheck,
  Award,
  AlertTriangle,
  ArrowRight,
  Target,
  Percent,
  Activity,
} from 'lucide-react';

export const ExecutiveSummary: React.FC = () => {
  const {
    t,
    formatMoney,
    totalSpend,
    totalRevenue,
    overallROAS,
    overallCAC,
    totalLeadsCount,
    totalMeetingsBooked,
    totalMeetingsHeld,
    totalDealsWon,
    diagnosticAlerts,
    setActiveTab,
    language,
  } = useApp();

  const cpl = totalLeadsCount > 0 ? totalSpend / totalLeadsCount : 0;
  const costPerMeeting = totalMeetingsHeld > 0 ? totalSpend / totalMeetingsHeld : 0;
  const showUpRate =
    totalMeetingsBooked > 0 ? Math.round((totalMeetingsHeld / totalMeetingsBooked) * 100) : 0;
  const closeRate =
    totalMeetingsHeld > 0 ? Math.round((totalDealsWon / totalMeetingsHeld) * 100) : 0;

  const criticalAlert = diagnosticAlerts.find((a) => a.severity === 'critical');

  const topKPIs = [
    {
      label: language === 'ar' ? 'إجمالي المداخيل المحققة' : t.kpis.revenue,
      value: formatMoney(totalRevenue),
      subtext: language === 'ar'
        ? `${totalDealsWon} وكالات عقارية تم إغلاق العقود معها`
        : `${totalDealsWon} agences clientes actives signées`,
      tag: language === 'ar' ? 'صافي المداخيل' : 'Chiffre d\'Affaires',
      icon: Award,
      iconColor: 'text-emerald-700 bg-emerald-50',
      valueColor: 'text-slate-900',
      benchmark: language === 'ar' ? 'الهدف: 100,000 د.م.' : 'Cible: 100k DH',
    },
    {
      label: language === 'ar' ? 'ميزانية إعلانات ميتا' : t.kpis.metaSpend,
      value: formatMoney(totalSpend),
      subtext: language === 'ar'
        ? `${totalLeadsCount} استمارة وكالة مستلمة`
        : `${totalLeadsCount} formulaires agences reçus`,
      tag: language === 'ar' ? 'الميزانية المنفقة' : 'Budget Meta Ads',
      icon: DollarSign,
      iconColor: 'text-petrol-800 bg-petrol-50',
      valueColor: 'text-slate-900',
      benchmark: language === 'ar' ? 'الميزانية المستهلكة' : 'Budget Dépensé',
    },
    {
      label: language === 'ar' ? 'العائد على الإنفاق (ROAS)' : t.kpis.roas,
      value: `${overallROAS}x`,
      subtext: language === 'ar'
        ? `كل 1 د.م. إعلاني جلب ${overallROAS} د.م. إيرادات`
        : `1 DH investi génère ${overallROAS} DH de vente`,
      tag: language === 'ar' ? 'مضاعف الأرباح' : 'Multiplicateur ROAS',
      icon: Target,
      iconColor: overallROAS >= 3 ? 'text-neon-600 bg-orange-50' : 'text-amber-700 bg-amber-50',
      valueColor: overallROAS >= 3 ? 'text-neon-600' : 'text-amber-700',
      benchmark: language === 'ar' ? 'المعيار: > 3.0x' : 'Objectif: > 3.0x',
    },
    {
      label: language === 'ar' ? 'تكلفة اكتساب الوكالة (CAC)' : t.kpis.cac,
      value: formatMoney(overallCAC),
      subtext: language === 'ar'
        ? 'متوسط تكلفة كسب كل وكالة جديدة'
        : `Coût pour signer 1 agence`,
      tag: language === 'ar' ? 'تكلفة الاكتساب' : 'CAC Unitaire',
      icon: Users,
      iconColor: 'text-slate-700 bg-slate-100',
      valueColor: 'text-slate-900',
      benchmark: language === 'ar' ? 'المعيار: < 6,000 د.م.' : 'Cible: < 6k DH',
    },
  ];

  const secondaryKPIs = [
    {
      label: language === 'ar' ? 'تكلفة الاستمارة (CPL)' : t.kpis.cpl,
      value: formatMoney(cpl),
      subtext: language === 'ar' ? 'تكلفة النموذج الواحد' : 'Coût par formulaire',
      benchmark: language === 'ar' ? 'المعيار: ~150 د.م.' : 'Std: ~150 DH',
      icon: Activity,
      color: 'text-slate-900',
    },
    {
      label: language === 'ar' ? 'تكلفة الموعد الفعلي' : t.kpis.costPerMeeting,
      value: formatMoney(costPerMeeting),
      subtext: language === 'ar'
        ? `${totalMeetingsHeld} موعد تم / ${totalMeetingsBooked} محجوز`
        : `${totalMeetingsHeld} tenus / ${totalMeetingsBooked} réservés`,
      benchmark: language === 'ar' ? 'المعيار: ~700 د.م.' : 'Std: ~700 DH',
      icon: CalendarCheck,
      color: 'text-slate-900',
    },
    {
      label: language === 'ar' ? 'نسبة حضور المواعيد' : t.kpis.showUpRate,
      value: `${showUpRate}%`,
      subtext: showUpRate < 65
        ? (language === 'ar' ? 'تسريب في الحضور (غياب)' : 'Perte importante par absence')
        : (language === 'ar' ? 'نسبة حضور مستقرة' : 'Taux sain (Cible > 70%)'),
      benchmark: language === 'ar' ? 'الهدف: > 70%' : 'Cible: > 70%',
      icon: Percent,
      color: showUpRate < 65 ? 'text-neon-600' : 'text-emerald-700',
      isWarning: showUpRate < 65,
    },
    {
      label: language === 'ar' ? 'نسبة إغلاق العقود' : t.kpis.closeRate,
      value: `${closeRate}%`,
      subtext: language === 'ar'
        ? 'تحول الحاضرين إلى عملاء متعاقدين'
        : 'Des RDV tenus deviennent clients',
      benchmark: language === 'ar' ? 'الهدف: 20% - 25%' : 'Cible: 20% - 25%',
      icon: Award,
      color: 'text-emerald-700',
      isWarning: false,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Critical Bottleneck Alert Notification Bar: Clean, sleek SaaS notification */}
      {criticalAlert && (
        <div className="bg-white rounded-xl border border-neon-500/40 p-4 sm:p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-orange-50 text-neon-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-neon-600">
                    {criticalAlert.problemSummary}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-xs font-mono text-slate-500">
                    {criticalAlert.currentRate}% {language === 'ar' ? 'الفعلي' : 'actuel'} مقابل {criticalAlert.benchmarkRate}% {language === 'ar' ? 'المعيار' : 'cible'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {criticalAlert.impactExplanation} <span className="font-semibold text-slate-800">{criticalAlert.actionRecommendation}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('funnel')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neon-500 hover:bg-neon-600 active:scale-[0.98] rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>{language === 'ar' ? 'معالجة التسريب' : 'Corriger'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Cards (Pure White, modern hairline border, balanced typography) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {topKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all flex flex-col justify-between w-full min-w-0"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 truncate">
                    {kpi.label}
                  </span>
                  <div className={`p-1.5 rounded-lg shrink-0 ${kpi.iconColor}`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                </div>

                {/* Balanced, modern metric value */}
                <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight mb-1 ${kpi.valueColor}`}>
                  {kpi.value}
                </div>

                <div className="text-xs text-slate-500 leading-relaxed">
                  {kpi.subtext}
                </div>
              </div>

              {/* Clean unboxed footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{kpi.benchmark}</span>
                <span className="text-slate-600 font-medium">{kpi.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Unit Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {secondaryKPIs.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className={`p-4 sm:p-4.5 rounded-xl bg-white border ${
                kpi.isWarning
                  ? 'border-neon-500/40 bg-orange-50/10'
                  : 'border-slate-200/80'
              } flex items-center justify-between gap-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all w-full min-w-0`}
            >
              <div className="space-y-0.5 overflow-hidden flex-1 min-w-0">
                <span className="text-xs font-medium text-slate-500 block truncate">
                  {kpi.label}
                </span>
                <div className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${kpi.color}`}>
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {kpi.subtext}
                </div>
              </div>
              <div className="text-right rtl:text-left shrink-0">
                <span className="text-[11px] font-mono text-slate-500 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 whitespace-nowrap block">
                  {kpi.benchmark}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
