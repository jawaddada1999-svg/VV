import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  DollarSign,
  Wrench,
  Check,
  Building2,
  Calendar,
  FileText,
  MessageSquare,
  Send,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MaintenanceTicket } from '../../types/agency';
import { translations } from '../../translations';

export const RetainersTab: React.FC = () => {
  const {
    clients,
    invoices,
    tickets,
    metrics,
    markInvoicePaid,
    addTicket,
    updateTicketStatus,
    setSelectedClientId,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'invoices' | 'tickets'>('clients');
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [ticketClientId, setTicketClientId] = useState(clients[0]?.id || '');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<MaintenanceTicket['priority']>('normal');

  // Agency Bank Details (RIB) for instant WhatsApp invoices
  const agencyRib = '230 780 4567890123456701 89 (Attijariwafa Bank - IBONDA SARL)';

  const [copiedRib, setCopiedRib] = useState(false);

  const retainerClients = clients.filter((c) => c.stage === 'active_retainer');

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

  const handleSendWhatsAppReminder = (agencyName: string, clientName: string, phone: string, amount: number, invNum: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `السلام عليكم أستاذ ${clientName}، تحية طيبة من فريق IBONDA للأوتوميشن العقاري. نود تذكيركم بموعد تجديد اشتراك الصيانة الشهرية لوكالة "${agencyName}" (فاتورة رقم: ${invNum}) بمبلغ ${amount.toLocaleString()} د.م. لضمان استمرار عمل سيناريوهات واتساب ونماذج الإعلانات بدون انقطاع.\n\nبيانات التحويل البنكي (RIB):\n${agencyRib}\n\nيرجى إرسال وصل التحويل فور السداد لتحديث ملف الوكالة. شكراً لثقتكم!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
              {t.retainersHeaderTag}
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
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

        <div className="flex items-center gap-3 self-end md:self-center font-mono">
          <div className={`bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 p-3.5 rounded-2xl shadow-2xs ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] text-emerald-800 font-bold block font-sans">{t.kpiRetainerMRR}</span>
            <span className="text-xl font-extrabold text-emerald-900">
              {metrics.currentMRR.toLocaleString()} {t.perMonth}
            </span>
          </div>
        </div>
      </div>

      {/* Quick RIB Info Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B3A42] to-slate-950 text-white p-4 rounded-2xl shadow-xs border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-orange-500 text-white rounded-xl shadow-xs">
            <CreditCard className="w-4 h-4" />
          </span>
          <div>
            <span className="font-extrabold block text-orange-400">{t.ribBoxTitle}:</span>
            <span className="font-mono text-[11px] text-slate-200 block" dir="ltr">{agencyRib}</span>
          </div>
        </div>

        <button
          onClick={handleCopyRib}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer border border-white/20 shrink-0"
        >
          {copiedRib ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedRib ? t.btnCopiedRib : t.btnCopyRib}</span>
        </button>
      </div>

      {/* 2. Sub Tabs Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'clients'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.subtabClients} ({retainerClients.length})
        </button>
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'invoices'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.subtabInvoices} ({invoices.length})
        </button>
        <button
          onClick={() => setActiveSubTab('tickets')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'tickets'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.subtabTickets} ({tickets.length})
        </button>
      </div>

      {/* SUBTAB 1: RETAINER CLIENTS */}
      {activeSubTab === 'clients' && (
        <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">{t.colClientAgency}</th>
                  <th className="p-3.5">{t.colContact}</th>
                  <th className="p-3.5">{t.colPackageChosen}</th>
                  <th className="p-3.5">{t.colMonthlyRetainer}</th>
                  <th className="p-3.5">Schedule</th>
                  <th className="p-3.5">{t.colNextRenewal}</th>
                  <th className="p-3.5">{t.colSystemStatus}</th>
                  <th className="p-3.5 text-center">{t.btnSendWhatsAppInvoice}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {retainerClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block text-xs">{client.agencyName}</span>
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
                        {client.packageTier}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-extrabold text-emerald-700 text-sm">
                      {client.monthlyRetainer.toLocaleString()} {t.perMonth}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200 font-mono">
                        {t.perMonth}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 font-bold">
                      {client.nextBillingDate ? new Date(client.nextBillingDate).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR') : t.perMonth}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        client.maintenanceStatus === 'support_needed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{client.maintenanceStatus === 'support_needed' ? t.pending : t.statusRunningLive}</span>
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
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-[11px] rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        title={t.btnSendWhatsAppInvoice}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp + RIB</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">{t.colClientAgency}</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">{t.colSystemStatus}</th>
                  <th className="p-3.5 text-center">{t.btnSendWhatsAppInvoice}</th>
                  <th className="p-3.5 text-center">{t.colActionDelivery}</th>
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.type === 'setup_fee' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inv.type === 'setup_fee' ? t.kpiSetupCash : t.kpiRetainerMRR}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-extrabold text-slate-900">
                        {inv.amount.toLocaleString()} {t.mad}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{inv.dueDate}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : inv.status === 'overdue'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {inv.status === 'paid' ? `✓ ${t.paid}` : inv.status === 'overdue' ? `⚠️ ${t.overdue}` : `⏳ ${t.pending}`}
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
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>WhatsApp + RIB</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-center">
                        {inv.status !== 'paid' ? (
                          <button
                            onClick={() => markInvoicePaid(inv.id)}
                            className="px-3 py-1.5 text-[11px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer shadow-2xs"
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

      {/* SUBTAB 3: TICKETS */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              {t.subtabTickets}
            </h3>
            <button
              onClick={() => setShowAddTicketModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Ticket</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{tkt.agencyName}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    tkt.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tkt.priority === 'urgent' ? 'Urgent' : 'Normal'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{tkt.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {tkt.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(tkt.createdAt).toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR')}
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

      {/* Add Ticket Modal */}
      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className={`bg-white rounded-2xl w-full max-w-md shadow-2xl border-2 border-slate-200 overflow-hidden ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between font-bold">
              <span>New Ticket</span>
              <button onClick={() => setShowAddTicketModal(false)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.colClientAgency}</label>
                <select
                  value={ticketClientId}
                  onChange={(e) => setTicketClientId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.agencyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                ></textarea>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowAddTicketModal(false)} className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold">✕</button>
                <button type="submit" className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
