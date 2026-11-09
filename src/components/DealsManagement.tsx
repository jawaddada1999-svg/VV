import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, LeadStage } from '../types';
import {
  GripVertical,
  Search,
  Kanban,
  Table as TableIcon,
  Phone,
  Calendar,
  ChevronRight,
  Edit2,
  Trash2,
  MapPin,
  User,
  CheckCircle,
  Move,
  Filter,
  DollarSign,
  Building,
} from 'lucide-react';

interface DealsManagementProps {
  isEditMode: boolean;
  globalSearch?: string;
}

export const DealsManagement: React.FC<DealsManagementProps> = ({
  isEditMode,
  globalSearch = '',
}) => {
  const {
    leads,
    updateLeadStatus,
    deleteLead,
    setSelectedLeadForEdit,
    setShowLeadModal,
    t,
    formatMoney,
    language,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [localSearch, setLocalSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const defaultStages: { key: LeadStage; label: string; color: string; dotColor: string }[] = [
    { key: 'new', label: t.crm.colNew, color: 'border-t-petrol-800', dotColor: 'bg-petrol-800' },
    { key: 'qualified', label: t.crm.colQualified, color: 'border-t-petrol-600', dotColor: 'bg-petrol-600' },
    { key: 'meeting_scheduled', label: t.crm.colBooked, color: 'border-t-amber-500', dotColor: 'bg-amber-500' },
    { key: 'meeting_held', label: t.crm.colHeld, color: 'border-t-neon-500', dotColor: 'bg-neon-500' },
    { key: 'proposal_sent', label: t.crm.colProposal, color: 'border-t-teal-600', dotColor: 'bg-teal-600' },
    { key: 'won', label: t.crm.colWon, color: 'border-t-emerald-600', dotColor: 'bg-emerald-600' },
    { key: 'lost', label: t.crm.colLost, color: 'border-t-slate-400', dotColor: 'bg-slate-400' },
  ];

  const [stageOrder, setStageOrder] = useState<LeadStage[]>(() => {
    const saved = localStorage.getItem('ebonda_crm_stage_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultStages.map((s) => s.key);
  });

  const defaultColumns = [
    { id: 'agency', label: t.crm.agencyName },
    { id: 'city', label: t.crm.city },
    { id: 'contact', label: t.crm.contact },
    { id: 'status', label: t.crm.status },
    { id: 'meetingDate', label: t.crm.meetingDate },
    { id: 'dealValue', label: t.crm.dealValue },
    { id: 'actions', label: 'إجراءات' },
  ];

  const [tableColumns, setTableColumns] = useState(() => {
    const saved = localStorage.getItem('ebonda_crm_col_order');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultColumns;
  });

  const [draggedStageKey, setDraggedStageKey] = useState<LeadStage | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);

  const stages = stageOrder.map(
    (key) => defaultStages.find((s) => s.key === key) || defaultStages[0]
  );

  // Extract unique cities for filter dropdown
  const uniqueCities = Array.from(new Set(leads.map((l) => l.city).filter(Boolean)));

  const combinedSearch = (localSearch || globalSearch).toLowerCase();

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !combinedSearch ||
      lead.agencyName.toLowerCase().includes(combinedSearch) ||
      lead.city.toLowerCase().includes(combinedSearch) ||
      lead.contactPerson.toLowerCase().includes(combinedSearch) ||
      lead.phone.includes(combinedSearch);

    const matchesStage = stageFilter === 'all' || lead.status === stageFilter;
    const matchesCity = cityFilter === 'all' || lead.city === cityFilter;

    return matchesSearch && matchesStage && matchesCity;
  });

  const handleEdit = (lead: Lead) => {
    setSelectedLeadForEdit(lead);
    setShowLeadModal(true);
  };

  const handleStageDrop = (targetKey: LeadStage) => {
    if (!draggedStageKey || draggedStageKey === targetKey) return;
    const newOrder = [...stageOrder];
    const fromIndex = newOrder.indexOf(draggedStageKey);
    const toIndex = newOrder.indexOf(targetKey);
    newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedStageKey);
    setStageOrder(newOrder);
    localStorage.setItem('ebonda_crm_stage_order', JSON.stringify(newOrder));
    setDraggedStageKey(null);
  };

  const handleColumnDrop = (targetIndex: number) => {
    if (draggedColIndex === null || draggedColIndex === targetIndex) return;
    const newCols = [...tableColumns];
    const item = newCols.splice(draggedColIndex, 1)[0];
    newCols.splice(targetIndex, 0, item);
    setTableColumns(newCols);
    localStorage.setItem('ebonda_crm_col_order', JSON.stringify(newCols));
    setDraggedColIndex(null);
  };

  const handleLeadDropOnStage = (targetStage: LeadStage) => {
    if (draggedLeadId) {
      updateLeadStatus(draggedLeadId, targetStage);
      setDraggedLeadId(null);
    }
  };

  const getNextStage = (current: LeadStage): LeadStage | null => {
    const sequence: LeadStage[] = [
      'new',
      'qualified',
      'meeting_scheduled',
      'meeting_held',
      'proposal_sent',
      'won',
    ];
    const currentIndex = sequence.indexOf(current);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      return sequence[currentIndex + 1];
    }
    return null;
  };

  const getNextStageLabel = (next: LeadStage): string => {
    const stage = defaultStages.find((s) => s.key === next);
    return stage ? stage.label : next;
  };

  return (
    <div className="space-y-5">
      {/* Header and Controls with Modern Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
              {language === 'ar' ? 'متابعة الصفقات والتحويل (Deals & Clients)' : 'Suivi des Deals & Clients'}
            </h2>
            {isEditMode && (
              <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-orange-50 text-neon-600 border border-orange-200 flex items-center gap-1">
                <Move className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'وضع السحب والترتيب' : 'Mode Drag'}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            {language === 'ar'
              ? 'تتبع شامل لجميع الوكالات العقارية من النموذج الأول حتى إغلاق العقد النهائي'
              : 'Gérez vos agences de la prise de contact au closing du mandat.'}
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-slate-100/80 rounded-lg p-1 border border-slate-200/70 text-xs font-medium">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 stroke-[2]" />
              <span>{t.crm.viewKanban}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 stroke-[2]" />
              <span>{t.crm.viewTable}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Filter and Search Engine Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 stroke-[2]" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث: وكالة، مدينة، هاتف...' : t.actions.search}
            className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-petrol-800 focus:bg-white font-medium"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full sm:w-auto text-xs font-medium bg-slate-50 border border-slate-200/90 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-petrol-800 cursor-pointer"
          >
            <option value="all">{language === 'ar' ? 'جميع مراحل الصفقات' : t.crm.allStages}</option>
            {defaultStages.map((st) => (
              <option key={st.key} value={st.key}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full sm:w-auto text-xs font-medium bg-slate-50 border border-slate-200/90 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-petrol-800 cursor-pointer"
        >
          <option value="all">{language === 'ar' ? 'جميع المدن (الدار البيضاء، الرباط...)' : 'Toutes les villes'}</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <span className="text-xs text-slate-500 mr-auto rtl:mr-0 rtl:ml-auto font-mono tabular-nums px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100">
          {language === 'ar' ? `${filteredLeads.length} وكالة مسجلة` : `${filteredLeads.length} leads`}
        </span>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {stages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
            const stageTotalValue = stageLeads.reduce((acc, l) => acc + (l.dealValue || 0), 0);

            return (
              <div
                key={stage.key}
                draggable={isEditMode}
                onDragStart={() => setDraggedStageKey(stage.key)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedStageKey) {
                    handleStageDrop(stage.key);
                  } else if (draggedLeadId) {
                    handleLeadDropOnStage(stage.key);
                  }
                }}
                className={`w-72 shrink-0 bg-white rounded-xl border ${
                  isEditMode ? 'border-dashed border-neon-500/80 ring-2 ring-neon-500/10' : 'border-slate-200/80'
                } p-3.5 flex flex-col max-h-[750px] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] transition-all`}
              >
                {/* Stage Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {isEditMode && <GripVertical className="w-3.5 h-3.5 text-orange-500 cursor-grab" />}
                    <span className={`w-2 h-2 rounded-full ${stage.dotColor}`}></span>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-800">
                      {stage.label}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono mb-2.5 flex items-center justify-between">
                  <span>{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                  <span className="text-slate-800 font-semibold">{formatMoney(stageTotalValue)}</span>
                </div>

                {/* Cards List */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleLeadDropOnStage(stage.key)}
                  className="space-y-2.5 overflow-y-auto flex-1 pr-0.5 min-h-[100px]"
                >
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                      {t.crm.emptyKanban}
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const nextStage = getNextStage(lead.status);

                      return (
                        <div
                          key={lead.id}
                          draggable={isEditMode}
                          onDragStart={() => setDraggedLeadId(lead.id)}
                          className={`p-3 bg-white rounded-lg border border-slate-200/80 hover:border-slate-300 transition-all shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] group ${
                            isEditMode ? 'cursor-grab active:cursor-grabbing ring-1 ring-orange-300' : ''
                          }`}
                        >
                          {isEditMode && (
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-dashed border-slate-200 text-xs text-neon-600 font-bold">
                              <span className="flex items-center gap-1">
                                <GripVertical className="w-3.5 h-3.5" />
                                {language === 'ar' ? 'اسحب للتحويل' : 'Glissez'}
                              </span>
                            </div>
                          )}

                          {/* Title & Quick Actions */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-black text-slate-950 group-hover:text-petrol-800 transition-colors leading-snug">
                              {lead.agencyName}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(lead)}
                                title={t.actions.edit}
                                className="p-1.5 text-slate-400 hover:text-neon-500 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteLead(lead.id)}
                                title={t.actions.delete}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Agency city and contact person */}
                          <div className="text-xs text-slate-700 mt-2 flex items-center gap-2 font-bold">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-petrol-800" />
                              {lead.city}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4 text-petrol-800" />
                              {lead.contactPerson}
                            </span>
                          </div>

                          {/* Contact quick call buttons */}
                          <div className="mt-3 flex items-center gap-2 text-xs">
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-950 font-mono text-xs font-black hover:text-neon-500 transition-colors border-2 border-slate-200"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{lead.phone}</span>
                              </a>
                            )}
                          </div>

                          {/* Meeting date if booked */}
                          {lead.meetingDate && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-2xl border-2 border-slate-200 flex items-center justify-between text-xs">
                              <span className="text-slate-950 font-mono flex items-center gap-2 font-black">
                                <Calendar className="w-4 h-4 text-neon-500" />
                                {new Date(lead.meetingDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="text-[11px] uppercase font-black text-neon-600 bg-orange-100 px-2 py-0.5 rounded-md">
                                {lead.meetingOutcome === 'showed'
                                  ? (language === 'ar' ? 'حضر' : 'Présent')
                                  : lead.meetingOutcome === 'no_show'
                                  ? (language === 'ar' ? 'غائب' : 'No-show')
                                  : (language === 'ar' ? 'مجدول' : 'Prévu')}
                              </span>
                            </div>
                          )}

                          {/* Card Footer: Deal value & Next stage button in NEON ORANGE */}
                          <div className="mt-4 pt-3.5 border-t-2 border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-base font-black font-mono text-slate-950">
                              {formatMoney(lead.dealValue)}
                            </span>

                            {nextStage ? (
                              <button
                                onClick={() => updateLeadStatus(lead.id, nextStage)}
                                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-white bg-neon-500 hover:bg-neon-600 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer"
                                title={`Transférer vers ${getNextStageLabel(nextStage)}`}
                              >
                                <span>{getNextStageLabel(nextStage)}</span>
                                <ChevronRight className="w-4 h-4 rtl:rotate-180 stroke-[3]" />
                              </button>
                            ) : lead.status === 'won' ? (
                              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-lg">
                                <CheckCircle className="w-4 h-4" />
                                {language === 'ar' ? 'صفقة مغلقة' : 'Signé'}
                              </span>
                            ) : null}
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
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs">
          {isEditMode && (
            <div className="p-3 bg-neon-50 border-b-2 border-neon-200 text-xs font-black text-neon-700 flex items-center gap-2">
              <GripVertical className="w-4 h-4" />
              <span>{language === 'ar' ? 'اسحب عناوين الأعمدة لإعادة ترتيب الجدول' : 'Glissez les colonnes pour les réorganiser'}</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-right rtl:text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-black border-b-2 border-slate-200 text-xs">
                <tr>
                  {tableColumns.map((col: any, index: number) => (
                    <th
                      key={col.id}
                      draggable={isEditMode}
                      onDragStart={() => setDraggedColIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleColumnDrop(index)}
                      className={`px-5 py-4 ${
                        isEditMode ? 'cursor-grab active:cursor-grabbing bg-orange-50 text-neon-700' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {isEditMode && <GripVertical className="w-4 h-4 text-neon-500" />}
                        <span>{col.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {filteredLeads.map((lead) => {
                  const stageObj = defaultStages.find((s) => s.key === lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {tableColumns.map((col: any) => {
                        if (col.id === 'agency') {
                          return (
                            <td key={col.id} className="px-5 py-4 font-black text-slate-950 text-sm sm:text-base">
                              {lead.agencyName}
                            </td>
                          );
                        }
                        if (col.id === 'city') {
                          return (
                            <td key={col.id} className="px-5 py-4 text-slate-700 font-bold">
                              {lead.city}
                            </td>
                          );
                        }
                        if (col.id === 'contact') {
                          return (
                            <td key={col.id} className="px-5 py-4">
                              <div className="text-slate-950 font-bold">{lead.contactPerson}</div>
                              <div className="text-xs font-mono text-slate-500 font-bold">{lead.phone}</div>
                            </td>
                          );
                        }
                        if (col.id === 'status') {
                          return (
                            <td key={col.id} className="px-5 py-4">
                              <span className="inline-flex items-center gap-1.5 font-bold">
                                <span className={`w-2.5 h-2.5 rounded-full ${stageObj?.dotColor || 'bg-slate-400'}`}></span>
                                <span>{stageObj?.label || lead.status}</span>
                              </span>
                            </td>
                          );
                        }
                        if (col.id === 'meetingDate') {
                          return (
                            <td key={col.id} className="px-5 py-4 font-mono text-slate-600 font-bold">
                              {lead.meetingDate ? new Date(lead.meetingDate).toLocaleDateString() : '—'}
                            </td>
                          );
                        }
                        if (col.id === 'dealValue') {
                          return (
                            <td key={col.id} className="px-5 py-4 font-mono font-black text-slate-950 text-sm sm:text-base">
                              {formatMoney(lead.dealValue)}
                            </td>
                          );
                        }
                        if (col.id === 'actions') {
                          return (
                            <td key={col.id} className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEdit(lead)}
                                  className="p-2 text-slate-500 hover:text-neon-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                  title="تعديل"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          );
                        }
                        return null;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
