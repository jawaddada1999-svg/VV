import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Phone,
  Calendar,
  Building2,
  DollarSign,
  Plus,
  ArrowRight,
  Filter,
  Search,
  ExternalLink,
  PhoneCall,
  Check,
  ChevronDown,
  GripVertical,
  Flame,
  MessageSquare,
  XCircle,
  HelpCircle,
  Users,
} from 'lucide-react';
import { ClientStage, PackageTier, AgencyClient } from '../../types/agency';
import { translations } from '../../translations';

interface ColumnDef {
  id: ClientStage;
  titleKey: 'colAdLeadsTitle' | 'colMeetingsTitle' | 'colTrialTitle' | 'colDeliveryTitle' | 'colRetainerTitle' | 'colLostTitle';
  subKey: 'colAdLeadsSub' | 'colMeetingsSub' | 'colTrialSub' | 'colDeliverySub' | 'colRetainerSub' | 'colLostSub';
  colorBorder: string;
  headerBg: string;
  badgeBg: string;
  badgeTextColor: string;
  accentBar: string;
}

export const PipelineTab: React.FC = () => {
  const {
    clients,
    moveClientStage,
    start7DayTrial,
    acceptTrialAndCloseDeal,
    activateMonthlyRetainer,
    setSelectedClientId,
    setShowAddClientModal,
    packages,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<ClientStage | null>(null);
  const [activeStageDropdownId, setActiveStageDropdownId] = useState<string | null>(null);

  // 6 Pipeline Columns with localized keys and separated title/badge structure
  const columns: ColumnDef[] = [
    {
      id: 'ad_lead',
      titleKey: 'colAdLeadsTitle',
      subKey: 'colAdLeadsSub',
      colorBorder: 'border-blue-500',
      headerBg: 'bg-blue-50/90 text-blue-950',
      badgeBg: 'bg-blue-600',
      badgeTextColor: 'text-white',
      accentBar: 'bg-blue-500',
    },
    {
      id: 'meeting_scheduled',
      titleKey: 'colMeetingsTitle',
      subKey: 'colMeetingsSub',
      colorBorder: 'border-indigo-500',
      headerBg: 'bg-indigo-50/90 text-indigo-950',
      badgeBg: 'bg-indigo-600',
      badgeTextColor: 'text-white',
      accentBar: 'bg-indigo-500',
    },
    {
      id: 'trial_7_days',
      titleKey: 'colTrialTitle',
      subKey: 'colTrialSub',
      colorBorder: 'border-amber-500',
      headerBg: 'bg-amber-50/90 text-amber-950',
      badgeBg: 'bg-amber-600',
      badgeTextColor: 'text-white',
      accentBar: 'bg-amber-500',
    },
    {
      id: 'delivery_in_progress',
      titleKey: 'colDeliveryTitle',
      subKey: 'colDeliverySub',
      colorBorder: 'border-purple-500',
      headerBg: 'bg-purple-50/90 text-purple-950',
      badgeBg: 'bg-purple-600',
      badgeTextColor: 'text-white',
      accentBar: 'bg-purple-500',
    },
    {
      id: 'active_retainer',
      titleKey: 'colRetainerTitle',
      subKey: 'colRetainerSub',
      colorBorder: 'border-emerald-500',
      headerBg: 'bg-emerald-50/90 text-emerald-950',
      badgeBg: 'bg-emerald-600',
      badgeTextColor: 'text-white',
      accentBar: 'bg-emerald-500',
    },
    {
      id: 'lost',
      titleKey: 'colLostTitle',
      subKey: 'colLostSub',
      colorBorder: 'border-rose-500',
      headerBg: 'bg-rose-50/90 text-rose-950',
      badgeBg: 'bg-rose-600',
      badgeTextColor: 'text-white',
      accentBar: 'bg-rose-500',
    },
  ];

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.agencyName.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchTier = filterTier === 'all' || c.packageTier === filterTier;
      return matchSearch && matchTier;
    });
  }, [clients, search, filterTier]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    e.dataTransfer.setData('text/plain', clientId);
    setDraggedClientId(clientId);
  };

  const handleDragOver = (e: React.DragEvent, colId: ClientStage) => {
    e.preventDefault();
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: ClientStage) => {
    e.preventDefault();
    const clientId = e.dataTransfer.getData('text/plain') || draggedClientId;
    if (clientId) {
      if (targetStage === 'trial_7_days') {
        start7DayTrial(clientId);
      } else if (targetStage === 'delivery_in_progress') {
        acceptTrialAndCloseDeal(clientId);
      } else if (targetStage === 'active_retainer') {
        activateMonthlyRetainer(clientId);
      } else {
        moveClientStage(clientId, targetStage);
      }
    }
    setDraggedClientId(null);
    setDragOverColId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-orange-100 text-orange-950 border border-orange-200">
              {t.pipelineHeaderTag}
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {clients.length} {t.clientsUnit}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.pipelineHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.pipelineHeaderDesc}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch md:self-center shrink-0">
          <button
            onClick={() => setShowAddClientModal(true)}
            className="w-full md:w-auto min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF6600] to-[#E65500] hover:from-[#E65500] hover:to-[#CC4A00] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.addClientBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full min-h-[44px] ${direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF6600]`}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-slate-500 font-bold shrink-0">{t.filterByTier}</span>
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="flex-1 sm:flex-initial min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:border-[#FF6600] cursor-pointer"
          >
            <option value="all">{t.allTiers}</option>
            <option value="starter">{t.starterPackage} (1,200 {t.perMonth})</option>
            <option value="growth">{t.growthPackage} (2,500 {t.perMonth})</option>
            <option value="enterprise">{t.enterprisePackage} (4,500 {t.perMonth})</option>
          </select>
        </div>
      </div>

      {/* 3. Drag & Drop Kanban Columns (Snappy horizontal swipe on mobile, 6-col board on desktop) */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-4 lg:grid lg:grid-cols-6 items-start no-scrollbar">
        {columns.map((col) => {
          const columnClients = filteredClients.filter((c) => c.stage === col.id);
          const isOver = dragOverColId === col.id;
          const title = t[col.titleKey];
          const subtitle = t[col.subKey];

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`snap-start shrink-0 w-[84vw] sm:w-[320px] lg:w-auto rounded-2xl p-3 border transition-all flex flex-col min-h-[460px] lg:min-h-[580px] ${
                isOver
                  ? 'border-[#FF6600] bg-orange-50/50 shadow-lg ring-2 ring-orange-400/30'
                  : 'border-slate-200/90 bg-slate-50/90 hover:border-slate-300'
              }`}
            >
              {/* Column Header: Distinct Title on top line, and Lead count pill on separate clear line (العنوان بوحدو والعدد بوحدو ما مخلطينش) */}
              <div className={`p-3 rounded-xl mb-3 border-r-4 rtl:border-r-4 rtl:border-l-0 ltr:border-l-4 ltr:border-r-0 ${col.colorBorder} ${col.headerBg} shadow-2xs`}>
                {/* 1. Title on its own independent line */}
                <h3 className="text-xs font-black text-slate-900 tracking-tight block leading-snug break-words">
                  {title}
                </h3>

                {/* 2. Subtitle on its own line */}
                <span className="text-[10px] font-medium text-slate-600 block mt-1 leading-snug">
                  {subtitle}
                </span>

                {/* 3. Separate Lead Count Badge on its own distinct row */}
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t.leads}:
                  </span>
                  <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-black ${col.badgeBg} ${col.badgeTextColor} shadow-xs`}>
                    {columnClients.length} {t.leadsCountSuffix}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[750px] pr-0.5">
                {columnClients.length === 0 ? (
                  <div className="text-center py-14 text-slate-400 text-xs font-medium border-2 border-dashed border-slate-200 rounded-xl px-2">
                    {t.dragDropHere}
                  </div>
                ) : (
                  columnClients.map((client) => {
                    let trialRemainingDays: number | null = null;
                    let isTrialUrgent = false;

                    if (client.stage === 'trial_7_days' && client.trialEndDate) {
                      const diffHours = Math.round((new Date(client.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60));
                      trialRemainingDays = Math.ceil(diffHours / 24);
                      isTrialUrgent = diffHours <= 24;
                    }

                    const isDropdownOpen = activeStageDropdownId === client.id;

                    return (
                      <div
                        key={client.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, client.id)}
                        onClick={() => setSelectedClientId(client.id)}
                        className={`bg-white p-3.5 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing group relative shadow-2xs hover:shadow-md ${
                          direction === 'rtl' ? 'text-right' : 'text-left'
                        } ${
                          client.stage === 'lost'
                            ? 'border-rose-200 hover:border-rose-400 bg-rose-50/20'
                            : client.stage === 'trial_7_days'
                            ? 'border-amber-200 hover:border-amber-400'
                            : client.stage === 'active_retainer'
                            ? 'border-emerald-200 hover:border-emerald-400'
                            : 'border-slate-200 hover:border-orange-500'
                        }`}
                      >
                        {/* Top: Package Badge & City */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                              {client.packageTier === 'starter'
                                ? t.starterPackage
                                : client.packageTier === 'growth'
                                ? t.growthPackage
                                : t.enterprisePackage}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">
                            {client.city}
                          </span>
                        </div>

                        {/* Agency & Contact */}
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-orange-600 transition-colors leading-tight">
                          {client.agencyName}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {client.contactPerson} • {client.phone}
                        </p>

                        {/* Financial Snapshot */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-bold">
                          <span className="text-slate-500 text-[10px]">
                            {language === 'ar' ? 'الإعداد: ' : language === 'fr' ? 'Installation : ' : 'Setup: '}
                            {client.setupFee.toLocaleString()} {t.mad}
                          </span>
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                            {client.monthlyRetainer.toLocaleString()} {t.perMonth}
                          </span>
                        </div>

                        {/* Rejected Reason Display for Lost Column */}
                        {client.stage === 'lost' && client.rejectionReason && (
                          <div className="mt-2 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[10px] leading-snug">
                            <span className="font-bold block mb-0.5">{t.rejectionReasonLabel}</span>
                            <span>{client.rejectionReason}</span>
                          </div>
                        )}

                        {/* 7-Day Trial Urgent Alert */}
                        {client.stage === 'trial_7_days' && (
                          <div className="mt-2.5 pt-2 border-t border-amber-100">
                            <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 mb-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                {t.trialExpiresIn}:
                              </span>
                              <span className="font-mono px-1.5 py-0.2 bg-amber-200 rounded">
                                {trialRemainingDays !== null ? `${trialRemainingDays} ${t.days}` : '7 days'}
                              </span>
                            </div>
                            {isTrialUrgent && (
                              <div className="text-[9px] font-black text-rose-600 bg-rose-50 p-1 rounded border border-rose-200 animate-bounce">
                                ⚠ {t.trialUrgentWarning}
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                acceptTrialAndCloseDeal(client.id);
                              }}
                              className="w-full mt-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded cursor-pointer transition-colors shadow-2xs"
                            >
                              {t.btnAcceptTrial}
                            </button>
                          </div>
                        )}

                        {/* Delivery Progress Bar */}
                        {client.stage === 'delivery_in_progress' && (
                          <div className="mt-2.5 pt-2 border-t border-purple-100">
                            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                              <span>{t.colProgressPct}:</span>
                              <span className="font-mono font-bold text-purple-700">{client.deliveryProgressPct || 25}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full transition-all"
                                style={{ width: `${client.deliveryProgressPct || 25}%` }}
                              ></div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                activateMonthlyRetainer(client.id);
                              }}
                              className="w-full mt-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded cursor-pointer"
                            >
                              {t.btnCompleteDelivery}
                            </button>
                          </div>
                        )}

                        {client.stage === 'active_retainer' && (
                          <div className="mt-2 pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {t.active}
                            </span>
                            <span className="text-slate-400 font-mono text-[9px]">
                              {client.nextBillingDate ? new Date(client.nextBillingDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR') : t.perMonth}
                            </span>
                          </div>
                        )}

                        {/* STAGE DROPDOWN SWITCHER BUTTON */}
                        <div className="mt-3 pt-2 border-t border-slate-100 relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveStageDropdownId(isDropdownOpen ? null : client.id);
                            }}
                            className="w-full py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span>{t.changeStageBtn}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute z-30 bottom-full mb-1 right-0 left-0 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs ${
                                direction === 'rtl' ? 'text-right' : 'text-left'
                              }`}
                            >
                              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 border-b border-slate-100">
                                {t.selectTargetStage}
                              </div>
                              {columns.map((target) => (
                                <button
                                  key={target.id}
                                  onClick={() => {
                                    if (target.id === 'trial_7_days') {
                                      start7DayTrial(client.id);
                                    } else if (target.id === 'delivery_in_progress') {
                                      acceptTrialAndCloseDeal(client.id);
                                    } else if (target.id === 'active_retainer') {
                                      activateMonthlyRetainer(client.id);
                                    } else {
                                      moveClientStage(client.id, target.id);
                                    }
                                    setActiveStageDropdownId(null);
                                  }}
                                  className={`w-full px-3 py-1.5 text-[11px] font-semibold hover:bg-slate-100 flex items-center justify-between cursor-pointer ${
                                    client.stage === target.id ? 'text-orange-600 bg-orange-50 font-bold' : 'text-slate-700'
                                  } ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                                >
                                  <span>{t[target.titleKey]}</span>
                                  {client.stage === target.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
