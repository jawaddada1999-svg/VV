import React, { useState, useMemo } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Layers,
  Activity,
  Bot,
  Calendar,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { AutomationSystem } from '../../types/database';

export const AutomationTab: React.FC = () => {
  const {
    automations,
    restartAutomation,
    pauseAutomation,
    setSelectedAgencyId,
  } = useInternal();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchAutomation, setSearchAutomation] = useState<string>('');

  const totalRuns = useMemo(() => {
    return automations.reduce((sum, a) => sum + a.total_runs, 0);
  }, [automations]);

  const activeCount = useMemo(() => {
    return automations.filter((a) => a.status === 'active').length;
  }, [automations]);

  const errorCount = useMemo(() => {
    return automations.filter((a) => a.status === 'error').length;
  }, [automations]);

  // Grouped Errors for fast triage
  const groupedErrors = useMemo(() => {
    const map = new Map<string, { title: string; count: number; agencies: string[]; systemIds: string[] }>();

    automations.forEach((auto) => {
      if (auto.status === 'error' && auto.last_error_message) {
        let key = 'Other Error';
        if (auto.last_error_message.includes('Token') || auto.last_error_message.includes('Google')) {
          key = 'Google Calendar Refresh Token Expired';
        } else if (auto.last_error_message.includes('WhatsApp') || auto.last_error_message.includes('Webhook')) {
          key = 'WhatsApp Webhook Timeout / Connection Reset';
        }

        if (!map.has(key)) {
          map.set(key, { title: key, count: 0, agencies: [], systemIds: [] });
        }
        const item = map.get(key)!;
        item.count += 1;
        item.agencies.push(auto.agency_name);
        item.systemIds.push(auto.id);
      }
    });

    return Array.from(map.values());
  }, [automations]);

  const filteredAutomations = useMemo(() => {
    return automations.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(searchAutomation.toLowerCase()) ||
        a.agency_name.toLowerCase().includes(searchAutomation.toLowerCase());
      const matchType = filterType === 'all' || a.type === filterType;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [automations, searchAutomation, filterType, filterStatus]);

  const getTypeIcon = (type: AutomationSystem['type']) => {
    switch (type) {
      case 'instant_whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'google_calendar_sync':
        return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
      case 'lead_notification':
        return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'crm_stage_move':
        return <Layers className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const getTypeName = (type: AutomationSystem['type']) => {
    switch (type) {
      case 'instant_whatsapp':
        return 'واتساب فوري خلال 60 ثانية';
      case 'google_calendar_sync':
        return 'مزامنة تقويم Google';
      case 'lead_notification':
        return 'إشعار فوري للوسطاء';
      case 'crm_stage_move':
        return 'تحريك مراحل الـ CRM تلقائياً';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] محرك الأوتوميشن
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {automations.length} نظام ربط
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            متابعة أنظمة الأوتوميشن والعمليات الآلية
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            مراقبة تنفيذ سريان العمليات (Workflows)، معالجة انقطاع رموز الربط، وإعادة التشغيل الفوري
          </p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => {
              automations.filter((a) => a.status === 'error').forEach((a) => restartAutomation(a.id));
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-petrol-800 hover:bg-petrol-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة تشغيل الأنظمة المعطلة</span>
          </button>
        </div>
      </div>

      {/* 2. Automation KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Runs */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] العمليات
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ▲ +22.4%
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">إجمالي عمليات الأوتوميشن المنفذة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {totalRuns.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">عملية</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">سريان آلي دون تدخل بشري</span>
        </div>

        {/* Active Automations */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-800 border border-teal-200/80">
              [Platform] الأنظمة
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {activeCount} نشط
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">الأنظمة النشطة الشغالة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {activeCount}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ {automations.length}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">عبر كافة الوكالات المشتركة</span>
        </div>

        {/* Error Count */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-50 text-rose-800 border border-rose-200/80">
              [Platform] الأعطال
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              errorCount > 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'
            }`}>
              {errorCount > 0 ? `${errorCount} أعطال` : 'صفر أعطال'}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">الأنظمة التي تحتاج إعادة تشغيل</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl sm:text-3xl font-bold font-mono ${errorCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {errorCount}
            </span>
            <span className="text-xs text-slate-500 font-bold">نظام متوقف</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">أغلبها بسبب انتهاء صلاحية Token</span>
        </div>

        {/* Success Rate */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              [Platform] الكفاءة
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              99.2%
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">نسبة نجاح التنفيذ الفوري</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              99.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">متوسط زمن الاستجابة 320ms</span>
        </div>
      </div>

      {/* 3. Grouped Errors Banner */}
      {groupedErrors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-900">
              أعطال متكررة ومجمعة (Grouped Errors Root Cause)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupedErrors.map((group, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-lg border border-amber-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{group.title}</span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                      تؤثر على {group.count} وكالات
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    الوكالات المتأثرة: {group.agencies.join(', ')}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">الحل: تجديد تفويض OAuth أو إعادة فحص الـ Webhook</span>
                  <button
                    onClick={() => {
                      group.systemIds.forEach((id) => restartAutomation(id));
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 text-white rounded hover:bg-petrol-700 cursor-pointer"
                  >
                    إعادة محاولة الاتصال
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Automations Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Table Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchAutomation}
              onChange={(e) => setSearchAutomation(e.target.value)}
              placeholder="بحث باسم النظام أو الوكالة..."
              className="w-full pr-9 pl-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-petrol-800"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:border-petrol-800"
            >
              <option value="all">كافة أنواع الأوتوميشن</option>
              <option value="instant_whatsapp">WhatsApp فوري</option>
              <option value="google_calendar_sync">مزامنة تقويم Google</option>
              <option value="lead_notification">إشعارات الليدات</option>
              <option value="crm_stage_move">مراحل الـ CRM</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:border-petrol-800"
            >
              <option value="all">كافة الحالات</option>
              <option value="active">نشطة فقط</option>
              <option value="error">معطلة / أخطاء</option>
              <option value="paused">متوقفة مؤقتاً</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">نظام الأوتوميشن</th>
                <th className="p-3.5">الوكالة المستفيدة</th>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">إجمالي التشغيل</th>
                <th className="p-3.5">متوسط السرعة</th>
                <th className="p-3.5">آخر رسالة خطأ</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAutomations.map((auto) => (
                <tr key={auto.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{auto.name}</td>
                  <td className="p-3.5 font-semibold text-slate-800">
                    <button
                      onClick={() => setSelectedAgencyId(auto.agency_id)}
                      className="hover:text-petrol-800 hover:underline cursor-pointer"
                    >
                      {auto.agency_name}
                    </button>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(auto.type)}
                      <span className="text-slate-700">{getTypeName(auto.type)}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      auto.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : auto.status === 'error'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {auto.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                      {auto.status === 'error' && <AlertTriangle className="w-3 h-3" />}
                      {auto.status === 'active' ? 'نشط' : auto.status === 'error' ? 'معطل' : 'متوقف'}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 font-bold">
                    {auto.total_runs.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {auto.avg_duration_ms} ms
                  </td>
                  <td className="p-3.5">
                    {auto.last_error_message ? (
                      <span className="text-rose-600 font-medium text-[11px] block max-w-xs truncate" title={auto.last_error_message}>
                        {auto.last_error_message}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-mono">سليم تماماً</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {auto.status === 'error' ? (
                        <button
                          onClick={() => restartAutomation(auto.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 text-white rounded hover:bg-petrol-700 cursor-pointer"
                        >
                          إعادة تشغيل
                        </button>
                      ) : auto.status === 'active' ? (
                        <button
                          onClick={() => pauseAutomation(auto.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                        >
                          إيقاف مؤقت
                        </button>
                      ) : (
                        <button
                          onClick={() => restartAutomation(auto.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 text-white rounded hover:bg-petrol-700 cursor-pointer"
                        >
                          تشغيل
                        </button>
                      )}
                    </div>
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
