import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { X, Building2, User, Phone, Mail, MapPin, DollarSign } from 'lucide-react';
import { PackageTier, ClientStage } from '../../types/agency';
import { translations } from '../../translations';

export const ClientModal: React.FC = () => {
  const {
    showAddClientModal,
    setShowAddClientModal,
    addClient,
    packages,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  const [agencyName, setAgencyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [city, setCity] = useState(language === 'ar' ? 'الدار البيضاء' : 'Casablanca');
  const [phone, setPhone] = useState('+212 6');
  const [email, setEmail] = useState('');
  const [packageTier, setPackageTier] = useState<PackageTier>('growth');
  const [stage, setStage] = useState<ClientStage>('ad_lead');
  const [adSource, setAdSource] = useState(language === 'ar' ? 'إعلانات ميتا' : language === 'fr' ? 'Meta Ads' : 'Meta Ads');
  const [notes, setNotes] = useState('');

  if (!showAddClientModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !contactPerson) return;

    const selectedPkg = packages.find((p) => p.id === packageTier);
    const setupFee = selectedPkg?.setupFee || 8500;
    const monthlyRetainer = selectedPkg?.monthlyRetainer || 2500;

    addClient({
      agencyName,
      contactPerson,
      city,
      phone,
      email: email || `${contactPerson.toLowerCase().replace(/\s+/g, '')}@agency.ma`,
      packageTier,
      setupFee,
      monthlyRetainer,
      stage,
      adSource,
      notes: notes || (language === 'ar' ? 'تم تسجيل العميل في المنظومة' : 'Client enregistré dans le système'),
      trialStartDate: stage === 'trial_7_days' ? new Date().toISOString() : undefined,
      trialEndDate: stage === 'trial_7_days' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    });

    setShowAddClientModal(false);
    setAgencyName('');
    setContactPerson('');
    setPhone('+212 6');
    setNotes('');
  };

  return (
    <div className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {language === 'ar' ? '+ إضافة وكالة عقارية أو صفقة جديدة' : language === 'fr' ? '+ Nouveau Client Agence' : '+ Add Real Estate Agency'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'ar' ? 'تسجيل عميل جديد واختيار الباقة وتحديد المرحلة' : language === 'fr' ? 'Enregistrez un nouveau prospect et choisissez son forfait' : 'Register new agency lead, select tier and initial stage'}
            </p>
          </div>
          <button
            onClick={() => setShowAddClientModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {language === 'ar' ? 'اسم الوكالة العقارية *' : language === 'fr' ? 'Nom de l’Agence *' : 'Agency Name *'}
            </label>
            <input
              type="text"
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: أطلس العقارية بريميوم، المنارة إيمو...' : 'Atlas Immo...'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar' ? 'اسم المسؤول أو المدير *' : language === 'fr' ? 'Responsable / Dirigeant *' : 'Decision Maker *'}
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder={language === 'ar' ? 'عمر، ياسين، سارة...' : 'Nom...'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar' ? 'المدينة *' : language === 'fr' ? 'Ville *' : 'City *'}
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={language === 'ar' ? 'الدار البيضاء، مراكش، طنجة...' : 'Casablanca...'}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar' ? 'الهاتف (واتساب) *' : language === 'fr' ? 'Téléphone WhatsApp *' : 'WhatsApp Phone *'}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-orange-500"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@agency.ma"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-orange-500"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar' ? 'باقة الأوتوميشن والصيانة' : language === 'fr' ? 'Offre d’automatisation' : 'Package Tier'}
              </label>
              <select
                value={packageTier}
                onChange={(e) => setPackageTier(e.target.value as PackageTier)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="growth">{t.growthPackage} (8,500 {t.mad} + 2,500 {t.perMonth})</option>
                <option value="enterprise">{t.enterprisePackage} (16,000 {t.mad} + 4,500 {t.perMonth})</option>
                <option value="starter">{t.starterPackage} (4,000 {t.mad} + 1,200 {t.perMonth})</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar' ? 'المرحلة في المسار' : language === 'fr' ? 'Étape Pipeline' : 'Initial Stage'}
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ClientStage)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="ad_lead">{t.colAdLeadsTitle}</option>
                <option value="meeting_scheduled">{t.colMeetingsTitle}</option>
                <option value="trial_7_days">{t.colTrialTitle}</option>
                <option value="delivery_in_progress">{t.colDeliveryTitle}</option>
                <option value="active_retainer">{t.colRetainerTitle}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {language === 'ar' ? 'مصدر الاستفسار أو الإعلان' : language === 'fr' ? 'Source d’acquisition' : 'Ad Source'}
            </label>
            <input
              type="text"
              value={adSource}
              onChange={(e) => setAdSource(e.target.value)}
              placeholder={language === 'ar' ? 'إعلانات ميتا، بحث جوجل، توصية...' : 'Meta Ads, Google...'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {language === 'ar' ? 'ملاحظات تفصيلية' : language === 'fr' ? 'Notes internes' : 'Internal Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ar' ? 'حجم فريق الوكالة، العقارات التي يسوقونها، المشاكل المطروحة...' : 'Notes...'}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddClientModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg cursor-pointer shadow-sm transition-colors"
            >
              {language === 'ar' ? 'حفظ وإضافة الوكالة' : language === 'fr' ? 'Enregistrer le client' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
