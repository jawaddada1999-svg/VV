import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  Target,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Zap,
  Percent,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export const BudgetSimulator: React.FC = () => {
  const { funnelStages, formatMoney, t, language } = useApp();

  // Mode: goal-driven or budget-driven
  const [calcMode, setCalcMode] = useState<'target' | 'budget'>('target');

  // Input states
  const [targetRevenue, setTargetRevenue] = useState<number>(75000); // 75,000 DH
  const [dealValue, setDealValue] = useState<number>(15000); // 15,000 DH retainer
  const [simBudget, setSimBudget] = useState<number>(15000); // 15,000 DH

  // Historical or baseline rates
  const baseCPC = funnelStages[1]?.unitCost || 4.8;
  const baseLPConv = (funnelStages[3]?.conversionRate || 5.0) / 100;
  const baseBookingRate = (funnelStages[4]?.conversionRate || 30.0) / 100;
  const baseShowUpRate = (funnelStages[5]?.conversionRate || 55.0) / 100;
  const baseCloseRate = (funnelStages[6]?.conversionRate || 20.0) / 100;

  // Optimized benchmarks for comparison
  const optShowUpRate = 0.75;
  const optLPConv = 0.065;

  // Mode 1: Target Revenue calculations
  const targetClients = Math.max(1, Math.ceil(targetRevenue / dealValue));
  const requiredHeldMeetings = Math.ceil(targetClients / baseCloseRate);
  const requiredBookedMeetings = Math.ceil(requiredHeldMeetings / baseShowUpRate);
  const requiredLeads = Math.ceil(requiredBookedMeetings / baseBookingRate);
  const requiredVisitors = Math.ceil(requiredLeads / baseLPConv);
  const requiredClicks = Math.ceil(requiredVisitors / 0.88);
  const requiredBudget = Math.round(requiredClicks * baseCPC);

  // Optimized scenario for the same target
  const optHeldMeetings = Math.ceil(targetClients / baseCloseRate);
  const optBookedMeetings = Math.ceil(optHeldMeetings / optShowUpRate);
  const optLeads = Math.ceil(optBookedMeetings / baseBookingRate);
  const optVisitors = Math.ceil(optLeads / optLPConv);
  const optClicks = Math.ceil(optVisitors / 0.88);
  const optBudget = Math.round(optClicks * baseCPC);
  const budgetSaved = Math.max(0, requiredBudget - optBudget);

  // Mode 2: Budget-driven calculations
  const simClicks = Math.round(simBudget / baseCPC);
  const simVisitors = Math.round(simClicks * 0.88);
  const simLeads = Math.round(simVisitors * baseLPConv);
  const simBooked = Math.round(simLeads * baseBookingRate);
  const simHeld = Math.round(simBooked * baseShowUpRate);
  const simClients = Math.round(simHeld * baseCloseRate);
  const simProjectedRevenue = simClients * dealValue;
  const simNetProfit = simProjectedRevenue - simBudget;
  const simROAS = simBudget > 0 ? (simProjectedRevenue / simBudget).toFixed(2) : '0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.simulator.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.simulator.subtitle}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-2 p-1 bg-petrol-50 dark:bg-petrol-900 rounded-xl max-w-md border border-petrol-200 dark:border-petrol-800">
        <button
          onClick={() => setCalcMode('target')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
            calcMode === 'target'
              ? 'bg-petrol-800 text-white shadow-xs dark:bg-petrol-700'
              : 'text-slate-600 dark:text-petrol-300 hover:text-petrol-900 dark:hover:text-white'
          }`}
        >
          {t.simulator.targetMode}
        </button>
        <button
          onClick={() => setCalcMode('budget')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
            calcMode === 'budget'
              ? 'bg-petrol-800 text-white shadow-xs dark:bg-petrol-700'
              : 'text-slate-600 dark:text-petrol-300 hover:text-petrol-900 dark:hover:text-white'
          }`}
        >
          {t.simulator.scalingMode}
        </button>
      </div>

      {/* Mode 1: Target Driven (Reverse Funnel) */}
      {calcMode === 'target' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Column */}
          <div className="bg-white dark:bg-petrol-900/90 p-6 rounded-2xl border border-slate-200/80 dark:border-petrol-800 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-petrol-800 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-neon-500" />
              <span>{language === 'ar' ? 'معايير وخيارات الهدف' : "Paramètres de l'Objectif"}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.simulator.targetRevenueLabel}
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="5000"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[45000, 75000, 100000, 150000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setTargetRevenue(val)}
                    className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {formatMoney(val)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.simulator.avgDealValueLabel}
              </label>
              <input
                type="number"
                step="1000"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {language === 'ar'
                  ? `أي ما يعادل ${targetClients} وكالات عقارية مستهدفة للإغلاق.`
                  : `Soit ${targetClients} agences clientes à closer.`}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1 font-mono">
              <div>
                {language === 'ar' ? 'نسبة الإغلاق الحالية: ' : 'Taux de closing actuel : '}
                {(baseCloseRate * 100).toFixed(0)}%
              </div>
              <div>
                {language === 'ar' ? 'نسبة الحضور الحالية: ' : 'Taux de show-up actuel : '}
                {(baseShowUpRate * 100).toFixed(0)}%
              </div>
              <div>
                {language === 'ar' ? 'تكلفة النقرة (CPC): ' : 'Coût par clic (CPC) : '}
                {formatMoney(baseCPC)}
              </div>
            </div>
          </div>

          {/* Results Column (2 Cols wide) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {language === 'ar'
                    ? `خطة العمل لتحقيق إيرادات بقيمة ${formatMoney(targetRevenue)}`
                    : `Feuille de Route pour Générer ${formatMoney(targetRevenue)}`}
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {targetClients} {language === 'ar' ? 'وكالة متعاقد معها' : 'agences signées'}
                </span>
              </div>

              {/* Step Requirements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <span className="text-[11px] text-slate-500">{t.simulator.requiredClicks}</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {requiredClicks.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                    {t.simulator.requiredLeads}
                  </span>
                  <div className="text-xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-1">
                    {requiredLeads}
                  </div>
                </div>
                <div className="p-3 bg-violet-50 dark:bg-violet-950/40 rounded-xl">
                  <span className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">
                    {language === 'ar' ? 'المواعيد الواجب جدولتها' : 'RDV à Bloquer'}
                  </span>
                  <div className="text-xl font-bold font-mono text-violet-700 dark:text-violet-300 mt-1">
                    {requiredBookedMeetings}
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.simulator.requiredMeetings}
                  </span>
                  <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                    {requiredHeldMeetings}
                  </div>
                </div>
              </div>

              {/* Main Required Budget banner: Petrol #0B434C & Neon Orange */}
              <div className="mt-5 p-5 bg-[#06252A] text-white rounded-xl border border-petrol-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-medium text-petrol-300">
                    {language === 'ar'
                      ? 'الميزانية الإعلانية الشهرية الموصى بها في ميتا'
                      : 'Budget Meta Ads Mensuel Recommandé'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-1 text-neon-400">
                    {formatMoney(requiredBudget)}
                  </div>
                  <span className="text-xs text-petrol-300 mt-0.5 block">
                    {language === 'ar'
                      ? `لتحقيق إيرادات قدرها ${formatMoney(targetRevenue)} (العائد المتوقع: ${(targetRevenue / requiredBudget).toFixed(1)}x)`
                      : `Pour un CA attendu de ${formatMoney(targetRevenue)} (ROAS : ${(targetRevenue / requiredBudget).toFixed(1)}x)`}
                  </span>
                </div>
                <div className="text-right rtl:text-left sm:border-l rtl:sm:border-l-0 rtl:sm:border-r sm:border-petrol-800 sm:pl-5 rtl:sm:pl-0 rtl:sm:pr-5">
                  <span className="text-xs text-petrol-300 font-medium">
                    {language === 'ar' ? 'صافي الأرباح المتوقعة' : 'Bénéfice Net Estimé'}
                  </span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    +{formatMoney(targetRevenue - requiredBudget)}
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison with Optimized Funnel */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'ar' ? 'وفر الميزانية عبر تحسين التحويل' : 'Gain d\'Optimisation de Conversion'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {language === 'ar' ? (
                  <>
                    إذا قمت برفع نسبة الحضور للمواعيد إلى <strong>75%</strong> (عبر رسائل تذكير الواتساب الآلية) وتحسين صفحة الهبوط إلى <strong>6.5%</strong>، فإن ميزانيتك الإعلانية اللازمة لنفس الهدف تنخفض إلى{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">{formatMoney(optBudget)}</strong> بدلاً من{' '}
                    <span className="line-through font-mono">{formatMoney(requiredBudget)}</span>.
                  </>
                ) : (
                  <>
                    Si vous optimisez le Show-Up rate à <strong>75%</strong> (via les rappels WhatsApp) et la Landing Page à <strong>6.5%</strong>, votre budget Ads nécessaire tombe à{' '}
                    <strong className="text-slate-900 dark:text-white font-mono">{formatMoney(optBudget)}</strong> au lieu de{' '}
                    <span className="line-through font-mono">{formatMoney(requiredBudget)}</span>.
                  </>
                )}
              </p>
              <div className="mt-3 flex items-center gap-2 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'ar'
                    ? `وفر في الإنفاق الإعلاني: +${formatMoney(budgetSaved)} / شهرياً تم توفيرها لنفس النتيجة!`
                    : `Économie de budget publicitaire : +${formatMoney(budgetSaved)} / mois économisés !`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Budget Scaling */}
      {calcMode === 'budget' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>{language === 'ar' ? 'محاكاة الأداء بميزانية محددة' : 'Simulation à Budget Fixe'}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'الميزانية الإعلانية الشهرية المقترحة' : 'Budget Ads Mensuel Injecté'}
              </label>
              <input
                type="number"
                step="2000"
                value={simBudget}
                onChange={(e) => setSimBudget(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {[8000, 15000, 25000, 50000].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSimBudget(b)}
                    className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  >
                    {formatMoney(b)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'متوسط قيمة العقد الشهري (Retainer)' : 'Prix du Retainer Moyen (DH)'}
              </label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'ar'
                  ? `النتائج المتوقعة مع ميزانية إعلانية قدرها ${formatMoney(simBudget)} :`
                  : `Résultats Projetés avec ${formatMoney(simBudget)} d'Ads`}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {language === 'ar' ? 'العائد المتوقع (ROAS): ' : 'ROAS Projeté : '}
                {simROAS}x
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[11px] text-slate-500">
                  {language === 'ar' ? 'النقرات المتوقعة' : 'Clics Estimés'}
                </span>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {simClicks.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl">
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  {language === 'ar' ? 'النماذج المتوقعة' : 'Leads Estimés'}
                </span>
                <div className="text-xl font-bold font-mono text-blue-700 dark:text-blue-300 mt-1">
                  {simLeads}
                </div>
              </div>
              <div className="p-3 bg-violet-50 dark:bg-violet-950/40 rounded-xl">
                <span className="text-[11px] text-violet-600 dark:text-violet-400 font-medium">
                  {language === 'ar' ? 'المواعيد المنجزة' : 'RDV Honorés'}
                </span>
                <div className="text-xl font-bold font-mono text-violet-700 dark:text-violet-300 mt-1">
                  {simHeld}
                </div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {language === 'ar' ? 'الوكالات المتعاقد معها' : 'Agences Clôturées'}
                </span>
                <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                  {simClients}
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900 dark:bg-slate-950 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-bold">
                  {language === 'ar' ? 'الإيرادات الشهرية المتوقعة' : 'Chiffre d\'Affaires Projeté'}
                </span>
                <div className="text-4xl font-black font-mono text-emerald-400 mt-1">
                  {formatMoney(simProjectedRevenue)}
                </div>
              </div>
              <div className="text-right rtl:text-left sm:border-l rtl:sm:border-l-0 rtl:sm:border-r sm:border-slate-800 sm:pl-6 rtl:sm:pl-0 rtl:sm:pr-6">
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'صافي الأرباح المتوقعة' : 'Bénéfice Net Projeté'}
                </span>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  +{formatMoney(simNetProfit)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
