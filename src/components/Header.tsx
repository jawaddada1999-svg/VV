import React, { useState } from 'react';
import { useAgency } from '../context/AgencyContext';
import {
  Plus,
  Menu,
  Search,
  Bell,
  X,
  Clock,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { translations, Language } from '../translations';
import { IbondaLogo } from './IbondaLogo';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    searchQuery,
    setSearchQuery,
    setShowAddClientModal,
    clients,
    setSelectedClientId,
    language,
    setLanguage,
    direction,
  } = useAgency();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const t = translations[language];

  // Active trials that need urgent attention
  const trialAlerts = clients.filter((c) => c.stage === 'trial_7_days');

  const languagesList: Array<{ code: Language; short: string; label: string; flag: string; sub: string }> = [
    { code: 'ar', short: 'AR', label: 'العربية', flag: '🇲🇦', sub: 'عربية 100%' },
    { code: 'fr', short: 'FR', label: 'Français', flag: '🇫🇷', sub: 'Français 100%' },
    { code: 'en', short: 'EN', label: 'English', flag: '🇬🇧', sub: 'English 100%' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <>
      <header className="vv-top-header sticky top-0 z-40 bg-gradient-to-r from-[#06252A] via-[#0B434C] to-[#06252A] backdrop-blur-xl border-b border-orange-500/25 shadow-lg shadow-[#04181B]/10 w-full max-w-full transition-all">
        <div className="h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 max-w-full">
          {/* SIDE 1: Mobile Menu + Compact Logo / Add Button + Desktop Search */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink min-w-0">
            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 transition-colors border border-slate-200 bg-white"
              title={language === 'ar' ? 'القائمة' : language === 'fr' ? 'Menu' : 'Menu'}
              aria-label={language === 'ar' ? 'القائمة الجانبية' : language === 'fr' ? 'Menu latéral' : 'Sidebar menu'}
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Primary Action Button: + New Deal / Client */}
            <button
              type="button"
              onClick={() => setShowAddClientModal(true)}
              className="min-h-[40px] flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4.5 py-2 bg-gradient-to-r from-[#FF6600] to-[#E65500] hover:from-[#E65500] hover:to-[#CC4A00] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.8]" />
              <span className="hidden sm:inline">{t.addClientBtn}</span>
              <span className="sm:hidden font-black">
                {language === 'ar' ? 'عقد جديد' : language === 'fr' ? 'Contrat' : 'New Deal'}
              </span>
            </button>

            {/* Desktop Search Box */}
            <div className="hidden md:flex items-center relative w-64 lg:w-88">
              <Search
                className={`w-4 h-4 absolute ${direction === 'rtl' ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full min-h-[42px] ${direction === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 text-xs bg-slate-100 hover:bg-slate-100/90 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium transition-all focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-orange-500/20`}
              />
            </div>
          </div>

          {/* SIDE 2: Mobile Search Toggle, Language Switcher, Notifications, Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowMobileSearch(!showMobileSearch);
                setShowLangMenu(false);
                setShowNotifMenu(false);
              }}
              className={`md:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                showMobileSearch || searchQuery
                  ? 'border-[#FF6600] bg-orange-50 text-[#FF6600]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              title={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
            >
              {showMobileSearch ? <X className="w-4 h-4 stroke-[2.4]" /> : <Search className="w-4 h-4 stroke-[2.2]" />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowNotifMenu(false);
                }}
                className={`min-h-[40px] flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                  showLangMenu
                    ? 'border-[#FF6600] bg-orange-50 text-orange-900 ring-2 ring-orange-400/20 font-black'
                    : 'border-slate-200 hover:border-[#FF6600] bg-white text-slate-800 font-extrabold'
                }`}
                title={t.languageSelect}
              >
                <Globe className="w-4 h-4 text-[#FF6600] shrink-0" />
                <span className="font-mono text-xs font-black text-slate-900 flex items-center gap-1">
                  <span>{currentLangObj.flag}</span>
                  <span className="hidden sm:inline">{currentLangObj.label}</span>
                  <span className="sm:hidden">{currentLangObj.short}</span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block ${
                    showLangMenu ? 'rotate-180 text-[#FF6600]' : ''
                  }`}
                />
              </button>

              {showLangMenu && (
                <div
                  className={`absolute ${
                    direction === 'rtl' ? 'left-0' : 'right-0'
                  } top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[100] text-xs`}
                >
                  <div
                    className={`px-4 py-2 text-[11px] font-black text-slate-500 border-b border-slate-100 flex items-center justify-between ${
                      direction === 'rtl' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span>{t.languageSelect}</span>
                    <span className="text-[10px] text-[#FF6600] font-bold">
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
                        className={`w-full min-h-[44px] px-4 py-2.5 flex items-center justify-between hover:bg-orange-50/90 cursor-pointer font-bold transition-colors ${
                          isCurrent ? 'text-[#FF6600] bg-orange-50 font-black' : 'text-slate-800'
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
                          <span className="text-[#FF6600] font-black text-sm px-2 py-0.5 bg-orange-100 rounded-md">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowLangMenu(false);
                }}
                className="relative min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 bg-white"
                title={t.notificationsTitle}
              >
                <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
                {trialAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#FF6600] text-white text-[10px] font-mono font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {trialAlerts.length}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  className={`fixed sm:absolute inset-x-3 sm:inset-x-auto ${
                    direction === 'rtl' ? 'sm:left-0' : 'sm:right-0'
                  } top-18 sm:top-full sm:mt-2 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] overflow-hidden text-xs ${
                    direction === 'rtl' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="p-3.5 bg-gradient-to-r from-[#082E35] to-[#0B434C] text-white flex items-center justify-between font-bold border-b border-orange-500/40">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>{t.notificationsTitle}</span>
                    </span>
                    <span className="text-[10px] bg-[#FF6600] text-white font-extrabold px-2.5 py-0.5 rounded-full font-mono">
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
                            <span className="text-[10px] text-[#FF6600] font-mono font-extrabold">
                              {client.packageTier.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed truncate">{client.notes}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Responsive Brand Logo */}
            <div className="hidden xs:flex sm:hidden items-center border-r rtl:border-r-0 rtl:border-l border-slate-200/80 px-2">
              <IbondaLogo size="sm" variant="dark" showText={false} />
            </div>
            <div className="hidden sm:flex items-center border-r rtl:border-r-0 rtl:border-l border-slate-200/80 px-3">
              <IbondaLogo size="md" variant="dark" />
            </div>
          </div>
        </div>

        {/* Expandable Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-3 pb-3 pt-1 border-t border-slate-100 bg-white">
            <div className="relative flex items-center">
              <Search
                className={`w-4 h-4 absolute ${direction === 'rtl' ? 'right-3.5' : 'left-3.5'} text-slate-400 pointer-events-none`}
              />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full min-h-[44px] ${direction === 'rtl' ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2 text-xs bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF6600]`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} p-1 text-slate-400 hover:text-slate-700 cursor-pointer`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

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
