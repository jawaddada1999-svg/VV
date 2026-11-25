import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  CreditCard,
  CheckCircle2,
  Plus,
  Check,
  MessageSquare,
  Send,
  Copy,
  Receipt,
  Trash2,
  Power,
  Search,
  ExternalLink,
  TrendingUp,
  Layers,
  X,
} from 'lucide-react';
import { ExpenseCategory, MaintenanceTicket } from '../../types/agency';
import { translations } from '../../translations';
import {
  EXPENSE_PRESETS,
  EXPENSE_CATEGORY_LABELS,
  calcClientExpenseStats,
} from '../../utils/expenseHelpers';

export const RetainersTab: React.FC = () => {
  const {
    clients,
    invoices,
    tickets,
    metrics,
    markInvoicePaid,
    addTicket,
    updateTicketStatus,
    addClientExpense,
    toggleClientExpenseActive,
    deleteClientExpense,
    updateClient,
    setSelectedClientId,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'expenses' | 'invoices' | 'tickets'>('clients');
  const [expenseClientFilter, setExpenseClientFilter] = useState<'retainers' | 'all'>('retainers');
  const [expenseSearch, setExpenseSearch] = useState('');

  // Add Expense Modal State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expClientId, setExpClientId] = useState(
    clients.find((c) => c.stage === 'active_retainer')?.id || clients[0]?.id || ''
  );
  const [expName, setExpName] = useState('');
  const [expProvider, setExpProvider] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('whatsapp_api');
  const [expBillingCycle, setExpBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expAmountInput, setExpAmountInput] = useState<string>('300');
  const [expNotes, setExpNotes] = useState('');

  // Inline retainer quick edit state
  const [editingRetainerId, setEditingRetainerId] = useState<string | null>(null);
  const [editingRetainerVal, setEditingRetainerVal] = useState<string>('');

  // Add Ticket Modal State
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [ticketClientId, setTicketClientId] = useState(clients[0]?.id || '');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority] = useState<MaintenanceTicket['priority']>('normal');

  // Agency Bank Details (RIB) for instant WhatsApp invoices
  const agencyRib = '230 780 4567890123456701 89 (Attijariwafa Bank - IBONDA SARL)';
  const [copiedRib, setCopiedRib] = useState(false);

  const retainerClients = clients.filter((c) => c.stage === 'active_retainer');

  // Localized copy for the Expenses & Net Profit Plan
  const expCopy = {
    ar: {
      grossMrr: 'إجمالي مداخيل الصيانة',
      toolsSpend: 'مصاريف الاشتراكات الشهرية',
      netRemaining: 'صافي الربح المتبقي',
      marginLabel: 'هامش الربح',
      retainerFee: 'مبلغ الصيانة',
      expensesCost: 'الاشتراكات والأدوات',
      netProfit: 'المتبقي الصافي',
      filterRetainersOnly: 'عملاء الصيانة النشطين',
      filterAllClients: 'كافة الوكالات (بما فيها التجربة والتنفيذ)',
      searchAgencyPlaceholder: 'بحث باسم الوكالة أو المدينة...',
      addExpenseBtn: '+ إضافة اشتراك / مصروف',
      quickAddForClient: '+ إضافة مصروف',
      modalTitle: 'إضافة اشتراك أو مصروف شهري على العميل',
      presetsLabel: 'قوالب سريعة (بنقرة واحدة):',
      selectClientLabel: 'اختر الوكالة العقارية:',
      subNameLabel: 'اسم الاشتراك أو الخدمة:',
      subNamePlaceholder: 'مثال: اشتراك واتساب API أو رصيد Make...',
      providerLabel: 'المزود / المنصة (اختياري):',
      providerPlaceholder: 'مثال: 360dialog، OpenAI، Make.com...',
      categoryLabel: 'تصنيف المصروف:',
      cycleLabel: 'دورية الفوترة:',
      cycleMonthly: 'اشتراك شهري',
      cycleYearly: 'اشتراك سنوي (يحسب شهرياً)',
      amountMonthlyLabel: 'التكلفة الشهرية (درهم/شهر):',
      amountYearlyLabel: 'المبلغ السنوي الإجمالي (درهم/سنة):',
      calculatedMonthlyNote: 'يخصم شهرياً من الصيانة:',
      notesLabel: 'ملاحظات (اختياري):',
      notesPlaceholder: 'مثال: رقم الخطة أو تفاصيل الاستخدام...',
      btnSaveExpense: 'حفظ وخصم من الصيانة',
      btnCancel: 'إلغاء',
      activeStatus: 'مفعل (يخصم)',
      pausedStatus: 'متوقف مؤقتاً',
      noExpensesYet: 'لا توجد اشتراكات مضافة لهذا العميل بعد — الصافي يساوي كامل مبلغ الصيانة.',
      yearlyTag: 'سنوي',
      monthlyTag: 'شهري',
      editRetainer: 'تعديل الصيانة',
      saveRetainer: 'حفظ',
      totalLedgerLabel: 'صافي الربح التراكمي للعرض الحالي',
      colSubscriptions: 'الاشتراكات',
      colNetRemaining: 'المتبقي الصافي',
      stageBadgeActive: 'صيانة نشطة',
      stageBadgeTrial: 'تجربة 7 أيام',
      stageBadgeDelivery: 'قيد التنفيذ',
      stageBadgeOther: 'عميل مسجل',
    },
    fr: {
      grossMrr: 'MRR Maintenance Brut',
      toolsSpend: 'Coût Abonnements / Mois',
      netRemaining: 'Bénéfice Net Restant',
      marginLabel: 'Marge Nette',
      retainerFee: 'Forfait Maintenance',
      expensesCost: 'Outils & Abonnements',
      netProfit: 'Reste Net',
      filterRetainersOnly: 'Clients Maintenance Actifs',
      filterAllClients: 'Toutes les agences (Essais & Livraisons inclus)',
      searchAgencyPlaceholder: 'Rechercher une agence ou ville...',
      addExpenseBtn: '+ Ajouter un Abonnement',
      quickAddForClient: '+ Ajouter charge',
      modalTitle: 'Ajouter un Abonnement ou Coût Client',
      presetsLabel: 'Modèles rapides (1 clic) :',
      selectClientLabel: 'Agence Immobilière :',
      subNameLabel: 'Nom de l’abonnement / outil :',
      subNamePlaceholder: 'Ex : API WhatsApp Officielle ou Make.com...',
      providerLabel: 'Fournisseur (optionnel) :',
      providerPlaceholder: 'Ex : 360dialog, OpenAI, Hetzner...',
      categoryLabel: 'Catégorie :',
      cycleLabel: 'Cycle de facturation :',
      cycleMonthly: 'Mensuel',
      cycleYearly: 'Annuel (calculé par mois)',
      amountMonthlyLabel: 'Coût mensuel (MAD/mois) :',
      amountYearlyLabel: 'Montant annuel total (MAD/an) :',
      calculatedMonthlyNote: 'Déduit chaque mois de la maintenance :',
      notesLabel: 'Notes (optionnel) :',
      notesPlaceholder: 'Ex : Plan Pro ou détails du compte...',
      btnSaveExpense: 'Enregistrer & Déduire',
      btnCancel: 'Annuler',
      activeStatus: 'Actif (Déduit)',
      pausedStatus: 'En pause',
      noExpensesYet: 'Aucun abonnement enregistré — 100 % du forfait reste en marge nette.',
      yearlyTag: 'Annuel',
      monthlyTag: 'Mensuel',
      editRetainer: 'Modifier forfait',
      saveRetainer: 'OK',
      totalLedgerLabel: 'Total Net Restant (vue filtrée)',
      colSubscriptions: 'Abonnements',
      colNetRemaining: 'Reste Net',
      stageBadgeActive: 'Maintenance Active',
      stageBadgeTrial: 'Essai 7 Jours',
      stageBadgeDelivery: 'En Livraison',
      stageBadgeOther: 'Enregistré',
    },
    en: {
      grossMrr: 'Gross Maintenance MRR',
      toolsSpend: 'Monthly Subscriptions Cost',
      netRemaining: 'Net Remaining Profit',
      marginLabel: 'Net Margin',
      retainerFee: 'Maintenance Fee',
      expensesCost: 'Tools & Subscriptions',
      netProfit: 'Net Remaining',
      filterRetainersOnly: 'Active Retainer Clients',
      filterAllClients: 'All Agencies (Incl. Trial & Delivery)',
      searchAgencyPlaceholder: 'Search agency name or city...',
      addExpenseBtn: '+ Add Subscription / Cost',
      quickAddForClient: '+ Add Cost',
      modalTitle: 'Add Client Subscription or Tool Cost',
      presetsLabel: '1-Click Presets:',
      selectClientLabel: 'Real Estate Agency:',
      subNameLabel: 'Subscription / Tool Name:',
      subNamePlaceholder: 'e.g. Official WhatsApp API or Make Pro...',
      providerLabel: 'Provider / Vendor (Optional):',
      providerPlaceholder: 'e.g. 360dialog, OpenAI, Hetzner...',
      categoryLabel: 'Expense Category:',
      cycleLabel: 'Billing Cycle:',
      cycleMonthly: 'Monthly',
      cycleYearly: 'Yearly (prorated monthly)',
      amountMonthlyLabel: 'Monthly Cost (MAD/mo):',
      amountYearlyLabel: 'Total Annual Invoice (MAD/yr):',
      calculatedMonthlyNote: 'Monthly deduction from retainer:',
      notesLabel: 'Notes (Optional):',
      notesPlaceholder: 'e.g. Plan tier or usage allocation...',
      btnSaveExpense: 'Save & Deduct',
      btnCancel: 'Cancel',
      activeStatus: 'Active (Deducted)',
      pausedStatus: 'Paused',
      noExpensesYet: 'No subscriptions logged yet — 100% of the maintenance fee remains net profit.',
      yearlyTag: 'Yearly',
      monthlyTag: 'Monthly',
      editRetainer: 'Edit Fee',
      saveRetainer: 'Save',
      totalLedgerLabel: 'Filtered Net Remaining Profit',
      colSubscriptions: 'Subscriptions',
      colNetRemaining: 'Net Remaining',
      stageBadgeActive: 'Active Retainer',
      stageBadgeTrial: '7-Day Trial',
      stageBadgeDelivery: 'In Delivery',
      stageBadgeOther: 'Lead / Client',
    },
  }[language];

  const overallMarginPct =
    metrics.currentMRR > 0 ? Math.round((metrics.netRetainerProfit / metrics.currentMRR) * 100) : 0;

  // Filtered clients list for the Expenses Ledger
  const filteredExpenseClients = useMemo(() => {
    const q = expenseSearch.trim().toLowerCase();
    return clients
      .filter((c) => {
        if (expenseClientFilter === 'retainers' && c.stage !== 'active_retainer') {
          return false;
        }
        if (expenseClientFilter === 'all' && c.stage === 'lost') {
          return false;
        }
        if (q) {
          return (
            c.agencyName.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.contactPerson.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (a.stage === 'active_retainer' && b.stage !== 'active_retainer') return -1;
        if (a.stage !== 'active_retainer' && b.stage === 'active_retainer') return 1;
        return b.monthlyRetainer - a.monthlyRetainer;
      });
  }, [clients, expenseClientFilter, expenseSearch]);

  const filteredTotals = useMemo(() => {
    return filteredExpenseClients.reduce(
      (acc, client) => {
        const s = calcClientExpenseStats(client);
        acc.retainer += s.retainer;
        acc.expenses += s.activeExpenses;
        acc.net += s.netProfit;
        return acc;
      },
      { retainer: 0, expenses: 0, net: 0 }
    );
  }, [filteredExpenseClients]);

  const openAddExpenseForClient = (clientId?: string) => {
    setExpClientId(clientId || retainerClients[0]?.id || clients[0]?.id || '');
    setExpName('');
    setExpProvider('');
    setExpCategory('whatsapp_api');
    setExpBillingCycle('monthly');
    setExpAmountInput('300');
    setExpNotes('');
    setShowAddExpenseModal(true);
  };

  const applyPresetToForm = (presetId: string) => {
    const preset = EXPENSE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setExpName(preset.label[language]);
    setExpProvider(preset.provider);
    setExpCategory(preset.category);
    setExpBillingCycle('monthly');
    setExpAmountInput(String(preset.monthlyCost));
    setExpNotes(preset.notes[language]);
  };

  const parsedAmount = Math.max(0, Number(expAmountInput) || 0);
  const normalizedMonthlyCost =
    expBillingCycle === 'yearly' ? Math.round(parsedAmount / 12) : Math.round(parsedAmount);

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expClientId || !expName.trim() || normalizedMonthlyCost <= 0) return;

    addClientExpense(expClientId, {
      name: expName.trim(),
      provider: expProvider.trim() || undefined,
      category: expCategory,
      monthlyCost: normalizedMonthlyCost,
      billingCycle: expBillingCycle,
      isActive: true,
      notes: expNotes.trim() || undefined,
    });

    setShowAddExpenseModal(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === ticketClientId);
    if (!client) return;

    addTicket({
      clientId: client.id,
      agencyName: client.agencyName,
      title: ticketTitle,
      description: ticketDescription,
      priority: ticketPriority,
      status: 'open',
    });

    setShowAddTicketModal(false);
    setTicketTitle('');
    setTicketDescription('');
  };

  const handleCopyRib = () => {
    navigator.clipboard.writeText(agencyRib);
    setCopiedRib(true);
    setTimeout(() => setCopiedRib(false), 3000);
  };

  const handleSendWhatsAppReminder = (
    agencyName: string,
    clientName: string,
    phone: string,
    amount: number,
    invNum: string
  ) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const textBody =
      language === 'ar'
        ? `السلام عليكم أستاذ ${clientName}، تحية طيبة من فريق IBONDA للأوتوميشن العقاري. نود تذكيركم بموعد تجديد اشتراك الصيانة الشهرية لوكالة "${agencyName}" (فاتورة رقم: ${invNum}) بمبلغ ${amount.toLocaleString()} درهم، لضمان استمرار عمل سيناريوهات واتساب ونماذج الإعلانات بدون انقطاع.\n\nبيانات التحويل البنكي (RIB):\n${agencyRib}\n\nيرجى إرسال وصل التحويل فور السداد لتحديث ملف الوكالة. شكراً لثقتكم!`
        : language === 'fr'
        ? `Bonjour ${clientName}, ici l’équipe IBONDA Automation. Nous vous rappelons l’échéance de votre forfait de maintenance mensuelle pour l’agence « ${agencyName} » (Facture : ${invNum}) d’un montant de ${amount.toLocaleString()} MAD, afin d’assurer la continuité de vos scénarios WhatsApp et formulaires publicitaires.\n\nCoordonnées bancaires (RIB) :\n${agencyRib}\n\nMerci de nous transmettre le justificatif de virement dès paiement effectué.`
        : `Hello ${clientName}, greetings from the IBONDA Automation team. This is a friendly reminder regarding the monthly maintenance retainer renewal for "${agencyName}" (Invoice: ${invNum}) totaling ${amount.toLocaleString()} MAD, ensuring uninterrupted WhatsApp and ad lead workflows.\n\nBank Transfer Details (RIB):\n${agencyRib}\n\nPlease share your transfer receipt once completed. Thank you!`;

    const message = encodeURIComponent(textBody);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const getStageLabel = (stage: string) => {
    if (stage === 'active_retainer') return expCopy.stageBadgeActive;
    if (stage === 'trial_7_days') return expCopy.stageBadgeTrial;
    if (stage === 'delivery_in_progress') return expCopy.stageBadgeDelivery;
    return expCopy.stageBadgeOther;
  };

  return (
    <div className="space-y-5">
      {/* 1. Header Banner with Gross MRR / Subscriptions Cost / Net Profit Remaining */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {t.retainersHeaderTag}
              </span>
              <span className="text-xs font-mono tabular-nums font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                {retainerClients.length} {t.active}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.retainersHeaderTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {t.retainersHeaderDesc}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAddExpenseForClient()}
            className="min-h-[44px] px-4 py-2 bg-[#FF6600] hover:bg-[#E65500] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2 shrink-0 self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>{expCopy.addExpenseBtn}</span>
          </button>
        </div>

        {/* Financial Profit Equation Strip: Maintenance MRR - Subscriptions = Net Profit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-500">{expCopy.grossMrr}</span>
            <div className="mt-1.5 flex items-baseline gap-1.5 font-mono tabular-nums">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {metrics.currentMRR.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">{t.perMonth}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex flex-col justify-between">
            <span className="text-xs font-bold text-orange-800">{expCopy.toolsSpend}</span>
            <div className="mt-1.5 flex items-baseline gap-1.5 font-mono tabular-nums">
              <span className="text-xl sm:text-2xl font-extrabold text-[#E65500]">
                -{metrics.totalMonthlyClientExpenses.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-orange-700">{t.perMonth}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-900">{expCopy.netRemaining}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono tabular-nums font-bold bg-emerald-600 text-white">
                {overallMarginPct}% {expCopy.marginLabel}
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1.5 font-mono tabular-nums">
              <span className="text-xl sm:text-2xl font-extrabold text-emerald-800">
                {metrics.netRetainerProfit.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-700">{t.perMonth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick RIB Info Bar */}
      <div className="bg-[#082E35] text-white p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-[#FF6600] text-white rounded-xl shrink-0">
            <CreditCard className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold block text-orange-300">{t.ribBoxTitle}:</span>
            <span className="font-mono text-[11px] text-slate-200 block mt-0.5" dir="ltr">
              {agencyRib}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopyRib}
          className="min-h-[40px] flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border border-white/20 shrink-0"
        >
          {copiedRib ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedRib ? t.btnCopiedRib : t.btnCopyRib}</span>
        </button>
      </div>

      {/* 2. Sub Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`px-4 min-h-[44px] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'clients'
              ? 'bg-[#082E35] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.subtabClients} ({retainerClients.length})
        </button>
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`px-4 min-h-[44px] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
            activeSubTab === 'expenses'
              ? 'bg-[#FF6600] text-white'
              : 'text-slate-700 bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/80'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>{t.subtabExpenses}</span>
          <span
            className={`px-1.5 py-0.5 rounded font-mono tabular-nums text-[10px] ${
              activeSubTab === 'expenses' ? 'bg-white/20 text-white' : 'bg-white text-[#E65500]'
            }`}
          >
            {overallMarginPct}%
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-4 min-h-[44px] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'invoices'
              ? 'bg-[#082E35] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.subtabInvoices} ({invoices.length})
        </button>
        <button
          onClick={() => setActiveSubTab('tickets')}
          className={`px-4 min-h-[44px] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'tickets'
              ? 'bg-[#082E35] text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.subtabTickets} ({tickets.length})
        </button>
      </div>

      {/* SUBTAB 1: RETAINER CLIENTS (Including Live Expense & Net Profit columns) */}
      {activeSubTab === 'clients' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">{t.colClientAgency}</th>
                  <th className="p-3.5">{t.colContact}</th>
                  <th className="p-3.5">{t.colPackageChosen}</th>
                  <th className="p-3.5">{t.colMonthlyRetainer}</th>
                  <th className="p-3.5">{expCopy.colSubscriptions}</th>
                  <th className="p-3.5">{expCopy.colNetRemaining}</th>
                  <th className="p-3.5">{t.colNextRenewal}</th>
                  <th className="p-3.5">{t.colSystemStatus}</th>
                  <th className="p-3.5 text-center">{t.btnSendWhatsAppInvoice}</th>
                  <th className="p-3.5 text-center">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {retainerClients.map((client) => {
                  const stats = calcClientExpenseStats(client);
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedClientId(client.id)}
                          className="font-bold text-slate-900 hover:text-[#FF6600] block text-xs cursor-pointer text-start"
                        >
                          {client.agencyName}
                        </button>
                        <span className="text-[11px] text-slate-400 font-medium">{client.city}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{client.contactPerson}</span>
                        <span className="text-[11px] text-slate-500 font-mono block mt-0.5" dir="ltr">
                          {client.phone}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-100 text-slate-900 border border-slate-200">
                          {client.packageTier === 'starter'
                            ? t.starterPackage
                            : client.packageTier === 'growth'
                            ? t.growthPackage
                            : t.enterprisePackage}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono tabular-nums font-bold text-slate-900 text-sm">
                        {editingRetainerId === client.id ? <div className="flex items-center gap-1"><input type="number" min="0" value={editingRetainerVal} onChange={e=>setEditingRetainerVal(e.target.value)} className="w-20 rounded-lg border px-2 py-1 text-xs"/><button onClick={()=>{updateClient(client.id,{monthlyRetainer:Math.max(0,Number(editingRetainerVal)||0)});setEditingRetainerId(null)}} className="text-emerald-700 font-bold text-xs">{language==='ar'?'حفظ':language==='fr'?'Enregistrer':'Save'}</button></div> : <>{client.monthlyRetainer.toLocaleString()} {t.perMonth}</>}
                      </td>
                      <td className="p-3.5 font-mono tabular-nums">
                        <button
                          type="button"
                          onClick={() => setActiveSubTab('expenses')}
                          className="text-[#E65500] font-bold hover:underline cursor-pointer"
                        >
                          -{stats.activeExpenses.toLocaleString()} ({stats.activeCount})
                        </button>
                      </td>
                      <td className="p-3.5 font-mono tabular-nums">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-extrabold text-sm ${
                              stats.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {stats.netProfit.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {stats.marginPct}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-bold">
                        {client.nextBillingDate
                          ? new Date(client.nextBillingDate).toLocaleDateString(
                              language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US'
                            )
                          : t.perMonth}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            client.maintenanceStatus === 'support_needed'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>
                            {client.maintenanceStatus === 'support_needed' ? t.pending : t.statusRunningLive}
                          </span>
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() =>
                            handleSendWhatsAppReminder(
                              client.agencyName,
                              client.contactPerson,
                              client.phone,
                              client.monthlyRetainer,
                              'RET-2026'
                            )
                          }
                          className="px-3 min-h-[36px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          title={t.btnSendWhatsAppInvoice}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp + RIB</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-center"><button onClick={()=>{setEditingRetainerId(client.id);setEditingRetainerVal(String(client.monthlyRetainer))}} className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-bold text-xs">{language==='ar'?'تعديل':language==='fr'?'Modifier':'Edit'}</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CLIENT EXPENSES, SUBSCRIPTIONS & REMAINING NET MAINTENANCE PLAN */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-4">
          {/* Toolbar: Scope Switcher + Search + Quick Totals */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setExpenseClientFilter('retainers')}
                className={`px-3.5 min-h-[40px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  expenseClientFilter === 'retainers'
                    ? 'bg-[#082E35] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {expCopy.filterRetainersOnly} ({retainerClients.length})
              </button>
              <button
                type="button"
                onClick={() => setExpenseClientFilter('all')}
                className={`px-3.5 min-h-[40px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  expenseClientFilter === 'all'
                    ? 'bg-[#082E35] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {expCopy.filterAllClients}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative">
                <Search
                  className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${
                    direction === 'rtl' ? 'right-3' : 'left-3'
                  }`}
                />
                <input
                  type="text"
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  placeholder={expCopy.searchAgencyPlaceholder}
                  className={`w-full sm:w-64 min-h-[40px] py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#FF6600] ${
                    direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between gap-3 px-3.5 min-h-[40px] rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <span className="font-semibold text-emerald-900">{expCopy.totalLedgerLabel}:</span>
                <span className="font-mono tabular-nums font-extrabold text-emerald-800">
                  {filteredTotals.net.toLocaleString()} {t.perMonth}
                </span>
              </div>
            </div>
          </div>

          {/* Per-Client Margin & Subscriptions Ledger */}
          <div className="space-y-4">
            {filteredExpenseClients.map((client) => {
              const stats = calcClientExpenseStats(client);
              const clientExpenses = client.expenses || [];
              const isEditingThisRetainer = editingRetainerId === client.id;

              return (
                <div
                  key={client.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  {/* Client Financial Header */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setSelectedClientId(client.id)}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-[#FF6600] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>{client.agencyName}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </button>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              client.stage === 'active_retainer'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : client.stage === 'trial_7_days'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {getStageLabel(client.stage)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {client.city} • {client.contactPerson} •{' '}
                          <span className="font-mono">
                            {client.packageTier === 'starter'
                              ? t.starterPackage
                              : client.packageTier === 'growth'
                              ? t.growthPackage
                              : t.enterprisePackage}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* 3-Column Financial Equation + Quick Add */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                      {/* 1. Retainer Fee */}
                      <div className="min-w-[110px]">
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          {expCopy.retainerFee}
                        </span>
                        {isEditingThisRetainer ? (
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="number"
                              min={0}
                              value={editingRetainerVal}
                              onChange={(e) => setEditingRetainerVal(e.target.value)}
                              className="w-24 px-2 py-1 text-xs font-mono font-bold border border-slate-300 rounded-lg bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const val = Math.max(0, Number(editingRetainerVal) || 0);
                                updateClient(client.id, { monthlyRetainer: val });
                                setEditingRetainerId(null);
                              }}
                              className="px-2 py-1 bg-[#082E35] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                            >
                              {expCopy.saveRetainer}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-slate-900">
                              {stats.retainer.toLocaleString()} {t.mad}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingRetainerId(client.id);
                                setEditingRetainerVal(String(client.monthlyRetainer));
                              }}
                              className="text-[10px] font-semibold text-slate-400 hover:text-[#FF6600] underline cursor-pointer"
                            >
                              {expCopy.editRetainer}
                            </button>
                          </div>
                        )}
                      </div>

                      <span className="text-slate-300 font-mono font-bold hidden sm:inline">−</span>

                      {/* 2. Subscriptions Cost */}
                      <div className="min-w-[110px]">
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          {expCopy.expensesCost}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold font-mono tabular-nums text-[#E65500] mt-0.5 block">
                          -{stats.activeExpenses.toLocaleString()} {t.mad}
                        </span>
                      </div>

                      <span className="text-slate-300 font-mono font-bold hidden sm:inline">=</span>

                      {/* 3. Net Remaining Profit */}
                      <div className="min-w-[130px] px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-emerald-900">
                            {expCopy.netProfit}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums font-bold text-emerald-700">
                            {stats.marginPct}%
                          </span>
                        </div>
                        <span
                          className={`text-sm sm:text-base font-extrabold font-mono tabular-nums block ${
                            stats.netProfit >= 0 ? 'text-emerald-800' : 'text-rose-700'
                          }`}
                        >
                          {stats.netProfit.toLocaleString()} {t.perMonth}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openAddExpenseForClient(client.id)}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{expCopy.quickAddForClient}</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Expense vs Net Split Bar */}
                  <div className="px-4 sm:px-5 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-emerald-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-[#FF6600] h-full transition-all"
                        style={{ width: `${stats.expensePct}%` }}
                        title={`${expCopy.expensesCost}: ${stats.expensePct}%`}
                      />
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${Math.max(0, 100 - stats.expensePct)}%` }}
                        title={`${expCopy.netProfit}: ${Math.max(0, 100 - stats.expensePct)}%`}
                      />
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-600 shrink-0">
                      {stats.expensePct}% / {Math.max(0, 100 - stats.expensePct)}%
                    </span>
                  </div>

                  {/* Client Subscriptions List */}
                  {clientExpenses.length === 0 ? (
                    <div className="p-4 text-xs text-slate-500 text-center">
                      {expCopy.noExpensesYet}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {clientExpenses.map((exp) => (
                        <div
                          key={exp.id}
                          className={`px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                            exp.isActive ? 'bg-white' : 'bg-slate-50/80 opacity-65'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                              {EXPENSE_CATEGORY_LABELS[exp.category][language]}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-xs font-bold text-slate-900 ${
                                    !exp.isActive ? 'line-through' : ''
                                  }`}
                                >
                                  {exp.name}
                                </span>
                                {exp.provider && (
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    ({exp.provider})
                                  </span>
                                )}
                                <span className="text-[10px] font-semibold text-slate-400">
                                  • {exp.billingCycle === 'yearly' ? expCopy.yearlyTag : expCopy.monthlyTag}
                                </span>
                              </div>
                              {exp.notes && (
                                <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xl">
                                  {exp.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                            <span
                              className={`text-xs sm:text-sm font-mono tabular-nums font-extrabold ${
                                exp.isActive ? 'text-[#E65500]' : 'text-slate-400 line-through'
                              }`}
                            >
                              -{exp.monthlyCost.toLocaleString()} {t.perMonth}
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleClientExpenseActive(client.id, exp.id)}
                              className={`px-2.5 min-h-[36px] rounded-lg text-[11px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                                exp.isActive
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <Power className="w-3 h-3" />
                              <span>{exp.isActive ? expCopy.activeStatus : expCopy.pausedStatus}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteClientExpense(client.id, exp.id)}
                              className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">{language === 'ar' ? 'رقم الفاتورة' : language === 'fr' ? 'N° Facture' : 'Invoice #'}</th>
                  <th className="p-3.5">{t.colClientAgency}</th>
                  <th className="p-3.5">{language === 'ar' ? 'النوع' : language === 'fr' ? 'Type' : 'Type'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'المبلغ' : language === 'fr' ? 'Montant' : 'Amount'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'تاريخ الاستحقاق' : language === 'fr' ? 'Échéance' : 'Due Date'}</th>
                  <th className="p-3.5">{t.colSystemStatus}</th>
                  <th className="p-3.5 text-center">{t.btnSendWhatsAppInvoice}</th>
                  <th className="p-3.5 text-center">{t.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const client = clients.find((c) => c.id === inv.clientId) || clients[0];
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="p-3.5 font-bold text-slate-900">{inv.agencyName}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.type === 'setup_fee' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {inv.type === 'setup_fee' ? t.kpiSetupCash : t.kpiRetainerMRR}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono tabular-nums font-extrabold text-slate-900">
                        {inv.amount.toLocaleString()} {t.mad}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{inv.dueDate}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : inv.status === 'overdue'
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {inv.status === 'paid'
                            ? `✓ ${t.paid}`
                            : inv.status === 'overdue'
                            ? `⚠️ ${t.overdue}`
                            : `⏳ ${t.pending}`}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() =>
                            handleSendWhatsAppReminder(
                              inv.agencyName,
                              client?.contactPerson || 'Decision Maker',
                              client?.phone || '+212661000000',
                              inv.amount,
                              inv.invoiceNumber
                            )
                          }
                          className="px-3 min-h-[36px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp + RIB</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        {inv.status !== 'paid' ? (
                          <button
                            onClick={() => markInvoicePaid(inv.id)}
                            className="px-3 min-h-[36px] text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer"
                          >
                            ✓ {t.paid}
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold">✓ {t.paid}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 4: TICKETS */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{t.subtabTickets}</h3>
            <button
              onClick={() => setShowAddTicketModal(true)}
              className="flex items-center gap-1.5 px-3.5 min-h-[44px] bg-[#FF6600] hover:bg-[#E65500] text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? '+ تذكرة دعم جديدة' : language === 'fr' ? '+ Nouveau Ticket' : '+ New Ticket'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{tkt.agencyName}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tkt.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tkt.priority === 'urgent'
                      ? language === 'ar'
                        ? 'عاجل'
                        : language === 'fr'
                        ? 'Urgent'
                        : 'Urgent'
                      : language === 'ar'
                      ? 'عادي'
                      : language === 'fr'
                      ? 'Normal'
                      : 'Normal'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{tkt.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {tkt.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(tkt.createdAt).toLocaleDateString(
                      language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US'
                    )}
                  </span>
                  <select
                    value={tkt.status}
                    onChange={(e) => updateTicketStatus(tkt.id, e.target.value as MaintenanceTicket['status'])}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="open">{t.pending}</option>
                    <option value="in_progress">{t.active}</option>
                    <option value="resolved">{t.completed} ✓</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD CLIENT SUBSCRIPTION / EXPENSE */}
      {showAddExpenseModal && (
        <div
          dir={direction}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <div
            className={`bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden ${
              direction === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            <div className="p-4 sm:p-5 bg-[#082E35] text-white flex items-center justify-between font-bold shrink-0">
              <span className="text-sm">{expCopy.modalTitle}</span>
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-5 space-y-4 text-xs overflow-y-auto">
              {/* 1-Click Presets */}
              <div>
                <span className="block font-bold text-slate-700 mb-2">{expCopy.presetsLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {EXPENSE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPresetToForm(preset.id)}
                      className="px-3 min-h-[36px] rounded-lg border border-slate-200 bg-slate-50 hover:bg-orange-50 hover:border-orange-300 text-slate-800 font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>{preset.label[language]}</span>
                      <span className="font-mono font-bold text-[#E65500]">{preset.monthlyCost}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{expCopy.selectClientLabel}</label>
                <select
                  value={expClientId}
                  onChange={(e) => setExpClientId(e.target.value)}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  {clients
                    .filter((c) => c.stage !== 'lost')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.agencyName} ({c.monthlyRetainer.toLocaleString()} {t.perMonth})
                      </option>
                    ))}
                </select>
              </div>

              {/* Name & Provider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{expCopy.subNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={expName}
                    onChange={(e) => setExpName(e.target.value)}
                    placeholder={expCopy.subNamePlaceholder}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{expCopy.providerLabel}</label>
                  <input
                    type="text"
                    value={expProvider}
                    onChange={(e) => setExpProvider(e.target.value)}
                    placeholder={expCopy.providerPlaceholder}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Category & Billing Cycle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{expCopy.categoryLabel}</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    {(Object.keys(EXPENSE_CATEGORY_LABELS) as ExpenseCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {EXPENSE_CATEGORY_LABELS[cat][language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{expCopy.cycleLabel}</label>
                  <select
                    value={expBillingCycle}
                    onChange={(e) => setExpBillingCycle(e.target.value as 'monthly' | 'yearly')}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="monthly">{expCopy.cycleMonthly}</option>
                    <option value="yearly">{expCopy.cycleYearly}</option>
                  </select>
                </div>
              </div>

              {/* Cost Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {expBillingCycle === 'yearly' ? expCopy.amountYearlyLabel : expCopy.amountMonthlyLabel}
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={expAmountInput}
                  onChange={(e) => setExpAmountInput(e.target.value)}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums font-extrabold text-sm text-slate-900"
                />
                {expBillingCycle === 'yearly' && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1.5 font-mono tabular-nums">
                    {expCopy.calculatedMonthlyNote} {normalizedMonthlyCost.toLocaleString()} {t.perMonth}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{expCopy.notesLabel}</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder={expCopy.notesPlaceholder}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  {expCopy.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 min-h-[44px] bg-[#FF6600] hover:bg-[#E65500] text-white rounded-xl font-bold cursor-pointer"
                >
                  {expCopy.btnSaveExpense}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-3">
          <div
            className={`bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden ${
              direction === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between font-bold">
              <span>
                {language === 'ar'
                  ? 'تذكرة دعم وصيانة جديدة'
                  : language === 'fr'
                  ? 'Nouveau Ticket de Support'
                  : 'New Support Ticket'}
              </span>
              <button
                onClick={() => setShowAddTicketModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.colClientAgency}</label>
                <select
                  value={ticketClientId}
                  onChange={(e) => setTicketClientId(e.target.value)}
                  className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.agencyName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'عنوان الطلب' : language === 'fr' ? 'Titre' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full min-h-[44px] p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'تفاصيل الطلب' : language === 'fr' ? 'Description' : 'Description'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                ></textarea>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTicketModal(false)}
                  className="px-4 min-h-[44px] bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 min-h-[44px] bg-[#FF6600] hover:bg-[#E65500] text-white rounded-xl font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ' : language === 'fr' ? 'Enregistrer' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
