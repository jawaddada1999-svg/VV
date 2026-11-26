import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import {
  BarChart3,
  Users,
  Megaphone,
  Calculator,
  Handshake,
  Wallet,
  Workflow,
  Globe,
} from 'lucide-react';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { FunnelDiagnostic } from './components/FunnelDiagnostic';
import { LeadCRM } from './components/LeadCRM';
import { MetaAdsTracker } from './components/MetaAdsTracker';
import { BudgetSimulator } from './components/BudgetSimulator';
import { DealsManagement } from './components/DealsManagement';
import { PaymentsManagement } from './components/PaymentsManagement';
import { LeadModal } from './components/LeadModal';
import { WebhookModal } from './components/WebhookModal';

const MyBusinessContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    currency,
    setCurrency,
    theme,
    setTheme,
    setShowLeadModal,
    setShowWebhookModal,
    leads,
  } = useApp();

  const isArabic = language === 'ar';
  const navItems = [
    { id: 'overview', label: isArabic ? 'الرئيسية' : 'Overview', icon: BarChart3 },
    { id: 'crm', label: isArabic ? 'العملاء المحتملون' : 'Leads CRM', icon: Users },
    { id: 'campaigns', label: isArabic ? 'الإعلانات' : 'Ads', icon: Megaphone },
    { id: 'funnel', label: isArabic ? 'مسار التحويل' : 'Conversion funnel', icon: Workflow },
    { id: 'deals', label: isArabic ? 'الصفقات' : 'Deals', icon: Handshake },
    { id: 'payments', label: isArabic ? 'المالية' : 'Finance', icon: Wallet },
    { id: 'simulator', label: isArabic ? 'محاكي الميزانية' : 'Budget simulator', icon: Calculator },
    { id: 'integrations', label: isArabic ? 'الربط والإعدادات' : 'Integrations', icon: Globe },
  ];

  const pageTitle = navItems.find((item) => item.id === activeTab)?.label || navItems[0].label;

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-6">
          <div className="min-w-0">
            <div className="text-lg font-black tracking-tight text-[#0B434C]">IBONDA</div>
            <div className="text-[10px] font-semibold text-slate-500">
              {isArabic ? 'لوحة إدارة نشاطك التجاري' : 'My Business dashboard'}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => setShowLeadModal(true)} className="rounded-xl bg-[#FF6600] px-3 py-2 text-xs font-bold text-white hover:bg-orange-700">
              {isArabic ? '+ إضافة عميل' : '+ New lead'}
            </button>
            <button onClick={() => setShowWebhookModal(true)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">
              {isArabic ? 'الربط' : 'Connect'}
            </button>
            <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value as 'ar' | 'fr' | 'en')} className="max-w-20 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs">
              <option value="ar">AR</option>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
            <select aria-label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value as 'MAD' | 'EUR' | 'USD')} className="max-w-20 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs">
              <option value="MAD">MAD</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="hidden rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-bold sm:block">
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-3 pb-2 sm:px-6" aria-label="My Business navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${active ? 'bg-[#0B434C] text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-5 px-3 py-5 sm:px-6 sm:py-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900 sm:text-2xl">{pageTitle}</h1>
            <p className="mt-1 text-xs text-slate-500">
              {isArabic ? `متابعة نشاط IBONDA — ${leads.length} عميل مسجل` : `IBONDA business activity — ${leads.length} leads tracked`}
            </p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-5">
            <ExecutiveSummary />
            <FunnelDiagnostic />
          </div>
        )}
        {activeTab === 'crm' && <LeadCRM />}
        {activeTab === 'campaigns' && <MetaAdsTracker />}
        {activeTab === 'funnel' && <FunnelDiagnostic />}
        {activeTab === 'deals' && <DealsManagement isEditMode={false} />}
        {activeTab === 'payments' && <PaymentsManagement />}
        {activeTab === 'simulator' && <BudgetSimulator />}
        {activeTab === 'integrations' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900">{isArabic ? 'الربط ومصادر البيانات' : 'Integrations & data sources'}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {isArabic ? 'إعداد ربط Meta وإعدادات استقبال العملاء والبيانات التجريبية. افتح إعدادات الربط لمراجعة التفاصيل.' : 'Manage Meta connection, lead intake and demo data settings.'}
            </p>
            <button onClick={() => setShowWebhookModal(true)} className="mt-4 rounded-xl bg-[#0B434C] px-4 py-2.5 text-sm font-bold text-white">
              {isArabic ? 'فتح إعدادات الربط' : 'Open integration settings'}
            </button>
          </section>
        )}
      </main>

      <LeadModal />
      <WebhookModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MyBusinessContent />
    </AppProvider>
  );
}
