import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GripVertical,
  Maximize2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ExecutiveSummary } from './ExecutiveSummary';
import { FunnelDiagnostic } from './FunnelDiagnostic';

export interface WidgetConfig {
  id: string;
  title: string;
  colSpan: 'full' | 'half' | 'third' | 'two-thirds';
}

interface OverviewGridProps {
  isEditMode: boolean;
  widgetOrder: WidgetConfig[];
  setWidgetOrder: React.Dispatch<React.SetStateAction<WidgetConfig[]>>;
  onDragStartWidget: (id: string) => void;
  onDropOnWidget: (targetId: string) => void;
  globalSearch: string;
}

export const OverviewGrid: React.FC<OverviewGridProps> = ({
  isEditMode,
  widgetOrder,
  setWidgetOrder,
  onDragStartWidget,
  onDropOnWidget,
  globalSearch,
}) => {
  const { leads, formatMoney, setActiveTab, language } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7d' | '30d' | 'all'>('30d');

  const periodOptions = [
    { key: 'today', label: language === 'ar' ? 'اليوم' : "Aujourd'hui" },
    { key: '7d', label: language === 'ar' ? 'آخر 7 أيام' : '7 jours' },
    { key: '30d', label: language === 'ar' ? 'آخر 30 يوماً' : '30 jours' },
    { key: 'all', label: language === 'ar' ? 'الكل' : 'Tout' },
  ];

  // Apply search filtering to recent leads
  const filteredRecentLeads = leads
    .filter((lead) => {
      if (!globalSearch) return true;
      const s = globalSearch.toLowerCase();
      return (
        lead.agencyName.toLowerCase().includes(s) ||
        lead.city.toLowerCase().includes(s) ||
        lead.contactPerson.toLowerCase().includes(s) ||
        lead.phone.includes(s)
      );
    })
    .slice(0, 5);

  const toggleSize = (id: string) => {
    if (!isEditMode) return;
    setWidgetOrder((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextSpan: WidgetConfig['colSpan'] =
            w.colSpan === 'full'
              ? 'half'
              : w.colSpan === 'half'
              ? 'two-thirds'
              : w.colSpan === 'two-thirds'
              ? 'third'
              : 'full';
          return { ...w, colSpan: nextSpan };
        }
        return w;
      })
    );
  };

  const getColSpanClass = (span: WidgetConfig['colSpan']) => {
    switch (span) {
      case 'full':
        return 'col-span-1 lg:col-span-12';
      case 'half':
        return 'col-span-1 lg:col-span-6';
      case 'third':
        return 'col-span-1 lg:col-span-4';
      case 'two-thirds':
        return 'col-span-1 lg:col-span-8';
      default:
        return 'col-span-1 lg:col-span-12';
    }
  };

  const renderWidgetContent = (id: string) => {
    switch (id) {
      case 'period_bar':
        return (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 p-4 sm:p-5 bg-white">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                {language === 'ar'
                  ? 'مؤشرات الأداء ومسار تحويل الوكالات'
                  : 'Tableau de Bord & Performance'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                {language === 'ar'
                  ? 'تتبع حي لميزانيات ميتا، نماذج الوكالات، المواعيد والصفقات المغلقة'
                  : 'Suivi direct des campagnes Meta, leads entrants et mandats signés.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
              {/* Modern segmented control */}
              <div className="grid grid-cols-2 sm:flex sm:items-center bg-slate-100/80 p-1 rounded-lg text-xs font-medium border border-slate-200/70 w-full sm:w-auto gap-0.5">
                {periodOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedPeriod(opt.key as any)}
                    className={`w-full sm:w-auto text-center px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      selectedPeriod === opt.key
                        ? 'bg-white text-slate-900 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-700">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        );

      case 'kpis_summary':
        return (
          <div className="p-4 sm:p-5 bg-white">
            <ExecutiveSummary />
          </div>
        );

      case 'funnel_diagnostic':
        return (
          <div className="p-4 sm:p-5 bg-white">
            <FunnelDiagnostic />
          </div>
        );

      case 'recent_leads':
        return (
          <div className="p-5 flex flex-col justify-between h-full bg-white">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {language === 'ar' ? 'أحدث الوكالات المسجلة' : 'Dernières Agences'}
                  </h3>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {filteredRecentLeads.length} {language === 'ar' ? 'وكالات مسجلة' : 'agences'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('crm')}
                  className="text-xs font-medium text-neon-600 hover:text-neon-700 cursor-pointer flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'خط الصفقات' : 'CRM'}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 stroke-[2]" />
                </button>
              </div>

              <div className="space-y-2">
                {filteredRecentLeads.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'Aucun résultat'}
                  </div>
                ) : (
                  filteredRecentLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3 bg-slate-50/70 rounded-lg border border-slate-200/70 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-800 truncate">
                          {lead.agencyName}
                        </h4>
                        <span className="font-mono text-xs font-bold text-petrol-800 shrink-0">
                          {formatMoney(lead.dealValue)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                        <span>{lead.city}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{lead.contactPerson}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('simulator')}
                className="w-full py-2 px-3 text-xs font-medium text-center text-white bg-petrol-800 hover:bg-petrol-700 active:scale-[0.99] rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-neon-400" />
                <span>{language === 'ar' ? 'حاسبة الأهداف والميزانية' : 'Simulateur'}</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full max-w-full">
      {widgetOrder.map((widget) => {
        return (
          <div
            key={widget.id}
            draggable={isEditMode}
            onDragStart={() => onDragStartWidget(widget.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDropOnWidget(widget.id)}
            className={`${getColSpanClass(
              widget.colSpan
            )} bg-white rounded-xl border ${
              isEditMode
                ? 'border-dashed border-neon-500/80 shadow-md ring-2 ring-neon-500/10'
                : 'border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]'
            } transition-all overflow-hidden flex flex-col justify-between`}
          >
            {/* Widget Top Bar in Edit Mode */}
            {isEditMode && (
              <div className="p-2.5 bg-orange-50/60 border-b border-orange-100 flex items-center justify-between text-xs font-medium text-orange-800">
                <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-3.5 h-3.5 text-orange-500" />
                  <span>{widget.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSize(widget.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer font-mono text-[11px]"
                    title="تغيير الحجم"
                  >
                    <Maximize2 className="w-3 h-3 text-slate-400" />
                    <span>{widget.colSpan}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Widget Inner Content */}
            <div className="flex-1">{renderWidgetContent(widget.id)}</div>
          </div>
        );
      })}
    </div>
  );
};
