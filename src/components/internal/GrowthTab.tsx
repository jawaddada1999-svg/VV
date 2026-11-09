import React, { useState, useMemo } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Plus,
  ChevronLeft,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  Building2,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { IbondaLead, IbondaLeadStatus, CampaignPlatform } from '../../types/database';

export const GrowthTab: React.FC = () => {
  const {
    ibondaLeads,
    marketingSpends,
    addIbondaLead,
    updateIbondaLeadStatus,
  } = useInternal();

  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newCity, setNewCity] = useState('Casablanca');
  const [newPhone, setNewPhone] = useState('+212 6');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('Meta Ads B2B');
  const [newPlatform, setNewPlatform] = useState<CampaignPlatform>('meta');
  const [newPotentialMrr, setNewPotentialMrr] = useState(5500);

  // Growth Funnel Metrics
  const funnelSteps = [
    { id: 'visitors', name: 'زوار الموقع والمحتوى', count: '14,200', pct: '100%', unit: 'زائر' },
    { id: 'leads', name: 'وكالات سجلت اهتمامها', count: '124', pct: '0.87%', unit: 'ليد' },
    { id: 'demos', name: 'عروض ديمو مجدولة', count: '48', pct: '38.7%', unit: 'ديمو' },
    { id: 'trials', name: 'وكالات في تجربة 14 يوم', count: '16', pct: '33.3%', unit: 'تجربة' },
    { id: 'paid', name: 'وكالات أغلقت اشتراكاً مدفوعاً', count: '9', pct: '56.2%', unit: 'اشتراك' },
  ];

  // Total Marketing Spend & Blended CAC
  const totalSpend = useMemo(() => {
    return marketingSpends.reduce((sum, s) => sum + s.amount, 0);
  }, [marketingSpends]);

  const totalAcquired = useMemo(() => {
    return marketingSpends.reduce((sum, s) => sum + s.agencies_converted, 0);
  }, [marketingSpends]);

  const blendedCac = totalAcquired > 0 ? Math.round(totalSpend / totalAcquired) : 0;

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName || !newContactName) return;

    addIbondaLead({
      contact_name: newContactName,
      agency_name: newAgencyName,
      city: newCity,
      phone: newPhone,
      email: newEmail || `${newContactName.toLowerCase().replace(/\s+/g, '')}@agency.ma`,
      source_campaign: newSource,
      platform: newPlatform,
      status: 'new_lead',
      deal_potential_mrr: Number(newPotentialMrr),
    });

    setShowAddLeadModal(false);
    setNewAgencyName('');
    setNewContactName('');
    setNewEmail('');
    setNewPhone('+212 6');
  };

  const getStatusBadge = (status: IbondaLeadStatus) => {
    switch (status) {
      case 'new_lead':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">ليد جديد</span>;
      case 'demo_scheduled':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">ديمو مجدول</span>;
      case 'trial_active':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">فترة تجريبية</span>;
      case 'converted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">تم التحويل (Paid)</span>;
      case 'lost':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">غير مناسب</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] نمو IBONDA
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              B2B Acquisition Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            مسار اكتساب الوكالات العقارية وتسويق المنصة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تتبع مسار تحويل الوكالات، كفاءة قنوات الاستحواذ (CAC)، وأنابيب المبيعات الخاصة بـ IBONDA
          </p>
        </div>

        <button
          onClick={() => setShowAddLeadModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-neon-500 hover:bg-neon-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ إضافة فرصة وكالة لـ IBONDA</span>
        </button>
      </div>

      {/* 2. Customer Acquisition Funnel (Horizontal Stage Progression) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="pb-3 border-b border-slate-100 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              مسار تحويل الزوار إلى اشتراكات مدفوعة (IBONDA B2B Funnel)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              متابعة كل مرحلة من الزيارة الأولى حتى إغلاق العقد
            </p>
          </div>
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block">تكلفة اكتساب الوكالة (Blended CAC)</span>
            <span className="text-sm font-bold text-petrol-900">{blendedCac.toLocaleString()} د.م.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {funnelSteps.map((step, idx) => (
            <div
              key={step.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 relative flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 block font-mono">
                  المرحلة {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-slate-800 mt-0.5">{step.name}</h4>
              </div>

              <div className="my-3">
                <span className="text-xl font-bold font-mono text-slate-900 block">{step.count}</span>
                <span className="text-[10px] text-slate-500">{step.unit}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">التحويل:</span>
                <span className="font-bold text-emerald-600">{step.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Campaign Spend & Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              قنوات التسويق الإعلاني ونفقات استقطاب الوكالات
            </h3>
            <p className="text-[11px] text-slate-500">
              مقارنة العائد على الإنفاق (ROI) وتكلفة الوكالة المشتركة عبر القنوات
            </p>
          </div>
          <span className="font-mono font-bold text-xs text-slate-700">
            مجموع الإنفاق: {totalSpend.toLocaleString()} د.م.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">الحملة والقناة</th>
                <th className="p-3.5">المنصة</th>
                <th className="p-3.5">الميزانية المصروفة</th>
                <th className="p-3.5">الليدات المكتسبة</th>
                <th className="p-3.5">تكلفة الليد (CPL)</th>
                <th className="p-3.5">وكالات أغلقت</th>
                <th className="p-3.5 font-mono">CAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marketingSpends.map((sp) => {
                const cpl = sp.leads_generated > 0 ? Math.round(sp.amount / sp.leads_generated) : 0;
                const cac = sp.agencies_converted > 0 ? Math.round(sp.amount / sp.agencies_converted) : 0;

                return (
                  <tr key={sp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{sp.campaign_name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-100 text-slate-700">
                        {sp.platform}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {sp.amount.toLocaleString()} د.م.
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      {sp.leads_generated} ليد
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {cpl} د.م.
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-700">
                      {sp.agencies_converted} وكالات
                    </td>
                    <td className="p-3.5 font-mono font-bold text-petrol-900">
                      {cac.toLocaleString()} د.م.
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. IBONDA Prospective Agencies Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              أنبوب المبيعات الخاص بـ IBONDA (Prospective Agencies CRM)
            </h3>
            <p className="text-[11px] text-slate-500">
              الوكالات العقارية في مراحل التفاوض والتقديم للحصول على منصة IBONDA
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {ibondaLeads.length} فرص مسجلة
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">الوكالة المرشحة</th>
                <th className="p-3.5">المسؤول والاتصال</th>
                <th className="p-3.5">المدينة</th>
                <th className="p-3.5">المصدر</th>
                <th className="p-3.5">القيمة المتوقعة (MRR)</th>
                <th className="p-3.5">المرحلة الحالية</th>
                <th className="p-3.5 text-center">تحديث المرحلة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ibondaLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{lead.agency_name}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 block">{lead.contact_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5" dir="ltr">
                      {lead.phone}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{lead.city}</td>
                  <td className="p-3.5 text-slate-500 truncate max-w-xs">{lead.source_campaign}</td>
                  <td className="p-3.5 font-mono font-bold text-petrol-900">
                    {lead.deal_potential_mrr.toLocaleString()} د.م./شهر
                  </td>
                  <td className="p-3.5">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="p-3.5 text-center">
                    <select
                      value={lead.status}
                      onChange={(e) => updateIbondaLeadStatus(lead.id, e.target.value as IbondaLeadStatus)}
                      className="text-[11px] font-bold bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-petrol-800"
                    >
                      <option value="new_lead">ليد جديد</option>
                      <option value="demo_scheduled">ديمو مجدول</option>
                      <option value="trial_active">فترة تجريبية</option>
                      <option value="converted">تم التحويل (Paid)</option>
                      <option value="lost">غير مهتم</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-right">
            <div className="p-4 bg-petrol-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">+ إضافة فرصة وكالة لـ IBONDA</h3>
              <button onClick={() => setShowAddLeadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateLead} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم الوكالة المرشحة *</label>
                <input
                  type="text"
                  required
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  placeholder="وكالة عقارية في كازا أو مراكش..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم المسؤول *</label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المدينة *</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القيمة المتوقعة (MRR)</label>
                  <input
                    type="number"
                    value={newPotentialMrr}
                    onChange={(e) => setNewPotentialMrr(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">قناة المصدر</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as CampaignPlatform)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="meta">Meta Ads (Facebook / Instagram)</option>
                  <option value="google">Google Search Intent</option>
                  <option value="linkedin">LinkedIn Direct</option>
                  <option value="referral">Referral / توصية وكيل آخر</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-petrol-800 text-white rounded-lg font-bold"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
