import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, Users, KanbanSquare, Building2, CalendarDays,
  UserRoundCog, MessageSquare, Bell, ChartNoAxesCombined, Settings,
  Search, Plus, Menu, X, Globe2, ChevronDown, Home, Clock3,
  TrendingUp, Eye, MapPin, BedDouble, Bath, ArrowUpRight, Megaphone, CheckCheck
} from 'lucide-react';

type Lang = 'ar' | 'fr' | 'en';
type Section = 'overview' | 'leads' | 'pipeline' | 'properties' | 'appointments' | 'team' | 'communications' | 'adAnalysis' | 'reports' | 'settings';

const copy = {
  ar: {
    title: 'لوحة الوكالة العقارية', subtitle: 'مساحة عمل موحدة لإدارة العملاء والعقارات والمعاينات',
    nav: 'القائمة الرئيسية', overview: 'نظرة عامة', leads: 'العملاء المحتملون', pipeline: 'مسار المبيعات',
    properties: 'العقارات', appointments: 'المواعيد والمعاينات', team: 'فريق العمل',
    communications: 'التواصل', adAnalysis: 'تحليل الإعلانات', reports: 'التقارير والتحليلات', settings: 'الإعدادات',
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
    communications: 'Communications', adAnalysis: 'Analyse publicitaire', reports: 'Rapports et analyses', settings: 'Paramètres',
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
    communications: 'Communications', adAnalysis: 'Ad performance', reports: 'Reports & analytics', settings: 'Settings',
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
  { id: 'adAnalysis', icon: Megaphone, key: 'adAnalysis' },
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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [overviewRange, setOverviewRange] = useState<'today' | 'week' | 'month'>('week');
  const t = copy[language];
  const rtl = language === 'ar';
  const ov = language === 'ar' ? {
    period: 'الفترة', today: 'اليوم', week: 'هذا الأسبوع', month: 'هذا الشهر',
    newLeads: 'العملاء الجدد', completedDeals: 'الصفقات المكتملة', pipeline: 'مسار العملاء',
    stageNew: 'جدد', stageContacted: 'تم التواصل', stageQualified: 'مؤهلون', stageVisit: 'معاينة', stageWon: 'صفقات ناجحة',
    teamActivity: 'نشاط الفريق', handled: 'عملاء تمت متابعتهم', tasksDone: 'متابعات مكتملة',
    alerts: 'ما يحتاج إلى انتباه', noContact: 'عملاء لم يتم التواصل معهم', overdue: 'متابعات متأخرة',
    recent: 'أحدث العملاء', nextVisits: 'المعاينات القادمة', viewAll: 'عرض الكل',
    demoNote: 'بيانات تجريبية للمعاينة؛ ستظهر البيانات الفعلية بعد ربط قاعدة البيانات.',
    lead1: 'ياسين المرابط', lead2: 'سلمى الإدريسي', lead3: 'عمر بناني',
    interest1: 'شقة سكنية · أكادير', interest2: 'فيلا · مراكش', interest3: 'مكتب تجاري · الدار البيضاء',
    new: 'جديد', qualified: 'مؤهل', contacted: 'تم التواصل',
    visit1: 'ياسين المرابط', visit2: 'سلمى الإدريسي', visit3: 'عمر بناني',
    property1: 'شقة سكنية · أكادير', property2: 'فيلا · مراكش', property3: 'مكتب تجاري · الدار البيضاء',
    alert1: 'عملاء جدد ينتظرون أول تواصل', alert2: 'متابعات تجاوزت موعدها المحدد',
    team1: 'مستشار المبيعات الأول', team2: 'مستشار المبيعات الثاني', team3: 'مسؤول المتابعة',
    todayLabel: 'اليوم', yesterday: 'أمس', tomorrow: 'غداً', demo: 'تجريبي'
  } : language === 'fr' ? {
    period: 'Période', today: 'Aujourd’hui', week: 'Cette semaine', month: 'Ce mois',
    newLeads: 'Nouveaux prospects', completedDeals: 'Transactions conclues', pipeline: 'Parcours des prospects',
    stageNew: 'Nouveaux', stageContacted: 'Contactés', stageQualified: 'Qualifiés', stageVisit: 'Visite', stageWon: 'Gagnés',
    teamActivity: 'Activité de l’équipe', handled: 'Prospects suivis', tasksDone: 'Suivis terminés',
    alerts: 'Points à traiter', noContact: 'Prospects sans premier contact', overdue: 'Suivis en retard',
    recent: 'Prospects récents', nextVisits: 'Prochaines visites', viewAll: 'Tout voir',
    demoNote: 'Données de démonstration ; les données réelles apparaîtront après la connexion à la base.',
    lead1: 'Yassine El Mourabit', lead2: 'Salma Idrissi', lead3: 'Omar Bennani',
    interest1: 'Appartement · Agadir', interest2: 'Villa · Marrakech', interest3: 'Bureau · Casablanca',
    new: 'Nouveau', qualified: 'Qualifié', contacted: 'Contacté',
    visit1: 'Yassine El Mourabit', visit2: 'Salma Idrissi', visit3: 'Omar Bennani',
    property1: 'Appartement · Agadir', property2: 'Villa · Marrakech', property3: 'Bureau · Casablanca',
    alert1: 'Prospects en attente du premier contact', alert2: 'Suivis ayant dépassé leur échéance',
    team1: 'Conseiller commercial 1', team2: 'Conseiller commercial 2', team3: 'Responsable du suivi',
    todayLabel: 'Aujourd’hui', yesterday: 'Hier', tomorrow: 'Demain', demo: 'Démo'
  } : {
    period: 'Period', today: 'Today', week: 'This week', month: 'This month',
    newLeads: 'New leads', completedDeals: 'Closed deals', pipeline: 'Lead pipeline',
    stageNew: 'New', stageContacted: 'Contacted', stageQualified: 'Qualified', stageVisit: 'Viewing', stageWon: 'Won',
    teamActivity: 'Team activity', handled: 'Leads followed up', tasksDone: 'Follow-ups completed',
    alerts: 'Needs attention', noContact: 'Leads awaiting first contact', overdue: 'Overdue follow-ups',
    recent: 'Recent leads', nextVisits: 'Upcoming viewings', viewAll: 'View all',
    demoNote: 'Demo data; real figures will appear after the database is connected.',
    lead1: 'Yassine El Mourabit', lead2: 'Salma Idrissi', lead3: 'Omar Bennani',
    interest1: 'Apartment · Agadir', interest2: 'Villa · Marrakech', interest3: 'Office · Casablanca',
    new: 'New', qualified: 'Qualified', contacted: 'Contacted',
    visit1: 'Yassine El Mourabit', visit2: 'Salma Idrissi', visit3: 'Omar Bennani',
    property1: 'Apartment · Agadir', property2: 'Villa · Marrakech', property3: 'Office · Casablanca',
    alert1: 'Leads waiting for first contact', alert2: 'Follow-ups past their due date',
    team1: 'Sales advisor 1', team2: 'Sales advisor 2', team3: 'Follow-up manager',
    todayLabel: 'Today', yesterday: 'Yesterday', tomorrow: 'Tomorrow', demo: 'Demo'
  };
  const notificationItems = language === 'ar'
    ? [{ title: 'عميل محتمل جديد', detail: 'تم تسجيل عميل مهتم بشقة في أكادير', time: 'قبل 10 دقائق' }, { title: 'موعد معاينة قريب', detail: 'لديك معاينة مجدولة اليوم على الساعة 11:00', time: 'قبل 35 دقيقة' }, { title: 'تحديث حالة عميل', detail: 'تم نقل عميل إلى مرحلة مؤهل', time: 'قبل ساعة' }]
    : language === 'fr'
    ? [{ title: 'Nouveau prospect', detail: 'Un prospect intéressé par un appartement à Agadir', time: 'Il y a 10 min' }, { title: 'Visite à venir', detail: 'Une visite est prévue aujourd’hui à 11h00', time: 'Il y a 35 min' }, { title: 'Statut du prospect mis à jour', detail: 'Un prospect est passé au statut qualifié', time: 'Il y a 1 h' }]
    : [{ title: 'New lead', detail: 'A new lead is interested in an apartment in Agadir', time: '10 minutes ago' }, { title: 'Upcoming viewing', detail: 'You have a viewing scheduled today at 11:00', time: '35 minutes ago' }, { title: 'Lead status updated', detail: 'A lead moved to qualified', time: '1 hour ago' }];
  const unreadCount = notificationItems.length - readNotifications.length;
  const activeLabel = useMemo(() => t[section], [t, section]);

  const changeLanguage = (value: Lang) => {
    setLanguage(value);
    window.localStorage.setItem('ibonda-agency-language', value);
    document.documentElement.lang = value;
    document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr';
  };

  const nav = (
    <aside className="h-full w-72 bg-[#102A56] text-white flex flex-col">
      <div className="h-20 px-5 flex items-center gap-3 border-b border-white/10">
        <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center"><Building2 className="w-5 h-5 text-[#E2A64A]"/></div>
        <div className="min-w-0"><div className="font-bold truncate">{t.agency}</div><div className="text-[10px] text-blue-200/80">AGENCY WORKSPACE</div></div>
      </div>
      <div className="px-4 py-4 border-b border-white/10">
        <div className="text-[10px] text-blue-100/65 mb-1">{t.agency}</div>
        <div className="text-sm font-bold">{t.nav}</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const selected = section === item.id;
          return <button key={item.id} onClick={() => { setSection(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${selected ? 'bg-[#244A83] text-white shadow-lg' : 'text-blue-50/80 hover:bg-white/5 hover:text-white'}`}>
            <Icon className={`w-4 h-4 ${selected ? 'text-[#E2A64A]' : 'text-blue-100/60'}`} />
            <span>{t[item.key]}</span>
          </button>;
        })}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-teal-100/70">{t.demo}</div>
    </aside>
  );

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F4F6FA] text-slate-900 flex">
      <div className="hidden lg:block fixed inset-y-0 z-30" style={rtl ? { right: 0 } : { left: 0 }}>{nav}</div>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} /><div className="absolute inset-y-0" style={rtl ? { right: 0 } : { left: 0 }}>{nav}</div></div>}
      <main className={`min-w-0 flex-1 ${rtl ? 'lg:mr-72' : 'lg:ml-72'}`}>
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="Open menu"><Menu className="w-5 h-5"/></button>
            <div className="min-w-0"><div className="text-[10px] text-slate-400">{t.agency}</div><h1 className="font-bold text-base truncate">{activeLabel}</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 w-64"><Search className="w-4 h-4 text-slate-400"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} className="bg-transparent outline-none text-xs w-full"/></div>
            <label className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold bg-white"><Globe2 className="w-4 h-4 text-slate-500"/><span className="sr-only">{t.language}</span><select aria-label={t.language} value={language} onChange={e => changeLanguage(e.target.value as Lang)} className="bg-transparent outline-none"><option value="ar">العربية</option><option value="fr">Français</option><option value="en">English</option></select><ChevronDown className="w-3 h-3 text-slate-400"/></label>
            <div className="relative">
              <button onClick={() => setNotificationsOpen(v => !v)} aria-label={language === 'ar' ? 'الإشعارات' : 'Notifications'} aria-expanded={notificationsOpen} className="relative p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-[#173B73]">
                <Bell className="w-4 h-4"/>
                {unreadCount > 0 && <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-[#D99A3D] text-white text-[9px] font-bold flex items-center justify-center">{unreadCount}</span>}
              </button>
              {notificationsOpen && <div className={`absolute top-12 ${rtl ? 'left-0' : 'right-0'} z-50 w-[min(340px,calc(100vw-2rem))] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden`}>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm">{language === 'ar' ? 'الإشعارات' : language === 'fr' ? 'Notifications' : 'Notifications'}</h3>
                  <button onClick={() => setReadNotifications(notificationItems.map((_, i) => i))} className="text-[11px] font-semibold text-[#244A83] hover:underline">{language === 'ar' ? 'تحديد الكل كمقروء' : language === 'fr' ? 'Tout marquer comme lu' : 'Mark all as read'}</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notificationItems.map((item, i) => <button key={i} onClick={() => setReadNotifications(prev => prev.includes(i) ? prev : [...prev, i])} className={`w-full text-start p-4 border-b border-slate-100 last:border-0 hover:bg-blue-50/60 ${readNotifications.includes(i) ? 'opacity-60' : 'bg-blue-50/30'}`}>
                    <div className="flex items-start gap-3"><span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${readNotifications.includes(i) ? 'bg-slate-300' : 'bg-[#D99A3D]'}`}/><span className="min-w-0"><span className="block text-xs font-bold text-slate-800">{item.title}</span><span className="block text-[11px] text-slate-500 mt-1 leading-5">{item.detail}</span><span className="block text-[10px] text-slate-400 mt-2">{item.time}</span></span></div>
                  </button>)}
                </div>
                <div className="px-4 py-2 bg-slate-50 text-[10px] text-slate-400 flex items-center gap-1.5"><CheckCheck className="w-3 h-3"/>{language === 'ar' ? 'إشعارات تجريبية للمعاينة؛ الربط الفعلي قيد التطوير' : language === 'fr' ? 'Notifications de démonstration ; connexion réelle en cours de développement' : 'Preview notifications; live integration is still in development'}</div>
              </div>}
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div><div className="text-xs font-bold text-[#244A83] mb-2">{t.agency}</div><h2 className="text-2xl font-black text-slate-900">{t.title}</h2><p className="text-sm text-slate-500 mt-1">{t.subtitle}</p></div>
            <button onClick={() => setSection('leads')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173B73] hover:bg-[#244A83] text-white px-4 py-2.5 text-sm font-bold shadow-sm"><Plus className="w-4 h-4"/>{t.addLead}</button>
          </div>
          {section === 'adAnalysis' ? (
            <section className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><span className="h-11 w-11 rounded-xl bg-[#EAF2FF] text-[#244A83] flex items-center justify-center"><Megaphone className="w-5 h-5"/></span><div><h3 className="font-bold">{t.adAnalysis}</h3><p className="text-xs text-slate-500 mt-1">{t.demo} · {language === 'ar' ? 'سيتم ربط بيانات الحملات الفعلية لاحقاً' : language === 'fr' ? 'Les données réelles des campagnes seront connectées ultérieurement' : 'Live campaign data will be connected later'}</p></div></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: language === 'ar' ? 'إجمالي الإنفاق' : language === 'fr' ? 'Dépenses totales' : 'Total spend', value: '12,450 MAD' },
                  { label: language === 'ar' ? 'العملاء من الإعلانات' : language === 'fr' ? 'Prospects issus des publicités' : 'Ad-generated leads', value: '186' },
                  { label: language === 'ar' ? 'تكلفة العميل المحتمل' : language === 'fr' ? 'Coût par prospect' : 'Cost per lead', value: '66.9 MAD' },
                  { label: language === 'ar' ? 'الحملات النشطة' : language === 'fr' ? 'Campagnes actives' : 'Active campaigns', value: '4' },
                ].map((item, i) => <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"><div className="text-xs text-slate-500 font-semibold">{item.label}</div><div className="mt-4 text-2xl font-black tabular-nums">{item.value}</div></div>)}
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100"><h3 className="font-bold">{language === 'ar' ? 'أداء الحملات' : language === 'fr' ? 'Performance des campagnes' : 'Campaign performance'}</h3></div>
                <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs"><tr><th className="p-4 text-start">{language === 'ar' ? 'الحملة' : language === 'fr' ? 'Campagne' : 'Campaign'}</th><th className="p-4 text-start">{language === 'ar' ? 'المنصة' : language === 'fr' ? 'Plateforme' : 'Platform'}</th><th className="p-4 text-start">{language === 'ar' ? 'الإنفاق' : language === 'fr' ? 'Dépenses' : 'Spend'}</th><th className="p-4 text-start">{language === 'ar' ? 'العملاء' : language === 'fr' ? 'Prospects' : 'Leads'}</th></tr></thead><tbody>
                  {[
                    [language === 'ar' ? 'شقق سكنية - أكادير' : 'Residential apartments - Agadir', 'Meta Ads', '4,200 MAD', '72'],
                    [language === 'ar' ? 'فلل للبيع - مراكش' : 'Villas for sale - Marrakech', 'Meta Ads', '5,100 MAD', '64'],
                    [language === 'ar' ? 'مكاتب تجارية' : 'Commercial offices', 'Google Ads', '3,150 MAD', '50'],
                  ].map((row, i) => <tr key={i} className="border-t border-slate-100"><td className="p-4 font-semibold">{row[0]}</td><td className="p-4 text-slate-600">{row[1]}</td><td className="p-4 text-slate-600">{row[2]}</td><td className="p-4 font-bold">{row[3]}</td></tr>)}
                </tbody></table></div>
              </div>
            </section>
          ) : section === 'overview' ? (
            <section className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">{ov.demoNote}</div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>{ov.period}</span>
                  <select value={overviewRange} onChange={e => setOverviewRange(e.target.value as 'today' | 'week' | 'month')} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 outline-none">
                    <option value="today">{ov.today}</option><option value="week">{ov.week}</option><option value="month">{ov.month}</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: t.totalLeads, value: '248', note: '+12.8%', icon: Users },
                  { label: ov.newLeads, value: '32', note: '+8.2%', icon: TrendingUp },
                  { label: t.visits, value: '18', note: '+4', icon: CalendarDays },
                  { label: ov.completedDeals, value: '7', note: '+2', icon: Building2 },
                ].map((item, index) => { const Icon = item.icon; return <div key={index} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm min-w-0"><div className="flex items-center justify-between gap-2"><span className="text-xs text-slate-500 font-semibold">{item.label}</span><span className="h-9 w-9 shrink-0 rounded-xl bg-blue-50 text-[#244A83] flex items-center justify-center"><Icon className="w-4 h-4"/></span></div><div className="mt-3 flex items-end justify-between gap-2"><strong className="text-2xl sm:text-3xl font-black tabular-nums">{item.value}</strong><span className="text-[10px] font-bold text-emerald-600">{item.note}</span></div></div>; })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <section className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-5"><div><h3 className="font-bold">{ov.pipeline}</h3><p className="text-xs text-slate-400 mt-1">{ov.demo}</p></div><KanbanSquare className="w-5 h-5 text-[#244A83]"/></div>
                  <div className="space-y-4">
                    {[
                      { label: ov.stageNew, count: 32, width: '100%', color: 'bg-blue-500' },
                      { label: ov.stageContacted, count: 24, width: '75%', color: 'bg-indigo-500' },
                      { label: ov.stageQualified, count: 16, width: '50%', color: 'bg-violet-500' },
                      { label: ov.stageVisit, count: 10, width: '31%', color: 'bg-amber-500' },
                      { label: ov.stageWon, count: 7, width: '22%', color: 'bg-emerald-500' },
                    ].map((item, i) => <div key={i}><div className="flex items-center justify-between text-xs mb-1.5"><span className="font-semibold text-slate-700">{item.label}</span><span className="font-bold tabular-nums text-slate-600">{item.count}</span></div><div className="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div className={item.color + ' h-full rounded-full'} style={{width:item.width}}/></div></div>)}
                  </div>
                </section>
                <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold">{ov.alerts}</h3><Bell className="w-5 h-5 text-[#244A83]"/></div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 p-3"><span className="h-8 w-8 shrink-0 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center"><Clock3 className="w-4 h-4"/></span><div className="min-w-0"><div className="text-sm font-bold text-slate-800">5</div><p className="text-xs text-slate-600 mt-1">{ov.alert1}</p></div></div>
                    <div className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-100 p-3"><span className="h-8 w-8 shrink-0 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center"><CalendarDays className="w-4 h-4"/></span><div className="min-w-0"><div className="text-sm font-bold text-slate-800">3</div><p className="text-xs text-slate-600 mt-1">{ov.alert2}</p></div></div>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <section className="xl:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2"><h3 className="font-bold">{ov.recent}</h3><button onClick={() => setSection('leads')} className="text-xs font-bold text-[#244A83]">{ov.viewAll}</button></div>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs"><tr><th className="p-4 text-start">{t.lead}</th><th className="p-4 text-start">{t.interest}</th><th className="p-4 text-start">{t.status}</th><th className="p-4 text-start">{t.date}</th></tr></thead><tbody>
                    {[[ov.lead1,ov.interest1,ov.qualified,ov.todayLabel],[ov.lead2,ov.interest2,ov.new,ov.yesterday],[ov.lead3,ov.interest3,ov.contacted,ov.yesterday]].map((row,i)=><tr key={i} className="border-t border-slate-100"><td className="p-4 font-semibold whitespace-nowrap">{row[0]}</td><td className="p-4 text-slate-600 whitespace-nowrap">{row[1]}</td><td className="p-4"><span className="rounded-full bg-blue-50 text-blue-800 px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">{row[2]}</span></td><td className="p-4 text-slate-500 text-xs whitespace-nowrap">{row[3]}</td></tr>)}
                  </tbody></table></div>
                </section>
                <section className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-2"><h3 className="font-bold">{ov.nextVisits}</h3><button onClick={() => setSection('appointments')} className="text-xs font-bold text-[#244A83]">{ov.viewAll}</button></div>
                  <div className="p-4 space-y-4">
                    {[[ '09:30',ov.visit1,ov.property1,ov.todayLabel ],[ '11:00',ov.visit2,ov.property2,ov.todayLabel ],[ '15:30',ov.visit3,ov.property3,ov.tomorrow ]].map((item,i)=><div key={i} className="flex items-start gap-3"><div className="rounded-lg bg-blue-50 text-[#244A83] px-2.5 py-2 text-xs font-black tabular-nums">{item[0]}</div><div className="min-w-0"><div className="text-sm font-bold">{item[1]}</div><div className="text-xs text-slate-500 mt-1">{item[2]}</div><div className="text-[10px] text-slate-400 mt-1">{item[3]}</div></div></div>)}
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-bold">{ov.teamActivity}</h3><UserRoundCog className="w-5 h-5 text-[#244A83]"/></div>
                  <div className="space-y-4">
                    {[{name:ov.team1,handled:42,done:35},{name:ov.team2,handled:36,done:29},{name:ov.team3,handled:28,done:24}].map((person,i)=><div key={i}><div className="flex justify-between gap-2 text-xs mb-1.5"><span className="font-semibold text-slate-700">{person.name}</span><span className="text-slate-500">{person.handled} · {person.done}</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-[#315C9B] rounded-full" style={{width:(person.done/person.handled*100)+'%'}}/></div></div>)}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-slate-500"><span>{ov.handled}: <b className="text-slate-800">106</b></span><span>{ov.tasksDone}: <b className="text-slate-800">88</b></span></div>
                </section>
                <section className="bg-[#102A56] rounded-2xl p-5 text-white flex flex-col justify-between gap-4">
                  <div><div className="text-xs text-blue-200 mb-2">{t.agency}</div><h3 className="text-lg font-bold">{ov.pipeline}</h3><p className="text-xs text-blue-100/75 mt-2">{ov.demoNote}</p></div>
                  <div className="flex flex-wrap gap-2"><button onClick={() => setSection('leads')} className="rounded-xl bg-white text-[#102A56] px-4 py-2 text-xs font-bold">{t.addLead}</button><button onClick={() => setSection('appointments')} className="rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2 text-xs font-bold">{ov.nextVisits}</button></div>
                </section>
              </div>
            </section>
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
