import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Wallet, TrendingUp, Receipt, CreditCard } from 'lucide-react';

export const FinanceTab: React.FC = () => {
  const { clients, invoices, metrics, language, direction } = useAgency();
  const ar = language === 'ar';
  const paid = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
  const activeExpenses = clients.flatMap((c) => c.expenses || []).filter((e) => e.isActive);
  const expenseTotal = activeExpenses.reduce((s, e) => s + (Number(e.monthlyCost) || 0), 0);
  const cards = [
    { label: ar ? 'مداخيل الصيانة الشهرية' : 'Monthly maintenance revenue', value: metrics.currentMRR, icon: Wallet, color: 'orange' },
    { label: ar ? 'صافي الربح الشهري' : 'Net monthly profit', value: metrics.netRetainerProfit, icon: TrendingUp, color: 'emerald' },
    { label: ar ? 'الفواتير المؤداة' : 'Paid invoices', value: paid, icon: Receipt, color: 'blue' },
    { label: ar ? 'الفواتير المتبقية' : 'Outstanding invoices', value: pending, icon: CreditCard, color: 'rose' },
  ];
  return <div className="space-y-5" dir={direction}>
    <div><h2 className="text-xl font-extrabold text-slate-900">{ar ? 'الأداء المالي' : 'Financial Performance'}</h2><p className="text-sm text-slate-500 mt-1">{ar ? 'تتبع المداخيل والمصاريف والفواتير وصافي الربح.' : 'Track revenue, expenses, invoices and net profit.'}</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map((c,index) => { const tone=["from-orange-50 to-white border-orange-200 text-orange-700 bg-orange-400","from-emerald-50 to-white border-emerald-200 text-emerald-700 bg-emerald-400","from-sky-50 to-white border-sky-200 text-sky-700 bg-sky-400","from-rose-50 to-white border-rose-200 text-rose-700 bg-rose-400"][index]; const [gradient,border,label,bar]=tone.split(' '); return <div key={c.label} className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl border ${border} p-5 shadow-sm hover:shadow-md transition-shadow`}><span className={`absolute inset-x-0 top-0 h-1 ${bar}`} /><div className="flex items-center justify-between"><span className={`text-xs font-extrabold ${label}`}>{c.label}</span><c.icon className={`w-5 h-5 ${label}`} /></div><div className="mt-3 text-2xl font-extrabold font-mono text-slate-900">{c.value.toLocaleString()} <span className="text-xs font-bold text-slate-400">MAD</span></div></div> })}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="font-bold text-slate-900 mb-3">{ar ? 'ملخص المصاريف' : 'Expense summary'}</h3><div className="flex justify-between py-3 border-b border-slate-100 text-sm"><span>{ar ? 'مصاريف الأدوات والاشتراكات' : 'Tools and subscriptions'}</span><b>{Math.round(expenseTotal).toLocaleString()} MAD</b></div><div className="flex justify-between py-3 text-sm"><span>{ar ? 'عدد الاشتراكات النشطة' : 'Active subscriptions'}</span><b>{activeExpenses.length}</b></div></section>
      <section className="bg-white rounded-2xl border border-slate-200 p-5"><h3 className="font-bold text-slate-900 mb-3">{ar ? 'آخر الفواتير' : 'Recent invoices'}</h3>{invoices.slice(0,6).map((i)=><div key={i.id} className="flex justify-between gap-3 py-2.5 border-b last:border-0 border-slate-100 text-sm"><div><b>{i.agencyName}</b><div className="text-xs text-slate-500">{i.invoiceNumber} · {i.issuedDate}</div></div><div className="text-right"><b>{i.amount.toLocaleString()} MAD</b><div className="text-xs text-slate-500">{i.status}</div></div></div>)}</section>
    </div>
  </div>;
};
