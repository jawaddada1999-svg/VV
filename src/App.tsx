import React, { useState } from 'react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/agency/OverviewTab';
import { PipelineTab } from './components/agency/PipelineTab';
import { MeetingsTab } from './components/agency/MeetingsTab';
import { DeliveryTab } from './components/agency/DeliveryTab';
import { RetainersTab } from './components/agency/RetainersTab';
import { AdsTab } from './components/agency/AdsTab';
import { ClientsDirectoryTab } from './components/agency/ClientsDirectoryTab';
import { PackagesSettingsTab } from './components/agency/PackagesSettingsTab';
import { BookingSettingsTab } from './components/agency/BookingSettingsTab';
import { ClientModal } from './components/agency/ClientModal';
import { ClientDetailDrawer } from './components/agency/ClientDetailDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Clock } from 'lucide-react';
import { translations } from './translations';
import { PlatformAdminApp } from './components/internal/PlatformAdminApp';

const DashboardContent: React.FC = () => {
  const { activeTab, clients, setActiveTab, setSelectedClientId, language, direction } = useAgency();
  const t = translations[language];
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activeTrials = clients.filter((c) => c.stage === 'trial_7_days');
  const urgentTrial = activeTrials.find((c) => {
    if (!c.trialEndDate) return false;
    const diffHours = (new Date(c.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours <= 36;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col w-full max-w-full overflow-x-hidden antialiased selection:bg-orange-500 selection:text-white" dir={direction}>
      <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <div className="flex-1 flex w-full max-w-full overflow-x-hidden relative">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />
        <main className={`flex-1 w-full max-w-full min-w-0 transition-all duration-300 pt-3.5 pb-24 sm:py-6 lg:pb-8 px-3 sm:px-6 lg:px-8 ${direction === 'rtl' ? (sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64') : (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')}`}>
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5 w-full min-w-0">
            {urgentTrial && <div onClick={() => { setSelectedClientId(urgentTrial.id); setActiveTab('pipeline'); }} className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-3.5 py-2.5 rounded-2xl shadow-sm flex items-center justify-between gap-2.5 text-xs font-semibold cursor-pointer transition-all hover:shadow-md">
              <div className="flex items-center gap-2 min-w-0"><Clock className="w-4 h-4 animate-pulse shrink-0" /><span className="truncate sm:whitespace-normal"><strong>{t.urgentTrialsAlert}:</strong> {urgentTrial.agencyName} ({urgentTrial.contactPerson}) - {urgentTrial.setupFee.toLocaleString()} {t.mad}</span></div>
              <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors">{t.viewDeal}</span>
            </div>}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'pipeline' && <PipelineTab />}
            {activeTab === 'meetings' && <MeetingsTab />}
            {activeTab === 'delivery' && <DeliveryTab />}
            {activeTab === 'retainers' && <RetainersTab />}
            {activeTab === 'ads' && <AdsTab />}
            {activeTab === 'clients' && <ClientsDirectoryTab />}
            {activeTab === 'booking_settings' && <BookingSettingsTab />}
            {activeTab === 'packages' && <PackagesSettingsTab />}
          </div>
        </main>
      </div>
      <MobileBottomNav onOpenMenu={() => setMobileSidebarOpen(true)} />
      <ClientModal />
      <ClientDetailDrawer />
    </div>
  );
};

export default function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <PlatformAdminApp />;
  }
  return <AgencyProvider><DashboardContent /></AgencyProvider>;
}
