import React from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Clock,
  Check,
} from 'lucide-react';
import { ClientStage, AutomationWorkflowType } from '../../types/agency';
import { translations } from '../../translations';

export const ClientDetailDrawer: React.FC = () => {
  const {
    selectedClient,
    setSelectedClientId,
    updateClient,
    start7DayTrial,
    acceptTrialAndCloseDeal,
    updateDeliveryProgress,
    activateMonthlyRetainer,
    invoices,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  if (!selectedClient) return null;

  const clientInvoices = invoices.filter((i) => i.clientId === selectedClient.id);

  // Trial countdown calculation
  let trialRemainingHours = null;
  let trialRemainingDays = null;
  if (selectedClient.stage === 'trial_7_days' && selectedClient.trialEndDate) {
    const diffMs = new Date(selectedClient.trialEndDate).getTime() - Date.now();
    trialRemainingHours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
    trialRemainingDays = Math.ceil(trialRemainingHours / 24);
  }

  const workflowsConfig: Record<
    'ar' | 'fr' | 'en',
    Array<{ key: AutomationWorkflowType; name: string }>
  > = {
    ar: [
      { key: 'whatsapp_instant_lead', name: 'إشعار واتساب ترحيبي فوري خلال 60 ثانية' },
      { key: 'google_calendar_sync', name: 'مزامنة تقويم المعاينات السحابي تلقائياً' },
      { key: 'lead_qualification_bot', name: 'روبوت تأهيل وتصنيف المشترين الجادين' },
      { key: 'meta_instant_forms', name: 'ربط استمارات ونماذج ميتا الفورية' },
      { key: 'crm_pipeline_sync', name: 'مزامنة بيانات نظام إدارة العلاقات والصفقات' },
    ],
    fr: [
      { key: 'whatsapp_instant_lead', name: 'Notification WhatsApp instantanée (60s)' },
      { key: 'google_calendar_sync', name: 'Synchronisation agenda des visites' },
      { key: 'lead_qualification_bot', name: 'Bot de qualification des acheteurs' },
      { key: 'meta_instant_forms', name: 'Intégration formulaires Meta Ads' },
      { key: 'crm_pipeline_sync', name: 'Synchronisation du CRM' },
    ],
    en: [
      { key: 'whatsapp_instant_lead', name: 'Instant WhatsApp alert within 60s' },
      { key: 'google_calendar_sync', name: 'Calendar appointment auto-sync' },
      { key: 'lead_qualification_bot', name: 'Buyer automated qualification bot' },
      { key: 'meta_instant_forms', name: 'Meta instant forms direct webhook' },
      { key: 'crm_pipeline_sync', name: 'CRM pipeline synchronization' },
    ],
  };

  const currentWorkflows = workflowsConfig[language] || workflowsConfig.ar;

  const getLocalizedPackageName = (tier: string) => {
    if (tier === 'starter') return t.starterPackage;
    if (tier === 'growth') return t.growthPackage;
    return t.enterprisePackage;
  };

  return (
    <div
      dir={direction}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto ${
        direction === 'rtl' ? 'text-right' : 'text-left'
      }`}
    >
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400 font-mono font-bold text-lg shrink-0">
              {selectedClient.agencyName.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-orange-500 text-white border border-orange-400">
                  {getLocalizedPackageName(selectedClient.packageTier)}
                </span>
                <span className="text-xs text-slate-300">
                  {selectedClient.city} • {language === 'ar' ? 'تاريخ التسجيل:' : language === 'fr' ? 'Inscrit le :' : 'Registered:'}{' '}
                  {new Date(selectedClient.createdAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {selectedClient.agencyName}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span>
                  {language === 'ar' ? 'المسؤول:' : language === 'fr' ? 'Contact :' : 'Contact:'}{' '}
                  <strong className="text-white">{selectedClient.contactPerson}</strong>
                </span>
                <span>•</span>
                <span dir="ltr" className="font-mono">{selectedClient.phone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedClientId(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* 1. Pricing & Deal Terms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">{t.colSetupFeeCollected}</span>
              <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                {selectedClient.setupFee.toLocaleString()} {t.mad}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'ar'
                  ? 'تدفع لمرة واحدة عند بدء تنفيذ المنظومة'
                  : language === 'fr'
                  ? 'Payable une seule fois au lancement'
                  : 'One-time onboarding fee'}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold block">{t.colMonthlyRetainer}</span>
              <span className="text-lg font-bold font-mono text-emerald-900 mt-1 block">
                {selectedClient.monthlyRetainer.toLocaleString()} {t.perMonth}
              </span>
              <span className="text-[10px] text-emerald-700">
                {language === 'ar'
                  ? 'اشتراك شهري للصيانة والتحديث المستمر'
                  : language === 'fr'
                  ? 'Abonnement mensuel de maintenance'
                  : 'Recurring monthly maintenance'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 font-bold block">{t.colStage}</span>
              <div className="mt-1">
                <select
                  value={selectedClient.stage}
                  onChange={(e) => updateClient(selectedClient.id, { stage: e.target.value as ClientStage })}
                  className="w-full text-xs font-bold bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="ad_lead">{t.colAdLeadsTitle}</option>
                  <option value="meeting_scheduled">{t.colMeetingsTitle}</option>
                  <option value="trial_7_days">{t.colTrialTitle}</option>
                  <option value="delivery_in_progress">{t.colDeliveryTitle}</option>
                  <option value="active_retainer">{t.colRetainerTitle}</option>
                  <option value="lost">{t.colLostTitle}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. 7-DAY FREE TRIAL CONTROLLER */}
          <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950">
                    {language === 'ar'
                      ? 'مرحلة التجربة الميدانية المجانية (7 أيام)'
                      : language === 'fr'
                      ? 'Période d’essai gratuit de 7 jours'
                      : '7-Day Free Trial Phase'}
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    {language === 'ar'
                      ? 'تحصل الوكالة على تجربة عملية للتأكد من سرعة التقاط واستقبال العملاء المحتملين'
                      : language === 'fr'
                      ? 'L’agence teste l’automatisation en conditions réelles'
                      : 'The agency tests real lead response and booking automation'}
                  </p>
                </div>
              </div>

              {selectedClient.stage === 'trial_7_days' ? (
                <span className="px-3 py-1 bg-amber-500 text-white rounded-lg font-mono font-bold text-xs shadow-2xs">
                  {language === 'ar'
                    ? `متبقي ${trialRemainingDays} أيام (${trialRemainingHours} ساعة)`
                    : language === 'fr'
                    ? `${trialRemainingDays} jours restants (${trialRemainingHours}h)`
                    : `${trialRemainingDays} days left (${trialRemainingHours}h)`}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  {language === 'ar' ? 'غير نشطة حالياً' : language === 'fr' ? 'Inactive actuellement' : 'Inactive'}
                </span>
              )}
            </div>

            {selectedClient.stage === 'trial_7_days' ? (
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] text-slate-600 font-mono">
                  {language === 'ar' ? 'بدأت:' : language === 'fr' ? 'Début :' : 'Started:'}{' '}
                  {selectedClient.trialStartDate ? new Date(selectedClient.trialStartDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR') : '-'} •{' '}
                  {language === 'ar' ? 'تنتهي:' : language === 'fr' ? 'Fin :' : 'Ends:'}{' '}
                  {selectedClient.trialEndDate ? new Date(selectedClient.trialEndDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR') : '-'}
                </div>

                <button
                  onClick={() => acceptTrialAndCloseDeal(selectedClient.id)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-[#FF5500] hover:from-orange-600 hover:to-[#D93800] text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {language === 'ar'
                      ? 'تأكيد نجاح التجربة وتحصيل رسوم الإعداد'
                      : language === 'fr'
                      ? 'Valider l’essai & encaisser les frais d’installation'
                      : 'Accept Trial & Collect Setup Fee'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">
                  {language === 'ar'
                    ? 'هل ترغب في بدء فترة التجربة المجانية للوكالة؟'
                    : language === 'fr'
                    ? 'Voulez-vous activer l’essai gratuit de 7 jours ?'
                    : 'Activate 7-day free trial for this agency?'}
                </span>
                <button
                  onClick={() => start7DayTrial(selectedClient.id)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  {language === 'ar' ? 'بدء تجربة 7 أيام مجانية' : language === 'fr' ? 'Lancer l’essai de 7 jours' : 'Start 7-Day Trial'}
                </button>
              </div>
            )}
          </div>

          {/* 3. AUTOMATION DELIVERY CONTROLLER */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {language === 'ar'
                    ? 'متابعة برمجة وتسليم منظومة الأوتوميشن'
                    : language === 'fr'
                    ? 'Suivi du déploiement de l’automatisation'
                    : 'Automation Delivery Progress'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {language === 'ar'
                    ? 'السيناريوهات المعتمدة ومعدل الإنجاز قبل التسليم النهائي'
                    : language === 'fr'
                    ? 'Scénarios configurés et avancement avant livraison finale'
                    : 'Configured workflows and progress before go-live'}
                </p>
              </div>
              <span className="font-mono font-bold text-purple-700 text-sm">
                {selectedClient.deliveryProgressPct || 0}%
              </span>
            </div>

            {/* Slider */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full rounded-full transition-all"
                style={{ width: `${selectedClient.deliveryProgressPct || 0}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-semibold">
                {language === 'ar' ? 'تحديث نسبة الإنجاز:' : language === 'fr' ? 'Mettre à jour l’avancement :' : 'Update progress:'}
              </span>
              <div className="flex items-center gap-1">
                {[0, 25, 50, 75, 100].map((step) => (
                  <button
                    key={step}
                    onClick={() => updateDeliveryProgress(selectedClient.id, step)}
                    className={`px-2.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                      (selectedClient.deliveryProgressPct || 0) === step
                        ? 'bg-purple-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {step}%
                  </button>
                ))}
              </div>
            </div>

            {/* Workflows checklist */}
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800 block mb-1.5">
                {language === 'ar'
                  ? 'السيناريوهات والمسارات المفعلة للوكالة:'
                  : language === 'fr'
                  ? 'Scénarios activés pour l’agence :'
                  : 'Active Automation Workflows:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentWorkflows.map((wf) => {
                  const isChecked = selectedClient.workflowsEnabled?.includes(wf.key);
                  return (
                    <label key={wf.key} className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const current = selectedClient.workflowsEnabled || [];
                          const next = isChecked
                            ? current.filter((k) => k !== wf.key)
                            : [...current, wf.key];
                          updateClient(selectedClient.id, { workflowsEnabled: next });
                        }}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-[11px] font-medium text-slate-800">{wf.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Button to complete and start retainer */}
            {selectedClient.stage !== 'active_retainer' && (
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => activateMonthlyRetainer(selectedClient.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  {language === 'ar'
                    ? 'اكتمل التسليم وتفعيل اشتراك الصيانة الشهرية'
                    : language === 'fr'
                    ? 'Livraison terminée (100%) & Activer la maintenance'
                    : 'Complete Delivery (100%) & Activate Retainer'}
                </button>
              </div>
            )}
          </div>

          {/* 4. Invoices History */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              {language === 'ar' ? 'سجل الفواتير والمدفوعات' : language === 'fr' ? 'Historique des factures' : 'Invoices & Billing'}
            </h4>

            {clientInvoices.length === 0 ? (
              <p className="text-slate-400 text-center py-3">
                {language === 'ar' ? 'لا توجد فواتير سابقة مسجلة.' : language === 'fr' ? 'Aucune facture enregistrée.' : 'No invoices recorded.'}
              </p>
            ) : (
              <div className="space-y-2">
                {clientInvoices.map((inv) => (
                  <div key={inv.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{inv.invoiceNumber}</span>
                      <span className="text-[10px] text-slate-500 mx-2">
                        {inv.type === 'setup_fee' ? t.kpiSetupCash : t.kpiRetainerMRR}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">{inv.amount.toLocaleString()} {t.mad}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status === 'paid' ? t.paid : t.pending}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Notes */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h4 className="text-xs font-bold text-slate-900">
              {language === 'ar' ? 'سجل الملاحظات والمتابعة' : language === 'fr' ? 'Notes et suivi' : 'Notes & Follow-up'}
            </h4>
            <textarea
              rows={3}
              value={selectedClient.notes}
              onChange={(e) => updateClient(selectedClient.id, { notes: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:border-orange-500"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            {language === 'ar' ? 'ملف رقم:' : language === 'fr' ? 'Réf. :' : 'Ref:'} {selectedClient.id}
          </span>
          <button
            onClick={() => setSelectedClientId(null)}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer shadow-2xs"
          >
            {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
