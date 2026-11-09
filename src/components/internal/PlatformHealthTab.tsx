import React, { useState, useMemo } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  Activity,
  Server,
  Database,
  Calendar,
  MessageSquare,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  UserX,
} from 'lucide-react';
import { ServiceName, ServiceStatus } from '../../types/database';

export const PlatformHealthTab: React.FC = () => {
  const {
    healthChecks,
    agencies,
    setSelectedAgencyId,
  } = useInternal();

  const [testingPing, setTestingPing] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState('الآن');

  // Calculate Inactive Agencies
  const inactiveAgencies = useMemo(() => {
    const now = Date.now();
    const dayMs = 1000 * 60 * 60 * 24;

    return agencies.map((agency) => {
      const lastActive = new Date(agency.last_activity_at).getTime();
      const diffDays = Math.floor((now - lastActive) / dayMs);

      let inactivityBracket: '14+' | '7-13' | '3-6' | 'active' = 'active';
      if (diffDays >= 14) inactivityBracket = '14+';
      else if (diffDays >= 7) inactivityBracket = '7-13';
      else if (diffDays >= 3) inactivityBracket = '3-6';

      return {
        ...agency,
        diffDays,
        inactivityBracket,
      };
    }).filter((a) => a.inactivityBracket !== 'active');
  }, [agencies]);

  const services = [
    {
      name: 'Supabase PostgreSQL & Auth',
      serviceKey: 'supabase' as ServiceName,
      status: 'healthy' as ServiceStatus,
      latency: '24 ms',
      uptime: '99.98%',
      description: 'قاعدة البيانات السحابية المركزية، ومصادقة المستخدمين، وصلاحيات RLS',
      icon: Database,
    },
    {
      name: 'Google Calendar & OAuth API',
      serviceKey: 'google_apis' as ServiceName,
      status: 'token_expired' as ServiceStatus,
      latency: '110 ms',
      uptime: '98.5%',
      description: 'مزامنة مواعيد المعاينات العقارية مع تقويم مديري الوكالات (يوجد تنبيه رمز منتهي)',
      icon: Calendar,
    },
    {
      name: 'WhatsApp Cloud API / Webhook',
      serviceKey: 'whatsapp' as ServiceName,
      status: 'healthy' as ServiceStatus,
      latency: '180 ms',
      uptime: '99.9%',
      description: 'إرسال الرسائل التلقائية الفورية وتلقي ردود الزبناء عبر الـ Webhook',
      icon: MessageSquare,
    },
    {
      name: 'Meta Ads Marketing API',
      serviceKey: 'meta_ads' as ServiceName,
      status: 'healthy' as ServiceStatus,
      latency: '95 ms',
      uptime: '99.7%',
      description: 'جلب بيانات النفقات وتكلفة الليد وسحب الـ Leads مباشرة من النماذج الفورية',
      icon: Globe,
    },
    {
      name: 'Webhooks Ingestion Pipeline',
      serviceKey: 'webhooks' as ServiceName,
      status: 'healthy' as ServiceStatus,
      latency: '18 ms',
      uptime: '100%',
      description: 'سيرفر استقبال الـ Webhooks من بوابات الدفع وصفحات الهبوط العقارية',
      icon: Radio,
    },
  ];

  const handleRunDiagnostic = () => {
    setTestingPing(true);
    setTimeout(() => {
      setTestingPing(false);
      setLastCheckTime(new Date().toLocaleTimeString('ar-MA'));
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] البنية التحتية
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Uptime 99.8%
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            صحة المنصة ومراقبة الخدمات والركود
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            فحص سرعة استجابة السيرفرات وقواعد البيانات وتتبع الوكالات غير النشطة
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          <span className="text-xs text-slate-400 font-mono">آخر فحص: {lastCheckTime}</span>
          <button
            onClick={handleRunDiagnostic}
            disabled={testingPing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-petrol-800 hover:bg-petrol-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
            <span>{testingPing ? 'جاري الفحص...' : 'إجراء فحص حي للخدمات'}</span>
          </button>
        </div>
      </div>

      {/* 2. Core Infrastructure Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          const isHealthy = svc.status === 'healthy';

          return (
            <div
              key={svc.serviceKey}
              className={`p-4.5 rounded-xl border bg-white flex flex-col justify-between shadow-2xs transition-all ${
                isHealthy ? 'border-slate-200/90' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${isHealthy ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{svc.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">Uptime: {svc.uptime}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isHealthy
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isHealthy ? 'سليم' : 'تنبيه رمز'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed mt-2">
                  {svc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">زمن الاستجابة:</span>
                <span className="font-bold text-slate-800">{svc.latency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Inactive Agencies Monitor (Churn Warning) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-amber-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                مراقب خمول الوكالات (Inactive Agencies Risk)
              </h3>
              <p className="text-[11px] text-slate-500">
                وكالات لم تسجل أي دخول أو نشاط منذ 3 أيام أو أكثر (مؤشر خطر الانسحاب)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-lg">
            {inactiveAgencies.length} وكالات راكدة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">الوكالة</th>
                <th className="p-3.5">المدينة</th>
                <th className="p-3.5">مدة الخمول</th>
                <th className="p-3.5">الخطة والـ MRR</th>
                <th className="p-3.5">مستوى الخطر</th>
                <th className="p-3.5 text-center">الإجراء الموصى به</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inactiveAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{agency.name}</td>
                  <td className="p-3.5 text-slate-600">{agency.city}</td>
                  <td className="p-3.5 font-mono font-bold text-slate-700">
                    منذ {agency.diffDays} أيام
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-900">{agency.mrr.toLocaleString()} د.م.</span>
                    <span className="text-[10px] text-slate-400 block font-sans">خطة {agency.plan}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      agency.diffDays >= 14
                        ? 'bg-rose-100 text-rose-800'
                        : agency.diffDays >= 7
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agency.diffDays >= 14 ? 'حرج (14+ يوماً)' : agency.diffDays >= 7 ? 'مرتفع (7+ أيام)' : 'متوسط (3+ أيام)'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedAgencyId(agency.id)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 hover:bg-petrol-700 text-white rounded cursor-pointer"
                      >
                        فحص الحساب والاتصال
                      </button>
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
