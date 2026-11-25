import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { X } from 'lucide-react';
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
  const [contactRole, setContactRole] = useState('agency_manager');
  const [teamSize, setTeamSize] = useState(1);
  const [city, setCity] = useState(language === 'ar' ? 'الدار البيضاء' : 'Casablanca');
  const [phone, setPhone] = useState('+212 6');
  const [email, setEmail] = useState('');
  const [packageTier, setPackageTier] = useState<PackageTier>('growth');
  const [stage, setStage] = useState<ClientStage>('ad_lead');
  const [adSource, setAdSource] = useState(
    language === 'ar' ? 'إعلانات ميتا' : 'Meta Ads'
  );
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setCity((prev) => {
      if (prev === 'الدار البيضاء' || prev === 'Casablanca') {
        return language === 'ar' ? 'الدار البيضاء' : 'Casablanca';
      }
      return prev;
    });
    setAdSource((prev) => {
      if (prev === 'إعلانات ميتا' || prev === 'Meta Ads') {
        return language === 'ar' ? 'إعلانات ميتا' : 'Meta Ads';
      }
      return prev;
    });
  }, [language]);

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
      contactRole,
      teamSize,
      city,
      phone,
      email: email || `${contactPerson.toLowerCase().replace(/\s+/g, '')}@agency.ma`,
      packageTier,
      setupFee,
      monthlyRetainer,
      stage,
      adSource,
      notes:
        notes ||
        (language === 'ar'
          ? 'تم تسجيل العميل في المنظومة'
          : language === 'fr'
          ? 'Client enregistré dans le système'
          : 'Client registered in the system'),
      trialStartDate: stage === 'trial_7_days' ? new Date().toISOString() : undefined,
      trialEndDate:
        stage === 'trial_7_days'
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
    });

    setShowAddClientModal(false);
    setAgencyName('');
    setContactPerson('');
    setContactRole('agency_manager');
    setTeamSize(1);
    setPhone('+212 6');
    setEmail('');
    setNotes('');
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        direction === 'rtl' ? 'text-right' : 'text-left'
      }`}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 z-10 p-4 sm:p-5 bg-[#082E35] text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {language === 'ar'
                ? '+ إضافة وكالة عقارية أو صفقة جديدة'
                : language === 'fr'
                ? '+ Nouveau Client Agence'
                : '+ Add Real Estate Agency'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {language === 'ar'
                ? 'تسجيل عميل جديد واختيار الباقة وتحديد المرحلة'
                : language === 'fr'
                ? 'Enregistrez un nouveau prospect et choisissez son forfait'
                : 'Register new agency lead, select tier and initial stage'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddClientModal(false)}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-300 hover:text-white rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {language === 'ar'
                ? 'اسم الوكالة العقارية *'
                : language === 'fr'
                ? 'Nom de l’Agence *'
                : 'Agency Name *'}
            </label>
            <input
              type="text"
              required
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'مثال: أطلس العقارية بريميوم، المنارة إيمو...'
                  : language === 'fr'
                  ? 'Ex : Atlas Immo...'
                  : 'e.g. Atlas Real Estate...'
              }
              className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar'
                  ? 'اسم المسؤول أو المدير *'
                  : language === 'fr'
                  ? 'Responsable / Dirigeant *'
                  : 'Decision Maker *'}
              </label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'عمر، ياسين، سارة...'
                    : language === 'fr'
                    ? 'Nom du dirigeant...'
                    : 'Contact name...'
                }
                className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
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
                className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colRole}</label>
              <select value={contactRole} onChange={(e) => setContactRole(e.target.value)} className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs">
                <option value="owner">{language === 'ar' ? 'مالك الوكالة' : language === 'fr' ? 'Propriétaire de l’agence' : 'Agency owner'}</option>
                <option value="agency_manager">{language === 'ar' ? 'مدير الوكالة' : language === 'fr' ? 'Directeur d’agence' : 'Agency manager'}</option>
                <option value="branch_manager">{language === 'ar' ? 'مدير الفرع' : language === 'fr' ? 'Responsable d’agence' : 'Branch manager'}</option>
                <option value="commercial_director">{language === 'ar' ? 'المدير التجاري' : language === 'fr' ? 'Directeur commercial' : 'Commercial director'}</option>
                <option value="sales_manager">{language === 'ar' ? 'مسؤول المبيعات' : language === 'fr' ? 'Responsable des ventes' : 'Sales manager'}</option>
                <option value="sales_agent">{language === 'ar' ? 'مستشار / تجاري' : language === 'fr' ? 'Conseiller commercial' : 'Sales agent'}</option>
                <option value="negotiator">{language === 'ar' ? 'مفاوض عقاري' : language === 'fr' ? 'Négociateur immobilier' : 'Property negotiator'}</option>
                <option value="marketing_manager">{language === 'ar' ? 'مسؤول التسويق' : language === 'fr' ? 'Responsable marketing' : 'Marketing manager'}</option>
                <option value="operations_manager">{language === 'ar' ? 'مسؤول العمليات' : language === 'fr' ? 'Responsable des opérations' : 'Operations manager'}</option>
                <option value="administrator">{language === 'ar' ? 'مسؤول إداري' : language === 'fr' ? 'Responsable administratif' : 'Administrator'}</option>
                <option value="assistant">{language === 'ar' ? 'مساعد إداري' : language === 'fr' ? 'Assistant administratif' : 'Administrative assistant'}</option>
                <option value="other">{language === 'ar' ? 'دور آخر' : language === 'fr' ? 'Autre fonction' : 'Other role'}</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{t.colTeamSize}</label>
              <input type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(Math.max(1, Number(e.target.value)))} className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar'
                  ? 'الهاتف (واتساب) *'
                  : language === 'fr'
                  ? 'Téléphone WhatsApp *'
                  : 'WhatsApp Phone *'}
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar'
                  ? 'البريد الإلكتروني'
                  : language === 'fr'
                  ? 'Email'
                  : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@agency.ma"
                className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar'
                  ? 'باقة الأوتوميشن والصيانة'
                  : language === 'fr'
                  ? 'Offre d’automatisation'
                  : 'Package Tier'}
              </label>
              <select
                value={packageTier}
                onChange={(e) => setPackageTier(e.target.value as PackageTier)}
                className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs cursor-pointer"
              >
                <option value="growth">
                  {t.growthPackage} (8,500 {t.mad} + 2,500 {t.perMonth})
                </option>
                <option value="enterprise">
                  {t.enterprisePackage} (16,000 {t.mad} + 4,500 {t.perMonth})
                </option>
                <option value="starter">
                  {t.starterPackage} (4,000 {t.mad} + 1,200 {t.perMonth})
                </option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {language === 'ar'
                  ? 'المرحلة في المسار'
                  : language === 'fr'
                  ? 'Étape Pipeline'
                  : 'Initial Stage'}
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as ClientStage)}
                className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs cursor-pointer"
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
              {language === 'ar'
                ? 'مصدر الاستفسار أو الإعلان'
                : language === 'fr'
                ? 'Source d’acquisition'
                : 'Ad Source'}
            </label>
            <input
              type="text"
              value={adSource}
              onChange={(e) => setAdSource(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'إعلانات ميتا، بحث جوجل، توصية...'
                  : language === 'fr'
                  ? 'Meta Ads, Google, Recommandation...'
                  : 'Meta Ads, Google, Referral...'
              }
              className="w-full min-h-[44px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {language === 'ar'
                ? 'ملاحظات تفصيلية'
                : language === 'fr'
                ? 'Notes internes'
                : 'Internal Notes'}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'حجم فريق الوكالة، العقارات التي يسوقونها، المشاكل المطروحة...'
                  : language === 'fr'
                  ? 'Taille d’équipe, type de biens, besoins...'
                  : 'Team size, property portfolio, pain points...'
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF6600] text-sm sm:text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddClientModal(false)}
              className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 bg-[#FF6600] hover:bg-[#E65500] text-white font-bold rounded-xl cursor-pointer shadow-sm transition-colors"
            >
              {language === 'ar'
                ? 'حفظ وإضافة الوكالة'
                : language === 'fr'
                ? 'Enregistrer le client'
                : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
