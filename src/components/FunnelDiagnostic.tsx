import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingDown,
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Zap,
  Eye,
  MousePointerClick,
  FileSpreadsheet,
  CalendarCheck,
  PhoneCall,
  Award,
  Sparkles,
} from 'lucide-react';

export const FunnelDiagnostic: React.FC = () => {
  const { funnelStages, diagnosticAlerts, t, formatMoney, language } = useApp();

  // What-If simulation state
  const [boostLP, setBoostLP] = useState<number>(1.5);
  const [boostShowUp, setBoostShowUp] = useState<number>(15);
  const [boostClosing, setBoostClosing] = useState<number>(5);

  const avgDealValue = 15000;

  const visitorsStage = funnelStages[2]?.count || 2700;
  const baseLPConv = funnelStages[3]?.conversionRate || 5.0;
  const baseBookRate = funnelStages[4]?.conversionRate || 30.0;
  const baseShowUpRate = funnelStages[5]?.conversionRate || 55.0;
  const baseCloseRate = funnelStages[6]?.conversionRate || 20.0;

  const simLPConv = Math.min(15, baseLPConv + boostLP);
  const simShowUp = Math.min(95, baseShowUpRate + boostShowUp);
  const simClose = Math.min(50, baseCloseRate + boostClosing);

  const simLeads = Math.round(visitorsStage * (simLPConv / 100));
  const simBooked = Math.round(simLeads * (baseBookRate / 100));
  const simHeld = Math.round(simBooked * (simShowUp / 100));
  const simWon = Math.round(simHeld * (simClose / 100));

  const actualWon = funnelStages[6]?.count || 5;
  const extraClients = Math.max(0, simWon - actualWon);
  const extraRevenue = extraClients * avgDealValue;

  const stageIcons = [Eye, MousePointerClick, Eye, FileSpreadsheet, CalendarCheck, PhoneCall, Award];

  return (
    <div className="space-y-6 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      {/* Header section with Clean Modern Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
            {language === 'ar' ? 'مسار التحويل وحماية الميزانية الإعلانية' : t.funnel.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            {language === 'ar'
              ? 'تشخيص فوري لمراحل تسرب العملاء وأين تهدر الميزانية في كل خطوة'
              : t.funnel.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {language === 'ar' ? 'تشخيص مباشر' : 'Diagnostic Actif'}
          </span>
        </div>
      </div>

      {/* Visual Funnel Stage Bars */}
      <div className="space-y-3">
        {funnelStages.map((stage, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === funnelStages.length - 1;
          const isLeak = !isFirst && stage.conversionRate < stage.benchmarkRate * 0.85;
          const isHealthy = !isFirst && stage.conversionRate >= stage.benchmarkRate;
          const Icon = stageIcons[idx] || Eye;

          return (
            <div key={stage.id} className="relative">
              <div
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isLeak
                    ? 'bg-rose-50/40 border-rose-200'
                    : isHealthy
                    ? 'bg-emerald-50/20 border-emerald-200'
                    : 'bg-white border-slate-200/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-medium shrink-0 ${
                        isLeak
                          ? 'bg-rose-100 text-rose-700'
                          : isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-petrol-800 text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-slate-400 text-xs">
                          0{idx + 1}.
                        </span>
                        <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                          {stage.name}
                        </h4>
                        {isLeak && (
                          <span className="text-[11px] font-medium text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                            {language === 'ar' ? 'تسريب ميزانية' : 'Fuite'}
                          </span>
                        )}
                        {isHealthy && (
                          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                            {language === 'ar' ? 'أداء ممتاز' : 'Optimal'}
                          </span>
                        )}
                      </div>
                      {stage.unitCost > 0 && (
                        <span className="text-slate-500 text-xs font-mono mt-0.5 block">
                          {language === 'ar'
                            ? `تكلفة الوحدة: ${formatMoney(stage.unitCost)}`
                            : `Coût unitaire : ${formatMoney(stage.unitCost)}`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 font-mono tabular-nums shrink-0">
                    <div className="text-right rtl:text-left">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 block">
                        {stage.count.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 uppercase font-medium">
                        {language === 'ar' ? 'التراكمي' : 'Total'}
                      </span>
                    </div>

                    {!isFirst && (
                      <div className="pl-4 rtl:pl-0 rtl:pr-4 border-l rtl:border-l-0 rtl:border-r border-slate-200">
                        <span
                          className={`text-xl sm:text-2xl font-bold block ${
                            isLeak
                              ? 'text-rose-600'
                              : isHealthy
                              ? 'text-emerald-600'
                              : 'text-petrol-800'
                          }`}
                        >
                          {stage.conversionRate}%
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {language === 'ar'
                            ? `المعيار: ${stage.benchmarkRate}%`
                            : `Cible: ${stage.benchmarkRate}%`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clean Progress Line */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isLeak
                        ? 'bg-rose-500'
                        : isHealthy
                        ? 'bg-emerald-500'
                        : 'bg-petrol-800'
                    }`}
                    style={{ width: `${Math.min(100, (stage.conversionRate / (stage.benchmarkRate || 100)) * 100)}%` }}
                  />
                </div>
              </div>

              {!isLast && (
                <div className="py-2 px-4 flex items-center justify-between text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-slate-400" />
                    <span>
                      {language === 'ar'
                        ? `التحويل للمرحلة التالية: ${funnelStages[idx + 1].conversionRate}%`
                        : `Conversion étape suivante : ${funnelStages[idx + 1].conversionRate}%`}
                    </span>
                  </div>
                  {funnelStages[idx + 1].dropOffRate > 0 && (
                    <span className="text-[11px] text-slate-400">
                      {language === 'ar'
                        ? `تسرب ${funnelStages[idx + 1].dropOffRate}%`
                        : `-${funnelStages[idx + 1].dropOffRate}% perte`}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive What-If Simulator */}
      <div className="bg-[#06252A] text-white rounded-xl p-5 sm:p-6 border border-petrol-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-petrol-800/80">
          <div>
            <div className="flex items-center gap-1.5 text-neon-400 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>محاكي الأثر المالي لـ IBONDA</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {language === 'ar'
                ? 'كيف تزيد أرباحك الشهرية دون رفع ميزانية الإعلانات؟'
                : 'Simulateur d\'Impact Financier sans dépenser plus'}
            </h3>
          </div>
          <div className="text-right rtl:text-left bg-black/20 p-4 rounded-lg border border-petrol-800 shrink-0">
            <span className="text-[11px] text-petrol-300 block font-medium">
              {language === 'ar' ? 'الإيرادات الإضافية المتوقعة' : 'Gain Potentiel'}
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-neon-400 mt-0.5">
              +{formatMoney(extraRevenue)}
            </div>
            <span className="text-[11px] font-mono text-petrol-300 block mt-0.5">
              {language === 'ar'
                ? `(+${extraClients} وكالات جديدة مغلقة)`
                : `(+${extraClients} clients)`}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2.5 bg-black/20 p-4 rounded-lg border border-petrol-800/80">
            <div className="flex items-center justify-between text-xs font-medium text-petrol-100">
              <span>{language === 'ar' ? 'تحسين صفحة الهبوط' : 'Optimisation Landing'}</span>
              <span className="font-mono text-neon-400 text-sm">
                {(baseLPConv + boostLP).toFixed(1)}% (+{boostLP}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={boostLP}
              onChange={(e) => setBoostLP(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-petrol-800 rounded-lg appearance-none cursor-pointer accent-neon-500"
            />
          </div>

          <div className="space-y-2.5 bg-black/20 p-4 rounded-lg border border-petrol-800/80">
            <div className="flex items-center justify-between text-xs font-medium text-petrol-100">
              <span>{language === 'ar' ? 'رفع حضور المواعيد' : 'Boost Show-Up'}</span>
              <span className="font-mono text-neon-400 text-sm">
                {(baseShowUpRate + boostShowUp).toFixed(0)}% (+{boostShowUp}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="5"
              value={boostShowUp}
              onChange={(e) => setBoostShowUp(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-petrol-800 rounded-lg appearance-none cursor-pointer accent-neon-500"
            />
          </div>

          <div className="space-y-2.5 bg-black/20 p-4 rounded-lg border border-petrol-800/80">
            <div className="flex items-center justify-between text-xs font-medium text-petrol-100">
              <span>{language === 'ar' ? 'رفع إغلاق العقود' : 'Boost Closing'}</span>
              <span className="font-mono text-neon-400 text-sm">
                {(baseCloseRate + boostClosing).toFixed(0)}% (+{boostClosing}%)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="5"
              value={boostClosing}
              onChange={(e) => setBoostClosing(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-petrol-800 rounded-lg appearance-none cursor-pointer accent-neon-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
