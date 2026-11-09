import React, { useState, useMemo } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  Building2,
  Search,
  Filter,
  Plus,
  Download,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  X,
} from 'lucide-react';
import { PlanTier, AgencyStatus, Agency } from '../../types/database';
import { AgencyDetailModal } from './AgencyDetailModal';

export const ClientsTab: React.FC = () => {
  const {
    agencies,
    modules,
    addAgency,
    selectedAgencyId,
    setSelectedAgencyId,
    setImpersonatingAgency,
  } = useInternal();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Agency Form state
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyCity, setNewAgencyCity] = useState('Casablanca');
  const [newAgencyOwner, setNewAgencyOwner] = useState('');
  const [newAgencyEmail, setNewAgencyEmail] = useState('');
  const [newAgencyPhone, setNewAgencyPhone] = useState('+212 6');
  const [newAgencyPlan, setNewAgencyPlan] = useState<PlanTier>('growth');
  const [newAgencyStatus, setNewAgencyStatus] = useState<AgencyStatus>('active');
  const [newAgencyNotes, setNewAgencyNotes] = useState('');

  // Filtered agencies
  const filteredAgencies = useMemo(() => {
    return agencies.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.owner_phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesPlan = planFilter === 'all' || a.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [agencies, searchTerm, statusFilter, planFilter]);

  const handleCreateAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName || !newAgencyOwner) return;

    const mrrByPlan: Record<PlanTier, number> = {
      starter: 2500,
      growth: 5500,
      enterprise: 12000,
    };

    addAgency({
      name: newAgencyName,
      city: newAgencyCity,
      owner_name: newAgencyOwner,
      owner_email: newAgencyEmail || `${newAgencyOwner.toLowerCase().replace(/\s+/g, '')}@agency.ma`,
      owner_phone: newAgencyPhone,
      plan: newAgencyPlan,
      status: newAgencyStatus,
      mrr: newAgencyStatus === 'trial' ? 0 : mrrByPlan[newAgencyPlan],
      notes: newAgencyNotes || 'تمت الإضافة يدويًا من قبل مدير منصة IBONDA',
    });

    setShowAddModal(false);
    // Reset form
    setNewAgencyName('');
    setNewAgencyOwner('');
    setNewAgencyEmail('');
    setNewAgencyPhone('+212 6');
    setNewAgencyNotes('');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Agency Name', 'City', 'Owner', 'Phone', 'Email', 'Plan', 'Status', 'MRR (MAD)', 'Created At'];
    const rows = agencies.map((a) => [
      `"${a.id}"`,
      `"${a.name}"`,
      `"${a.city}"`,
      `"${a.owner_name}"`,
      `"${a.owner_phone}"`,
      `"${a.owner_email}"`,
      `"${a.plan}"`,
      `"${a.status}"`,
      a.mrr,
      `"${a.created_at}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ibonda_agencies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Actions Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] دليل الوكالات
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              ({agencies.length} وكالة مسجلة)
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            إدارة الوكالات العقارية المشتركة
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            تحكم كامل في الاشتراكات، الصلاحيات، تفعيل الموديولات، وتسجيل الدخول كوكالة
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer border border-slate-200/80"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neon-500 hover:bg-neon-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ إضافة وكالة جديدة</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم، المدينة، اسم المالك، الهاتف..."
            className="w-full pr-9 pl-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-petrol-800 focus:bg-white transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'active', label: 'نشطة' },
              { id: 'at_risk', label: 'في خطر' },
              { id: 'trial', label: 'تجريبية' },
              { id: 'paused', label: 'متوقفة' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {[
              { id: 'all', label: 'كل الخطط' },
              { id: 'enterprise', label: 'Enterprise' },
              { id: 'growth', label: 'Growth' },
              { id: 'starter', label: 'Starter' },
            ].map((pl) => (
              <button
                key={pl.id}
                onClick={() => setPlanFilter(pl.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  planFilter === pl.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {pl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Agencies Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
              <tr>
                <th className="p-3.5">الوكالة والمقر</th>
                <th className="p-3.5">المالك والاتصال</th>
                <th className="p-3.5">الخطة والـ MRR</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">الموديولات المفعلة</th>
                <th className="p-3.5">آخر نشاط</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAgencies.map((agency) => {
                const agencyMods = modules.filter((m) => m.agency_id === agency.id && m.enabled);
                const isAtRisk = agency.status === 'at_risk';

                return (
                  <tr
                    key={agency.id}
                    className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                      isAtRisk ? 'bg-amber-50/30' : ''
                    }`}
                    onClick={() => setSelectedAgencyId(agency.id)}
                  >
                    {/* Agency & City */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-petrol-800/10 text-petrol-900 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                          {agency.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-petrol-800 transition-colors block">
                            {agency.name}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {agency.city}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner & Phone */}
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{agency.owner_name}</span>
                      <span className="text-[11px] text-slate-500 font-mono block mt-0.5" dir="ltr">
                        {agency.owner_phone}
                      </span>
                    </td>

                    {/* Plan & MRR */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          agency.plan === 'enterprise'
                            ? 'bg-petrol-100 text-petrol-900'
                            : agency.plan === 'growth'
                            ? 'bg-teal-100 text-teal-900'
                            : 'bg-orange-100 text-orange-900'
                        }`}>
                          {agency.plan}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {agency.mrr.toLocaleString()} د.م.
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        agency.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : agency.status === 'at_risk'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : agency.status === 'trial'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {agency.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                        {agency.status === 'at_risk' && <AlertTriangle className="w-3 h-3" />}
                        {agency.status === 'active' ? 'نشطة' : agency.status === 'at_risk' ? 'في خطر' : agency.status === 'trial' ? 'تجريبية' : 'متوقفة'}
                      </span>
                    </td>

                    {/* Enabled Modules */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap max-w-xs">
                        {agencyMods.map((m) => (
                          <span
                            key={m.id}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-mono"
                          >
                            {m.module_key}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Last Activity */}
                    <td className="p-3.5">
                      <span className="text-[11px] text-slate-500 font-mono block">
                        {new Date(agency.last_activity_at).toLocaleDateString('ar-MA')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(agency.last_activity_at).toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAgencyId(agency.id)}
                          className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-petrol-800 hover:text-white text-slate-700 rounded transition-colors cursor-pointer"
                        >
                          تفاصيل
                        </button>
                        <button
                          onClick={() => setImpersonatingAgency(agency)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                          title="تسجيل الدخول كوكالة"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add Agency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden text-right">
            <div className="p-4 bg-petrol-900 text-white flex items-center justify-between border-b border-petrol-800">
              <div>
                <h3 className="text-base font-bold text-white">+ تسجيل وكالة عقارية جديدة</h3>
                <p className="text-xs text-slate-300 mt-0.5">إعداد الحساب وتعيين باقة الاشتراك</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgency} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم الوكالة العقارية *</label>
                <input
                  type="text"
                  required
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  placeholder="مثال: المنارة العقارية بريستيج"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المدينة والمقر *</label>
                  <input
                    type="text"
                    required
                    value={newAgencyCity}
                    onChange={(e) => setNewAgencyCity(e.target.value)}
                    placeholder="الدار البيضاء، مراكش، الرباط..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">اسم المالك / المدير *</label>
                  <input
                    type="text"
                    required
                    value={newAgencyOwner}
                    onChange={(e) => setNewAgencyOwner(e.target.value)}
                    placeholder="ياسين، عثمان..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">رقم الهاتف (واتساب) *</label>
                  <input
                    type="text"
                    required
                    value={newAgencyPhone}
                    onChange={(e) => setNewAgencyPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800 font-mono"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newAgencyEmail}
                    onChange={(e) => setNewAgencyEmail(e.target.value)}
                    placeholder="contact@agency.ma"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">خطة الاشتراك</label>
                  <select
                    value={newAgencyPlan}
                    onChange={(e) => setNewAgencyPlan(e.target.value as PlanTier)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800 font-bold"
                  >
                    <option value="growth">Growth (5,500 د.م/شهر)</option>
                    <option value="enterprise">Enterprise (12,000 د.م/شهر)</option>
                    <option value="starter">Starter (2,500 د.م/شهر)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الحالة الأولية</label>
                  <select
                    value={newAgencyStatus}
                    onChange={(e) => setNewAgencyStatus(e.target.value as AgencyStatus)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800 font-bold"
                  >
                    <option value="active">نشطة ومفعلة</option>
                    <option value="trial">فترة تجريبية (Trial)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ملاحظات داخلية</label>
                <textarea
                  rows={2}
                  value={newAgencyNotes}
                  onChange={(e) => setNewAgencyNotes(e.target.value)}
                  placeholder="ملاحظات حول مصدر العميل أو شروط العقد..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-petrol-800"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-petrol-800 hover:bg-petrol-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  حفظ وتسجيل الوكالة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Deep-Dive Modal for Selected Agency */}
      {selectedAgencyId && (
        <AgencyDetailModal
          agencyId={selectedAgencyId}
          onClose={() => setSelectedAgencyId(null)}
        />
      )}
    </div>
  );
};
