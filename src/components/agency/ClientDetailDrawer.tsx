import React, { useState, useEffect } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  X,
  Clock,
  Check,
  FileText,
  Plus,
  Pin,
  Trash2,
  Calendar,
  User,
  PhoneCall,
  MessageSquare,
  FileSignature,
  StickyNote,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckCircle2,
  Receipt,
  Power,
} from 'lucide-react';
import { ClientStage, AutomationWorkflowType, NoteType, ClientNoteEntry, ExpenseCategory } from '../../types/agency';
import { translations } from '../../translations';
import {
  EXPENSE_PRESETS,
  EXPENSE_CATEGORY_LABELS,
  calcClientExpenseStats,
} from '../../utils/expenseHelpers';

const notesTranslations = {
  ar: {
    sectionTitle: 'سجل ملخصات الاجتماعات ومتابعات العميل',
    sectionDesc: 'توثيق دائم لكافة تفاصيل جلسات الاستشارة، الاتفاقات، ومواعيد المتابعة القادمة',
    addNoteBtn: '+ تدوين ملخص / متابعة جديدة',
    filterAll: 'كافة السجلات',
    filterMeetings: 'ملخصات الاجتماعات',
    filterFollowUps: 'متابعات هاتفية',
    filterWhatsApp: 'مراسلات واتساب',
    filterContracts: 'عقود وعروض أسعار',
    typeMeeting: 'ملخص اجتماع',
    typeFollowUp: 'متابعة هاتفية',
    typeCall: 'مكالمة استفسار',
    typeWhatsApp: 'محادثة واتساب',
    typeContract: 'عقد وعرض أسعار',
    typeGeneral: 'ملاحظة عامة',
    formHeading: 'تدوين ملخص اجتماع أو متابعة جديدة',
    formTitleLabel: 'عنوان المتابعة أو الاجتماع:',
    formTitlePlaceholder: 'مثال: ملخص جلسة مناقشة باقة النمو وحجز المعاينات...',
    formAuthorLabel: 'المسؤول عن التدوين:',
    formAuthorPlaceholder: 'اسم مستشار المبيعات أو المتابع...',
    formContentLabel: 'تفاصيل ما دار في الاجتماع والقرارات المتفق عليها:',
    formContentPlaceholder: 'سجل أهم النقاط، أسئلة العميل، العقارات المستهدفة، والخطوات المتفق عليها...',
    formOutcomeLabel: 'النتيجة / الإجراء المتفق عليه (اختياري):',
    formOutcomePlaceholder: 'مثال: وافق على بدء تجربة 7 أيام المجانية...',
    formFollowUpDateLabel: 'تاريخ المتابعة القادمة (اختياري):',
    formPinLabel: 'تثبيت هذه الملاحظة في أعلى السجل للأهمية القصوى',
    btnSaveNote: 'حفظ الملاحظة في السجل',
    btnCancel: 'إلغاء',
    emptyHistory: 'لا توجد ملاحظات أو متابعات مسجلة بعد لهذا العميل.',
    emptyHistorySub: 'اضغط على زر تدوين ملخص اجتماع أعلاه لبدء توثيق سجل المتابعات.',
    pinnedBadge: 'مثبتة في الأعلى',
    byStaff: 'بواسطة:',
    outcomeTag: 'النتيجة المباشرة:',
    nextFollowUpTag: 'موعد المتابعة القادم:',
    deleteConfirm: 'هل أنت متأكد من حذف هذه الملاحظة نهائياً من السجل؟',
    quickScratchpadTitle: 'الملاحظات السريعة الدائمة للوكالة',
    quickScratchpadDesc: 'ملخص عام وملاحظات موجزة تظهر فورياً في لوحة التحكم',
    quickScratchpadSaved: 'تم الحفظ تلقائياً',
  },
  fr: {
    sectionTitle: 'Historique des réunions et suivis du client',
    sectionDesc: 'Journalisation persistante des synthèses de réunions, accords et rappels',
    addNoteBtn: '+ Ajouter un compte-rendu / suivi',
    filterAll: 'Tous les enregistrements',
    filterMeetings: 'Comptes-rendus de réunions',
    filterFollowUps: 'Suivis téléphoniques',
    filterWhatsApp: 'Échanges WhatsApp',
    filterContracts: 'Contrats & Devis',
    typeMeeting: 'Compte-rendu de réunion',
    typeFollowUp: 'Suivi commercial',
    typeCall: 'Appel téléphonique',
    typeWhatsApp: 'Message WhatsApp',
    typeContract: 'Contrat & Devis',
    typeGeneral: 'Note générale',
    formHeading: 'Nouveau compte-rendu ou suivi',
    formTitleLabel: 'Titre du compte-rendu ou suivi :',
    formTitlePlaceholder: 'Ex : Synthèse réunion forfait Growth...',
    formAuthorLabel: 'Rédacteur / Responsable :',
    formAuthorPlaceholder: 'Nom du conseiller ou gestionnaire...',
    formContentLabel: 'Détails de l’échange et points d’accord :',
    formContentPlaceholder: 'Points clés abordés, questions du client, décisions prises...',
    formOutcomeLabel: 'Résultat / Prochaine étape (optionnel) :',
    formOutcomePlaceholder: 'Ex : Accord pour lancer l’essai de 7 jours...',
    formFollowUpDateLabel: 'Date du prochain suivi (optionnel) :',
    formPinLabel: 'Épingler cette note en haut de la liste',
    btnSaveNote: 'Enregistrer dans le journal',
    btnCancel: 'Annuler',
    emptyHistory: 'Aucune note ou suivi enregistré pour cette agence.',
    emptyHistorySub: 'Cliquez sur le bouton ci-dessus pour consigner votre premier compte-rendu.',
    pinnedBadge: 'Épinglé en haut',
    byStaff: 'Par :',
    outcomeTag: 'Résultat :',
    nextFollowUpTag: 'Prochain suivi prévu :',
    deleteConfirm: 'Confirmer la suppression définitive de cette note ?',
    quickScratchpadTitle: 'Bloc-notes permanent de l’agence',
    quickScratchpadDesc: 'Résumé global et contexte rapide visible sur le tableau de bord',
    quickScratchpadSaved: 'Enregistré automatiquement',
  },
  en: {
    sectionTitle: 'Meeting Summaries & Follow-up History',
    sectionDesc: 'Persistent staff logging for meeting notes, agreed terms, and follow-up touchpoints',
    addNoteBtn: '+ Log Meeting Summary / Follow-up',
    filterAll: 'All Logs',
    filterMeetings: 'Meeting Summaries',
    filterFollowUps: 'Follow-ups & Calls',
    filterWhatsApp: 'WhatsApp Logs',
    filterContracts: 'Contracts & Proposals',
    typeMeeting: 'Meeting Summary',
    typeFollowUp: 'Follow-up Call',
    typeCall: 'Inquiry Call',
    typeWhatsApp: 'WhatsApp Chat',
    typeContract: 'Contract & Proposal',
    typeGeneral: 'General Note',
    formHeading: 'Log Meeting Summary or Follow-up',
    formTitleLabel: 'Title / Subject:',
    formTitlePlaceholder: 'e.g. Growth Package consultation review...',
    formAuthorLabel: 'Staff Member / Author:',
    formAuthorPlaceholder: 'Staff member name or role...',
    formContentLabel: 'Meeting Details, Discussion & Agreements:',
    formContentPlaceholder: 'Key points discussed, client questions, agreements, objections...',
    formOutcomeLabel: 'Outcome / Action Item (Optional):',
    formOutcomePlaceholder: 'e.g. Agreed to start 7-Day Free Trial...',
    formFollowUpDateLabel: 'Next Follow-up Date (Optional):',
    formPinLabel: 'Pin this note to the top',
    btnSaveNote: 'Save to Client History',
    btnCancel: 'Cancel',
    emptyHistory: 'No notes or meeting summaries logged yet for this client.',
    emptyHistorySub: 'Click the button above to log your first meeting summary or follow-up note.',
    pinnedBadge: 'Pinned to Top',
    byStaff: 'By:',
    outcomeTag: 'Direct Outcome:',
    nextFollowUpTag: 'Next Follow-up:',
    deleteConfirm: 'Are you sure you want to permanently delete this note?',
    quickScratchpadTitle: 'Permanent Quick Brief & Scratchpad',
    quickScratchpadDesc: 'General overview and notes synced directly to the dashboard',
    quickScratchpadSaved: 'Auto-saved',
  },
};

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
    addClientNote,
    deleteClientNote,
    togglePinNote,
    addClientExpense,
    toggleClientExpenseActive,
    deleteClientExpense,
  } = useAgency();

  const t = translations[language];
  const nt = notesTranslations[language] || notesTranslations.ar;

  // Form State for new note
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>('meeting_summary');
  const [noteTitle, setNoteTitle] = useState('');
  const defaultAuthorForLang = (lang: 'ar' | 'fr' | 'en') =>
    lang === 'ar' ? 'فريق المتابعة والاستشارات' : lang === 'fr' ? 'Équipe Conseil & Suivi' : 'Agency Staff';
  const [noteAuthor, setNoteAuthor] = useState(() => defaultAuthorForLang(language));
  const [noteContent, setNoteContent] = useState('');
  const [noteOutcome, setNoteOutcome] = useState('');
  const [noteFollowUpDate, setNoteFollowUpDate] = useState('');
  const [noteIsPinned, setNoteIsPinned] = useState(false);

  useEffect(() => {
    setNoteAuthor((prev) => {
      if (
        prev === 'فريق المتابعة والاستشارات' ||
        prev === 'Équipe Conseil & Suivi' ||
        prev === 'Agency Staff'
      ) {
        return defaultAuthorForLang(language);
      }
      return prev;
    });
  }, [language]);

  // Filter State
  const [notesFilter, setNotesFilter] = useState<string>('all');

  // Quick scratchpad feedback
  const [quickSaved, setQuickSaved] = useState(false);

  // Per-client Subscriptions & Expenses inline form
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expName, setExpName] = useState('');
  const [expProvider, setExpProvider] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('whatsapp_api');
  const [expBillingCycle, setExpBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expAmountInput, setExpAmountInput] = useState('300');

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

  // Submit new note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    addClientNote(selectedClient.id, {
      clientId: selectedClient.id,
      type: noteType,
      title: noteTitle.trim(),
      author: noteAuthor.trim() || (language === 'ar' ? 'فريق العمل' : language === 'fr' ? 'Équipe' : 'Staff'),
      content: noteContent.trim(),
      outcome: noteOutcome.trim() || undefined,
      followUpDate: noteFollowUpDate || undefined,
      isPinned: noteIsPinned,
    });

    // Reset Form
    setNoteTitle('');
    setNoteContent('');
    setNoteOutcome('');
    setNoteFollowUpDate('');
    setNoteIsPinned(false);
    setIsAddingNote(false);
  };

  // Filter and sort notes
  const rawNotes = selectedClient.noteHistory || [];
  const filteredNotes = rawNotes.filter((n) => {
    if (notesFilter === 'all') return true;
    if (notesFilter === 'meeting_summary') return n.type === 'meeting_summary';
    if (notesFilter === 'follow_up') return n.type === 'follow_up' || n.type === 'call';
    if (notesFilter === 'whatsapp') return n.type === 'whatsapp';
    if (notesFilter === 'contract') return n.type === 'contract';
    return true;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getTypeBadge = (type: NoteType) => {
    switch (type) {
      case 'meeting_summary':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <FileText className="w-3 h-3 text-indigo-600" />
            <span>{nt.typeMeeting}</span>
          </span>
        );
      case 'follow_up':
      case 'call':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <PhoneCall className="w-3 h-3 text-blue-600" />
            <span>{nt.typeFollowUp}</span>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <MessageSquare className="w-3 h-3 text-emerald-600" />
            <span>{nt.typeWhatsApp}</span>
          </span>
        );
      case 'contract':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <FileSignature className="w-3 h-3 text-purple-600" />
            <span>{nt.typeContract}</span>
          </span>
        );
      case 'general':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <StickyNote className="w-3 h-3 text-slate-500" />
            <span>{nt.typeGeneral}</span>
          </span>
        );
    }
  };

  const handleScratchpadChange = (val: string) => {
    updateClient(selectedClient.id, { notes: val });
    setQuickSaved(true);
    setTimeout(() => setQuickSaved(false), 2000);
  };

  return (
    <div
      dir={direction}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto ${
        direction === 'rtl' ? 'text-right' : 'text-left'
      }`}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800 shrink-0">
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
                  {new Date(selectedClient.createdAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US')}
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
        <div className="p-5 overflow-y-auto flex-1 space-y-6 text-xs">
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
                  <option value="meeting_completed">{t.colAttendedTitle}</option>
                  <option value="meeting_no_show">{t.colNoShowTitle}</option>
                  <option value="trial_7_days">{t.colTrialTitle}</option>
                  <option value="delivery_in_progress">{t.colDeliveryTitle}</option>
                  <option value="negotiation_follow_up">{t.colFollowUpTitle}</option>
                  <option value="deal_won">{t.colRetainerTitle}</option>
                  <option value="active_retainer">{t.colRetainerTitle}</option>
                  <option value="lost">{t.colLostTitle}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 1B. CLIENT SUBSCRIPTIONS & REMAINING MAINTENANCE PROFIT */}
          {(() => {
            const stats = calcClientExpenseStats(selectedClient);
            const clientExpenses = selectedClient.expenses || [];
            const drawerExpCopy = {
              ar: {
                title: 'اشتراكات ومصاريف العميل وصافي مبلغ الصيانة',
                sub: 'كل ما يتم صرفه على أدوات الوكالة يُخصم مباشرة من الصيانة الشهرية',
                retainer: 'الصيانة الشهرية',
                spent: 'مصاريف الاشتراكات',
                remaining: 'المتبقي الصافي',
                addBtn: '+ إضافة اشتراك',
                cancelBtn: 'إلغاء',
                presets: 'اختيار سريع:',
                namePh: 'اسم الاشتراك أو الخدمة...',
                providerPh: 'المزود (مثال: 360dialog)...',
                monthly: 'شهري',
                yearly: 'سنوي',
                saveBtn: 'حفظ وخصم',
                empty: 'لا توجد مصاريف مسجلة — المتبقي الصافي يعادل 100% من مبلغ الصيانة.',
                activeTag: 'مفعل',
                pausedTag: 'متوقف',
                yearlyFormula: 'يخصم شهرياً:',
              },
              fr: {
                title: 'Abonnements du client & Bénéfice net de maintenance',
                sub: 'Chaque outil actif est déduit automatiquement du forfait mensuel',
                retainer: 'Maintenance',
                spent: 'Abonnements',
                remaining: 'Reste Net',
                addBtn: '+ Ajouter coût',
                cancelBtn: 'Annuler',
                presets: 'Modèles :',
                namePh: 'Nom de l’outil ou abonnement...',
                providerPh: 'Fournisseur (ex : OpenAI)...',
                monthly: 'Mensuel',
                yearly: 'Annuel',
                saveBtn: 'Enregistrer',
                empty: 'Aucune charge enregistrée — 100 % du forfait reste en marge nette.',
                activeTag: 'Actif',
                pausedTag: 'Pause',
                yearlyFormula: 'Déduit / mois :',
              },
              en: {
                title: 'Client Subscriptions & Remaining Maintenance Profit',
                sub: 'Recurring tools and API costs automatically deducted from the monthly retainer',
                retainer: 'Maintenance Fee',
                spent: 'Subscriptions',
                remaining: 'Net Remaining',
                addBtn: '+ Add Expense',
                cancelBtn: 'Cancel',
                presets: 'Quick presets:',
                namePh: 'Subscription or tool name...',
                providerPh: 'Provider (e.g. OpenAI)...',
                monthly: 'Monthly',
                yearly: 'Yearly',
                saveBtn: 'Save & Deduct',
                empty: 'No subscriptions logged — 100% of the maintenance retainer remains net profit.',
                activeTag: 'Active',
                pausedTag: 'Paused',
                yearlyFormula: 'Monthly deduction:',
              },
            }[language];

            const parsedAmt = Math.max(0, Number(expAmountInput) || 0);
            const normalizedMonthly =
              expBillingCycle === 'yearly' ? Math.round(parsedAmt / 12) : Math.round(parsedAmt);

            const handleDrawerAddExpense = (e: React.FormEvent) => {
              e.preventDefault();
              if (!expName.trim() || normalizedMonthly <= 0) return;
              addClientExpense(selectedClient.id, {
                name: expName.trim(),
                provider: expProvider.trim() || undefined,
                category: expCategory,
                monthlyCost: normalizedMonthly,
                billingCycle: expBillingCycle,
                isActive: true,
              });
              setExpName('');
              setExpProvider('');
              setExpAmountInput('300');
              setIsAddingExpense(false);
            };

            return (
              <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#FF6600]" />
                      <h3 className="text-sm font-bold text-slate-900">{drawerExpCopy.title}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{drawerExpCopy.sub}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingExpense(!isAddingExpense)}
                    className="min-h-[38px] px-3.5 py-1.5 bg-[#FF6600] hover:bg-[#E65500] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-center shrink-0"
                  >
                    {isAddingExpense ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAddingExpense ? drawerExpCopy.cancelBtn : drawerExpCopy.addBtn}</span>
                  </button>
                </div>

                {/* 3-Box Margin Equation */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 block">{drawerExpCopy.retainer}</span>
                    <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-slate-900 mt-0.5 block">
                      {stats.retainer.toLocaleString()} {t.mad}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200">
                    <span className="text-[10px] font-bold text-orange-800 block">{drawerExpCopy.spent}</span>
                    <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-[#E65500] mt-0.5 block">
                      -{stats.activeExpenses.toLocaleString()} {t.mad}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-emerald-900">{drawerExpCopy.remaining}</span>
                      <span className="text-[10px] font-mono tabular-nums font-bold text-emerald-700">
                        {stats.marginPct}%
                      </span>
                    </div>
                    <span
                      className={`text-sm sm:text-base font-extrabold font-mono tabular-nums mt-0.5 block ${
                        stats.netProfit >= 0 ? 'text-emerald-800' : 'text-rose-700'
                      }`}
                    >
                      {stats.netProfit.toLocaleString()} {t.mad}
                    </span>
                  </div>
                </div>

                {/* Margin Split Bar */}
                <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#FF6600] h-full transition-all"
                    style={{ width: `${stats.expensePct}%` }}
                  />
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${Math.max(0, 100 - stats.expensePct)}%` }}
                  />
                </div>

                {/* Inline Add Form */}
                {isAddingExpense && (
                  <form
                    onSubmit={handleDrawerAddExpense}
                    className="p-3.5 rounded-xl bg-slate-50 border border-orange-200 space-y-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600">{drawerExpCopy.presets}</span>
                      {EXPENSE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setExpName(preset.label[language]);
                            setExpProvider(preset.provider);
                            setExpCategory(preset.category);
                            setExpBillingCycle('monthly');
                            setExpAmountInput(String(preset.monthlyCost));
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-orange-300 text-[10px] font-bold text-slate-800 cursor-pointer"
                        >
                          {preset.label[language]} ({preset.monthlyCost})
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        value={expName}
                        onChange={(e) => setExpName(e.target.value)}
                        placeholder={drawerExpCopy.namePh}
                        className="w-full min-h-[40px] px-3 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        value={expProvider}
                        onChange={(e) => setExpProvider(e.target.value)}
                        placeholder={drawerExpCopy.providerPh}
                        className="w-full min-h-[40px] px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <select
                        value={expCategory}
                        onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                        className="w-full min-h-[40px] px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                      >
                        {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => (
                          <option key={cat} value={cat}>
                            {EXPENSE_CATEGORY_LABELS[cat][language]}
                          </option>
                        ))}
                      </select>

                      <select
                        value={expBillingCycle}
                        onChange={(e) => setExpBillingCycle(e.target.value as 'monthly' | 'yearly')}
                        className="w-full min-h-[40px] px-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                      >
                        <option value="monthly">{drawerExpCopy.monthly}</option>
                        <option value="yearly">{drawerExpCopy.yearly}</option>
                      </select>

                      <input
                        type="number"
                        required
                        min={1}
                        value={expAmountInput}
                        onChange={(e) => setExpAmountInput(e.target.value)}
                        className="w-full min-h-[40px] px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono tabular-nums font-bold text-slate-900"
                      />
                    </div>

                    {expBillingCycle === 'yearly' && (
                      <p className="text-[11px] font-bold text-emerald-700 font-mono">
                        {drawerExpCopy.yearlyFormula} {normalizedMonthly.toLocaleString()} {t.perMonth}
                      </p>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="px-4 min-h-[38px] bg-[#082E35] hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        {drawerExpCopy.saveBtn}
                      </button>
                    </div>
                  </form>
                )}

                {/* Subscriptions Rows */}
                {clientExpenses.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-2">{drawerExpCopy.empty}</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {clientExpenses.map((exp) => (
                      <div
                        key={exp.id}
                        className={`px-3 py-2.5 flex items-center justify-between gap-2 text-xs ${
                          exp.isActive ? 'bg-white' : 'bg-slate-50 opacity-65'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {EXPENSE_CATEGORY_LABELS[exp.category][language]}
                            </span>
                            <span
                              className={`font-bold text-slate-900 ${
                                !exp.isActive ? 'line-through' : ''
                              }`}
                            >
                              {exp.name}
                            </span>
                            {exp.provider && (
                              <span className="text-[10px] text-slate-400 font-mono">({exp.provider})</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-mono tabular-nums font-extrabold ${
                              exp.isActive ? 'text-[#E65500]' : 'text-slate-400 line-through'
                            }`}
                          >
                            -{exp.monthlyCost.toLocaleString()} {t.perMonth}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleClientExpenseActive(selectedClient.id, exp.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer inline-flex items-center gap-1 ${
                              exp.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{exp.isActive ? drawerExpCopy.activeTag : drawerExpCopy.pausedTag}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteClientExpense(selectedClient.id, exp.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

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

          {/* 3. EXTENDED PERSISTENT NOTES, MEETING SUMMARIES & FOLLOW-UP HISTORY */}
          <div className="p-5 rounded-2xl border-2 border-slate-200 bg-white shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {nt.sectionTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-100 text-orange-800">
                    {rawNotes.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {nt.sectionDesc}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
              >
                {isAddingNote ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>{nt.btnCancel}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{nt.addNoteBtn}</span>
                  </>
                )}
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                { key: 'all', label: nt.filterAll },
                { key: 'meeting_summary', label: nt.filterMeetings },
                { key: 'follow_up', label: nt.filterFollowUps },
                { key: 'whatsapp', label: nt.filterWhatsApp },
                { key: 'contract', label: nt.filterContracts },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setNotesFilter(tab.key)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    notesFilter === tab.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add Note Form */}
            {isAddingNote && (
              <form
                onSubmit={handleSaveNote}
                className="bg-slate-50 p-4 rounded-xl border border-orange-200 space-y-3.5 animate-fadeIn"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-xs text-slate-900">{nt.formHeading}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noteIsPinned}
                        onChange={(e) => setNoteIsPinned(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span>{nt.formPinLabel}</span>
                    </label>
                  </div>
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    {language === 'ar' ? 'نوع التدوين:' : language === 'fr' ? 'Type d’enregistrement :' : 'Entry Type:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { key: 'meeting_summary', label: nt.typeMeeting, icon: FileText },
                      { key: 'follow_up', label: nt.typeFollowUp, icon: PhoneCall },
                      { key: 'whatsapp', label: nt.typeWhatsApp, icon: MessageSquare },
                      { key: 'contract', label: nt.typeContract, icon: FileSignature },
                      { key: 'general', label: nt.typeGeneral, icon: StickyNote },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = noteType === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setNoteType(item.key as NoteType)}
                          className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500 text-white border-orange-600 shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {nt.formTitleLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder={nt.formTitlePlaceholder}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {nt.formAuthorLabel}
                    </label>
                    <input
                      type="text"
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                      placeholder={nt.formAuthorPlaceholder}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {nt.formContentLabel}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder={nt.formContentPlaceholder}
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed text-slate-900 focus:outline-none focus:border-orange-500"
                  ></textarea>
                </div>

                {/* Outcome & Follow-up Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {nt.formOutcomeLabel}
                    </label>
                    <input
                      type="text"
                      value={noteOutcome}
                      onChange={(e) => setNoteOutcome(e.target.value)}
                      placeholder={nt.formOutcomePlaceholder}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {nt.formFollowUpDateLabel}
                    </label>
                    <input
                      type="date"
                      value={noteFollowUpDate}
                      onChange={(e) => setNoteFollowUpDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {nt.btnCancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-[#FF5500] hover:from-orange-600 hover:to-[#D93800] text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    {nt.btnSaveNote}
                  </button>
                </div>
              </form>
            )}

            {/* Notes List */}
            {sortedNotes.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-600">{nt.emptyHistory}</p>
                <p className="text-[11px] text-slate-400 mt-1">{nt.emptyHistorySub}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedNotes.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-xl border transition-all ${
                      entry.isPinned
                        ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getTypeBadge(entry.type)}

                          {entry.isPinned && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/70 text-amber-900 border border-amber-300">
                              <Pin className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                              <span>{nt.pinnedBadge}</span>
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(entry.createdAt).toLocaleDateString(
                              language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              }
                            )}{' '}
                            •{' '}
                            {new Date(entry.createdAt).toLocaleTimeString(
                              language === 'ar' ? 'ar-MA' : 'fr-FR',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>

                          <span className="text-[11px] text-slate-500 font-medium">
                            {nt.byStaff} <strong className="text-slate-800">{entry.author}</strong>
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {entry.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => togglePinNote(selectedClient.id, entry.id)}
                          title={entry.isPinned ? 'Unpin' : 'Pin to top'}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            entry.isPinned
                              ? 'bg-amber-200 border-amber-300 text-amber-900 hover:bg-amber-300'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <Pin className={`w-3.5 h-3.5 ${entry.isPinned ? 'fill-amber-900' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(nt.deleteConfirm)) {
                              deleteClientNote(selectedClient.id, entry.id);
                            }
                          }}
                          title="Delete note"
                          className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-slate-700 text-xs leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-lg border border-slate-100 mt-2 font-normal">
                      {entry.content}
                    </div>

                    {/* Outcome & Next Follow-up Badges */}
                    {(entry.outcome || entry.followUpDate) && (
                      <div className="flex items-center gap-2 flex-wrap mt-2.5 pt-2 border-t border-slate-100">
                        {entry.outcome && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              <strong>{nt.outcomeTag}</strong> {entry.outcome}
                            </span>
                          </div>
                        )}

                        {entry.followUpDate && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-mono font-medium">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              <strong>{nt.nextFollowUpTag}</strong> {entry.followUpDate}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quick General Scratchpad */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {nt.quickScratchpadTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {nt.quickScratchpadDesc}
                  </p>
                </div>
                {quickSaved && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {nt.quickScratchpadSaved}
                  </span>
                )}
              </div>
              <textarea
                rows={2}
                value={selectedClient.notes || ''}
                onChange={(e) => handleScratchpadChange(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'اكتب هنا ملاحظات سريعة مختصرة يتم حفظها تلقائياً...'
                    : language === 'fr'
                    ? 'Ajoutez ici une note rapide. Elle sera enregistrée automatiquement...'
                    : 'Add a quick note here. It will be saved automatically...'
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-900 focus:outline-none focus:border-orange-500 transition-colors"
              ></textarea>
            </div>
          </div>

          {/* 4. AUTOMATION DELIVERY CONTROLLER */}
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

          {/* 5. Invoices History */}
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
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
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
