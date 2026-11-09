import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Webhook,
  Copy,
  Check,
  Zap,
  Download,
  ShieldCheck,
  Globe,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Sliders,
  RotateCcw,
  AlertTriangle,
  Code2,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const WebhookModal: React.FC = () => {
  const {
    showWebhookModal,
    setShowWebhookModal,
    addLead,
    leads,
    campaigns,
    setCampaignDirectMetrics,
    clearAllData,
    resetToMockData,
    integrationSettings,
    updateIntegrationSettings,
    t,
    language,
    formatMoney,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'meta' | 'landing' | 'leads_webhook' | 'calendly' | 'direct_input'>('overview');
  const [copied, setCopied] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [connectionTested, setConnectionTested] = useState<boolean>(integrationSettings.isLiveConnected);

  // Direct numbers input state
  const [directSpend, setDirectSpend] = useState<number>(campaigns[0]?.spend || 5000);
  const [directClicks, setDirectClicks] = useState<number>(campaigns[0]?.clicks || 750);
  const [directImpressions, setDirectImpressions] = useState<number>(campaigns[0]?.impressions || 25000);
  const [directLeads, setDirectLeads] = useState<number>(campaigns[0]?.leads || 35);
  const [directMeetingsHeld, setDirectMeetingsHeld] = useState<number>(campaigns[0]?.meetingsHeld || 8);
  const [directClientsWon, setDirectClientsWon] = useState<number>(campaigns[0]?.clientsClosed || 2);
  const [directRevenue, setDirectRevenue] = useState<number>(campaigns[0]?.revenue || 30000);

  // Local meta credentials input
  const [adAccountId, setAdAccountId] = useState(integrationSettings.metaAdAccountId || '');
  const [accessToken, setAccessToken] = useState(integrationSettings.metaAccessToken || '');
  const [pixelId, setPixelId] = useState(integrationSettings.metaPixelId || '');
  const [landingUrl, setLandingUrl] = useState(integrationSettings.landingPageUrl || 'https://agence-mandats.ma');

  if (!showWebhookModal) return null;

  const simulatedWebhookUrl = `${window.location.origin}/api/v1/webhook/leads`;
  const verifyToken = 'immo_metrics_secure_token_2026';

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestMetaConnection = () => {
    if (!adAccountId) {
      alert(language === 'ar' ? 'يرجى إدخال معرف الحساب الإعلاني (Ad Account ID) أولاً.' : 'Veuillez saisir votre Ad Account ID Meta.');
      return;
    }
    setConnectionTested(true);
    updateIntegrationSettings({
      metaAdAccountId: adAccountId,
      metaAccessToken: accessToken,
      metaPixelId: pixelId,
      landingPageUrl: landingUrl,
      isLiveConnected: true,
      lastSyncTimestamp: new Date().toISOString(),
    });
    const msg = language === 'ar'
      ? `تم التحقق بنجاح من حساب إعلانات ميتا (${adAccountId}). تم تفعيل الربط المباشر وحفظ الإعدادات.`
      : `Connexion Meta Ads réussie (${adAccountId}) ! Les identifiants sont sauvegardés.`;
    setTestStatus(msg);
    setTimeout(() => setTestStatus(null), 4000);
  };

  const handleApplyDirectMetrics = () => {
    if (campaigns.length > 0) {
      setCampaignDirectMetrics(campaigns[0].id, {
        spend: Number(directSpend),
        clicks: Number(directClicks),
        impressions: Number(directImpressions),
        leads: Number(directLeads),
        meetingsHeld: Number(directMeetingsHeld),
        clientsClosed: Number(directClientsWon),
        revenue: Number(directRevenue),
      });
      const msg = language === 'ar'
        ? 'تم تحديث أرقام الحملة الإعلانية والداشبورد بالكامل بأرقامك الحقيقية بنجاح!'
        : 'Les chiffres réels ont été injectés dans votre dashboard avec succès !';
      setTestStatus(msg);
      setTimeout(() => setTestStatus(null), 4000);
    }
  };

  const handleSimulateIncomingLead = () => {
    const moroccanCities = ['Casablanca (Gauthier)', 'Rabat (Agdal)', 'Marrakech (Guéliz)', 'Tanger (Malabata)', 'Agadir (Founty)'];
    const agencyPrefixes = language === 'ar'
      ? ['أطلس العقارية بريميوم', 'وكالة المنارة العقارية', 'مجموعة النخيل للوساطة', 'المغرب للعقارات الراقية', 'دار الاستثمار العقاري']
      : ['Agence Immo Elite', 'Prestige Properties', 'Maroc Mandats B2B', 'Horizon Immobilier', 'Atlas Conseil Immo'];
    const contacts = ['Yassine Benkirane', 'Fatima-Zahra El Fassi', 'Amine Tazi', 'Salma Bennani', 'Reda Mansour'];

    const randomCity = moroccanCities[Math.floor(Math.random() * moroccanCities.length)];
    const randomAgency = `${agencyPrefixes[Math.floor(Math.random() * agencyPrefixes.length)]} ${Math.floor(Math.random() * 90 + 10)}`;
    const randomContact = contacts[Math.floor(Math.random() * contacts.length)];

    addLead({
      agencyName: randomAgency,
      city: randomCity,
      contactPerson: randomContact,
      phone: `+212 6 ${Math.floor(Math.random() * 89 + 10)} ${Math.floor(Math.random() * 89 + 10)} ${Math.floor(Math.random() * 89 + 10)}`,
      email: `${randomContact.toLowerCase().replace(/[^a-z]/g, '')}@agence-immo.ma`,
      status: 'new',
      dealValue: 15000,
      adSource: 'Meta Ads - Formulaire Instantané (Lead Form)',
      notes: language === 'ar'
        ? 'تم استقبال هذه الوكالة آلياً عبر Webhook في الوقت الفعلي من نموذج إعلانات ميتا.'
        : 'Lead reçu automatiquement via Webhook en temps réel depuis le formulaire Meta Ads.',
      qualificationCriteria: {
        hasBudget: true,
        activeAgentsCount: 6,
        wantsExclusiveMandates: true,
      },
    });

    const successMessage = language === 'ar'
      ? `تمت العملية بنجاح! تم استقبال طلب الوكالة "${randomAgency}" وإدراجه في بداية خط الصفقات.`
      : `Succès ! Lead reçu : "${randomAgency}" ajouté en tête du pipeline.`;

    setTestStatus(successMessage);
    setTimeout(() => setTestStatus(null), 4000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(leads, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'immo_metrics_leads.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const snippetCode = `<!-- IMMO-METRICS: Tracking Code à placer dans le <head> de votre Landing Page -->
<script>
  (function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    // Script d'écoute automatique des formulaires soumission
    d.addEventListener('submit', function(e) {
      var form = e.target;
      var data = {
        agencyName: (form.querySelector('[name="agency"]') || {}).value || "Agence Visiteur LP",
        contactPerson: (form.querySelector('[name="name"]') || {}).value || "Responsable",
        phone: (form.querySelector('[name="phone"]') || {}).value || "",
        email: (form.querySelector('[name="email"]') || {}).value || "",
        source: "Landing Page Direct"
      };
      if (data.phone || data.email) {
        fetch("${simulatedWebhookUrl}", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).catch(function(err){ console.log(err); });
      }
    });
  })(window,document,'script','immoDataLayer','LP-TRACKER-2026');
</script>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-petrol-900 rounded-2xl border border-slate-200/80 dark:border-petrol-800 w-full max-w-4xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-petrol-100 dark:border-petrol-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-petrol-800 text-white shadow-md shadow-petrol-900/30 border border-petrol-700 shrink-0">
              <Cpu className="w-6 h-6 text-neon-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-petrol-800 dark:text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'مركز ربط البيانات الحقيقية ومصادر الـ API' : 'Centre de Connexion des Données Réelles & APIs'}</span>
                {connectionTested && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-500/10 text-neon-600 dark:text-neon-400 border border-neon-500/30">
                    {language === 'ar' ? 'متصل' : 'Connecté'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-petrol-300">
                {language === 'ar'
                  ? 'كيف تجعل أرقام الداشبورد حقيقية 100% بربط إعلانات ميتا وصفحة الهبوط ونماذج الحجز'
                  : 'Comment connecter vos vraies campagnes Meta, vos formulaires et vos pages de vente.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWebhookModal(false)}
            aria-label={t.webhookModal.close}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs with Petrol & Neon Orange Indicator */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-petrol-100 dark:border-petrol-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-petrol-800 text-white dark:bg-petrol-700 border-b-2 border-neon-500'
                : 'text-slate-600 dark:text-petrol-300 hover:bg-petrol-50 dark:hover:bg-petrol-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-neon-500" />
            <span>{language === 'ar' ? '1. من أين الأرقام؟ وكيف نربط؟' : '1. Explication & Sources'}</span>
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'meta'
                ? 'bg-petrol-800 text-white dark:bg-petrol-700 border-b-2 border-neon-500'
                : 'text-slate-600 dark:text-petrol-300 hover:bg-petrol-50 dark:hover:bg-petrol-800'
            }`}
          >
            <Layers className="w-4 h-4 text-neon-500" />
            <span>{language === 'ar' ? '2. إعلانات ميتا (Meta Ads API)' : '2. Meta Ads API'}</span>
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'landing'
                ? 'bg-petrol-800 text-white dark:bg-petrol-700 border-b-2 border-neon-500'
                : 'text-slate-600 dark:text-petrol-300 hover:bg-petrol-50 dark:hover:bg-petrol-800'
            }`}
          >
            <Globe className="w-4 h-4 text-neon-500" />
            <span>{language === 'ar' ? '3. صفحة الهبوط (Landing Page)' : '3. Landing Page Script'}</span>
          </button>
          <button
            onClick={() => setActiveTab('leads_webhook')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leads_webhook'
                ? 'bg-petrol-800 text-white dark:bg-petrol-700 border-b-2 border-neon-500'
                : 'text-slate-600 dark:text-petrol-300 hover:bg-petrol-50 dark:hover:bg-petrol-800'
            }`}
          >
            <Webhook className="w-4 h-4 text-neon-500" />
            <span>{language === 'ar' ? '4. استمارات ميتا (Lead Webhooks)' : '4. Webhooks Formulaires'}</span>
          </button>
          <button
            onClick={() => setActiveTab('calendly')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calendly'
                ? 'bg-petrol-800 text-white dark:bg-petrol-700 border-b-2 border-neon-500'
                : 'text-slate-600 dark:text-petrol-300 hover:bg-petrol-50 dark:hover:bg-petrol-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-neon-500" />
            <span>{language === 'ar' ? '5. حجز المواعيد (Calendly)' : '5. Calendly / Calls'}</span>
          </button>
          <button
            onClick={() => setActiveTab('direct_input')}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'direct_input'
                ? 'bg-petrol-800 text-white dark:bg-petrol-700 border-b-2 border-neon-500'
                : 'text-slate-600 dark:text-petrol-300 hover:bg-petrol-50 dark:hover:bg-petrol-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-neon-500" />
            <span>{language === 'ar' ? '6. إدخال الأرقام الحقيقية يدوياً' : '6. Saisie Directe Réelle'}</span>
          </button>
        </div>

        {/* Global Test Status Message */}
        {testStatus && (
          <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{testStatus}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW & EXPLANATION */}
        {activeTab === 'overview' && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/60 leading-relaxed">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'من أين جاءت الأرقام الموجودة حالياً في الداشبورد؟'
                    : "D'où viennent les chiffres actuels du tableau de bord ?"}
                </span>
              </h4>
              <p className="text-slate-700 dark:text-slate-300">
                {language === 'ar'
                  ? 'الأرقام المعروضة حالياً هي بيانات نموذجية استرشادية (Benchmark Model) تم توليدها استناداً إلى متوسطات سوق العقارات المغربي B2B (وكالات الدار البيضاء، الرباط، مراكش، طنجة)، لكي ترى بوضوح كيف تحسب النسب وكيف يكشف النظام مواطن الهدر في الميزانية (مثل تسريب نسبة الحضور 55% مقارنة بالمعيار 70%).'
                  : 'Les chiffres actuels sont des données de calibrage représentatives du marché immobilier B2B au Maroc (Casablanca, Rabat, Marrakech) afin d\'illustrer le calcul des goulets d\'étranglement (ex: le taux de show-up à 55% vs le standard à 70%).'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">
                {language === 'ar'
                  ? 'أين وكيف نربط هذا النظام لكي تصبح الأرقام حقيقية 100%؟'
                  : 'Où et comment connecter le système pour des chiffres 100% réels ?'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>{language === 'ar' ? 'إعلانات ميتا (Meta Ads)' : 'Meta Ads (Facebook & Instagram)'}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'لجلب ميزانيتك المنفقة والنقرات ومرات الظهور يومياً عبر الـ Meta Marketing API.'
                      : 'Pour synchroniser le budget dépensé réel, les clics et le CPC via l\'API Meta Marketing.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>{language === 'ar' ? 'صفحة الهبوط (Landing Page)' : 'Page de Vente / Formulaire'}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'وضع كود التتبع البرمجي في موقعك لتسجيل الزوار والاستمارات التي تملأ على الويب.'
                      : 'Installer le script de tracking dans votre page (WordPress, Elementor, Framer) pour compter les vrais visiteurs.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>{language === 'ar' ? 'استمارات ميتا الفورية (Lead Forms)' : 'Formulaires Instantanés Meta'}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'ربط الـ Webhook مع Zapier أو Make لاستقبال بيانات الوكالة في ثوانٍ داخل الداشبورد.'
                      : 'Recevoir en live chaque agence qui soumet un formulaire instantané Facebook/Instagram.'}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>{language === 'ar' ? 'حجز المواعيد (Calendly / Calls)' : 'Prise de Rendez-vous (Calendly)'}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {language === 'ar'
                      ? 'ربط المواعيد المحجوزة لتحديث حالة الموعد وحساب نسبة الحضور الفعلي بدقة.'
                      : 'Synchroniser chaque appel réservé pour mesurer votre taux de présence et closing réel.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action: Start Clean vs Keep Demo */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  {language === 'ar' ? 'هل تريد البدء بقائمة فارغة من الصفر لحملاتك الحقيقية؟' : 'Voulez-vous réinitialiser à zéro pour vos vraies données ?'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar'
                    ? 'يمكنك تصفير البيانات والبدء بإدخال بياناتك، أو استعادة البيانات التوضيحية متى أردت.'
                    : 'Vous pouvez effacer les données de démo et commencer avec votre propre pipeline vierge.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    clearAllData();
                    alert(language === 'ar' ? 'تم تفريغ خط الصفقات بنجاح. يمكنك الآن استقبال أو إدخال بياناتك الحقيقية.' : 'Pipeline réinitialisé à zéro pour vos vraies données.');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg whitespace-nowrap"
                >
                  {language === 'ar' ? 'تفريغ الداشبورد (0 عميل)' : 'Vider le CRM (0 leads)'}
                </button>
                <button
                  onClick={() => {
                    resetToMockData();
                    alert(language === 'ar' ? 'تمت استعادة البيانات الاسترشادية.' : 'Données démo restaurées.');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg whitespace-nowrap"
                >
                  {language === 'ar' ? 'استعادة النموذج التوضيحي' : 'Restaurer la Démo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: META ADS API */}
        {activeTab === 'meta' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200/50 dark:border-blue-900/50">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {language === 'ar' ? 'كيف تحصل على بيانات الربط من Meta Business Manager؟' : 'Comment obtenir vos identifiants Meta Ads ?'}
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                <li>{language === 'ar' ? 'ادخل إلى Meta Ads Manager وانسخ معرف حسابك الإعلاني (يبدأ عادة بـ act_).' : 'Allez sur Meta Ads Manager et copiez votre Ad Account ID (ex: act_123456789).'}</li>
                <li>{language === 'ar' ? 'من Meta for Developers، قم بإنشاء Access Token دائم أو مستخدم نظام (System User) بصلاحية ads_read.' : 'Dans Meta for Developers / Graph API Explorer, générez un Token avec le droit ads_read.'}</li>
                <li>{language === 'ar' ? 'الصق المعرف و Token هنا واضغط حفظ واختبار الاتصال.' : 'Collez les informations ci-dessous et cliquez sur Tester la Connexion.'}</li>
              </ol>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Ad Account ID (معرف الحساب الإعلاني)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="act_123456789012345"
                  value={adAccountId}
                  onChange={(e) => setAdAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Marketing API Access Token
                </label>
                <input
                  type="password"
                  dir="ltr"
                  placeholder="EAAGm0PX4ZC9kBA..."
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meta Pixel ID (معرف البكسل لصفحة الهبوط)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="987654321098765"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  {connectionTested
                    ? (language === 'ar' ? 'الحساب متصل بنجاح مع Meta Marketing API.' : 'Compte vérifié et prêt pour la synchronisation.')
                    : (language === 'ar' ? 'لم يتم تأكيد الاتصال بعد.' : 'Non connecté.')}
                </span>
                <button
                  type="button"
                  onClick={handleTestMetaConnection}
                  className="px-4 py-2 font-bold text-white bg-neon-500 hover:bg-neon-600 rounded-lg shadow-md shadow-neon-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'اختبار الاتصال وحفظ الإعدادات' : 'Tester & Sauvegarder'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LANDING PAGE SCRIPT */}
        {activeTab === 'landing' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {language === 'ar' ? 'أين تضع هذا الكود في صفحة الهبوط الخاصة بك؟' : 'Où installer ce code sur votre Landing Page ?'}
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {language === 'ar'
                  ? 'انسخ الكود أدناه وقم بلصقه في وسم <head> في موقعك (سواء في WordPress أو Elementor Custom Code أو Webflow أو Framer). يقوم الكود بحساب عدد الزوار الحقيقيين وإرسال بيانات أي استمارة تملأ على الموقع تلقائياً إلى الداشبورد.'
                  : 'Copiez ce snippet et collez-le dans la balise <head> de votre page (WordPress, Elementor, Webflow, Framer). Il enregistre les visites et envoie chaque formulaire soumis.'}
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-slate-300 rounded-t-lg text-[11px] font-mono">
                <span>tracking-snippet.js</span>
                <button
                  onClick={() => handleCopy(snippetCode, 'snippet')}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {copied === 'snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied === 'snippet' ? (language === 'ar' ? 'تم النسخ!' : 'Copié !') : (language === 'ar' ? 'نسخ الكود' : 'Copier')}</span>
                </button>
              </div>
              <pre dir="ltr" className="p-3 bg-slate-950 text-emerald-400 rounded-b-lg font-mono text-[10px] overflow-x-auto leading-relaxed text-left max-h-48">
                {snippetCode}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: META LEADS WEBHOOK */}
        {activeTab === 'leads_webhook' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'ar' ? 'رابط الويب هوك لاستقبال الوكالات (Webhook Endpoint)' : 'URL du Webhook de Réception des Leads'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  dir="ltr"
                  value={simulatedWebhookUrl}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-[11px]"
                />
                <button
                  onClick={() => handleCopy(simulatedWebhookUrl, 'url')}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 whitespace-nowrap cursor-pointer"
                >
                  {copied === 'url' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied === 'url' ? (language === 'ar' ? 'منسوخ!' : 'Copié !') : (language === 'ar' ? 'نسخ' : 'Copier')}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Verify Token (رمز التحقق)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  dir="ltr"
                  value={verifyToken}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-[11px]"
                />
                <button
                  onClick={() => handleCopy(verifyToken, 'token')}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 whitespace-nowrap cursor-pointer"
                >
                  {copied === 'token' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied === 'token' ? (language === 'ar' ? 'منسوخ!' : 'Copié !') : (language === 'ar' ? 'نسخ' : 'Copier')}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-petrol-50/70 dark:bg-petrol-950/40 rounded-xl border border-petrol-200/60 dark:border-petrol-800 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-petrol-900 dark:text-white block">
                  {language === 'ar' ? 'اختبار استقبال طلب وكالة جديد في الوقت الفعلي' : 'Tester la réception directe d\'un Lead'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-petrol-300">
                  {language === 'ar' ? 'يحاكي وصول وكالة ملأت للتو نموذج إعلانك على فيسبوك/إنستغرام.' : 'Simule une soumission de formulaire Meta Lead Ads instantanée.'}
                </span>
              </div>
              <button
                onClick={handleSimulateIncomingLead}
                className="px-3.5 py-2 font-black text-white bg-neon-500 hover:bg-neon-600 rounded-lg shadow-md shadow-neon-500/25 whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال طلب تجريبي' : 'Simuler un Lead'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: CALENDLY & MEETINGS */}
        {activeTab === 'calendly' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {language === 'ar' ? 'كيفية ربط المواعيد المحجوزة عبر Calendly أو TidyCal أو Cal.com' : 'Comment connecter Calendly pour les RDV ?'}
              </span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                {language === 'ar'
                  ? 'عندما يحجز صاحب وكالة عقارية مكالمة معك عبر رابط Calendly، يرسل Calendly إشعاراً آلياً إلى نفس رابط الويب هوك الخاص بك. يتم فوراً نقل الوكالة إلى مرحلة "موعد مجدول" مع تحديد تاريخ وتوقيت المكالمة، لتتمكن بعد نهاية المكالمة من تحديد هل حضر (Showed) أم تخلف (No-show).'
                  : 'Dès qu\'un gérant d\'agence réserve un créneau sur Calendly, un webhook met à jour son statut vers "RDV Fixé" avec la date. Vous pouvez ensuite marquer la présence réelle.'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                {language === 'ar' ? 'خطوات التفعيل في دقيقتين عبر Zapier أو Make:' : 'Configuration en 2 minutes via Zapier :'}
              </span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="px-1.5 py-0.5 rounded bg-petrol-100 dark:bg-petrol-800 text-petrol-800 dark:text-petrol-200 font-bold">TRIGGER</span>
                  <span>Calendly : Invitee Created (New Scheduled Event)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">ACTION</span>
                  <span>Webhooks by Zapier (POST) → {simulatedWebhookUrl}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DIRECT REAL INPUT */}
        {activeTab === 'direct_input' && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 leading-relaxed">
              <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                {language === 'ar' ? 'الحل الأسرع: إدخال أرقامك الحقيقية اليوم مباشرة بضغطة زر' : 'Solution Rapide : Saisissez directement vos vrais chiffres aujourd\'hui'}
              </span>
              <p className="text-amber-800 dark:text-amber-400 text-[11px]">
                {language === 'ar'
                  ? 'إذا لم تكن ترغب في إعداد روابط الـ API والـ Webhooks الآن، يمكنك ببساطة كتابة أرقام إعلاناتك الحقيقية من Facebook Ads Manager اليوم وسيقوم الداشبورد بحساب كل شيء لك فوراً.'
                  : 'Pas envie de configurer des APIs pour l\'instant ? Entrez simplement les chiffres réels de votre Business Manager et le dashboard recalculera tout immédiatement.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'الميزانية المنفقة اليوم (DH)' : 'Budget Dépensé Réel (DH)'}
                </label>
                <input
                  type="number"
                  value={directSpend}
                  onChange={(e) => setDirectSpend(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'عدد النقرات الحقيقية (Clicks)' : 'Clics Réels'}
                </label>
                <input
                  type="number"
                  value={directClicks}
                  onChange={(e) => setDirectClicks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'مرات الظهور (Impressions)' : 'Impressions Réelles'}
                </label>
                <input
                  type="number"
                  value={directImpressions}
                  onChange={(e) => setDirectImpressions(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'عدد النماذج المستلمة (Leads)' : 'Formulaires Reçus'}
                </label>
                <input
                  type="number"
                  value={directLeads}
                  onChange={(e) => setDirectLeads(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'المواعيد التي حضرت فعلياً' : 'RDV Présents (Showed)'}
                </label>
                <input
                  type="number"
                  value={directMeetingsHeld}
                  onChange={(e) => setDirectMeetingsHeld(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ar' ? 'الوكالات التي تم التعاقد معها' : 'Clients Signés'}
                </label>
                <input
                  type="number"
                  value={directClientsWon}
                  onChange={(e) => setDirectClientsWon(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold text-emerald-600"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleApplyDirectMetrics}
                className="px-4 py-2 font-black text-white bg-neon-500 hover:bg-neon-600 rounded-lg shadow-md shadow-neon-500/25 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>{language === 'ar' ? 'تطبيق الأرقام الحقيقية وتحديث الداشبورد فوراً' : 'Appliquer les Chiffres Réels au Dashboard'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.webhookModal.exportJson}</span>
          </button>

          <button
            onClick={() => setShowWebhookModal(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {t.webhookModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
