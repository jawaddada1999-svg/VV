import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetaCampaign } from '../types';
import {
  Plus,
  Play,
  Pause,
  Sparkles,
  TrendingUp,
  DollarSign,
  Target,
} from 'lucide-react';

export const MetaAdsTracker: React.FC = () => {
  const { campaigns, addCampaign, updateCampaign, formatMoney, t, language } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: 'Meta Combined' as MetaCampaign['platform'],
    spend: 3000,
    impressions: 20000,
    clicks: 600,
    leads: 30,
    meetingsBooked: 10,
    meetingsHeld: 6,
    clientsClosed: 1,
    revenue: 15000,
  });

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leads, 0);
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const overallROAS = totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) : '0';

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name) return;

    addCampaign({
      name: newCampaign.name,
      platform: newCampaign.platform,
      status: 'active',
      spend: Number(newCampaign.spend),
      impressions: Number(newCampaign.impressions),
      clicks: Number(newCampaign.clicks),
      leads: Number(newCampaign.leads),
      meetingsBooked: Number(newCampaign.meetingsBooked),
      meetingsHeld: Number(newCampaign.meetingsHeld),
      clientsClosed: Number(newCampaign.clientsClosed),
      revenue: Number(newCampaign.revenue),
      startDate: new Date().toISOString().slice(0, 10),
    });

    setShowAddModal(false);
    setNewCampaign({
      name: '',
      platform: 'Meta Combined',
      spend: 3000,
      impressions: 20000,
      clicks: 600,
      leads: 30,
      meetingsBooked: 10,
      meetingsHeld: 6,
      clientsClosed: 1,
      revenue: 15000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Campaign button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-sans">
            {language === 'ar' ? 'حملات ميتا الإعلانية (Meta Ads)' : t.campaigns.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bold mt-1">
            {language === 'ar'
              ? 'متابعة أداء حملات فيسبوك وإنستغرام وعائد الاستثمار لكل إعلان B2B'
              : t.campaigns.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-neon-500 hover:bg-neon-600 active:scale-[0.98] rounded-lg shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{language === 'ar' ? '+ إضافة حملة ميتا' : 'Nouvelle Campagne'}</span>
        </button>
      </div>

      {/* Summary strips with Clean White Cards and Modern Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
            {language === 'ar' ? 'الميزانية المنفقة' : 'Budget Dépensé'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-1.5">
            {formatMoney(totalSpend)}
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
            {language === 'ar' ? 'تكلفة الاستمارة (CPL)' : 'Coût moyen / Formulaire'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 mt-1.5">
            {formatMoney(avgCPL)}
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
            {language === 'ar' ? 'إجمالي الإيرادات المحققة' : 'Chiffre d\'Affaires'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 mt-1.5">
            {formatMoney(totalRevenue)}
          </div>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all">
          <span className="text-xs sm:text-sm font-semibold text-slate-600 block">
            {language === 'ar' ? 'العائد على الإنفاق (ROAS)' : 'ROAS Global'}
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-neon-600 mt-1.5">
            {overallROAS}x
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            {language === 'ar' ? 'سجل الحملات الإعلانية ومعدلات التحويل' : 'Performances par Campagne'}
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
            {campaigns.length} {language === 'ar' ? 'حملات' : 'campagnes'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right rtl:text-right text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-950 uppercase tracking-wider font-black border-b-2 border-slate-200 text-xs">
              <tr>
                <th className="px-5 py-4">{t.campaigns.campaignName}</th>
                <th className="px-5 py-4">{t.campaigns.status}</th>
                <th className="px-5 py-4 text-left rtl:text-right">{t.campaigns.spend}</th>
                <th className="px-5 py-4 text-left rtl:text-right">{t.campaigns.clicks}</th>
                <th className="px-5 py-4 text-left rtl:text-right">CTR / CPC</th>
                <th className="px-5 py-4 text-left rtl:text-right">{t.campaigns.leads}</th>
                <th className="px-5 py-4 text-left rtl:text-right">{t.campaigns.cpl}</th>
                <th className="px-5 py-4 text-left rtl:text-right">{language === 'ar' ? 'المواعيد' : 'RDV'}</th>
                <th className="px-5 py-4 text-left rtl:text-right">{t.campaigns.costMeeting}</th>
                <th className="px-5 py-4 text-left rtl:text-right">{t.campaigns.clients}</th>
                <th className="px-5 py-4 text-left rtl:text-right font-black">{t.campaigns.roas}</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {campaigns.map((camp) => {
                const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : '0';
                const cpc = camp.clicks > 0 ? (camp.spend / camp.clicks).toFixed(1) : '0';
                const cpl = camp.leads > 0 ? Math.round(camp.spend / camp.leads) : 0;
                const costMeeting =
                  camp.meetingsHeld > 0 ? Math.round(camp.spend / camp.meetingsHeld) : 0;
                const roas = camp.spend > 0 ? (camp.revenue / camp.spend).toFixed(2) : '0';

                return (
                  <tr
                    key={camp.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-black text-slate-950 text-sm sm:text-base">
                        {camp.name}
                      </div>
                      <div className="text-xs text-slate-500 font-bold flex items-center gap-2 mt-1">
                        <span>{camp.platform}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">
                          {language === 'ar' ? `البدء: ${camp.startDate}` : `Lancée: ${camp.startDate}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          updateCampaign(camp.id, {
                            status: camp.status === 'active' ? 'paused' : 'active',
                          })
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-colors ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {camp.status === 'active' ? (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{t.campaigns.active}</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>{t.campaigns.paused}</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono font-black text-slate-950 text-sm sm:text-base">
                      {formatMoney(camp.spend)}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono font-bold text-slate-800">
                      {camp.clicks.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono text-slate-700 font-bold">
                      <div>{ctr}%</div>
                      <div className="text-[11px] text-slate-500">
                        {formatMoney(Number(cpc))}/{language === 'ar' ? 'نقرة' : 'clic'}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono font-black text-petrol-800 text-base">
                      {camp.leads}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono font-bold text-slate-900">
                      {formatMoney(cpl)}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono text-slate-800 font-bold">
                      {camp.meetingsHeld} / {camp.meetingsBooked}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono text-slate-800 font-bold">
                      {formatMoney(costMeeting)}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono font-black text-emerald-600 text-base">
                      {camp.clientsClosed}
                    </td>
                    <td className="px-5 py-4 text-left rtl:text-right font-mono font-black text-base">
                      <span
                        className={`px-3 py-1 rounded-xl ${
                          Number(roas) >= 3
                            ? 'text-neon-700 bg-orange-100 border border-orange-300'
                            : Number(roas) >= 1
                            ? 'text-amber-800 bg-amber-100 border border-amber-300'
                            : 'text-rose-800 bg-rose-100 border border-rose-300'
                        }`}
                      >
                        {roas}x
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border-2 border-slate-200 w-full max-w-lg p-6 sm:p-7 shadow-2xl">
            <h3 className="text-xl font-black text-slate-950 mb-4">
              {language === 'ar' ? 'إضافة حملة إعلانية جديدة في ميتا' : 'Ajouter une Campagne Meta'}
            </h3>
            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-black text-slate-800 mb-1.5">
                  اسم الحملة الإعلانية *
                </label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="مثال: B2B عقارات تفويضات حصرية الدار البيضاء"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold focus:border-petrol-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 mb-1.5">
                    المنصة
                  </label>
                  <select
                    value={newCampaign.platform}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        platform: e.target.value as MetaCampaign['platform'],
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-950 font-bold"
                  >
                    <option value="Meta Combined">فيسبوك + إنستغرام</option>
                    <option value="Instagram">إنستغرام فقط</option>
                    <option value="Facebook">فيسبوك فقط</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-800 mb-1.5">
                    الميزانية (د.م.)
                  </label>
                  <input
                    type="number"
                    value={newCampaign.spend}
                    onChange={(e) =>
                      setNewCampaign({ ...newCampaign, spend: Number(e.target.value) })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-950 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-slate-700 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-white bg-neon-500 hover:bg-neon-600 rounded-xl font-black shadow-md shadow-neon-500/20 transition-all cursor-pointer"
                >
                  حفظ الحملة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
