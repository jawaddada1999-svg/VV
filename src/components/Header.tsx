import React, { useState } from 'react';
import { useAgency } from '../context/AgencyContext';
import {
  Plus,
  Menu,
  Search,
  Bell,
  X,
  Clock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Globe,
  ChevronDown,
  Building2,
  Activity,
  FileCheck2,
} from 'lucide-react';
import { translations, Language } from '../translations';
import { IbondaLogo } from './IbondaLogo';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    setShowAddClientModal,
    clients,
    metrics,
    setSelectedClientId,
    language,
    setLanguage,
    direction,
  } = useAgency();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = translations[language];

  // Active trials that need urgent attention (expiring within 48h)
  const trialAlerts = clients.filter((c) => c.stage === 'trial_7_days');

  // Languages list with clear flags and labels
  const languagesList: Array<{ code: Language; label: string; flag: string; sub: string }> = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦', sub: 'عربية 100%' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', sub: 'Français' },
    { code: 'en', label: 'English', flag: '🇬🇧', sub: 'English' },
  ];

  return (
    <>
      {/* SPATIOUS, CLEAR AND HIGH HEADER (Header عريض وواضح باش يبان كلشي) */}
      <header className="sticky top-0 z-40 h-20 sm:h-24 bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm px-4 sm:px-8 w-full max-w-full transition-all">
        <div className="h-full flex items-center justify-between gap-3 sm:gap-6 max-w-full">
          {/* ========================================================= */}
          {/* SIDE 1: Logo Brand, Menu toggle, Add Client Button, Search */}
          {/* ========================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink min-w-0">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={onToggleMobileSidebar}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 transition-colors border border-slate-200"
              title="القائمة"
              aria-label="القائمة الجانبية"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Primary Action Button: + إضافة عقد / صفقة جديدة */}
            <button
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-[#FF5500] hover:from-orange-600 hover:to-[#D93800] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 hover:shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0 border border-orange-400/40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden xs:inline sm:inline">
                {t.addClientBtn}
              </span>
              <span className="xs:hidden">
                + عقد
              </span>
            </button>

            {/* Search Box on Desktop - Spacious */}
            <div className="hidden md:flex items-center relative w-64 lg:w-96">
              <Search className={`w-4 h-4 absolute ${direction === 'rtl' ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full ${direction === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 text-xs bg-slate-100 hover:bg-slate-100/90 focus:bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20`}
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* SIDE 2: Language Switcher, Notifications, Brand Display */}
          {/* ========================================================= */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* LANGUAGE SWITCHER BUTTON (واضح وعريض، يفتح قائمة بارزة فوق كل شيء) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowNotifMenu(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 transition-all cursor-pointer shadow-xs ${
                  showLangMenu
                    ? 'border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-400/30 font-black'
                    : 'border-slate-300 hover:border-orange-500 bg-white text-slate-800 font-extrabold'
                }`}
                title="تغيير لغة لوحة التحكم / Change Language / Changer la langue"
              >
                <Globe className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="font-mono text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>{language === 'ar' ? '🇲🇦' : language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                  <span>{language === 'ar' ? 'العربية' : language === 'fr' ? 'Français' : 'English'}</span>
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showLangMenu ? 'rotate-180 text-orange-600' : ''}`} />
              </button>

              {/* Language Dropdown Menu with High Z-Index & Clear Borders */}
              {showLangMenu && (
                <div
                  className={`absolute ${
                    direction === 'rtl' ? 'left-0' : 'right-0'
                  } top-full mt-2 w-56 bg-white border-2 border-orange-500/60 rounded-2xl shadow-2xl py-2 z-[100] text-xs animate-fade-in`}
                >
                  <div className={`px-4 py-2 text-[11px] font-black text-slate-500 border-b border-slate-100 flex items-center justify-between ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <span>{t.languageSelect}</span>
                    <span className="text-[10px] text-orange-600 font-bold">
                      {language === 'ar' ? 'تحويل شامل' : language === 'fr' ? 'Basculement total' : 'Full Switch'}
                    </span>
                  </div>
                  {languagesList.map((lang) => {
                    const isCurrent = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-orange-50/90 cursor-pointer font-bold transition-colors ${
                          isCurrent ? 'text-orange-600 bg-orange-50 font-black' : 'text-slate-800'
                        } ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0">{lang.flag}</span>
                          <div>
                            <span className="text-xs font-black block text-slate-900">{lang.label}</span>
                            <span className="text-[10px] text-slate-500 font-semibold block">{lang.sub}</span>
                          </div>
                        </span>
                        {isCurrent && (
                          <span className="text-orange-600 font-black text-sm px-2 py-0.5 bg-orange-100 rounded-md">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications Dropdown with Badge */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowLangMenu(false);
                }}
                className="relative p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border-2 border-slate-200"
                title={t.notificationsTitle}
              >
                <Bell className="w-5 h-5 stroke-[2.2]" />
                {trialAlerts.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-mono font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                    {trialAlerts.length}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  className={`absolute ${direction === 'rtl' ? 'left-0' : 'right-0'} top-full mt-2 w-80 sm:w-96 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden text-xs ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                  <div className="p-3.5 bg-gradient-to-r from-[#082E35] to-[#0B434C] text-white flex items-center justify-between font-bold border-b border-orange-500/40">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>{t.notificationsTitle}</span>
                    </span>
                    <span className="text-[10px] bg-orange-500 text-white font-extrabold px-2.5 py-0.5 rounded-full font-mono">
                      {trialAlerts.length} {t.alertsCount}
                    </span>
                  </div>

                  <div className="p-2 divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {trialAlerts.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">{t.notificationsEmpty}</div>
                    ) : (
                      trialAlerts.map((client) => (
                        <div
                          key={client.id}
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setShowNotifMenu(false);
                          }}
                          className="p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                            <span>{client.agencyName}</span>
                            <span className="text-[10px] text-orange-600 font-mono font-extrabold">
                              {client.packageTier.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed truncate">
                            {client.notes}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Brand Logo & Name: High Profile, Prominent and Clear */}
            <div className="flex items-center border-r-2 rtl:border-r-0 rtl:border-l-2 border-slate-200/80 px-2 sm:px-3">
              <IbondaLogo size="lg" variant="light" />
            </div>
          </div>
        </div>
      </header>

      {/* Global Click-Away Backdrop for Menus */}
      {(showLangMenu || showNotifMenu) && (
        <div
          onClick={() => {
            setShowLangMenu(false);
            setShowNotifMenu(false);
          }}
          className="fixed inset-0 z-30 bg-transparent"
        />
      )}
    </>
  );
};
