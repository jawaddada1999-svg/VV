import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Users, KanbanSquare, Building2, CalendarDays,
  UserRoundCog, MessageSquare, Bell, ChartNoAxesCombined, Settings,
  Search, Plus, Menu, X, Globe2, ChevronDown, Home, Clock3,
  TrendingUp, Eye, MapPin, BedDouble, Bath, ArrowUpRight
} from 'lucide-react';

type Lang = 'ar' | 'fr' | 'en';
type Section = 'overview' | 'leads' | 'pipeline' | 'properties' | 'appointments' | 'team' | 'communications' | 'reports' | 'settings';

const copy = {
  ar: {
    title: 'لوحة الوكالة العقارية', subtitle: 'مساحة عمل موحدة لإدارة العملاء والعقارات والمعاينات',
    nav: 'القائمة الرئيسية', overview: 'نظرة عامة', leads: 'العملاء المحتملون', pipeline: 'مسار المبيعات',
    properties: 'العقارات', appointments: 'المواعيد والمعاينات', team: 'فريق العمل',
    communications: 'التواصل', reports: 'التقارير والتحليلات', settings: 'الإعدادات',
    search: 'ابحث عن عميل أو عقار...', addLead: 'إضافة عميل', totalLeads: 'إجمالي العملاء',
    visits: 'المعاينات القادمة', listings: 'العقارات المنشورة', conversion: 'معدل التحويل',
    recentLeads: 'أحدث العملاء المحتملين', upcoming: 'المواعيد القادمة', viewAll: 'عرض الكل',
    lead: 'العميل', interest: 'الاهتمام', status: 'الحالة', date: 'التاريخ',
    property: 'العقار', client: 'العميل', time: 'الوقت', demo: 'بيانات توضيحية',
    emptyTitle: 'قسم قيد التجهيز', emptyText: 'سيتم بناء وظائف هذا القسم وربطها بقاعدة البيانات في المراحل التالية.',
    agency: 'وكالة الأمل العقارية', manager: 'مدير الوكالة', language: 'اللغة',
    available: 'متاح', qualified: 'مؤهل', new: 'جديد', confirmed: 'مؤكد',
    apartment: 'شقة سكنية', villa: 'فيلا مستقلة', office: 'مكتب تجاري',
  },
  fr: {
    title: 'Espace agence immobilière', subtitle: 'Un espace unifié pour gérer les prospects, biens et visites',
    nav: 'Navigation principale', overview: 'Vue d’ensemble', leads: 'Prospects', pipeline: 'Pipeline commercial',
    properties: 'Biens immobiliers', appointments: 'Rendez-vous et visites', team: 'Équipe',
    communications: 'Communications', reports: 'Rapports et analyses', settings: 'Paramètres',
    search: 'Rechercher un prospect ou un bien...', addLead: 'Ajouter un prospect', totalLeads: 'Total prospects',
    visits: 'Visites à venir', listings: 'Biens publiés', conversion: 'Taux de conversion',
    recentLeads: 'Prospects récents', upcoming: 'Prochains rendez-vous', viewAll: 'Voir tout',
    lead: 'Prospect', interest: 'Intérêt', status: 'Statut', date: 'Date',
    property: 'Bien', client: 'Client', time: 'Heure', demo: 'Données de démonstration',
    emptyTitle: 'Section en préparation', emptyText: 'Les fonctionnalités de cette section seront développées et connectées à la base de données dans les prochaines étapes.',
    agency: 'Agence Immobilière Al Amal', manager: 'Directeur d’agence', language: 'Langue',
    available: 'Disponible', qualified: 'Qualifié', new: 'Nouveau', confirmed: 'Confirmé',
    apartment: 'Appartement', villa: 'Villa', office: 'Bureau commercial',
  },
  en: {
    title: 'Real Estate Agency Dashboard', subtitle: 'One workspace to manage leads, properties and viewings',
    nav: 'Main navigation', overview: 'Overview', leads: 'Leads', pipeline: 'Sales pipeline',
    properties: 'Properties', appointments: 'Appointments & viewings', team: 'Team',
    communications: 'Communications', reports: 'Reports & analytics', settings: 'Settings',
    search: 'Search leads or properties...', addLead: 'Add lead', totalLeads: 'Total leads',
    visits: 'Upcoming viewings', listings: 'Published listings', conversion: 'Conversion rate',
    recentLeads: 'Recent leads', upcoming: 'Upcoming appointments', viewAll: 'View all',
    lead: 'Lead', interest: 'Interest', status: 'Status', date: 'Date',
    property: 'Property', client: 'Client', time: 'Time', demo: 'Demo data',
    emptyTitle: 'Section in progress', emptyText: 'This section’s features will be built and connected to the database in the next stages.',
    agency: 'Al Amal Real Estate', manager: 'Agency manager', language: 'Language',
    available: 'Available', qualified: 'Qualified', new: 'New', confirmed: 'Confirmed',
    apartment: 'Apartment', villa: 'Villa', office: 'Commercial office',
  },
} as const;

