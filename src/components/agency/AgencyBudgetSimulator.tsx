import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { Calculator, Target, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';

export const AgencyBudgetSimulator: React.FC = () => {
  const { campaigns, language, direction } = useAgency();
  const [mode, setMode] = useState<'target' | 'budget'>('target');
  const [targetRevenue, setTargetRevenue] = useState(75000);
  const [dealValue, setDealValue] = useState(15000);
  const [budget, setBudget] = useState(15000);

  const totals = campaigns.reduce((a, c) => ({
    spend: a.spend + (Number(c.spend) || 0),
    clicks: a.clicks + (Number(c.clicks) || 0),
    visitors: a.visitors + (Number(c.landingPageVisitors) || 0),
    leads: a.leads + (Number(c.leadsGenerated) || 0),
    booked: a.booked + (Number(c.meetingsBooked) || 0),
    attended: a.attended + (Number(c.meetingsShowedUp) || 0),
    deals: a.deals + (Number(c.dealsClosed) || 0),
  }), { spend: 0, clicks: 0, visitors: 0, leads: 0, booked: 0, attended: 0, deals: 0 });

  const observed = {
    cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 4.8,
    landing: totals.visitors > 0 ? totals.leads / totals.visitors : 0.05,
    booking: totals.leads > 0 ? totals.booked / totals.leads : 0.30,
    showUp: totals.booked > 0 ? totals.attended / totals.booked : 0.55,
    close: totals.attended > 0 ? totals.deals / totals.attended : 0.20,
  };
  const usedFallback = totals.clicks === 0 || totals.visitors === 0 || totals.leads === 0 || totals.booked === 0 || totals.attended === 0;
  const cpc = Math.max(0.01, observed.cpc);
  const landing = Math.max(0.001, Math.min(1, observed.landing));
  const booking = Math.max(0.001, Math.min(1, observed.booking));
  const showUp = Math.max(0.001, Math.min(1, observed.showUp));
  const close = Math.max(0.001, Math.min(1, observed.close));
  const money = (v: number) => `${Math.round(v).toLocaleString(language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US')} MAD`;

  const targetClients = Math.max(1, Math.ceil(Math.max(0, targetRevenue) / Math.max(1, dealValue)));
  const held = Math.ceil(targetClients / close);
  const booked = Math.ceil(held / showUp);
  const leads = Math.ceil(booked / booking);
  const visitors = Math.ceil(leads / landing);
  const clicks = Math.ceil(visitors / 0.88);
  const requiredBudget = clicks * cpc;

  const optimizedVisitors = Math.ceil(leads / 0.065);
  const optimizedBooked = booked;
  const optimizedHeld = Math.ceil(targetClients / close);
  const optimizedClicks = Math.ceil(optimizedVisitors / 0.88);
  const optimizedBudget = optimizedClicks * cpc;
  const saved = Math.max(0, requiredBudget - optimizedBudget);

  const simClicks = Math.floor(Math.max(0, budget) / cpc);
  const simVisitors = Math.round(simClicks * 0.88);
  const simLeads = Math.round(simVisitors * landing);
  const simBooked = Math.round(simLeads * booking);
  const simHeld = Math.round(simBooked * showUp);
  const simDeals = Math.round(simHeld * close);
  const revenue = simDeals * Math.max(0, dealValue);
  const net = revenue - Math.max(0, budget);
  const roas = budget > 0 ? revenue / budget : 0;

  const ar = language === 'ar';
  const fr = language === 'fr';

  return (
    <div dir={direction} className="space-y-5">
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-xl bg-orange-50 text-[#FF6600]"><Calculator className="w-5 h-5" /></span>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{ar ? 'محاكي الميزانية الإعلانية' : fr ? 'Simulateur de budget publicitaire' : 'Ad Budget Simulator'}</h2>
            <p className="text-xs text-slate-500 mt-1">{ar ? 'قدّر الميزانية أو النتائج المتوقعة انطلاقاً من أداء الحملات المسجل' : fr ? 'Estimez le budget ou les résultats à partir des performances enregistrées' : 'Estimate budget or outcomes using recorded campaign performance'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl max-w-lg">
        <button onClick={() => setMode('target')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold ${mode === 'target' ? 'bg-[#0B434C] text-white shadow' : 'text-slate-600'}`}>{ar ? 'تحديد هدف الإيرادات' : fr ? 'Objectif de revenu' : 'Revenue target'}</button>
        <button onClick={() => setMode('budget')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold ${mode === 'budget' ? 'bg-[#0B434C] text-white shadow' : 'text-slate-600'}`}>{ar ? 'تحديد الميزانية' : fr ? 'Budget fixe' : 'Set a budget'}</button>
      </div>

      {usedFallback && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">{ar ? 'بعض مراحل الحساب لا تتوفر لها بيانات كافية بعد؛ استُخدمت افتراضات أولية للمراحل الناقصة. ستتغير النتائج تلقائياً مع تسجيل بيانات الحملات.' : fr ? 'Certaines étapes manquent de données : des hypothèses provisoires sont utilisées et seront remplacées dès que les campagnes auront des données.' : 'Some funnel stages lack recorded data; provisional assumptions are used until campaign data is available.'}</div>}

      {mode === 'target' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Target className="w-4 h-4 text-orange-500" />{ar ? 'معايير الهدف' : fr ? 'Paramètres de l’objectif' : 'Target parameters'}</h3>
            <label className="block text-xs font-semibold text-slate-600">{ar ? 'الإيرادات الشهرية المستهدفة (MAD)' : fr ? 'Revenu mensuel visé (MAD)' : 'Target monthly revenue (MAD)'}
              <input type="number" min="0" value={targetRevenue} onChange={e => setTargetRevenue(Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900" />
            </label>
            <div className="flex flex-wrap gap-2">{[45000,75000,100000,150000].map(v => <button key={v} onClick={() => setTargetRevenue(v)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700">{money(v)}</button>)}</div>
            <label className="block text-xs font-semibold text-slate-600">{ar ? 'متوسط قيمة العقد' : fr ? 'Valeur moyenne du contrat' : 'Average deal value'}
              <input type="number" min="1" value={dealValue} onChange={e => setDealValue(Math.max(1, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900" />
            </label>
            <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1">
              <div>{ar ? 'تكلفة النقرة' : fr ? 'CPC' : 'CPC'}: <b>{money(cpc)}</b></div>
              <div>{ar ? 'نسبة التحويل إلى عميل محتمل' : fr ? 'Conversion en prospect' : 'Visitor-to-lead'}: <b>{(landing*100).toFixed(1)}%</b></div>
              <div>{ar ? 'نسبة حضور المواعيد' : fr ? 'Taux de présence' : 'Show-up rate'}: <b>{(showUp*100).toFixed(1)}%</b></div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between gap-2"><h3 className="font-bold text-sm text-slate-900">{ar ? 'المسار المطلوب لتحقيق الهدف' : fr ? 'Parcours estimé pour atteindre l’objectif' : 'Estimated funnel to reach target'}</h3><span className="text-xs font-bold text-slate-500">{targetClients} {ar ? 'صفقة' : fr ? 'contrats' : 'deals'}</span></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[[ar?'النقرات':fr?'Clics':'Clicks,',clicks],[ar?'العملاء المحتملون':fr?'Prospects':'Leads',leads],[ar?'المواعيد المحجوزة':fr?'RDV réservés':'Booked meetings',booked],[ar?'المواعيد المنجزة':fr?'RDV effectués':'Attended meetings',held]].map(([label,val],i)=><div key={i} className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-semibold text-slate-500">{label}</div><div className="mt-1 text-xl font-extrabold text-slate-900">{Number(val).toLocaleString()}</div></div>)}
              </div>
              <div className="mt-4 rounded-xl bg-[#06252A] p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div><div className="text-xs text-slate-300">{ar ? 'الميزانية الشهرية المطلوبة' : fr ? 'Budget mensuel requis' : 'Required monthly budget'}</div><div className="text-2xl font-extrabold text-orange-400 mt-1">{money(requiredBudget)}</div></div>
                <div><div className="text-xs text-slate-300">{ar ? 'صافي تقديري قبل التكاليف الأخرى' : fr ? 'Net estimé avant autres coûts' : 'Estimated net before other costs'}</div><div className={`text-xl font-extrabold mt-1 ${targetRevenue-requiredBudget>=0?'text-emerald-400':'text-rose-300'}`}>{money(targetRevenue-requiredBudget)}</div></div>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900"><Zap className="w-4 h-4" />{ar ? 'سيناريو التحسين' : fr ? 'Scénario optimisé' : 'Optimized scenario'}</div>
              <p className="text-xs text-emerald-900 mt-2">{ar ? 'إذا ارتفع تحويل صفحة الهبوط إلى 6.5% وحضور المواعيد إلى 75%، فالميزانية التقديرية المطلوبة تصبح:' : fr ? 'Avec 6,5 % de conversion de page et 75 % de présence, le budget estimé devient :' : 'At 6.5% landing conversion and 75% show-up, estimated required budget becomes:'} <b>{money(optimizedBudget)}</b></p>
              <div className="mt-2 text-xs font-bold text-emerald-800">{ar ? 'توفير محتمل:' : fr ? 'Économie potentielle :' : 'Potential saving:'} {money(saved)}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2"><Calculator className="w-4 h-4 text-orange-500" />{ar ? 'إعدادات الميزانية' : fr ? 'Paramètres du budget' : 'Budget settings'}</h3>
            <label className="block text-xs font-semibold text-slate-600">{ar ? 'الميزانية الإعلانية (MAD)' : fr ? 'Budget publicitaire (MAD)' : 'Ad budget (MAD)'}
              <input type="number" min="0" step="1000" value={budget} onChange={e => setBudget(Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900" />
            </label>
            <div className="flex flex-wrap gap-2">{[8000,15000,25000,50000].map(v => <button key={v} onClick={() => setBudget(v)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-700">{money(v)}</button>)}</div>
            <label className="block text-xs font-semibold text-slate-600">{ar ? 'متوسط قيمة العقد' : fr ? 'Valeur moyenne du contrat' : 'Average deal value'}
              <input type="number" min="1" value={dealValue} onChange={e => setDealValue(Math.max(1, Number(e.target.value)))} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900" />
            </label>
          </div>
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between"><h3 className="font-bold text-sm text-slate-900">{ar ? 'النتائج المتوقعة' : fr ? 'Résultats estimés' : 'Projected results'}</h3><span className="text-xs font-bold text-emerald-700">ROAS {roas.toFixed(2)}x</span></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[[ar?'النقرات':fr?'Clics':'Clicks',simClicks],[ar?'العملاء المحتملون':fr?'Prospects':'Leads',simLeads],[ar?'المواعيد':fr?'RDV':'Meetings',simBooked],[ar?'الصفقات':fr?'Contrats':'Deals',simDeals]].map(([label,val],i)=><div key={i} className="rounded-xl bg-slate-50 p-3"><div className="text-[10px] font-semibold text-slate-500">{label}</div><div className="mt-1 text-xl font-extrabold text-slate-900">{Number(val).toLocaleString()}</div></div>)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4"><div className="text-xs text-emerald-800">{ar?'الإيرادات المتوقعة':fr?'Revenu estimé':'Projected revenue'}</div><div className="text-xl font-extrabold text-emerald-800 mt-1">{money(revenue)}</div></div>
              <div className={`rounded-xl border p-4 ${net>=0?'bg-sky-50 border-sky-200':'bg-rose-50 border-rose-200'}`}><div className="text-xs text-slate-700">{ar?'النتيجة بعد الإعلانات':fr?'Résultat après publicité':'After-ad result'}</div><div className="text-xl font-extrabold text-slate-900 mt-1">{money(net)}</div></div>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" />{ar?'هذه تقديرات وليست ضماناً للنتائج.' : fr ? 'Il s’agit d’estimations, pas de garanties.' : 'These are estimates, not guaranteed results.'}</div>
          </div>
        </div>
      )}
    </div>
  );
};
