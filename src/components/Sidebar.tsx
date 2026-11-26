import React from 'react';
import { useAgency } from '../context/AgencyContext';
import {
  BarChart3,
  Calculator,
  Wallet,
  Kanban,
  Calendar,
  Layers,
  CreditCard,
  Target,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Sparkles,
  Flame,
  Zap,
  MessageCircle,
  Users,
  SlidersHorizontal,
  FileBarChart,
} from 'lucide-react';
import { translations } from '../translations';
import { IbondaLogo } from './IbondaLogo';
import { DAY_ORDER } from '../utils/bookingSlots';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | null;
  badgeColor?: string;
}

interface NavigationGroup {
  groupTitle: string;
  items: NavigationItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activeTab, setActiveTab, metrics, clients, bookingSettings, language, direction } = useAgency();
  const t = translations[language];

  const trialsCount = clients.filter((c) => c.stage === 'trial_7_days').length;
  const buildsCount = clients.filter((c) => c.stage === 'delivery_in_progress').length;
  const activeWorkingDaysCount = DAY_ORDER.filter((d) => bookingSettings.schedule[d]?.enabled).length;

  const navigationGroups: NavigationGroup[] = [
    {
      groupTitle: language === 'ar' ? 'النمو والعملاء' : t.navLeadershipGroup,
      items: [
        { id: 'overview', label: t.navOverview, icon: BarChart3, badge: null },
        { id: 'reports', label: language === 'ar' ? 'التقارير والتحليلات' : language === 'fr' ? 'Rapports' : 'Reports', icon: FileBarChart, badge: null },
        {
          id: 'clients',
          label: language === 'ar' ? 'دليل الوكالات والعملاء' : t.navClients,
          icon: Building2,
          badge: `${clients.length}`,
          badgeColor: 'bg-white/20 text-white',
        },
        {
          id: 'pipeline',
          label: language === 'ar' ? 'مسار الصفقات' : t.navPipeline,
          icon: Kanban,
          badge: trialsCount > 0 ? `${trialsCount}` : null,
          badgeColor: 'bg-orange-500 text-white font-extrabold',
        },
        {
          id: 'meetings',
          label: language === 'ar' ? 'المواعيد ومكالمات الاستشارة' : t.navMeetings,
          icon: Calendar,
          badge: `${metrics.meetingsBookedThisMonth}`,
          badgeColor: 'bg-white/20 text-white',
        },
        { id: 'conversations', label: language === 'ar' ? 'المحادثات والتواصل' : language === 'fr' ? 'Conversations' : 'Conversations', icon: MessageCircle, badge: null },
        {
          id: 'ads',
          label: language === 'ar' ? 'حملات إعلانية' : t.navAds,
          icon: Target,
          badge: language === 'ar' ? 'ميتا وجوجل' : 'Meta & Google',
          badgeColor: 'bg-white/15 text-white',
        },
      ],
    },
    {
      groupTitle: language === 'ar' ? 'التشغيل والموارد المالية' : t.navExecutionGroup,
      items: [
        {
          id: 'delivery',
          label: language === 'ar' ? 'تسليم المشاريع' : t.navDelivery,
          icon: Layers,
          badge: buildsCount > 0 ? `${buildsCount}` : null,
          badgeColor: 'bg-purple-500 text-white font-bold',
        },
        {
          id: 'budget_simulator',
          label: language === 'ar' ? 'محاكي الميزانية' : language === 'fr' ? 'Simulateur de budget' : 'Budget simulator',
          icon: Calculator,
          badge: null,
        },
        {
          id: 'finance',
          label: language === 'ar' ? 'الأداء المالي' : language === 'fr' ? 'Performance financière' : 'Financial performance',
          icon: Wallet,
          badge: `${metrics.netRetainerProfit.toLocaleString()}`,
          badgeColor: 'bg-emerald-500 text-white font-bold',
        },
        {
          id: 'retainers',
          label: language === 'ar' ? 'عقود واشتراكات الصيانة' : t.navRetainers,
          icon: CreditCard,
          badge: `${metrics.activeRetainerClients}`,
          badgeColor: 'bg-emerald-500 text-white font-bold',
        },
        {
          id: 'booking_settings',
          label: language === 'ar' ? 'أوقات العمل ونظام الحجز' : t.navBookingSettings,
          icon: Clock,
          badge: `${activeWorkingDaysCount}/7`,
          badgeColor: bookingSettings.isBookingOpen
            ? 'bg-emerald-500 text-white font-bold'
            : 'bg-rose-500 text-white font-bold',
        },
        {
          id: 'packages',
          label: language === 'ar' ? 'هيكلة وتسعير الباقات' : t.navPackages,
          icon: Settings,
          badge: '3',
          badgeColor: 'bg-white/15 text-white',
        },
      ],
    },
    {
      groupTitle: language === 'ar' ? 'إدارة الفريق والنظام' : language === 'fr' ? 'Équipe et paramètres' : 'Team & settings',
      items: [
        { id: 'employees', label: language === 'ar' ? 'الموظفون وإدارة الفريق' : language === 'fr' ? 'Équipe' : 'Team members', icon: Users, badge: null },
        { id: 'settings', label: language === 'ar' ? 'الإعدادات' : language === 'fr' ? 'Paramètres' : 'Settings', icon: SlidersHorizontal, badge: null },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* LUXURY DEEP PETROL-BLUE SIDEBAR WITH VIBRANT ORANGE ACCENTS */}
      {/* (أزرق ملكي أنيق يطابق خلفية الهيدر مع لمسات وأزرار برتقالية للحفاظ على ألوان وهوية اللوغو) */}
      <aside
        className={`fixed top-0 bottom-0 ${
          direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        } z-50 bg-gradient-to-b from-[#06252A] via-[#0B434C] to-[#041D22] text-white border-petrol-800/80 transition-all duration-300 ease-in-out flex flex-col justify-between shadow-2xl lg:shadow-none lg:shrink-0 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 max-w-[85vw] ${
          mobileOpen
            ? 'flex translate-x-0'
            : direction === 'rtl'
            ? 'hidden lg:flex lg:translate-x-0'
            : 'hidden lg:flex lg:translate-x-0'
        }`}
      >
        <div className="p-3.5 flex flex-col flex-1 overflow-y-auto">
          {/* Header Section of Sidebar: Brand Logo in Orange + Petrol Blue */}
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/15">
            {!collapsed ? (
              <IbondaLogo size="md" variant="dark" />
            ) : (
              <IbondaLogo size="sm" variant="dark" showText={false} />
            )}

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 lg:hidden cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/15 transition-colors cursor-pointer mr-auto"
              title={
                collapsed
                  ? language === 'ar'
                    ? 'توسيع القائمة'
                    : language === 'fr'
                    ? 'Agrandir le menu'
                    : 'Expand sidebar'
                  : language === 'ar'
                  ? 'تصغير القائمة'
                  : language === 'fr'
                  ? 'Réduire le menu'
                  : 'Collapse sidebar'
              }
            >
              {collapsed ? (
                <ChevronLeft className={`w-4 h-4 ${direction === 'rtl' ? 'rotate-180' : ''} stroke-[2.5]` } />
              ) : (
                <ChevronRight className={`w-4 h-4 ${direction === 'rtl' ? 'rotate-180' : ''} stroke-[2.5]` } />
              )}
            </button>
          </div>

          {/* Grouped Navigation */}
          <nav className="space-y-4">
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!collapsed && (
                  <span className="text-[10px] font-extrabold text-slate-400 px-3 block mb-1 uppercase tracking-wider">
                    {group.groupTitle}
                  </span>
                )}
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileOpen(false);
                      }}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer group ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-[#FF5500] text-white shadow-md shadow-orange-500/25 border border-orange-400/40 transform scale-[1.01]'
                          : 'text-slate-200 hover:bg-white/10 hover:text-white'
                      } ${collapsed ? 'justify-center px-2' : ''}`}
                    >
                      <div
                        className={`shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-orange-400'
                        }`}
                      >
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </div>

                      {!collapsed && (
                        <div className={`flex items-center justify-between flex-1 truncate ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                                item.badgeColor
                                  ? item.badgeColor
                                  : isActive
                                  ? 'bg-white/25 text-white'
                                  : 'bg-white/15 text-slate-200'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Retainer Summary with Orange Glow */}
        {!collapsed && (
          <div className="p-3 border-t border-white/15 bg-black/20">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300">
                  {language === 'ar' ? 'اشتراكات الصيانة' : language === 'fr' ? 'MRR Maintenance' : 'Monthly MRR'}
                </span>
                <span className="text-xs font-mono font-extrabold text-orange-400">
                  {metrics.currentMRR.toLocaleString()} {t.mad}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300">
                  {language === 'ar' ? 'وكالات نشطة' : language === 'fr' ? 'Agences actives' : 'Active Agencies'}
                </span>
                <span className="text-xs font-mono font-extrabold text-white">
                  {metrics.activeRetainerClients}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