const navItems = [
  { id: 'overview', icon: LayoutDashboard, key: 'overview' },
  { id: 'leads', icon: Users, key: 'leads' },
  { id: 'pipeline', icon: KanbanSquare, key: 'pipeline' },
  { id: 'properties', icon: Building2, key: 'properties' },
  { id: 'appointments', icon: CalendarDays, key: 'appointments' },
  { id: 'team', icon: UserRoundCog, key: 'team' },
  { id: 'communications', icon: MessageSquare, key: 'communications' },
  { id: 'reports', icon: ChartNoAxesCombined, key: 'reports' },
  { id: 'settings', icon: Settings, key: 'settings' },
] as const;

export const AgencyDashboard: React.FC = () => {
  const [language, setLanguage] = useState<Lang>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('ibonda-agency-language') : null;
    return saved === 'fr' || saved === 'en' ? saved : 'ar';
  });
  const [section, setSection] = useState<Section>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const t = copy[language];
  const rtl = language === 'ar';
  const activeLabel = useMemo(() => t[section], [t, section]);

  const changeLanguage = (value: Lang) => {
    setLanguage(value);
    window.localStorage.setItem('ibonda-agency-language', value);
    document.documentElement.lang = value;
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
  };

  const nav = (
    <aside className="h-full w-72 bg-[#082F36] text-white flex flex-col">
      <div className="h-20 px-5 flex items-center gap-3 border-b border-white/10">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#1A7180] to-[#0B414A] border border-white/10 flex items-center justify-center font-black text-xl text-white">IB</div>
        <div><div className="font-black tracking-[0.18em]">IBONDA</div><div className="text-[10px] text-teal-200/70">AGENCY WORKSPACE</div></div>
      </div>
      <div className="px-4 py-4 border-b border-white/10">
        <div className="text-[10px] text-teal-100/60 mb-1">{t.agency}</div>
        <div className="text-sm font-bold">{t.nav}</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const selected = section === item.id;
          return <button key={item.id} onClick={() => { setSection(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${selected ? 'bg-[#14606B] text-white shadow-lg' : 'text-teal-50/75 hover:bg-white/5 hover:text-white'}`}>
            <Icon className={`w-4 h-4 ${selected ? 'text-[#F4B35E]' : 'text-teal-100/60'}`} />
            <span>{t[item.key]}</span>
          </button>;
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-teal-100/70">{t.demo}</div>
    </aside>
  );

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F4F7F8] text-slate-900 flex">
      <div className="hidden lg:block fixed inset-y-0 z-30" style={rtl ? { right: 0 } : { left: 0 }}>{nav}</div>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} /><div className="absolute inset-y-0" style={rtl ? { right: 0 } : { left: 0 }}>{nav}</div></div>}
      <main className={`min-w-0 flex-1 ${rtl ? 'lg:mr-72' : 'lg:ml-72'}`}>
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Open menu"><Menu className="w-5 h-5"/></button>
            <div className="min-w-0"><div className="text-[10px] text-slate-400">IBONDA / AGENCY</div><h1 className="font-bold text-base truncate">{activeLabel}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 w-64"><Search className="w-4 h-4 text-slate-400"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} className="bg-transparent outline-none text-xs w-full"/></div>
            <label className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold bg-white"><Globe2 className="w-4 h-4 text-slate-500"/><span className="sr-only">{t.language}</span><select aria-label={t.language} value={language} onChange={e => changeLanguage(e.target.value as Lang)} className="bg-transparent outline-none"><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option></select><ChevronDown className="w-3 h-3 text-slate-400"/></label>
            <button className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600"><Bell className="w-4 h-4"/><span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"/></button>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div><div className="text-xs font-bold text-[#16707A] mb-2">{t.agency}</div><h2 className="text-2xl font-black text-slate-900">{t.title}</h2><p className="text-sm text-slate-500 mt-1">{t.subtitle}</p></div>
            <button onClick={() => setSection('leads')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D515B] hover:bg-[#12636E] text-white px-4 py-2.5 text-sm font-bold shadow-sm"><Plus className="w-4 h-4"/>{t.addLead}</button>
          </div>
          {section === 'overview' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: t.totalLeads, value: '248', change: '+12.8%', icon: Users },
                  { label: t.visits, value: '18', change: '+4 هذا الأسبوع', icon: CalendarDays },
                  { label: t.listings, value: '64', change: '12 مميزة', icon: Building2 },
                  { label: t.conversion, value: '8.6%', change: '+1.4%', icon: TrendingUp },
                ].map((item, index) => { const Icon = item.icon; return <div key={index} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs text-slate-500 font-semibold">{item.label}</span><span className="h-9 w-9 rounded-xl bg-teal-50 text-[#16707A] flex items-center justify-center"><Icon className="w-4 h-4"/></span></div><div className="mt-4 flex items-end justify-between"><strong className="text-3xl font-black tabular-nums">{item.value}</strong><span className="text-[10px] font-bold text-emerald-600">{item.change}</span></div></div>; })}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                <section className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold">{t.recentLeads}</h3><button onClick={() => setSection('leads')} className="text-xs font-bold text-[#16707A]">{t.viewAll}</button></div>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs"><tr><th className="p-4 text-start">{t.lead}</th><th className="p-4 text-start">{t.interest}</th><th className="p-4 text-start">{t.status}</th><th className="p-4 text-start">{t.date}</th></tr></thead><tbody>
                    {[['ياسين المرابط','شقة في أكادير',t.qualified,'اليوم'],['سلمى الإدريسي','فيلا في مراكش',t.new,'أمس'],['عمر بناني','مكتب تجاري',t.confirmed,'18 نوفمبر']].map((row, i) => <tr key={i} className="border-t border-slate-100"><td className="p-4 font-semibold">{row[0]}</td><td className="p-4 text-slate-600">{row[1]}</td><td className="p-4"><span className="rounded-full bg-teal-50 text-teal-700 px-2.5 py-1 text-[11px] font-bold">{row[2]}</span></td><td className="p-4 text-slate-500 text-xs">{row[3]}</td></tr>)}
                  </tbody></table></div>
                </section>
                <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold">{t.upcoming}</h3><button onClick={() => setSection('appointments')} className="text-xs font-bold text-[#16707A]">{t.viewAll}</button></div>
                  <div className="p-5 space-y-4">{[['09:30','ياسين المرابط','شقة سكنية - أكادير'],['11:00','سلمى الإدريسي','فيلا مستقلة - مراكش'],['15:30','عمر بناني','مكتب تجاري - الدار البيضاء']].map((item,i)=><div key={i} className="flex gap-3 items-start"><div className="rounded-xl bg-teal-50 text-[#12636E] px-2.5 py-2 text-xs font-black">{item[0]}</div><div className="min-w-0"><div className="text-sm font-bold">{item[1]}</div><div className="text-xs text-slate-500 mt-1">{item[2]}</div></div></div>)}</div>
                </section>
              </div>
              <div className="bg-[#0B414A] rounded-2xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><div className="text-xs text-teal-100/70 mb-1">{t.agency}</div><h3 className="text-lg font-bold">IBONDA · Agency Workspace</h3><p className="text-xs text-teal-100/70 mt-1">{t.demo}</p></div><div className="flex items-center gap-2 text-xs text-teal-100"><Eye className="w-4 h-4"/> Preview workspace <ArrowUpRight className="w-4 h-4"/></div></div>
            </>
          ) : (
            <section className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-teal-50 text-[#16707A] flex items-center justify-center mb-4"><Settings className="w-6 h-6"/></div>
              <h3 className="text-xl font-black">{t.emptyTitle}: {activeLabel}</h3><p className="max-w-xl mx-auto text-sm text-slate-500 mt-2 leading-7">{t.emptyText}</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-800 border border-amber-100 px-3 py-1.5 text-xs font-bold"><Clock3 className="w-3.5 h-3.5"/> {t.demo}</div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
