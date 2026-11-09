import React from 'react';
import { useInternal, DateFilterRange } from '../../context/InternalContext';
import {
  Calendar,
  Filter,
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const GlobalFilterBar: React.FC = () => {
  const {
    dateRange,
    setDateRange,
    selectedAgencyFilter,
    setSelectedAgencyFilter,
    selectedPlanFilter,
    setSelectedPlanFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    agencies,
  } = useInternal();

  const dateOptions: Array<{ key: DateFilterRange; label: string }> = [
    { key: 'today', label: 'اليوم' },
    { key: '7d', label: '7 أيام' },
    { key: '30d', label: '30 يوم' },
    { key: 'this_month', label: 'هاد الشهر' },
    { key: 'last_month', label: 'الشهر اللي فات' },
    { key: 'custom', label: 'مخصص' },
  ];

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
      {/* 1. Date Range Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
        <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 ml-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          الفترة:
        </span>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {dateOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setDateRange(opt.key)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
                dateRange === opt.key
                  ? 'bg-petrol-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Agency & Plan Filters */}
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {/* Agency Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedAgencyFilter}
            onChange={(e) => setSelectedAgencyFilter(e.target.value)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">كل الوكالات ({agencies.length})</option>
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Filter */}
        <select
          value={selectedPlanFilter}
          onChange={(e) => setSelectedPlanFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">كل الباقات</option>
          <option value="enterprise">Enterprise</option>
          <option value="growth">Growth</option>
          <option value="starter">Starter</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشطة</option>
          <option value="at_risk">في خطر</option>
          <option value="trial">تجريبية</option>
          <option value="paused">متوقفة</option>
        </select>
      </div>
    </div>
  );
};
