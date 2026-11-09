import React from 'react';
import { useAgency } from '../context/AgencyContext';

interface IbondaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark'; // dark background (e.g. sidebar) or light background (e.g. header)
}

export const IbondaLogo: React.FC<IbondaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'light',
}) => {
  let language = 'ar';
  try {
    const agency = useAgency();
    language = agency.language;
  } catch {
    // fallback if outside provider
  }

  // Dimensions for the icon
  const sizeMap = {
    sm: 'w-8 h-8 min-w-8',
    md: 'w-10 h-10 min-w-10',
    lg: 'w-12 h-12 min-w-12',
    xl: 'w-14 h-14 min-w-14',
  };

  const textSizes = {
    sm: { title: 'text-sm', sub: 'text-[9px]' },
    md: { title: 'text-base', sub: 'text-[10px]' },
    lg: { title: 'text-lg', sub: 'text-[11px]' },
    xl: { title: 'text-xl', sub: 'text-xs' },
  };

  const subText =
    language === 'ar'
      ? 'أوتوميشن التسويق العقاري'
      : language === 'fr'
      ? 'Automatisation Immobilière'
      : 'Real Estate Automation';

  const badgeText =
    language === 'ar'
      ? 'منظومة'
      : 'OPS';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-definition emblem */}
      <div
        className={`relative ${sizeMap[size]} rounded-2xl shadow-lg transition-transform hover:scale-105 overflow-hidden flex items-center justify-center p-0.5 bg-[#03171A] border-2 ${
          variant === 'dark' ? 'border-orange-500/40 shadow-orange-500/10' : 'border-slate-800 shadow-slate-900/15'
        }`}
      >
        <img
          src="/ebonda-logo.svg"
          alt="IBONDA Logo"
          className="w-full h-full object-contain filter drop-shadow"
          loading="eager"
        />
        {/* Subtle glowing reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-2xl" />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${textSizes[size].title} ${
                variant === 'dark' ? 'text-white' : 'text-slate-950'
              }`}
            >
              IBONDA
            </span>
            <span className="inline-flex px-1.5 py-0.5 rounded-md font-mono font-black text-[9px] bg-gradient-to-r from-orange-500 to-[#FF5500] text-white shadow-2xs">
              {badgeText}
            </span>
          </div>
          <span
            className={`font-extrabold tracking-wider uppercase mt-1 ${textSizes[size].sub} ${
              variant === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`}
          >
            {subText}
          </span>
        </div>
      )}
    </div>
  );
};
