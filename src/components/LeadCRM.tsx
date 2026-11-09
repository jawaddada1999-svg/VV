import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead, LeadStage } from '../types';
import {
  Search,
  Kanban,
  Table as TableIcon,
  Phone,
  Mail,
  Calendar,
  Building,
  DollarSign,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  User,
} from 'lucide-react';

export const LeadCRM: React.FC = () => {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const stages: { key: LeadStage; label: string; color: string; dotColor: string }[] = [
    { key: 'new', label: t.crm.colNew, color: 'border-t-petrol-800 dark:border-t-petrol-400', dotColor: 'bg-petrol-800 dark:bg-petrol-400' },
    { key: 'qualified', label: t.crm.colQualified, color: 'border-t-petrol-600 dark:border-t-petrol-300', dotColor: 'bg-petrol-600 dark:bg-petrol-300' },
    { key: 'meeting_scheduled', label: t.crm.colBooked, color: 'border-t-amber-500', dotColor: 'bg-amber-500' },
    { key: 'meeting_held', label: t.crm.colHeld, color: 'border-t-neon-500', dotColor: 'bg-neon-500' },
    { key: 'proposal_sent', label: t.crm.colProposal, color: 'border-t-teal-500', dotColor: 'bg-teal-500' },
    { key: 'won', label: t.crm.colWon, color: 'border-t-emerald-500', dotColor: 'bg-emerald-500' },
    { key: 'lost', label: t.crm.colLost, color: 'border-t-slate-400', dotColor: 'bg-slate-400' },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStage = stageFilter === 'all' || lead.status === stageFilter;

    return matchesSearch && matchesStage;
  });

  const handleEdit = (lead: Lead) => {
    setSelectedLeadForEdit(lead);
    setShowLeadModal(true);
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
    const stage = stages.find((s) => s.key === next);
    return stage ? stage.label : next;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-petrol-800 dark:text-white">
            {t.crm.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-petrol-300 mt-1">
            {t.crm.subtitle}
          </p>
        </div>

        {/* View toggles & Quick counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-petrol-50 dark:bg-petrol-900 rounded-xl p-1 border border-petrol-200 dark:border-petrol-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-petrol-800 text-white shadow-xs dark:bg-petrol-700'
                  : 'text-slate-600 dark:text-petrol-300 hover:text-petrol-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>{t.crm.viewKanban}</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-petrol-800 text-white shadow-xs dark:bg-petrol-700'
                  : 'text-slate-600 dark:text-petrol-300 hover:text-petrol-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>{t.crm.viewTable}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar: Pure White background & Petrol #0B434C accents */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-petrol-900/90 p-3 rounded-2xl border border-slate-200/80 dark:border-petrol-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-petrol-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.actions.search}
            className="w-full pl-9 pr-4 py-2 text-xs bg-petrol-50/50 dark:bg-petrol-950 border border-petrol-200 dark:border-petrol-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-500 font-medium"
          />
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="w-full sm:w-auto text-xs font-bold bg-petrol-50/50 dark:bg-petrol-950 border border-petrol-200 dark:border-petrol-800 rounded-xl px-3 py-2 text-petrol-800 dark:text-petrol-200 focus:outline-none focus:ring-2 focus:ring-neon-500 cursor-pointer"
        >
          <option value="all">{t.crm.allStages}</option>
          {stages.map((st) => (
            <option key={st.key} value={st.key}>
              {st.label}
            </option>
          ))}
        </select>

        <span className="text-xs text-slate-500 dark:text-petrol-300 ml-auto rtl:ml-0 rtl:mr-auto font-mono font-bold tabular-nums">
          {language === 'ar' ? `${filteredLeads.length} وكالة مسجلة` : `${filteredLeads.length} leads trouvés`}
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
                className={`w-80 shrink-0 bg-petrol-50/50 dark:bg-petrol-950/60 rounded-2xl border border-petrol-100 dark:border-petrol-800 p-3.5 flex flex-col max-h-[780px] border-t-4 ${stage.color}`}
              >
                {/* Stage Column Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-petrol-100 dark:border-petrol-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`}></span>
                    <span className="text-xs font-black text-petrol-800 dark:text-white">
                      {stage.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-petrol-800 dark:text-petrol-200 bg-white dark:bg-petrol-900 px-2 py-0.5 rounded-lg border border-petrol-200 dark:border-petrol-700">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-petrol-300 font-mono font-bold mb-3">
                  {language === 'ar' ? 'إجمالي المرحلة:' : 'Total:'} <span className="text-petrol-800 dark:text-white font-black">{formatMoney(stageTotalValue)}</span>
                </div>

                {/* Cards List: Pure White cards in light mode / Dark Petrol in dark mode */}
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 dark:text-petrol-400 text-xs italic border border-dashed border-petrol-200 dark:border-petrol-800 rounded-xl">
                      {t.crm.emptyKanban}
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const nextStage = getNextStage(lead.status);

                      return (
                        <div
                          key={lead.id}
                          className="p-4 bg-white dark:bg-petrol-900 rounded-xl border border-slate-200/90 dark:border-petrol-800 hover:border-neon-500 dark:hover:border-neon-500 transition-all shadow-xs group"
                        >
                          {/* Title & Quick Actions */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-neon-600 dark:group-hover:text-neon-400 transition-colors leading-snug">
                              {lead.agencyName}
                            </h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(lead)}
                                title={t.actions.edit}
                                className="p-1 text-slate-400 hover:text-neon-500 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteLead(lead.id)}
                                title={t.actions.delete}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Agency city and contact person */}
                          <div className="text-xs text-slate-600 dark:text-petrol-200 mt-2 flex items-center gap-2 font-bold">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-petrol-600 dark:text-neon-400" />
                              {lead.city}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-petrol-600 dark:text-neon-400" />
                              {lead.contactPerson}
                            </span>
                          </div>

                          {/* Contact quick call buttons */}
                          <div className="mt-3 flex items-center gap-2 text-xs">
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-petrol-950 text-slate-900 dark:text-white font-mono text-xs font-bold hover:text-neon-500 transition-colors border border-slate-200 dark:border-petrol-800"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>{lead.phone}</span>
                              </a>
                            )}
                          </div>

                          {/* Meeting date if booked */}
                          {lead.meetingDate && (
                            <div className="mt-3 p-2.5 bg-slate-50 dark:bg-petrol-950 rounded-xl border border-slate-200/80 dark:border-petrol-800 flex items-center justify-between text-xs">
                              <span className="text-slate-900 dark:text-petrol-100 font-mono flex items-center gap-1.5 font-bold">
                                <Calendar className="w-4 h-4 text-neon-500" />
                                {new Date(lead.meetingDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="text-[11px] uppercase font-black text-neon-600 dark:text-neon-400">
                                {lead.meetingOutcome === 'showed'
                                  ? (language === 'ar' ? 'حضر' : 'Présent')
                                  : lead.meetingOutcome === 'no_show'
                                  ? (language === 'ar' ? 'غائب' : 'No-show')
                                  : (language === 'ar' ? 'مجدول' : 'Prévu')}
                              </span>
                            </div>
                          )}

                          {/* Card Footer: Deal value & Next stage button in NEON ORANGE */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-petrol-800 flex items-center justify-between gap-2">
                            <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                              {formatMoney(lead.dealValue)}
                            </span>

                            {nextStage ? (
                              <button
                                onClick={() => updateLeadStatus(lead.id, nextStage)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-black text-white bg-neon-500 hover:bg-neon-600 rounded-lg shadow-xs shadow-neon-500/20 transition-all cursor-pointer"
                                title={`Transférer vers ${getNextStageLabel(nextStage)}`}
                              >
                                <span>{getNextStageLabel(nextStage)}</span>
                                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 stroke-[3]" />
                              </button>
                            ) : lead.status === 'won' ? (
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
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
        <div className="bg-white dark:bg-petrol-900/90 rounded-2xl border border-slate-200/80 dark:border-petrol-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-petrol-50/70 dark:bg-petrol-950/70 text-petrol-800 dark:text-petrol-300 border-b border-petrol-100 dark:border-petrol-800 font-bold">
                <tr>
                  <th className="px-4 py-3.5">{t.crm.agencyName}</th>
                  <th className="px-4 py-3.5">{t.crm.city}</th>
                  <th className="px-4 py-3.5">{t.crm.contact}</th>
                  <th className="px-4 py-3.5">{t.crm.status}</th>
                  <th className="px-4 py-3.5">{t.crm.meetingDate}</th>
                  <th className="px-4 py-3.5 text-right rtl:text-left">{t.crm.dealValue}</th>
                  <th className="px-4 py-3.5 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-petrol-100 dark:divide-petrol-800/80">
                {filteredLeads.map((lead) => {
                  const stageObj = stages.find((s) => s.key === lead.status);
                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-petrol-50/50 dark:hover:bg-petrol-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-petrol-900 dark:text-white">
                        {lead.agencyName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-petrol-300 font-medium">
                        {lead.city}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-petrol-900 dark:text-white font-medium">{lead.contactPerson}</div>
                        <div className="text-[11px] font-mono text-slate-400 dark:text-petrol-400">{lead.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className={`w-2 h-2 rounded-full ${stageObj?.dotColor || 'bg-slate-400'}`}></span>
                          <span>{stageObj?.label || lead.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 dark:text-petrol-300">
                        {lead.meetingDate ? new Date(lead.meetingDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right rtl:text-left font-mono font-bold text-petrol-800 dark:text-white">
                        {formatMoney(lead.dealValue)}
                      </td>
                      <td className="px-4 py-3 text-right rtl:text-left">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(lead)}
                            className="p-1 text-slate-400 hover:text-neon-500 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
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
