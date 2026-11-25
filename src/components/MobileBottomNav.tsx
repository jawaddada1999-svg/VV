import React from 'react';
import { useAgency } from '../context/AgencyContext';
import { BarChart3, Kanban, Calendar, Menu, Building2 } from 'lucide-react';
import { translations } from '../translations';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab, language } = useAgency();
  const t = translations[language];

  const items = [
    {
      id: 'overview',
      label: language === 'ar' ? 'الرئيسية' : language === 'fr' ? 'Accueil' : 'Home',
      icon: BarChart3,
    },
    {
      id: 'clients',
      label: language === 'ar' ? 'الوكالات' : language === 'fr' ? 'Agences' : 'Agencies',
      icon: Building2,
    },
    {
      id: 'pipeline',
      label: language === 'ar' ? 'الصفقات' : language === 'fr' ? 'Pipeline' : 'Pipeline',
      icon: Kanban,
    },
    {
      id: 'meetings',
      label: language === 'ar' ? 'المواعيد' : language === 'fr' ? 'Agenda' : 'Meetings',
      icon: Calendar,
    },
  ];

  return (
    <nav
      aria-label={language === 'ar' ? 'التنقل السريع' : language === 'fr' ? 'Navigation rapide' : 'Quick navigation'}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(8,46,53,0.08)] px-1.5 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl px-1 transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#FF6600] bg-orange-50/90 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-semibold'
              }`}
            >
              {isActive && (
                <span className="absolute top-0.5 w-6 h-0.5 rounded-full bg-[#FF6600]" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              <span className="text-[10px] leading-none truncate max-w-full">{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenMenu}
          title={t.navLeadershipGroup}
          className="min-h-[52px] flex flex-col items-center justify-center gap-1 rounded-xl px-1 text-slate-600 hover:text-[#082E35] hover:bg-slate-50 font-semibold transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] leading-none truncate max-w-full">
            {language === 'ar' ? 'المزيد' : language === 'fr' ? 'Plus' : 'More'}
          </span>
        </button>
      </div>
    </nav>
  );
};
