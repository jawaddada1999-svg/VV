import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LeadStage } from '../types';
import { X, Building } from 'lucide-react';

export const LeadModal: React.FC = () => {
  const {
    showLeadModal,
    setShowLeadModal,
    selectedLeadForEdit,
    addLead,
    updateLead,
    campaigns,
    t,
    currency,
  } = useApp();

  const [formData, setFormData] = useState({
    agencyName: '',
    city: 'Casablanca',
    contactPerson: '',
    phone: '',
    email: '',
    status: 'new' as LeadStage,
    dealValue: 15000,
    adSource: campaigns[0]?.name || 'Meta Ads',
    meetingDate: '',
    meetingOutcome: 'pending' as 'pending' | 'showed' | 'no_show' | 'rescheduled',
    notes: '',
    hasBudget: true,
    activeAgentsCount: 5,
    wantsExclusiveMandates: true,
  });

  useEffect(() => {
    if (selectedLeadForEdit) {
      setFormData({
        agencyName: selectedLeadForEdit.agencyName,
        city: selectedLeadForEdit.city,
        contactPerson: selectedLeadForEdit.contactPerson,
        phone: selectedLeadForEdit.phone,
        email: selectedLeadForEdit.email,
        status: selectedLeadForEdit.status,
        dealValue: selectedLeadForEdit.dealValue,
        adSource: selectedLeadForEdit.adSource,
        meetingDate: selectedLeadForEdit.meetingDate ? selectedLeadForEdit.meetingDate.slice(0, 16) : '',
        meetingOutcome: selectedLeadForEdit.meetingOutcome || 'pending',
        notes: selectedLeadForEdit.notes || '',
        hasBudget: selectedLeadForEdit.qualificationCriteria?.hasBudget ?? true,
        activeAgentsCount: selectedLeadForEdit.qualificationCriteria?.activeAgentsCount ?? 5,
        wantsExclusiveMandates: selectedLeadForEdit.qualificationCriteria?.wantsExclusiveMandates ?? true,
      });
    } else {
      setFormData({
        agencyName: '',
        city: 'Casablanca',
        contactPerson: '',
        phone: '',
        email: '',
        status: 'new',
        dealValue: 15000,
        adSource: campaigns[0]?.name || 'B2B Immo - Meta Ads',
        meetingDate: '',
        meetingOutcome: 'pending',
        notes: '',
        hasBudget: true,
        activeAgentsCount: 5,
        wantsExclusiveMandates: true,
      });
    }
  }, [selectedLeadForEdit, campaigns]);

  if (!showLeadModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agencyName || !formData.contactPerson) return;

    if (selectedLeadForEdit) {
      updateLead(selectedLeadForEdit.id, {
        agencyName: formData.agencyName,
        city: formData.city,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        dealValue: Number(formData.dealValue),
        adSource: formData.adSource,
        meetingDate: formData.meetingDate ? new Date(formData.meetingDate).toISOString() : undefined,
        meetingOutcome: formData.meetingOutcome,
        notes: formData.notes,
        qualificationCriteria: {
          hasBudget: formData.hasBudget,
          activeAgentsCount: Number(formData.activeAgentsCount),
          wantsExclusiveMandates: formData.wantsExclusiveMandates,
        },
      });
    } else {
      addLead({
        agencyName: formData.agencyName,
        city: formData.city,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        dealValue: Number(formData.dealValue),
        adSource: formData.adSource,
        meetingDate: formData.meetingDate ? new Date(formData.meetingDate).toISOString() : undefined,
        meetingOutcome: formData.meetingOutcome,
        notes: formData.notes,
        qualificationCriteria: {
          hasBudget: formData.hasBudget,
          activeAgentsCount: Number(formData.activeAgentsCount),
          wantsExclusiveMandates: formData.wantsExclusiveMandates,
        },
      });
    }

    setShowLeadModal(false);
  };

  const currencySymbol = currency === 'MAD' ? 'MAD' : currency === 'EUR' ? '€' : '$';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-petrol-900 rounded-2xl border border-slate-200/80 dark:border-petrol-800 w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-petrol-100 dark:border-petrol-800 mb-4">
          <h3 className="text-base font-bold text-petrol-800 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-neon-500 shrink-0" />
            <span>
              {selectedLeadForEdit
                ? `${t.leadModal.editTitle} ${selectedLeadForEdit.agencyName}`
                : t.leadModal.addTitle}
            </span>
          </h3>
          <button
            onClick={() => setShowLeadModal(false)}
            aria-label={t.leadModal.cancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.agencyName}
              </label>
              <input
                type="text"
                required
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                placeholder={t.leadModal.agencyNamePlaceholder}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.city}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder={t.leadModal.cityPlaceholder}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.contact}
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder={t.leadModal.contactPlaceholder}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.phone}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+212 6..."
                dir="ltr"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-left"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.email}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@agence.com"
                dir="ltr"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-left font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.stage}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStage })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
              >
                <option value="new">{t.crm.colNew}</option>
                <option value="qualified">{t.crm.colQualified}</option>
                <option value="meeting_scheduled">{t.crm.colBooked}</option>
                <option value="meeting_held">{t.crm.colHeld}</option>
                <option value="proposal_sent">{t.crm.colProposal}</option>
                <option value="won">{t.crm.colWon}</option>
                <option value="lost">{t.crm.colLost}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.dealValue} ({currencySymbol})
              </label>
              <input
                type="number"
                value={formData.dealValue}
                onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.leadModal.source}
              </label>
              <select
                value={formData.adSource}
                onChange={(e) => setFormData({ ...formData, adSource: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="Formulaire Direct LP">Formulaire Direct LP</option>
                <option value="Bouche-à-oreille">Recommandation / Direct</option>
              </select>
            </div>
          </div>

          {/* Meeting scheduling section */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              {t.leadModal.meetingDetails}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-500 mb-1">{t.leadModal.meetingDateTime}</label>
                <input
                  type="datetime-local"
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">{t.leadModal.attendanceOutcome}</label>
                <select
                  value={formData.meetingOutcome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      meetingOutcome: e.target.value as 'pending' | 'showed' | 'no_show' | 'rescheduled',
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="pending">{t.leadModal.outcomePending}</option>
                  <option value="showed">{t.leadModal.outcomeShowed}</option>
                  <option value="no_show">{t.leadModal.outcomeNoShow}</option>
                  <option value="rescheduled">{t.leadModal.outcomeRescheduled}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.leadModal.notes}
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t.leadModal.notesPlaceholder}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowLeadModal(false)}
              className="px-4 py-2 text-slate-600 dark:text-petrol-300 hover:bg-slate-100 dark:hover:bg-petrol-800 rounded-lg transition-colors font-medium cursor-pointer"
            >
              {t.leadModal.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-neon-500 hover:bg-neon-600 rounded-xl font-black shadow-md shadow-neon-500/30 transition-all cursor-pointer"
            >
              {selectedLeadForEdit ? t.leadModal.saveChanges : t.leadModal.createLead}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
