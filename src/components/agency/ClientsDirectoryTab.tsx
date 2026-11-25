import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Building2,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Download,
  Share2,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { ClientStage, PackageTier } from '../../types/agency';
import { translations } from '../../translations';

export const ClientsDirectoryTab: React.FC = () => {
  const {
    clients,
    setSelectedClientId,
    setShowAddClientModal,
    moveClientStage,
    updateClient,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  const [search, setSearch] = useState('');
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<any>({});
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Extract unique base cities list for filter in active language
  const uniqueCities = useMemo(() => {
    const citiesSet = new Set(
      clients
        .map((c) => c.city.split('(')[0].trim())
        .filter(Boolean)
    );
    return Array.from(citiesSet);
  }, [clients]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.agencyName.toLowerCase().includes(search.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search);
      const matchCity = cityFilter === 'all' || c.city.toLowerCase().includes(cityFilter.toLowerCase());
      const matchStage = stageFilter === 'all' || (stageFilter === 'rejected' && c.stage === 'lost') || (stageFilter === 'free_trial' && c.stage === 'trial_7_days') || (stageFilter === 'rejected_after_trial' && c.stage === 'lost' && (!!c.trialStartDate || c.trialAccepted === false)) || (stageFilter === 'subscribed' && c.stage === 'active_retainer') || c.stage === stageFilter;
      const matchTier = tierFilter === 'all' || c.packageTier === tierFilter;
      return matchSearch && matchCity && matchStage && matchTier;
    });
  }, [clients, search, cityFilter, stageFilter, tierFilter]);

  const getStageBadge = (stage: ClientStage) => {
    switch (stage) {
      case 'ad_lead':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">{t.colAdLeadsTitle}</span>;
      case 'meeting_scheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">{t.colMeetingsTitle}</span>;
      case 'trial_7_days':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">{t.colTrialTitle}</span>;
      case 'delivery_in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">{t.colDeliveryTitle}</span>;
      case 'active_retainer':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">{t.colRetainerTitle}</span>;
      case 'lost':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">{t.colLostTitle}</span>;
      default:
        return null;
    }
  };

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Agency Name',
      'City',
      'Contact Person',
      'Phone',
      'Package',
      'Setup Fee (MAD)',
      'Monthly Retainer (MAD)',
      'Stage',
      'Rejection Reason'
    ];
    const rows = filtered.map((c) => [
      `"${c.id}"`,
      `"${c.agencyName}"`,
      `"${c.city}"`,
      `"${c.contactPerson}"`,
      `"${c.phone}"`,
      `"${c.packageTier}"`,
      c.setupFee,
      c.monthlyRetainer,
      `"${c.stage}"`,
      `"${c.rejectionReason || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ibonda_agencies_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-slate-100 text-slate-900 border border-slate-300">
              {t.clientsHeaderTag}
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {clients.length} {t.clientsUnit}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.clientsHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t.clientsHeaderDesc}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-colors cursor-pointer border border-slate-300 shadow-2xs"
            title="CSV Export"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{t.btnExportCsv}</span>
          </button>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF5500] hover:from-orange-600 hover:to-[#D93800] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.addClientBtn}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          {label:language==='ar'?'جميع الوكالات':'All clients',value:clients.length},
          {label:language==='ar'?'مرفوضة':'Rejected',value:clients.filter(c=>c.stage==='lost').length},
          {label:language==='ar'?'تجربة مجانية':'Free trial',value:clients.filter(c=>c.stage==='trial_7_days').length},
          {label:language==='ar'?'مرفوضة بعد التجربة':'Rejected after trial',value:clients.filter(c=>c.stage==='lost' && (!!c.trialStartDate || c.trialAccepted===false)).length},
          {label:language==='ar'?'عملاء مشتركين':'Subscribed clients',value:clients.filter(c=>c.stage==='active_retainer').length}
        ].map((x,index)=>{const tone=[{"card":"from-sky-50 to-white border-sky-200","label":"text-sky-700","bar":"bg-sky-400"},{"card":"from-emerald-50 to-white border-emerald-200","label":"text-emerald-700","bar":"bg-emerald-400"},{"card":"from-violet-50 to-white border-violet-200","label":"text-violet-700","bar":"bg-violet-400"},{"card":"from-amber-50 to-white border-amber-200","label":"text-amber-700","bar":"bg-amber-400"},{"card":"from-rose-50 to-white border-rose-200","label":"text-rose-700","bar":"bg-rose-400"},{"card":"from-cyan-50 to-white border-cyan-200","label":"text-cyan-700","bar":"bg-cyan-400"}][index % 6];return <div key={x.label} className={`relative overflow-hidden bg-gradient-to-br ${tone.card} rounded-2xl border p-4 shadow-sm hover:shadow-md transition-shadow`}><span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} /><div className={`text-[11px] font-extrabold ${tone.label}`}>{x.label}</div><div className="text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">{x.value}</div></div>})}
      </div>

      {/* 2. Advanced Multi-Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className={`w-4 h-4 absolute ${direction === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full ${direction === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-orange-500`}
          />
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-center flex-wrap">
          {/* City Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 min-h-[40px]">
            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">{t.filterByCity} {t.all}</option>
              {uniqueCities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 min-h-[40px] font-bold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">{t.filterByStatus} {t.all}</option>
            <option value="rejected">{language==='ar'?'مرفوض':'Rejected'}</option>
            <option value="free_trial">{language==='ar'?'تجربة مجانية':'Free trial'}</option>
            <option value="rejected_after_trial">{language==='ar'?'مرفوض بعد التجربة':'Rejected after trial'}</option>
            <option value="subscribed">{language==='ar'?'عملاء مشتركين':'Subscribed clients'}</option>
            <option value="trial_7_days">7 {t.days}</option>
            <option value="delivery_in_progress">{t.cardInBuildTitle}</option>
            <option value="active_retainer">{t.active}</option>
            <option value="meeting_scheduled">{t.statusScheduled}</option>
            <option value="ad_lead">{t.leads}</option>
            <option value="lost">{t.overdue}</option>
          </select>

          {/* Package Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 min-h-[40px] font-bold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">{t.allTiers}</option>
            <option value="starter">{t.starterPackage}</option>
            <option value="growth">{t.growthPackage}</option>
            <option value="enterprise">{t.enterprisePackage}</option>
          </select>

        </div>
      </div>

      {/* 3. Clients Master Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">{t.colClientAgency}</th>
                <th className="p-3.5">{t.colCity}</th>
                <th className="p-3.5">{t.colContact}</th>
                <th className="p-3.5">{t.colTier}</th>
                <th className="p-3.5">{t.colSetupFeeCollected}</th>
                <th className="p-3.5">{t.colMonthlyRetainer}</th>
                <th className="p-3.5">{t.colStage}</th>
                <th className="p-3.5">{language==='ar'?'حجم الفريق':'Team size'}</th>
                <th className="p-3.5">{language==='ar'?'الطلبات اليومية':'Daily inquiries'}</th>
                <th className="p-3.5">{language==='ar'?'الدور':'Role'}</th>
                <th className="p-3.5 text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400 font-medium">
                    {t.notificationsEmpty}
                  </td>
                </tr>
              ) : (
                filtered.map((client) => {
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block text-xs">{client.agencyName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {client.adSource || (language === 'ar' ? 'إعلانات ميتا' : language === 'fr' ? 'Publicités Meta' : 'Meta Ads')}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          <span>{client.city}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{client.contactPerson}</span>
                        <span className="text-[11px] text-slate-500 font-mono block" dir="ltr">{client.phone}</span><span className="text-[10px] text-slate-400 block">{client.email}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-100 text-slate-900 border border-slate-200">
                          {client.packageTier === 'starter'
                            ? t.starterPackage
                            : client.packageTier === 'growth'
                            ? t.growthPackage
                            : t.enterprisePackage}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {client.setupFee.toLocaleString()} {t.mad}
                      </td>

                      <td className="p-3.5 font-mono font-extrabold text-emerald-700">
                        {client.monthlyRetainer.toLocaleString()} {t.perMonth}
                      </td>

                      <td className="p-3.5">
                        {getStageBadge(client.stage)}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <button onClick={() => { setEditingClientId(client.id); setEditDraft({agencyName:client.agencyName,contactPerson:client.contactPerson,phone:client.phone,email:client.email,agencyManager:client.agencyManager||'',teamSize:client.teamSize??'',dailyInquiries:client.dailyInquiries??'',contactRole:client.contactRole||''}); }} className="px-3 py-1.5 text-xs font-bold bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl">{language==='ar'?'تعديل':'Edit'}</button>
                          <button onClick={() => setSelectedClientId(client.id)} className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-800 rounded-xl">{t.viewDeal}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editingClientId && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 flex items-center justify-center p-4" onClick={()=>setEditingClientId(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-5 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <h3 className="font-extrabold text-lg mb-4">{language==='ar'?'تعديل بيانات الوكالة':'Edit agency details'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ['agencyName',language==='ar'?'اسم الوكالة':'Agency name'],
                ['contactPerson',language==='ar'?'اسم جهة الاتصال':'Contact person'],
                ['phone',language==='ar'?'الهاتف':'Phone'],
                ['email',language==='ar'?'البريد الإلكتروني':'Email'],
                ['agencyManager',language==='ar'?'مسؤول عن الوكالة':'Agency manager'],
                ['contactRole',language==='ar'?'الدور (مدير/تجاري)':'Role (manager/commercial)'],
                ['teamSize',language==='ar'?'عدد الموظفين':'Team size'],
                ['dailyInquiries',language==='ar'?'الطلبات اليومية':'Daily inquiries']
              ].map(([key,label])=><label key={key} className="text-xs font-bold text-slate-600">{label}<input value={editDraft[key] ?? ''} onChange={e=>setEditDraft((old:any)=>({...old,[key]:e.target.value}))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500"/></label>)}
            </div>
            <div className="flex justify-end gap-2 mt-5"><button onClick={()=>setEditingClientId(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold">{language==='ar'?'إلغاء':'Cancel'}</button><button onClick={()=>{if(editingClientId){updateClient(editingClientId,{...editDraft,teamSize:editDraft.teamSize===''?undefined:Number(editDraft.teamSize),dailyInquiries:editDraft.dailyInquiries===''?undefined:Number(editDraft.dailyInquiries)});setEditingClientId(null)}}} className="px-4 py-2 rounded-xl bg-orange-600 text-white text-sm font-bold">{language==='ar'?'حفظ التغييرات':'Save changes'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
};
