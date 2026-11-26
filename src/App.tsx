import React, { useEffect, useState } from 'react';
import { AgencyProvider, useAgency } from './context/AgencyContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/agency/OverviewTab';
import { FinanceTab } from './components/agency/FinanceTab';
import { PipelineTab } from './components/agency/PipelineTab';
import { MeetingsTab } from './components/agency/MeetingsTab';
import { DeliveryTab } from './components/agency/DeliveryTab';
import { RetainersTab } from './components/agency/RetainersTab';
import { AdsTab } from './components/agency/AdsTab';
import { AgencyBudgetSimulator } from './components/agency/AgencyBudgetSimulator';
import { ClientsDirectoryTab } from './components/agency/ClientsDirectoryTab';
import { PackagesSettingsTab } from './components/agency/PackagesSettingsTab';
import { EmployeesTab } from './components/agency/EmployeesTab';
import { SettingsTab } from './components/agency/SettingsTab';
import { ConversationsTab } from './components/agency/ConversationsTab';
import { ReportsTab } from './components/agency/ReportsTab';
import { BookingSettingsTab } from './components/agency/BookingSettingsTab';
import { ClientModal } from './components/agency/ClientModal';
import { ClientDetailDrawer } from './components/agency/ClientDetailDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Clock } from 'lucide-react';
import { translations } from './translations';

const DashboardContent: React.FC = () => {
  const { activeTab, clients, setActiveTab, setSelectedClientId, language, direction } = useAgency();
  const t = translations[language];

  useEffect(() => {
    const openEmployees = () => setActiveTab('employees');
    window.addEventListener('ibonda-open-employees', openEmployees);
    return () => window.removeEventListener('ibonda-open-employees', openEmployees);
  }, [setActiveTab]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check if any client has trial ending soon
  const activeTrials = clients.filter((c) => c.stage === 'trial_7_days');
  const urgentTrial = activeTrials.find((c) => {
    if (!c.trialEndDate) return false;
    const diffHours = (new Date(c.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60);
    return diffHours <= 36;
  });

  return (
    <div
      className="vv-app-shell min-h-screen bg-[#F1F6F7] text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden antialiased selection:bg-orange-500 selection:text-white"
      dir={direction}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      <div className={`vv-workspace-column flex-1 min-w-0 min-h-screen flex flex-col ${direction === 'rtl' ? (sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64') : (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')}`}>
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        <div className="vv-workspace-surface flex-1 flex flex-col min-w-0 overflow-x-clip">
          <main className="vv-main-frame flex-1 w-full max-w-full min-w-0 pt-3.5 pb-24 sm:py-6 lg:pb-8 px-3 sm:px-6 lg:px-8">
            <div className={`max-w-[1600px] mx-auto space-y-4 sm:space-y-5 w-full min-w-0 ${activeTab === 'booking_settings' ? 'vv-booking-preserve' : 'vv-modern-content'}`}>
            {/* Top Alert for Trial Expiring Soon */}
            {urgentTrial && (
              <div
                onClick={() => {
                  setSelectedClientId(urgentTrial.id);
                  setActiveTab('pipeline');
                }}
                className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-3.5 py-2.5 rounded-2xl shadow-sm flex items-center justify-between gap-2.5 text-xs font-semibold cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="w-4 h-4 animate-pulse shrink-0" />
                  <span className="truncate sm:whitespace-normal">
                    <strong>{t.urgentTrialsAlert}:</strong>{' '}
                    {urgentTrial.agencyName} ({urgentTrial.contactPerson}) -{' '}
                    {urgentTrial.setupFee.toLocaleString()} {t.mad}
                  </span>
                </div>
                <span className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl text-[11px] font-bold shrink-0 transition-colors">
                  {t.viewDeal}
                </span>
              </div>
            )}

            {/* TAB CONTENT */}
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'clients' && <ClientsDirectoryTab />}
            {activeTab === 'reports' && <ReportsTab />}
            {activeTab === 'conversations' && <ConversationsTab />}
            {activeTab === 'employees' && <EmployeesTab />}
            {activeTab === 'settings' && <SettingsTab />}
            {activeTab === 'pipeline' && <PipelineTab />}
            {activeTab === 'meetings' && <MeetingsTab />}
            {activeTab === 'ads' && <AdsTab />}
            {activeTab === 'budget_simulator' && <AgencyBudgetSimulator />}
            {activeTab === 'delivery' && <DeliveryTab />}
            {activeTab === 'finance' && <FinanceTab />}
            {activeTab === 'retainers' && <RetainersTab />}
            {activeTab === 'booking_settings' && <BookingSettingsTab />}
            {activeTab === 'packages' && <PackagesSettingsTab />}
            </div>
          </main>
        </div>
      </div>

      {/* Fixed Native-Style Bottom Navigation on Mobile */}
      <MobileBottomNav onOpenMenu={() => setMobileSidebarOpen(true)} />

      {/* Global Modals & Drawers */}
      <ClientModal />
      <ClientDetailDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AgencyProvider>
      <DashboardContent />
    </AgencyProvider>
  );
}
