import React, { useState } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  X,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  CreditCard,
  Layers,
  Activity,
  Bot,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { PlanTier, ModuleKey, AgencyStatus } from '../../types/database';

interface AgencyDetailModalProps {
  agencyId: string;
  onClose: () => void;
}

export const AgencyDetailModal: React.FC<AgencyDetailModalProps> = ({ agencyId, onClose }) => {
  const {
    agencies,
    subscriptions,
    modules,
    invoices,
    automations,
    healthChecks,
    updateAgency,
    toggleAgencyModule,
    changeAgencyPlan,
    updateAgencyStatus,
    retryInvoicePayment,
    markInvoicePaid,
    setImpersonatingAgency,
  } = useInternal();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'plan' | 'modules' | 'usage' | 'invoices' | 'health' | 'upsell'
  >('overview');

  const agency = agencies.find((a) => a.id === agencyId);
  const subscription = subscriptions.find((s) => s.agency_id === agencyId);
  const agencyModules = modules.filter((m) => m.agency_id === agencyId);
  const agencyInvoices = invoices.filter((i) => i.agency_id === agencyId);
  const agencyAutomations = automations.filter((a) => a.agency_id === agencyId);
  const agencyHealth = healthChecks.filter((h) => h.agency_id === agencyId || h.agency_name === agency?.name);

  if (!agency) return null;

  const moduleDefinitions: Array<{ key: ModuleKey; label: string; description: string }> = [
    { key: 'crm', label: 'نظام إدارة علاقات الزبناء (CRM)', description: 'إدارة وتتبع مسار تحويل الصفقات العقارية' },
    { key: 'automation', label: 'محرك الأوتوميشن والعمليات', description: 'ربط النماذج، واتساب الفوري، والتنبيهات الذكية' },
    { key: 'appointments', label: 'جدولة المواعيد والمعاينات', description: 'مزامنة مع Google Calendar وحجز زيارات العقارات' },
    { key: 'analytics', label: 'تحليلات إعلانات ميتا وجوجل', description: 'متابعة تكلفة الليد وعائد الإنفاق الإعلاني ROAS' },
    { key: 'landing_pages', label: 'صفحات الهبوط المخصصة', description: 'استضافة صفحات التقاط تفويضات العقارات الحصرية' },
    { key: 'whatsapp_bot', label: 'بوت واتساب الذكي (AI Bot)', description: 'تأهيل الزبناء والرد الفوري الآلي 24/7' },
  ];

  const planOptions: Array<{ key: PlanTier; name: string; price: number; features: string }> = [
    { key: 'starter', name: 'باقة البداية (Starter)', price: 2500, features: 'CRM + المواعيد + لغاية 200 ليد' },
    { key: 'growth', name: 'باقة النمو (Growth)', price: 5500, features: 'كل أدوات Starter + محرك الأوتوميشن + لغاية 1,000 ليد' },
    { key: 'enterprise', name: 'باقة الشركات (Enterprise)', price: 12000, features: 'المنظومة الكاملة + WhatsApp Bot AI + دعم VIP مخصص' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-right">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-petrol-800 border border-petrol-600 flex items-center justify-center text-neon-400 font-mono font-bold text-lg shrink-0">
              {agency.name.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-white/10 text-white border border-white/15">
                  [Agency] بطاقة تحكم الوكالة
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  agency.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : agency.status === 'at_risk'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : agency.status === 'trial'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {agency.status === 'active' ? 'نشطة ومفعلة' : agency.status === 'at_risk' ? 'تحت الخطر (At-Risk)' : agency.status === 'trial' ? 'فترة تجريبية' : 'متوقفة'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neon-500/20 text-neon-300 border border-neon-500/30 uppercase font-mono">
                  خطة {agency.plan}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {agency.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {agency.city}
                </span>
                <span>•</span>
                <span>المالك: {agency.owner_name}</span>
                <span>•</span>
                <span className="font-mono text-neon-400 font-bold">{agency.mrr.toLocaleString()} د.م./شهر</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold scrollbar-none">
          {[
            { id: 'overview', label: 'نظرة عامة' },
            { id: 'plan', label: 'الاشتراك والخطة' },
            { id: 'modules', label: 'الموديولات المفعلة' },
            { id: 'usage', label: 'إحصائيات الاستخدام' },
            { id: 'invoices', label: 'الفواتير والمدفوعات' },
            { id: 'health', label: 'الصحة والأعطال' },
            { id: 'upsell', label: 'فرص الترقية والإجراءات' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-petrol-800 text-petrol-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">[Agency] إيراد شهري</span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                    {agency.mrr.toLocaleString()} د.م.
                  </span>
                  <span className="text-[11px] text-slate-500">خطة {agency.plan.toUpperCase()}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">[Agency] تاريخ التسجيل</span>
                  <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
                    {new Date(agency.created_at).toLocaleDateString('ar-MA')}
                  </span>
                  <span className="text-[11px] text-emerald-600">مشترك نشط</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">[Agency] آخر نشاط</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {new Date(agency.last_activity_at).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[11px] text-slate-500">نشاط متكرر</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block">[Agency] أنظمة الأوتوميشن</span>
                  <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                    {agencyAutomations.length}
                  </span>
                  <span className="text-[11px] text-teal-600">نظام متصل</span>
                </div>
              </div>

              {/* Contact Information & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                    معلومات الاتصال والمسؤول
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">اسم المالك:</span>
                      <span className="font-bold text-slate-800">{agency.owner_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">البريد الإلكتروني:</span>
                      <span className="font-mono text-slate-800">{agency.owner_email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم الهاتف:</span>
                      <span className="font-mono text-slate-800" dir="ltr">{agency.owner_phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">المدينة والمقر:</span>
                      <span className="font-bold text-slate-800">{agency.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                      ملاحظات المالك الداخلي (Internal Notes)
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {agency.notes || 'لا توجد ملاحظات إدارية خاصة.'}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">تغيير حالة الوكالة:</span>
                    <select
                      value={agency.status}
                      onChange={(e) => updateAgencyStatus(agency.id, e.target.value as AgencyStatus)}
                      className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-petrol-800"
                    >
                      <option value="active">نشطة (Active)</option>
                      <option value="at_risk">تحت الخطر (At-Risk)</option>
                      <option value="trial">فترة تجريبية (Trial)</option>
                      <option value="paused">متوقفة (Paused)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBSCRIPTION & PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  إدارة خطة الاشتراك والترقية
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تغيير الباقة يحسب فوراً في الـ MRR الإجمالي ويوثق في سجل التدقيق
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {planOptions.map((opt) => {
                  const isCurrent = agency.plan === opt.key;
                  return (
                    <div
                      key={opt.key}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-petrol-800 bg-petrol-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900">{opt.name}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-petrol-800 text-white rounded">
                              الخطة الحالية
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1 my-2">
                          <span className="text-2xl font-bold font-mono text-slate-900">
                            {opt.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">د.م./شهر</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2">{opt.features}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-petrol-800 flex items-center justify-center gap-1 py-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            الخطة المفعلة حالياً
                          </span>
                        ) : (
                          <button
                            onClick={() => changeAgencyPlan(agency.id, opt.key)}
                            className="w-full py-2 bg-petrol-800 hover:bg-petrol-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            ترقية/تبديل إلى هذه الخطة
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MODULES TOGGLE */}
          {activeTab === 'modules' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  التحكم في وحدات المنصة (Modules Feature Flags)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  يمكنك تفعيل أو تعطيل أي موديول بشكل مستقل لهذه الوكالة حسب اتفاقيتها
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {moduleDefinitions.map((mod) => {
                  const isEnabled = agencyModules.some((m) => m.module_key === mod.key && m.enabled);
                  return (
                    <div
                      key={mod.key}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{mod.label}</h4>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isEnabled ? 'مفعل' : 'معطل'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleAgencyModule(agency.id, mod.key)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          isEnabled
                            ? 'text-petrol-800 bg-petrol-50 hover:bg-petrol-100'
                            : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                        }`}
                        title={isEnabled ? 'تعطيل الموديول' : 'تفعيل الموديول'}
                      >
                        {isEnabled ? (
                          <ToggleRight className="w-7 h-7 stroke-[2]" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 stroke-[2]" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: USAGE STATS */}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  استهلاك الموارد والحدود (Usage & Limits)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  إحصائيات استخدام الوكالة لموارد السيرفر، الليدات، والرسائل
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-600">الليدات المستلمة</span>
                    <span className="text-[11px] font-bold text-slate-500">182 / 500</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-petrol-800 h-full rounded-full" style={{ width: '36.4%' }}></div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 block">استهلاك عادي (36.4%)</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-600">رسائل WhatsApp الفورية</span>
                    <span className="text-[11px] font-bold text-slate-500">420 / 1,000</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 block">استهلاك طبيعي (42%)</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-600">تشغيل الأوتوميشن</span>
                    <span className="text-[11px] font-bold text-slate-500">1,240 عملية</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium mt-2 block">نشاط مكثف ومستقر</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INVOICES & PAYMENTS */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    سجل الفواتير والدفعات الشهرية
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    متابعة الفواتير المحصلة وحالات التعثر
                  </p>
                </div>
              </div>

              {agencyInvoices.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  لا توجد فواتير سابقة مسجلة لهذه الوكالة.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-semibold">رقم الفاتورة</th>
                        <th className="p-3 font-semibold">تاريخ الإصدار</th>
                        <th className="p-3 font-semibold">المبلغ</th>
                        <th className="p-3 font-semibold">الحالة</th>
                        <th className="p-3 font-semibold">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {agencyInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/60">
                          <td className="p-3 font-mono font-bold text-slate-800">{inv.invoice_number}</td>
                          <td className="p-3 text-slate-500 font-mono">
                            {new Date(inv.issued_at).toLocaleDateString('ar-MA')}
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {inv.amount.toLocaleString()} د.م.
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'failed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'failed' ? 'فشلت' : 'معلقة'}
                            </span>
                          </td>
                          <td className="p-3">
                            {inv.status === 'failed' && (
                              <button
                                onClick={() => retryInvoicePayment(inv.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 text-white rounded hover:bg-petrol-700 cursor-pointer"
                              >
                                إعادة الخصم
                              </button>
                            )}
                            {inv.status === 'pending' && (
                              <button
                                onClick={() => markInvoicePaid(inv.id)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                              >
                                تأكيد السداد
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: HEALTH & LOGS */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  الحالة التقنية والتكاملات
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  فحص اتصال WhatsApp API، Google Calendar، والـ Webhooks
                </p>
              </div>

              <div className="space-y-3">
                {agencyAutomations.map((auto) => (
                  <div
                    key={auto.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${auto.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <h4 className="text-xs font-bold text-slate-900">{auto.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">({auto.type})</span>
                      </div>
                      {auto.last_error_message && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium bg-rose-50 px-2 py-1 rounded border border-rose-100">
                          {auto.last_error_message}
                        </p>
                      )}
                    </div>
                    <div className="text-left font-mono text-xs">
                      <span className="text-slate-400 block text-[10px]">معدل الاستجابة</span>
                      <span className="font-bold text-slate-700">{auto.avg_duration_ms} ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: UPSELL & ACTIONS */}
          {activeTab === 'upsell' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-petrol-50 to-teal-50 border border-petrol-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-neon-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-petrol-900">فرصة مقترحة لزيادة الإيراد</h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    الوكالة تحقق استقراراً ممتازاً. يمكن تقديم عرض ترقية إلى الخطة التالية مع خصم 10% على الاشتراك السنوي لتحصيل تدفق نقدي مسبق.
                  </p>
                </div>
              </div>

              {/* Impersonate / Login as Agency */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">تسجيل الدخول كوكالة (Impersonate Agency View)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    معاينة الواجهة تماماً كما يراها مدير الوكالة لتقديم الدعم الفني
                  </p>
                </div>
                <button
                  onClick={() => {
                    setImpersonatingAgency(agency);
                    onClose();
                  }}
                  className="px-4 py-2 bg-petrol-800 hover:bg-petrol-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  تسجيل الدخول كوكالة
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Agency ID: {agency.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
