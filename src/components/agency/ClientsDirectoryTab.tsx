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
import { AgencyClient, ClientStage, PackageTier } from '../../types/agency';
import { translations } from '../../translations';

export const ClientsDirectoryTab: React.FC = () => {
  const {
    clients,
    updateClient,
    setSelectedClientId,
    setShowAddClientModal,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  const getRoleLabel = (role?: string) => {
    if (!role) return '—';
    const roles: Record<string, { ar: string; fr: string; en: string }> = {
      owner: { ar: 'مالك الوكالة', fr: 'Propriétaire de l’agence', en: 'Agency owner' },
      agency_manager: { ar: 'مدير الوكالة', fr: 'Directeur d’agence', en: 'Agency manager' },
      branch_manager: { ar: 'مدير الفرع', fr: 'Responsable d’agence', en: 'Branch manager' },
      commercial_director: { ar: 'المدير التجاري', fr: 'Directeur commercial', en: 'Commercial director' },
      sales_manager: { ar: 'مسؤول المبيعات', fr: 'Responsable des ventes', en: 'Sales manager' },
      sales_agent: { ar: 'مستشار / تجاري', fr: 'Conseiller commercial', en: 'Sales agent' },
      negotiator: { ar: 'مفاوض عقاري', fr: 'Négociateur immobilier', en: 'Property negotiator' },
      marketing_manager: { ar: 'مسؤول التسويق', fr: 'Responsable marketing', en: 'Marketing manager' },
      operations_manager: { ar: 'مسؤول العمليات', fr: 'Responsable des opérations', en: 'Operations manager' },
      administrator: { ar: 'مسؤول إداري', fr: 'Responsable administratif', en: 'Administrator' },
      assistant: { ar: 'مساعد إداري', fr: 'Assistant administratif', en: 'Administrative assistant' },
      other: { ar: 'دور آخر', fr: 'Autre fonction', en: 'Other role' },
    };
    return roles[role]?.[language] || role;
  };

  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [editingClient, setEditingClient] = useState<AgencyClient | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<AgencyClient>>({});

  const cityOptions = [
    'الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'فاس', 'أكادير', 'مكناس', 'وجدة',
    'تطوان', 'القنيطرة', 'سلا', 'المحمدية', 'الجديدة', 'آسفي', 'بني ملال', 'الناظور',
    'العيون', 'الداخلة', 'خريبكة', 'الرشيدية', 'ورزازات', 'الحسيمة', 'الصويرة', 'تمارة',
    'سطات', 'العرائش', 'شفشاون', 'تارودانت', 'كلميم', 'بركان', 'تازة', 'الخميسات',
    'القصر الكبير', 'الفقيه بن صالح', 'سيدي قاسم', 'سيدي سليمان', 'تاوريرت', 'جرسيف',
    'ميدلت', 'زاكورة', 'طانطان', 'بوجدور', 'السمارة', 'أزيلال', 'بنسليمان'
  ];
  const roleOptions = [
    { value: 'owner', ar: 'مالك الوكالة', fr: 'Propriétaire de l’agence', en: 'Agency owner' },
    { value: 'agency_manager', ar: 'مدير الوكالة', fr: 'Directeur d’agence', en: 'Agency manager' },
    { value: 'branch_manager', ar: 'مدير الفرع', fr: 'Responsable d’agence', en: 'Branch manager' },
    { value: 'general_manager', ar: 'المدير العام', fr: 'Directeur général', en: 'General manager' },
    { value: 'commercial_director', ar: 'المدير التجاري', fr: 'Directeur commercial', en: 'Commercial director' },
    { value: 'sales_manager', ar: 'مسؤول المبيعات', fr: 'Responsable des ventes', en: 'Sales manager' },
    { value: 'sales_agent', ar: 'مستشار / تجاري', fr: 'Conseiller commercial', en: 'Sales agent' },
    { value: 'negotiator', ar: 'مفاوض عقاري', fr: 'Négociateur immobilier', en: 'Property negotiator' },
    { value: 'marketing_manager', ar: 'مسؤول التسويق', fr: 'Responsable marketing', en: 'Marketing manager' },
    { value: 'operations_manager', ar: 'مسؤول العمليات', fr: 'Responsable des opérations', en: 'Operations manager' },
    { value: 'administrator', ar: 'مسؤول إداري', fr: 'Responsable administratif', en: 'Administrator' },
    { value: 'assistant', ar: 'مساعد إداري', fr: 'Assistant administratif', en: 'Administrative assistant' },
    { value: 'accountant', ar: 'محاسب', fr: 'Comptable', en: 'Accountant' },
    { value: 'other', ar: 'دور آخر', fr: 'Autre fonction', en: 'Other role' },
  ];
  const openEdit = (client: AgencyClient) => {
    setEditingClient(client);
    setEditDraft({ ...client });
  };
  const saveEdit = () => {
    if (!editingClient) return;
    updateClient(editingClient.id, editDraft);
    setEditingClient(null);
  };

  // Keep the main Moroccan cities first, followed by the other major regional cities.
  const uniqueCities = cityOptions;

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
      case 'meeting_completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">{t.colAttendedTitle}</span>;
      case 'meeting_no_show':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-200">{t.colNoShowTitle}</span>;
      case 'negotiation_follow_up':
      case 'paused':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-200">{t.colFollowUpTitle}</span>;
      case 'deal_won':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-200">{t.colRetainerTitle}</span>;
      case 'trial_7_days':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">{t.colTrialTitle}</span>;
      case 'delivery_in_progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">{t.colDeliveryTitle}</span>;
      case 'active_retainer':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300">{t.colRetainerTitle}</span>;
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
          {label:language==='ar'?'جميع الوكالات':language==='fr'?'Toutes les agences':'All agencies',value:clients.length},
          {label:language==='ar'?'مرفوضة':language==='fr'?'Non converties':'Not converted',value:clients.filter(c=>c.stage==='lost').length},
          {label:language==='ar'?'تجربة مجانية':language==='fr'?'Essai gratuit':'Free trial',value:clients.filter(c=>c.stage==='trial_7_days').length},
          {label:language==='ar'?'مرفوضة بعد التجربة':language==='fr'?'Non converties après l’essai':'Not converted after trial',value:clients.filter(c=>c.stage==='lost' && (!!c.trialStartDate || c.trialAccepted===false)).length},
          {label:language==='ar'?'عملاء مشتركين':language==='fr'?'Agences sous contrat':'Subscribed agencies',value:clients.filter(c=>c.stage==='active_retainer').length}
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
            <option value="rejected">{language==='ar'?'مرفوض':language==='fr'?'Non converti':'Not converted'}</option>
            <option value="free_trial">{language==='ar'?'تجربة مجانية':language==='fr'?'Essai gratuit':'Free trial'}</option>
            <option value="rejected_after_trial">{language==='ar'?'مرفوض بعد التجربة':language==='fr'?'Non converti après l’essai':'Not converted after trial'}</option>
            <option value="subscribed">{language==='ar'?'عملاء مشتركين':language==='fr'?'Agences sous contrat':'Subscribed agencies'}</option>
            <option value="delivery_in_progress">{t.cardInBuildTitle}</option>
            <option value="active_retainer">{t.active}</option>
            <option value="meeting_scheduled">{t.colMeetingsTitle}</option>
            <option value="meeting_completed">{t.colAttendedTitle}</option>
            <option value="meeting_no_show">{t.colNoShowTitle}</option>
            <option value="trial_7_days">{t.colTrialTitle}</option>
            <option value="delivery_in_progress">{t.colDeliveryTitle}</option>
            <option value="negotiation_follow_up">{t.colFollowUpTitle}</option>
            <option value="deal_won">{t.colRetainerTitle}</option>
            <option value="ad_lead">{t.colAdLeadsTitle}</option>
            <option value="lost">{t.colLostTitle}</option>
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
                <th className="p-3.5">{t.colRole}</th>
                <th className="p-3.5">{t.colTeamSize}</th>
                <th className="p-3.5">{t.colDailyInquiries}</th>
                <th className="p-3.5">{t.colTier}</th>
                <th className="p-3.5">{t.colSetupFeeCollected}</th>
                <th className="p-3.5">{t.colMonthlyRetainer}</th>
                <th className="p-3.5">{t.colStage}</th>
                <th className="p-3.5">{language === 'ar' ? 'آخر تحديث' : language === 'fr' ? 'Dernière mise à jour' : 'Last updated'}</th>
                <th className="p-3.5 text-center">{language === 'ar' ? 'تعديل' : language === 'fr' ? 'Modifier' : 'Edit'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400 font-medium">
                    {t.notificationsEmpty}
                  </td>
                </tr>
              ) : (
                filtered.map((client) => {
                  return (
                    <tr key={client.id} onClick={() => setSelectedClientId(client.id)} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
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
                        <span className="text-[11px] text-slate-500 font-mono block" dir="ltr">{client.phone}</span>
                        <span className="text-[10px] text-slate-400 block">{client.email}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-50 text-violet-900 border border-violet-200">
                          {getRoleLabel(client.contactRole)}
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="font-mono font-extrabold text-slate-900">{client.teamSize ?? '—'}</span>
                        <span className="block text-[10px] text-slate-500">{language === 'ar' ? 'فرد' : language === 'fr' ? 'personnes' : 'people'}</span>
                      </td>

                      <td className="p-3.5 text-center font-mono font-bold text-slate-800">
                        {client.dailyInquiries ?? '—'}
                        <span className="block text-[10px] text-slate-500">{language === 'ar' ? 'استفسار / يوم' : language === 'fr' ? 'demandes / jour' : 'inquiries / day'}</span>
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

                      <td className="p-3.5 text-[10px] text-slate-600 font-mono">
                        {client.lastUpdatedAt ? new Date(client.lastUpdatedAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US') : '—'}
                      </td>
                      <td className="p-3.5 text-center">
                        <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(client); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 font-bold">
                          <span>{language === 'ar' ? 'تعديل الملف' : language === 'fr' ? 'Modifier' : 'Edit'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingClient && (
        <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4" onClick={() => setEditingClient(null)}>
          <div className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200" dir={direction} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 bg-slate-900 text-white">
              <div>
                <h3 className="font-extrabold text-sm">{language === 'ar' ? 'تعديل بيانات الوكالة والعميل' : language === 'fr' ? 'Modifier la fiche agence' : 'Edit agency record'}</h3>
                <p className="text-[11px] text-slate-300 mt-1">{editingClient.agencyName}</p>
              </div>
              <button type="button" onClick={() => setEditingClient(null)} className="text-white/80 hover:text-white px-2 py-1 rounded-lg">✕</button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'agencyName', label: language === 'ar' ? 'اسم الوكالة' : language === 'fr' ? 'Nom de l’agence' : 'Agency name', type: 'text' },
                  { key: 'contactPerson', label: language === 'ar' ? 'اسم المسؤول' : language === 'fr' ? 'Nom du contact' : 'Contact person', type: 'text' },
                  { key: 'phone', label: language === 'ar' ? 'الهاتف / واتساب' : language === 'fr' ? 'Téléphone / WhatsApp' : 'Phone / WhatsApp', type: 'tel' },
                  { key: 'email', label: 'Email', type: 'email' },
                ].map((field) => (
                  <label key={field.key} className="block space-y-1.5">
                    <span className="font-bold text-slate-700">{field.label}</span>
                    <input type={field.type} value={String(editDraft[field.key as keyof AgencyClient] ?? '')} onChange={(e) => setEditDraft((prev) => ({ ...prev, [field.key]: e.target.value }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-orange-500" />
                  </label>
                ))}
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{language === 'ar' ? 'المدينة' : language === 'fr' ? 'Ville' : 'City'}</span>
                  <select value={String(editDraft.city ?? '')} onChange={(e) => setEditDraft((prev) => ({ ...prev, city: e.target.value }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                    <option value="">{language === 'ar' ? 'اختر المدينة' : language === 'fr' ? 'Choisir une ville' : 'Select city'}</option>
                    {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
                    {editDraft.city && !cityOptions.includes(String(editDraft.city)) && <option value={String(editDraft.city)}>{String(editDraft.city)}</option>}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colRole}</span>
                  <select value={String(editDraft.contactRole ?? '')} onChange={(e) => setEditDraft((prev) => ({ ...prev, contactRole: e.target.value }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                    <option value="">{language === 'ar' ? 'اختر الدور داخل الوكالة' : language === 'fr' ? 'Choisir le rôle' : 'Select agency role'}</option>
                    {roleOptions.map((role) => <option key={role.value} value={role.value}>{role[language]}</option>)}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colTeamSize}</span>
                  <input type="number" min="1" value={Number(editDraft.teamSize ?? 1)} onChange={(e) => setEditDraft((prev) => ({ ...prev, teamSize: Number(e.target.value) }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colDailyInquiries}</span>
                  <input type="number" min="0" value={Number(editDraft.dailyInquiries ?? 0)} onChange={(e) => setEditDraft((prev) => ({ ...prev, dailyInquiries: Number(e.target.value) }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colTier}</span>
                  <select value={String(editDraft.packageTier ?? 'growth')} onChange={(e) => setEditDraft((prev) => ({ ...prev, packageTier: e.target.value as PackageTier }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                    <option value="starter">{t.starterPackage}</option><option value="growth">{t.growthPackage}</option><option value="enterprise">{t.enterprisePackage}</option>
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colStage}</span>
                  <select value={String(editDraft.stage ?? 'ad_lead')} onChange={(e) => setEditDraft((prev) => ({ ...prev, stage: e.target.value as ClientStage }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900">
                    <option value="ad_lead">{t.colAdLeadsTitle}</option><option value="meeting_scheduled">{t.colMeetingsTitle}</option><option value="meeting_completed">{t.colAttendedTitle}</option><option value="meeting_no_show">{t.colNoShowTitle}</option><option value="trial_7_days">{t.colTrialTitle}</option><option value="delivery_in_progress">{t.colDeliveryTitle}</option><option value="negotiation_follow_up">{t.colFollowUpTitle}</option><option value="deal_won">{t.colRetainerTitle}</option><option value="active_retainer">{t.active}</option><option value="paused">{language === 'ar' ? 'متوقف مؤقتاً' : 'Paused'}</option><option value="lost">{t.colLostTitle}</option>
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colSetupFeeCollected} ({t.mad})</span>
                  <input type="number" min="0" value={Number(editDraft.setupFee ?? 0)} onChange={(e) => setEditDraft((prev) => ({ ...prev, setupFee: Number(e.target.value) }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                </label>
                <label className="block space-y-1.5">
                  <span className="font-bold text-slate-700">{t.colMonthlyRetainer} ({t.mad})</span>
                  <input type="number" min="0" value={Number(editDraft.monthlyRetainer ?? 0)} onChange={(e) => setEditDraft((prev) => ({ ...prev, monthlyRetainer: Number(e.target.value) }))} className="w-full min-h-[42px] px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900" />
                </label>
              </div>
              <label className="block space-y-1.5">
                <span className="font-bold text-slate-700">{language === 'ar' ? 'ملاحظات المتابعة الداخلية' : language === 'fr' ? 'Notes internes de suivi' : 'Internal follow-up notes'}</span>
                <textarea rows={4} value={String(editDraft.notes ?? '')} onChange={(e) => setEditDraft((prev) => ({ ...prev, notes: e.target.value }))} placeholder={language === 'ar' ? 'سجل آخر تواصل، ما الذي ينتظره العميل، والخطوة القادمة...' : language === 'fr' ? 'Dernier contact, attentes et prochaine étape...' : 'Last contact, client expectations, and next step...'} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 resize-y" />
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-500">{language === 'ar' ? 'آخر تحديث' : language === 'fr' ? 'Dernière mise à jour' : 'Last updated'}: {editingClient.lastUpdatedAt ? new Date(editingClient.lastUpdatedAt).toLocaleString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US') : '—'}</span>
                <div className="flex items-center gap-2 justify-end">
                  <button type="button" onClick={() => setEditingClient(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">{language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}</button>
                  <button type="button" onClick={saveEdit} className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold">{language === 'ar' ? 'حفظ التعديلات' : language === 'fr' ? 'Enregistrer' : 'Save changes'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
