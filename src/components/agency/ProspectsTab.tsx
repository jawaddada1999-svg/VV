import React, { useMemo, useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Search, Users, Phone, MapPin } from 'lucide-react';

export const ProspectsTab: React.FC = () => {
  const { clients, setSelectedClientId, language, direction } = useAgency();
  const [search, setSearch] = useState('');
  const prospects = useMemo(() => clients.filter((c) => ['ad_lead','meeting_scheduled','meeting_completed'].includes(c.stage)).filter((c) => [c.agencyName,c.contactPerson,c.phone,c.city].join(' ').toLowerCase().includes(search.toLowerCase())), [clients, search]);
  const ar = language === 'ar';
  const stages = [{id:'ad_lead',label:ar?'عميل محتمل جديد':'New lead'},{id:'meeting_scheduled',label:ar?'موعد محجوز':'Meeting booked'},{id:'meeting_completed',label:ar?'تم الاجتماع':'Meeting completed'}];
  return <div className="space-y-5" dir={direction}>
    <div><h2 className="text-xl font-extrabold text-slate-900">{ar?'العملاء المحتملون':'Prospects'}</h2><p className="text-sm text-slate-500 mt-1">{ar?'تتبع الوكالات المهتمة قبل تحويلها إلى عميلات.':'Track interested agencies before conversion.'}</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">{stages.map(s=><div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-4"><div className="text-xs text-slate-500 font-bold">{s.label}</div><div className="text-2xl font-extrabold mt-2">{clients.filter(c=>c.stage===s.id).length}</div></div>)}</div>
    <div className="bg-white rounded-2xl border border-slate-200 p-4"><div className="relative"><Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={ar?'بحث عن وكالة أو مسؤول أو هاتف...':'Search agency, contact or phone...'} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-orange-500"/></div>
    <div className="overflow-x-auto mt-4"><table className="w-full min-w-[850px] text-xs text-left"><thead className="bg-slate-100 text-slate-600"><tr>{[ar?'الوكالة':'Agency',ar?'المسؤول':'Contact',ar?'الهاتف':'Phone',ar?'المدينة':'City',ar?'حجم الفريق':'Team size',ar?'الطلبات اليومية':'Daily inquiries',ar?'المرحلة':'Stage'].map(x=><th key={x} className="p-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{prospects.map(c=><tr key={c.id} onClick={()=>setSelectedClientId(c.id)} className="hover:bg-orange-50/50 cursor-pointer"><td className="p-3 font-bold">{c.agencyName}</td><td className="p-3">{c.contactPerson}</td><td className="p-3" dir="ltr">{c.phone}</td><td className="p-3">{c.city}</td><td className="p-3">{c.teamSize ?? '—'}</td><td className="p-3">{c.dailyInquiries ?? '—'}</td><td className="p-3">{stages.find(s=>s.id===c.stage)?.label || c.stage}</td></tr>)}</tbody></table>{prospects.length===0&&<div className="p-8 text-center text-slate-400">{ar?'لا توجد نتائج':'No prospects found'}</div>}</div></div>
  </div>;
};
