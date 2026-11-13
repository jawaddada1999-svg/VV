import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Layers,
  DollarSign,
  CheckCircle2,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { PackageTier } from '../../types/agency';
import { translations } from '../../translations';

export const PackagesSettingsTab: React.FC = () => {
  const { packages, updatePackagePricing, resetToInitialData, language, direction } = useAgency();
  const t = translations[language];

  const [prices, setPrices] = useState<Record<PackageTier, { setup: number; retainer: number }>>(() => {
    const map: Record<PackageTier, { setup: number; retainer: number }> = {
      starter: { setup: 4000, retainer: 1200 },
      growth: { setup: 8500, retainer: 2500 },
      enterprise: { setup: 16000, retainer: 4500 },
    };
    packages.forEach((p) => {
      map[p.id] = { setup: p.setupFee, retainer: p.monthlyRetainer };
    });
    return map;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePriceChange = (tier: PackageTier, field: 'setup' | 'retainer', value: number) => {
    setPrices((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value,
      },
    }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(prices).forEach(([tier, val]) => {
      updatePackagePricing(tier as PackageTier, val.setup, val.retainer);
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
              {t.packagesHeaderTag}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              {language === 'ar' ? '3 باقات معتمدة' : language === 'fr' ? '3 Forfaits' : '3 Tiers'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {t.packagesHeaderTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.packagesHeaderDesc}
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm(language === 'ar' ? 'هل أنت متأكد من إعادة ضبط البيانات إلى الحالة الأصلية؟' : language === 'fr' ? 'Réinitialiser les données initiales ?' : 'Reset to initial data?')) {
              resetToInitialData();
            }
          }}
          className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'إعادة الضبط' : language === 'fr' ? 'Réinitialiser' : 'Reset'}</span>
        </button>
      </div>

      {/* 2. Packages Pricing Form */}
      <form onSubmit={handleSaveAll} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {packages.map((pkg) => {
            const current = prices[pkg.id] || { setup: pkg.setupFee, retainer: pkg.monthlyRetainer };

            return (
              <div
                key={pkg.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-[#FF6600] transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      pkg.id === 'enterprise'
                        ? 'bg-purple-100 text-purple-900'
                        : pkg.id === 'growth'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-orange-100 text-orange-900'
                    }`}>
                      {pkg.id === 'starter' ? t.starterPackage : pkg.id === 'growth' ? t.growthPackage : t.enterprisePackage}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{language === 'ar' ? pkg.nameAr : pkg.name}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">{pkg.tagline}</p>

                  {/* Pricing Inputs */}
                  <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        {t.colSetupFeeCollected}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={current.setup}
                          onChange={(e) => handlePriceChange(pkg.id, 'setup', Number(e.target.value))}
                          className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm focus:outline-none focus:border-[#FF6600]"
                        />
                        <span className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none`}>
                          {t.mad}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        {t.colMonthlyRetainer}:
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={current.retainer}
                          onChange={(e) => handlePriceChange(pkg.id, 'retainer', Number(e.target.value))}
                          className="w-full min-h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold text-emerald-700 text-sm focus:outline-none focus:border-[#FF6600]"
                        />
                        <span className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none`}>
                          {t.perMonth}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-2">
                      {language === 'ar' ? 'الميزات ومخرجات الأتمتة المشمولة:' : language === 'fr' ? 'Fonctionnalités & Livrables inclus :' : 'Features & Deliverables:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {t.packagesHeaderDesc}
          </span>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {language === 'ar' ? 'تم حفظ الأسعار بنجاح!' : language === 'fr' ? 'Tarifs enregistrés !' : 'Saved!'}
              </span>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#FF6600] to-[#E65500] hover:from-[#E65500] hover:to-[#CC4A00] text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ar' ? 'حفظ تعديلات الأسعار' : language === 'fr' ? 'Enregistrer les tarifs' : 'Save Pricing'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
