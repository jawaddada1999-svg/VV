import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  UserCheck,
  Download,
} from 'lucide-react';

export const PaymentsManagement: React.FC = () => {
  const { leads, formatMoney, language } = useApp();

  const closedLeads = leads.filter((l) => l.status === 'won');
  const proposalLeads = leads.filter((l) => l.status === 'proposal_sent');

  // Simulated commissions: 15% agency retainer commission
  const totalCommission = closedLeads.reduce(
    (acc, l) => acc + (l.dealValue || 15000) * 0.15,
    0
  );
  const totalContractValue = closedLeads.reduce(
    (acc, l) => acc + (l.dealValue || 15000),
    0
  );
  const pendingCollection = proposalLeads.reduce(
    (acc, l) => acc + (l.dealValue || 15000) * 0.15,
    0
  );

  const transactions = [
    {
      id: 'TX-2026-081',
      agency: 'أطلس العقارية بريميوم',
      city: 'الدار البيضاء (أنفا)',
      amount: 15000,
      commission: 2250,
      status: 'paid',
      date: '2026-11-04',
      method: 'تحويل بنكي مباشر (CIH / Attijari)',
    },
    {
      id: 'TX-2026-079',
      agency: 'مجموعة النخيل للوساطة',
      city: 'مراكش (جيليز)',
      amount: 20000,
      commission: 3000,
      status: 'paid',
      date: '2026-11-01',
      method: 'شيك مصدق',
    },
    {
      id: 'TX-2026-074',
      agency: 'المنارة العقارية بريستيج',
      city: 'الرباط (أكدال)',
      amount: 12000,
      commission: 1800,
      status: 'pending',
      date: '2026-10-28',
      method: 'فاتورة قيد المعالجة',
    },
    {
      id: 'TX-2026-068',
      agency: 'دار الاستثمار والوساطة',
      city: 'طنجة (مالاباطا)',
      amount: 18000,
      commission: 2700,
      status: 'paid',
      date: '2026-10-25',
      method: 'تحويل بنكي بنك إفريقيا',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Title & Subtitle */}
      <div>
        <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
          {language === 'ar' ? 'إدارة الدفعات والعمولات' : 'Gestion des Paiements & Commissions'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-normal">
          {language === 'ar'
            ? 'تتبع مستحقات العقود، عمولات التسويق المكتسبة، والتحويلات المالية من الوكالات العقارية'
            : 'Suivi des encaissements, commissions d\'acquisition B2B et facturation agences.'}
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {language === 'ar' ? 'إجمالي العمولات المكتسبة' : 'Commissions Encaissées'}
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <DollarSign className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">
            {formatMoney(totalCommission > 0 ? totalCommission : 9750)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {language === 'ar' ? 'نسبة العمولة: 15% من قيمة كل عقد مغلق' : 'Commission 15% sur mandats'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {language === 'ar' ? 'إجمالي قيمة العقود الجارية' : 'Volume de Contrats Signés'}
            </span>
            <div className="p-1.5 rounded-lg bg-petrol-50 text-petrol-800 shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
            {formatMoney(totalContractValue > 0 ? totalContractValue : 65000)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {language === 'ar' ? `${closedLeads.length || 4} وكالات عقارية نشطة` : 'Agences actives'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {language === 'ar' ? 'عمولات قيد التحصيل' : 'Commissions en Attente'}
            </span>
            <div className="p-1.5 rounded-lg bg-orange-50 text-neon-600 shrink-0">
              <Clock className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neon-500">
            {formatMoney(pendingCollection > 0 ? pendingCollection : 4500)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {language === 'ar' ? 'مستحقات قيد التأكيد والدفع' : 'En attente de closing'}
          </span>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="bg-white dark:bg-petrol-900 rounded-2xl border border-slate-200/90 dark:border-petrol-800 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-petrol-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neon-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {language === 'ar' ? 'سجل المعاملات والتحويلات المالية المباشرة' : 'Historique des Virements'}
            </h3>
          </div>
          <button
            onClick={() => alert('تم تصدير سجل العمولات والدفعات')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-700 dark:text-petrol-200 bg-slate-100 dark:bg-petrol-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neon-500" />
            <span>{language === 'ar' ? 'تصدير كشف الحساب' : 'Exporter'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right text-xs">
            <thead className="bg-petrol-50/70 dark:bg-petrol-950/80 text-petrol-900 dark:text-petrol-200 uppercase tracking-wider font-black border-b border-petrol-100 dark:border-petrol-800 text-[11px]">
              <tr>
                <th className="px-5 py-3.5">{language === 'ar' ? 'رقم المعاملة' : 'Réf'}</th>
                <th className="px-5 py-3.5">{language === 'ar' ? 'الوكالة العقارية' : 'Agence'}</th>
                <th className="px-5 py-3.5">{language === 'ar' ? 'المدينة' : 'Ville'}</th>
                <th className="px-5 py-3.5 text-left rtl:text-right">{language === 'ar' ? 'قيمة العقد' : 'Montant'}</th>
                <th className="px-5 py-3.5 text-left rtl:text-right">{language === 'ar' ? 'العمولة المكتسبة (15%)' : 'Commission'}</th>
                <th className="px-5 py-3.5">{language === 'ar' ? 'طريقة الدفع' : 'Mode'}</th>
                <th className="px-5 py-3.5">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                <th className="px-5 py-3.5">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-petrol-800/80">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-petrol-800/40 transition-colors"
                >
                  <td className="px-5 py-4 font-mono font-bold text-slate-400 dark:text-petrol-400">
                    {tx.id}
                  </td>
                  <td className="px-5 py-4 font-black text-slate-900 dark:text-white text-sm">
                    {tx.agency}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-600 dark:text-petrol-300">
                    {tx.city}
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-slate-900 dark:text-white">
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                    +{formatMoney(tx.commission)}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-600 dark:text-petrol-300">
                    {tx.method}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                        tx.status === 'paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{tx.status === 'paid' ? (language === 'ar' ? 'تم الدفع بنجاح' : 'Payé') : (language === 'ar' ? 'قيد التحصيل' : 'En attente')}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-petrol-300 font-bold">
                    {tx.date}
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
