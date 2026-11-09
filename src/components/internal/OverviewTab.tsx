import React, { useState } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Zap,
  ShieldAlert,
  ChevronLeft,
  GripVertical,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const OverviewTab: React.FC = () => {
  const {
    platformKPIs,
    mrrHistory,
    platformDailyLeads,
    agencies,
    criticalAlerts,
    setSelectedAgencyId,
    restartAutomation,
    retryInvoicePayment,
    isEditMode,
  } = useInternal();

  // Revenue by Plan calculation for Donut Chart
  const planDistribution = React.useMemo(() => {
    const counts = { enterprise: 0, growth: 0, starter: 0 };
    const revenue = { enterprise: 0, growth: 0, starter: 0 };

    agencies.forEach((a) => {
      if (a.status === 'active' || a.status === 'at_risk') {
        counts[a.plan] += 1;
        revenue[a.plan] += a.mrr;
      }
    });

    return [
      { name: 'Enterprise (12,000 د.م)', value: revenue.enterprise, count: counts.enterprise, color: '#0B434C' },
      { name: 'Growth (5,500 د.م)', value: revenue.growth, count: counts.growth, color: '#0D9488' },
      { name: 'Starter (2,500 د.م)', value: revenue.starter, count: counts.starter, color: '#FF6600' },
    ];
  }, [agencies]);

  // Quick Upsell Opportunities
  const upsellCandidates = [
    {
      agencyId: 'ag-5',
      agencyName: 'كازا ليدينغ هومز (Casa Leading)',
      currentPlan: 'Starter (2,500 د.م)',
      targetPlan: 'Growth (5,500 د.م)',
      potentialGain: '+3,000 د.م/شهر',
      reason: 'سجلت 180 ليد هذا الشهر وطلبت تفعيل أوتوميشن المواعيد المتزامنة مع Google Calendar.',
    },
    {
      agencyId: 'ag-2',
      agencyName: 'مجموعة النخيل برستيج (Palmier)',
      currentPlan: 'Growth (5,500 د.م)',
      targetPlan: 'Enterprise (12,000 د.م)',
      potentialGain: '+6,500 د.م/شهر',
      reason: 'توسعت إلى فرعين وتحتاج واجهات API مخصصة و WhatsApp Bot بالذكاء الاصطناعي.',
    },
    {
      agencyId: 'ag-6',
      agencyName: 'أكادير باي إنفست (Agadir Bay)',
      currentPlan: 'Trial (مجاني)',
      targetPlan: 'Growth (5,500 د.م)',
      potentialGain: '+5,500 د.م/شهر',
      reason: 'الفترة التجريبية تنتهي خلال 5 أيام، نسبة التفاعل 92% مع تفعيل صفحة هبوط مستقلة.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Health Snapshot */}
      <div className="bg-gradient-to-l from-petrol-900 via-petrol-800 to-[#06262B] text-white p-5 sm:p-6 rounded-2xl shadow-sm border border-petrol-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20">
              [Platform] مركز القيادة الداخلية (Mission Control)
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              النظام متصل ويعمل بكفاءة 99.8%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            نظرة عامة على صحة وأداء IBONDA
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            متابعة فورية للمداخيل الشهرية المتكررة (MRR)، نمو الوكالات النشطة، جودة الأوتوميشن، وتنبيهات التدخل السريع للمالك.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15 text-right">
            <span className="text-[10px] text-slate-300 block font-medium">صافي الإيرادات المتكررة</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-neon-400">
              {platformKPIs.currentMRR.toLocaleString()} د.م.
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer border border-white/15"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Platform KPIs Grid with explicit [Platform] Level Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Current MRR */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] المنصة
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              ▲ {platformKPIs.mrrChangePct}%
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">إجمالي الـ MRR الحالي</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {platformKPIs.currentMRR.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">د.م./شهر</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>معدل إيراد الوكالة (ARPU)</span>
            <span className="font-mono font-bold text-slate-700">{platformKPIs.arpu.toLocaleString()} د.م.</span>
          </div>
        </div>

        {/* KPI 2: Active Agencies */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] الوكالات
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              ▲ {platformKPIs.activeAgenciesChangePct}%
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">الوكالات النشطة المشتركة</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {platformKPIs.activeAgenciesCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">وكالة نشطة</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>وكالات جديدة هذا الشهر</span>
            <span className="font-mono font-bold text-emerald-600">+{platformKPIs.newAgenciesThisMonth} وكالات</span>
          </div>
        </div>

        {/* KPI 3: Platform Leads Total */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-800 border border-teal-200/80">
              [Platform] مجموع الليدات
            </span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              اليوم: {platformKPIs.totalLeadsToday}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">الليدات المولدة عبر كل الوكالات</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {platformKPIs.totalLeadsThisMonth.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">ليد هذا الشهر</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>مواعيد محجوزة (المجموع)</span>
            <span className="font-mono font-bold text-slate-700">{platformKPIs.totalAppointmentsThisMonth} موعد</span>
          </div>
        </div>

        {/* KPI 4: Automations Health */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200/80">
              [Platform] الأوتوميشن
            </span>
            {platformKPIs.failingAutomationsCount > 0 ? (
              <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
                {platformKPIs.failingAutomationsCount} متوقفة
              </span>
            ) : (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                الكل سليم
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-slate-500 block">أنظمة الأوتوميشن الشغالة</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
              {platformKPIs.activeAutomationsCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">نظام نشط</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>نسبة الاستقرار (Uptime)</span>
            <span className="font-mono font-bold text-emerald-600">99.4%</span>
          </div>
        </div>
      </div>

      {/* 3. Urgent Alerts Bar for Platform Owner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-700 stroke-[2.2]" />
              <h3 className="text-sm font-bold text-amber-900">
                تنبيهات فورية تتطلب تدخل المالك ({criticalAlerts.length})
              </h3>
            </div>
            <span className="text-[11px] font-medium text-amber-700">
              عطل فني أو تعثر سداد قد يؤثر على تجربة الوكالة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      alert.type === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.type === 'critical' ? 'عطل حرج' : 'تنبيه خطر'}
                    </span>
                    {alert.agencyName && (
                      <span className="text-[11px] font-bold text-slate-700 truncate max-w-[140px]">
                        {alert.agencyName}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{alert.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  {alert.actionType === 'restart_automation' && (
                    <button
                      onClick={() => alert.agencyId && restartAutomation(alert.id.replace('alert-auto-', ''))}
                      className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 hover:bg-petrol-700 text-white rounded-md cursor-pointer transition-colors"
                    >
                      إعادة تشغيل فورية
                    </button>
                  )}
                  {alert.actionType === 'retry_invoice' && (
                    <button
                      onClick={() => alert.agencyId && retryInvoicePayment(alert.id.replace('alert-inv-', ''))}
                      className="px-2.5 py-1 text-[11px] font-bold bg-neon-500 hover:bg-neon-600 text-white rounded-md cursor-pointer transition-colors"
                    >
                      إعادة معالجة الدفعة
                    </button>
                  )}
                  {alert.actionType === 'view_agency' && (
                    <button
                      onClick={() => alert.agencyId && setSelectedAgencyId(alert.agencyId)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md cursor-pointer transition-colors"
                    >
                      فتح ملف الوكالة
                    </button>
                  )}

                  {alert.agencyId && (
                    <button
                      onClick={() => setSelectedAgencyId(alert.agencyId!)}
                      className="text-[11px] font-medium text-slate-500 hover:text-petrol-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      تفاصيل
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Charts Grid: MRR Growth (12 Mo) + Revenue by Plan Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: MRR Evolution (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
                  [Platform] الرسم البياني
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  تطور الإيرادات المتكررة (MRR) - آخر 12 شهر
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                مقارنة صافي النمو، التوسع (Expansion)، والاشتراكات الجديدة
              </p>
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block">الوصول الحالي</span>
              <span className="text-base font-bold text-petrol-900">84,500 د.م.</span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrrHistory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B434C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0B434C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString()} د.م.`, 'الـ MRR']}
                  labelStyle={{ fontWeight: 'bold', color: '#0F172A' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    direction: 'rtl',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#0B434C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#mrrGradient)"
                  dot={{ r: 3, fill: '#0B434C' }}
                  activeDot={{ r: 6, fill: '#FF6600' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Distribution by Plan (Donut) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
                [Platform] الخطط
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                توزيع الإيرادات حسب خطة الاشتراك
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              نسبة مساهمة كل فئة في الـ MRR الإجمالي
            </p>
          </div>

          <div className="h-52 w-full my-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} د.م.`, 'المداخيل']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100">
            {planDistribution.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span className="text-slate-700 font-medium">{p.name} ({p.count})</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{p.value.toLocaleString()} د.م.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Daily Leads Bar Chart & Quick Upsell Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Leads Activity (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-800 border border-teal-200/80">
                  [Platform] النشاط اليومي
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  توليد الليدات اليومية عبر المنصة (آخر 30 يوم)
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                متابعة استقرار تدفق الزبناء المحتملين لكل الوكالات
              </p>
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-slate-400 block">المتوسط اليومي</span>
              <span className="text-base font-bold text-teal-700">~47 ليد/يوم</span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformDailyLeads} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} ليد`, 'الليدات المستلمة']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                    direction: 'rtl',
                  }}
                />
                <Bar dataKey="leads" fill="#0D9488" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Upsell Opportunities Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neon-50 text-neon-700 border border-neon-200">
                [Agency] فرص ترقية
              </span>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-neon-500" />
                فرص Upsell جاهزة
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              وكالات مؤهلة لترقية باقتها لتحقيق +15,000 د.م. MRR
            </p>
          </div>

          <div className="space-y-3 my-3">
            {upsellCandidates.map((c) => (
              <div
                key={c.agencyId}
                onClick={() => setSelectedAgencyId(c.agencyId)}
                className="p-3 rounded-lg border border-slate-200 hover:border-petrol-700 hover:bg-slate-50/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-petrol-800 transition-colors">
                    {c.agencyName}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                    {c.potentialGain}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1.5">
                  <span className="line-through">{c.currentPlan}</span>
                  <span>←</span>
                  <span className="font-bold text-slate-800">{c.targetPlan}</span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {c.reason}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {}}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200/90 transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            عرض كافة فرص الترقية والـ Growth
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
