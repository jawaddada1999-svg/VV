import React from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const PlatformCrmTab: React.FC = () => {
  const { agencies, platformKPIs, setSelectedAgencyId } = useInternal();

  // Aggregate stats across all agencies (Privacy-safe, no client PII)
  const agencyLeadPerformance = [
    { name: 'أطلس العقارية بريميوم', city: 'الدار البيضاء', leads: 420, convRate: '18.5%', avgResponse: '4 دقائق', neglected: 2 },
    { name: 'سيتي سنتر بروبيرتيز', city: 'الدار البيضاء', leads: 310, convRate: '16.2%', avgResponse: '6 دقائق', neglected: 1 },
    { name: 'مجموعة النخيل برستيج', city: 'مراكش', leads: 285, convRate: '15.0%', avgResponse: '8 دقائق', neglected: 3 },
    { name: 'بوغاز كابيتال العقارية', city: 'طنجة', leads: 215, convRate: '14.4%', avgResponse: '7 دقائق', neglected: 0 },
    { name: 'كازا ليدينغ هومز', city: 'الدار البيضاء', leads: 180, convRate: '13.8%', avgResponse: '12 دقيقة', neglected: 5 },
    { name: 'المحيط العقارية', city: 'الرباط', leads: 145, convRate: '12.5%', avgResponse: '15 دقيقة', neglected: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] تجميع الليدات
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Aggregate CRM Metrics
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            مؤشرات الليدات ومسار التحويل التراكمي للمنصة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تحليل إجمالي الليدات المحققة لكل الوكالات، سرعة الرد، ونسب التحويل العامة دون كشف خصوصية زبناء الوكالات
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>حماية تامة لخصوصية زبناء الوكالات (No Client PII)</span>
        </div>
      </div>

      {/* 2. Platform CRM Aggregate KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-800 border border-teal-200/80 block w-max mb-2">
            [Platform] المجموع
          </span>
          <span className="text-xs font-semibold text-slate-500 block">إجمالي الليدات عبر المنصة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {platformKPIs.totalLeadsThisMonth.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">ليد</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">اليوم: {platformKPIs.totalLeadsToday} ليد جديد</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 block w-max mb-2">
            [Platform] التحويل
          </span>
          <span className="text-xs font-semibold text-slate-500 block">متوسط نسبة التحويل لصفقات</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              15.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">معدل تحويل الزيارات إلى مواعيد</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-800 border border-blue-200/80 block w-max mb-2">
            [Platform] سرعة الرد
          </span>
          <span className="text-xs font-semibold text-slate-500 block">متوسط زمن أول استجابة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              6.5
            </span>
            <span className="text-xs font-bold text-slate-500">دقائق</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-2 block">بفضل الأوتوميشن الفوري بالواتساب</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200/80 block w-max mb-2">
            [Platform] إهمال الليدات
          </span>
          <span className="text-xs font-semibold text-slate-500 block">ليدات مهملة بلا رد (&gt;24 ساعة)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              15
            </span>
            <span className="text-xs font-bold text-slate-500">ليد فقط</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">أقل من 1.1% من إجمالي الليدات</span>
        </div>
      </div>

      {/* 3. Agency Aggregate CRM Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            مقارنة أداء الوكالات في معالجة الليدات (Agency Aggregates)
          </h3>
          <p className="text-[11px] text-slate-500">
            أرقام مجمعة توضح كفاءة كل وكالة في سرعة التفاعل ونسب الإغلاق
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">الوكالة</th>
                <th className="p-3.5">المدينة</th>
                <th className="p-3.5">الليدات المجمعة</th>
                <th className="p-3.5">نسبة التحويل</th>
                <th className="p-3.5">متوسط سرعة الرد</th>
                <th className="p-3.5">ليدات متأخرة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agencyLeadPerformance.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="p-3.5 text-slate-600">{item.city}</td>
                  <td className="p-3.5 font-mono font-bold text-petrol-900">{item.leads}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-600">{item.convRate}</td>
                  <td className="p-3.5 font-mono text-slate-700">{item.avgResponse}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      item.neglected > 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.neglected}
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
