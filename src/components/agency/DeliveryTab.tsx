import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Layers,
  CheckCircle2,
  Clock,
  Zap,
  Calendar,
  Building2,
  Check,
  ChevronDown,
  Timer,
  AlertCircle,
  FolderSync,
  TrendingUp,
  Percent,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PackageTier, AutomationWorkflowType } from '../../types/agency';
import { translations } from '../../translations';

export const DeliveryTab: React.FC = () => {
  const {
    clients,
    updateDeliveryProgress,
    updateClient,
    activateMonthlyRetainer,
    setSelectedClientId,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  // Projects in build & configuration
  const inProgressProjects = clients.filter((c) => c.stage === 'delivery_in_progress');

  // Projects successfully delivered (active in retainers)
  const deliveredProjects = clients.filter((c) => c.stage === 'active_retainer');

  // Projects in 7-day trial
  const trialProjects = clients.filter((c) => c.stage === 'trial_7_days');

  // Official active retainers
  const activeRetainerProjects = clients.filter((c) => c.stage === 'active_retainer');

  // Average Delivery Progress across active projects
  const avgProgress = inProgressProjects.length > 0
    ? Math.round(inProgressProjects.reduce((sum, p) => sum + (p.deliveryProgressPct || 25), 0) / inProgressProjects.length)
    : 100;

  // Progress options for quick selection
  const progressOptions = [10, 25, 50, 75, 90, 100];
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [managerDraft, setManagerDraft] = useState('');

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-purple-100 text-purple-900 border border-purple-300">
              {t.deliveryHeaderTag}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {inProgressProjects.length} {t.projectsUnit}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.deliveryHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {t.deliveryHeaderDesc}
          </p>
        </div>

        {/* Average Progress Quick Gauge */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Percent className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className={direction === 'rtl' ? 'text-right' : 'text-left'}>
            <span className="text-[10px] text-purple-700 font-bold block">
              {language === 'ar' ? 'متوسط تقدم المشاريع' : language === 'fr' ? 'Avancement moyen' : 'Average Progress'}
            </span>
            <span className="text-lg font-mono font-extrabold text-purple-950">
              {avgProgress}% {language === 'ar' ? 'إنجاز' : language === 'fr' ? 'complété' : 'complete'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Cards (4 Cards with Distinct Vivid Coordinated Colors) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Projects in build (Vibrant Purple/Indigo) */}
        <div className="bg-gradient-to-br from-white to-purple-50/50 p-5 rounded-2xl border-2 border-purple-300 shadow-xs hover:border-purple-500 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2.5 rounded-xl bg-purple-600 text-white shadow-xs">
              <FolderSync className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              {t.cardInBuildTitle}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.cardInBuildTitle}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-900">
              {inProgressProjects.length}
            </span>
            <span className="text-xs text-slate-500 font-bold">{t.projectsUnit}</span>
          </div>
          <span className="text-[11px] text-purple-700 mt-2 block font-medium">
            {t.cardInBuildSub}
          </span>
        </div>

        {/* Card 2: Delivered Projects (Vibrant Emerald) */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 p-5 rounded-2xl border-2 border-emerald-300 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              {t.cardDeliveredTitle}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.cardDeliveredTitle}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
              {deliveredProjects.length}
            </span>
            <span className="text-xs text-slate-500 font-bold">{t.projectsUnit}</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-2 block font-medium">
            {t.cardDeliveredSub}
          </span>
        </div>

        {/* Card 3: Trial Projects (Vibrant Amber/Gold) */}
        <div className="bg-gradient-to-br from-white to-amber-50/50 p-5 rounded-2xl border-2 border-amber-300 shadow-xs hover:border-amber-500 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs">
              <Timer className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              {t.cardTrialTitle}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.cardTrialTitle}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700">
              {trialProjects.length}
            </span>
            <span className="text-xs text-slate-500 font-bold">{t.clientsUnit}</span>
          </div>
          <span className="text-[11px] text-amber-700 mt-2 block font-medium">
            {t.cardTrialSub}
          </span>
        </div>

        {/* Card 4: Official Active Retainers (Vibrant Petrol/Teal) */}
        <div className="bg-gradient-to-br from-white to-teal-50/50 p-5 rounded-2xl border-2 border-teal-300 shadow-xs hover:border-teal-500 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2.5 rounded-xl bg-petrol-800 text-white shadow-xs">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-teal-900 bg-teal-100 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              {t.cardRetainersTitle}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.cardRetainersTitle}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-petrol-900">
              {activeRetainerProjects.length}
            </span>
            <span className="text-xs text-slate-500 font-bold">{t.clientsUnit}</span>
          </div>
          <span className="text-[11px] text-teal-800 mt-2 block font-medium">
            {t.cardRetainersSub}
          </span>
        </div>
      </div>

      {/* 3. Streamlined Delivery Table: Client, Package, Start Date, Time Remaining, and Progress % Selector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.deliveryTableTitle}
            </h3>
            <span className="text-xs text-slate-500">
              {t.deliveryTableSub}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 border border-purple-200 px-3 py-1 rounded-full">
            {inProgressProjects.length} {t.cardInBuildTitle}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">{t.colClientAgency}</th>
                <th className="p-3.5">{language === 'ar' ? 'مسؤول عن الوكالة' : 'Agency manager'}</th>
                <th className="p-3.5">{t.colPackageChosen}</th>
                <th className="p-3.5">{t.colStartDate}</th>
                <th className="p-3.5">{t.colTimeRemaining}</th>
                <th className="p-3.5 text-center min-w-[280px] bg-purple-50/40 text-purple-950 border-x border-purple-100">
                  {t.colProgressPct}
                </th>
                <th className="p-3.5 text-center">{t.colActionDelivery}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inProgressProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    {language === 'ar'
                      ? 'لا توجد مشاريع قيد التسليم حالياً. كل المشاريع السابقة تم تسليمها بنجاح وهي تحت الصيانة.'
                      : language === 'fr'
                      ? 'Aucun projet en cours de livraison actuellement. Tous les projets précédents sont actifs en maintenance.'
                      : 'No delivery projects currently in progress. All completed systems are active on monthly retainers.'}
                  </td>
                </tr>
              ) : (
                inProgressProjects.map((project) => {
                  const currentPct = project.deliveryProgressPct || 25;
                  const deadline =
                    project.targetDeliveryDate ||
                    (language === 'ar' ? 'خلال 3 أيام' : language === 'fr' ? 'Sous 3 jours' : 'Within 3 days');

                  return (
                    <tr key={project.id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Client & Agency */}
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block text-xs">{project.agencyName}</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {project.contactPerson} • {project.city} (<span dir="ltr">{project.phone}</span>)
                        </span>
                      </td>

                      {/* Package Selected */}
                      <td className="p-3.5">
                        {editingProjectId === project.id ? <div className="flex items-center gap-1"><input value={managerDraft} onChange={(e)=>setManagerDraft(e.target.value)} placeholder={language==='ar'?'اسم المسؤول':'Manager name'} className="w-32 rounded-lg border px-2 py-1 text-xs"/><button onClick={()=>{updateClient(project.id,{agencyManager:managerDraft.trim()});setEditingProjectId(null)}} className="text-emerald-700 font-bold">{language==='ar'?'حفظ':'Save'}</button></div> : <div className="flex items-center gap-2"><span>{project.agencyManager || '—'}</span><button onClick={()=>{setEditingProjectId(project.id);setManagerDraft(project.agencyManager||'')}} className="text-orange-600 font-bold">{language==='ar'?'تعديل':'Edit'}</button></div>}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase font-mono ${
                          project.packageTier === 'enterprise'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : project.packageTier === 'growth'
                            ? 'bg-teal-100 text-teal-900 border border-teal-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {project.packageTier} ({project.setupFee.toLocaleString()} {t.mad})
                        </span>
                      </td>

                      {/* Received Date */}
                      <td className="p-3.5 font-mono text-slate-700 text-[11px]">
                        {project.contractDate || project.createdAt.slice(0, 10)}
                      </td>

                      {/* Time Remaining */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 w-fit font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{deadline}</span>
                        </div>
                      </td>

                      {/* Progress % Selector Slider / Quick Buttons */}
                      <td className="p-3.5 text-center bg-purple-50/20 border-x border-purple-100">
                        <div className="space-y-1.5 max-w-xs mx-auto">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">
                              {language === 'ar' ? 'التقدم الحالي:' : language === 'fr' ? 'Progression :' : 'Progress:'}
                            </span>
                            <span className="font-mono font-extrabold text-purple-900 text-xs">{currentPct}%</span>
                          </div>

                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-l from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${currentPct}%` }}
                            ></div>
                          </div>

                          {/* Quick % buttons */}
                          <div className="flex items-center justify-center gap-1 pt-1">
                            {progressOptions.map((pct) => (
                              <button
                                key={pct}
                                onClick={() => updateDeliveryProgress(project.id, pct)}
                                className={`px-2.5 py-0.5 text-[10px] font-mono font-extrabold rounded-md cursor-pointer transition-all ${
                                  currentPct === pct
                                    ? 'bg-purple-700 text-white shadow-xs scale-105'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Final Delivery Action */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => activateMonthlyRetainer(project.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.btnCompleteDelivery}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active Retainer Clients (Official Retainers Working Successfully) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.activeRetainersTableTitle} ({activeRetainerProjects.length})
            </h3>
            <span className="text-xs text-slate-500">
              {t.activeRetainersTableSub}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">{t.colClientAgency}</th>
                <th className="p-3.5">{t.colCity}</th>
                <th className="p-3.5">{t.colPackageChosen}</th>
                <th className="p-3.5">{t.colSetupFeeCollected}</th>
                <th className="p-3.5">{t.colMonthlyRetainer}</th>
                <th className="p-3.5">{t.colNextRenewal}</th>
                <th className="p-3.5">{t.colSystemStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeRetainerProjects.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{c.agencyName}</td>
                  <td className="p-3.5 text-slate-600 font-medium">{c.city}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-petrol-50 text-petrol-900">
                      {c.packageTier}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {c.setupFee.toLocaleString()} {t.mad}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {c.monthlyRetainer.toLocaleString()} {t.perMonth}
                  </td>
                  <td className="p-3.5 font-mono text-slate-700">
                    {c.nextBillingDate ? new Date(c.nextBillingDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US') : (language === 'ar' ? 'شهري' : language === 'fr' ? 'Mensuel' : 'Monthly')}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.statusRunningLive}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
