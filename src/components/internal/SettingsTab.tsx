import React, { useState } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  Shield,
  Key,
  DollarSign,
  User,
  History,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { PlanTier } from '../../types/database';

export const SettingsTab: React.FC = () => {
  const {
    adminUser,
    auditLogs,
    resetToSeedData,
  } = useInternal();

  const [starterPrice, setStarterPrice] = useState(2500);
  const [growthPrice, setGrowthPrice] = useState(5500);
  const [enterprisePrice, setEnterprisePrice] = useState(12000);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] إعدادات المالك
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Root Administration
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            إعدادات النظام والخطط وسجل التدقيق
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            إدارة تسعير الباقات، مفاتيح التكامل السحابي، ومراجعة سجل الأنشطة الإدارية
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('هل أنت متأكد من رغبتك في استعادة البيانات الافتراضية؟')) {
              resetToSeedData();
            }
          }}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer border border-slate-200 shrink-0"
        >
          استعادة البيانات الأولية (Reset Seed Data)
        </button>
      </div>

      {/* 2. Admin Profile & Session */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-petrol-800 text-neon-400 font-mono font-bold text-lg flex items-center justify-center shrink-0">
              IB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{adminUser.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-petrol-100 text-petrol-800 font-mono">
                  {adminUser.role}
                </span>
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">{adminUser.title}</span>
              <span className="text-xs font-mono text-slate-400 block mt-0.5">{adminUser.email}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>الصلاحيات: تحكم كامل بالمداخيل وقواعد البيانات</span>
            <span className="text-emerald-600 font-bold">جلسة آمنة نشطة</span>
          </div>
        </div>

        {/* Pricing Plans Configuration */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">تسعير باقات الاشتراك الشهرية (MAD)</h3>
          <p className="text-xs text-slate-500 mb-3">تعديل التسعير الافتراضي للوكالات الجديدة</p>

          <form onSubmit={handleSavePricing} className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-500 mb-1">Starter</label>
                <input
                  type="number"
                  value={starterPrice}
                  onChange={(e) => setStarterPrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Growth</label>
                <input
                  type="number"
                  value={growthPrice}
                  onChange={(e) => setGrowthPrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Enterprise</label>
                <input
                  type="number"
                  value={enterprisePrice}
                  onChange={(e) => setEnterprisePrice(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> تم حفظ التسعير بنجاح
                </span>
              ) : <span></span>}
              <button
                type="submit"
                className="px-4 py-1.5 bg-petrol-800 text-white font-bold rounded-lg hover:bg-petrol-700 cursor-pointer"
              >
                تحديث الأسعار
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. API Integrations Status */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">مفاتيح الربط البرمجي (Platform API Keys)</h3>
        <p className="text-xs text-slate-500 mb-4">تم تأمين المفاتيح في المتغيرات البيئية للمنصة</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Supabase Service Role Key</span>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">متصل وآمن</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Meta Marketing App Secret</span>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">متصل وآمن</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-700">WhatsApp Cloud Token</span>
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">متصل وآمن</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Google Calendar OAuth 2.0</span>
            <span className="text-[11px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">تجديد دوري</span>
          </div>
        </div>
      </div>

      {/* 4. Immutable Audit Trail Log */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              سجل التدقيق الداخلي (Immutable Audit Trail Log)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono font-bold">
            {auditLogs.length} سجل مسجل
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">المسؤول</th>
                <th className="p-3.5">نوع الإجراء</th>
                <th className="p-3.5">الوكالة المستهدفة</th>
                <th className="p-3.5">تفاصيل التعديل</th>
                <th className="p-3.5">التوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {log.actor_name}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-petrol-800">{log.action}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{log.target_agency}</td>
                  <td className="p-3.5 text-slate-600">{log.details}</td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                    {new Date(log.created_at).toLocaleString('ar-MA')}
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
