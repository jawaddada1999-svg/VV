import React from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';

export const PlatformAppointmentsTab: React.FC = () => {
  const { platformKPIs } = useInternal();

  const cityAppointmentData = [
    { city: 'الدار البيضاء', booked: 160, held: 128, showUp: '80.0%', cancelled: 18 },
    { city: 'مراكش', booked: 85, held: 66, showUp: '77.6%', cancelled: 11 },
    { city: 'الرباط', booked: 52, held: 41, showUp: '78.8%', cancelled: 6 },
    { city: 'طنجة', booked: 43, held: 35, showUp: '81.4%', cancelled: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] إجمالي المواعيد
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Platform Appointments Aggregate
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            مواعيد المعاينات والزيارات العقارية عبر المنصة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إجمالي المعاينات المحجوزة، نسبة الحضور الفعلي (Show-up Rate)، ونسب الإلغاء على مستوى كل المدن
          </p>
        </div>
      </div>

      {/* 2. Platform Appointments KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80 block w-max mb-2">
            [Platform] المجموع
          </span>
          <span className="text-xs font-semibold text-slate-500 block">إجمالي المواعيد المحجوزة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {platformKPIs.totalAppointmentsThisMonth}
            </span>
            <span className="text-xs font-bold text-slate-500">موعد</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">اليوم: {platformKPIs.totalAppointmentsToday} مواعيد مجدولة</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 block w-max mb-2">
            [Platform] الحضور
          </span>
          <span className="text-xs font-semibold text-slate-500 block">نسبة الحضور الفعلي (Show-Up)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              79.4%
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-2 block">▲ +4.2% بفضل تذكيرات واتساب H-2</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-800 border border-rose-200/80 block w-max mb-2">
            [Platform] الغياب (No-Show)
          </span>
          <span className="text-xs font-semibold text-slate-500 block">نسبة عدم الحضور والغياب</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              11.8%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">انخفاض من 16.5% الشهر الماضي</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200/80 block w-max mb-2">
            [Platform] الإلغاء المسبق
          </span>
          <span className="text-xs font-semibold text-slate-500 block">نسبة الإلغاء أو إعادة الجدولة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              8.8%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">تتم إعادة جدولتها آلياً عبر التقويم</span>
        </div>
      </div>

      {/* 3. City Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            توزيع مواعيد المعاينات حسب المدن الرئيسية (City Distribution)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">المدينة</th>
                <th className="p-3.5">إجمالي المواعيد المحجوزة</th>
                <th className="p-3.5">المواعيد المنجزة فعلياً</th>
                <th className="p-3.5">نسبة الحضور (Show-Up)</th>
                <th className="p-3.5">الملغاة مسبقاً</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cityAppointmentData.map((row) => (
                <tr key={row.city} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{row.city}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-800">{row.booked}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">{row.held}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600">{row.showUp}</td>
                  <td className="p-3.5 font-mono text-slate-500">{row.cancelled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
