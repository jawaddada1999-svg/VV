import React, { useState, useMemo } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Search,
  RefreshCw,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { InvoiceStatus } from '../../types/database';

export const FinanceTab: React.FC = () => {
  const {
    platformKPIs,
    invoices,
    agencies,
    retryInvoicePayment,
    markInvoicePaid,
    setSelectedAgencyId,
  } = useInternal();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchInvoice, setSearchInvoice] = useState<string>('');

  const arr = platformKPIs.currentMRR * 12;

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoice_number.toLowerCase().includes(searchInvoice.toLowerCase()) ||
        inv.agency_name.toLowerCase().includes(searchInvoice.toLowerCase());
      const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, searchInvoice, statusFilter]);

  const failedInvoices = useMemo(() => {
    return invoices.filter((i) => i.status === 'failed');
  }, [invoices]);

  const failedAmount = useMemo(() => {
    return failedInvoices.reduce((sum, i) => sum + i.amount, 0);
  }, [failedInvoices]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] الإدارة المالية
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              IBONDA Financial Hub
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            المالية والاشتراكات الشهرية المتكررة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تحصيل الاشتراكات، مؤشرات الـ SaaS، إدارة الفواتير، ومتابعة مدفوعات الوكالات المتعثرة
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right font-mono">
            <span className="text-[10px] text-slate-400 block">الإيراد السنوي التقديري (ARR)</span>
            <span className="text-sm font-bold text-petrol-900">{arr.toLocaleString()} د.م.</span>
          </div>
        </div>
      </div>

      {/* 2. SaaS Financial KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] MRR
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ▲ +14.2%
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">الإيرادات الشهرية المتكررة (MRR)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {platformKPIs.currentMRR.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">د.م.</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">من {platformKPIs.activeAgenciesCount} وكالة نشطة</span>
        </div>

        {/* ARPU */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-800 border border-teal-200/80">
              [Platform] ARPU
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ▲ +5.1%
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">متوسط الإيراد لكل وكالة (ARPU)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {platformKPIs.arpu.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">د.م./وكالة</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">مدفوع بزيادة باقات Enterprise</span>
        </div>

        {/* Churn Rate */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200/80">
              [Platform] Churn
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ▼ 2.1% (ممتاز)
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">معدل الانسحاب الشهري (Churn)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {platformKPIs.churnRate}%
            </span>
            <span className="text-xs font-bold text-slate-500">شهرياً</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">المعيار الذهبي لأقل من 3%</span>
        </div>

        {/* NRR */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              [Platform] NRR
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ▲ 112.5%
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500 block">صافي الاحتفاظ بالإيراد (NRR)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {platformKPIs.nrr}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">ترقيات الوكالات تفوق خسائر المغادرين</span>
        </div>
      </div>

      {/* 3. Failed Payments Recovery Alert */}
      {failedInvoices.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                تنبيه: {failedInvoices.length} فواتير متعثرة السداد بقيمة {failedAmount.toLocaleString()} د.م.
              </h4>
              <p className="text-xs text-rose-700 mt-0.5">
                فشلت بطاقات الدفع البنكية للوكالات أثناء محاولة التجديد التلقائي. يتطلب الأمر إعادة المحاولة أو التواصل الهاتفي.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              failedInvoices.forEach((f) => retryInvoicePayment(f.id));
            }}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
          >
            إعادة محاولة خصم كل المتعثرات الآن
          </button>
        </div>
      )}

      {/* 4. Invoices Management Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Table Top Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="بحث برقم الفاتورة أو الوكالة..."
              className="w-full pr-9 pl-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-petrol-800"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
            {[
              { id: 'all', label: 'كافة الفواتير' },
              { id: 'paid', label: 'مدفوعة' },
              { id: 'failed', label: 'فشلت' },
              { id: 'pending', label: 'معلقة' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">رقم الفاتورة</th>
                <th className="p-3.5">الوكالة العقارية</th>
                <th className="p-3.5">تاريخ الإصدار</th>
                <th className="p-3.5">المبلغ</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">سبب الفشل / التاريخ</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-800">{inv.invoice_number}</td>
                  <td className="p-3.5 font-bold text-slate-900">
                    <button
                      onClick={() => setSelectedAgencyId(inv.agency_id)}
                      className="hover:text-petrol-800 hover:underline cursor-pointer"
                    >
                      {inv.agency_name}
                    </button>
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono">
                    {new Date(inv.issued_at).toLocaleDateString('ar-MA')}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {inv.amount.toLocaleString()} د.م.
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inv.status === 'failed'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                      {inv.status === 'failed' && <AlertTriangle className="w-3 h-3" />}
                      {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'failed' ? 'فشلت الدفعة' : 'معلقة'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {inv.status === 'failed' ? (
                      <span className="text-rose-600 font-medium">{inv.failure_reason}</span>
                    ) : inv.paid_at ? (
                      <span className="font-mono text-slate-400">
                        سُدِدت في: {new Date(inv.paid_at).toLocaleDateString('ar-MA')}
                      </span>
                    ) : (
                      'بانتظار دورة التحصيل'
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {inv.status === 'failed' && (
                        <button
                          onClick={() => retryInvoicePayment(inv.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-petrol-800 hover:bg-petrol-700 text-white rounded cursor-pointer"
                        >
                          إعادة الخصم
                        </button>
                      )}
                      {inv.status === 'pending' && (
                        <button
                          onClick={() => markInvoicePaid(inv.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                        >
                          تأكيد الدفع
                        </button>
                      )}
                      <button
                        onClick={() => {
                          alert(`تم تنزيل الفاتورة رقم ${inv.invoice_number} بنجاح بصيغة PDF.`);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                        title="تحميل الفاتورة PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
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
