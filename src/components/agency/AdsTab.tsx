import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  BarChart2,
  CheckCircle2,
  PlayCircle,
  CheckCheck,
  UserCheck,
  UserX,
  Eye,
  ArrowDownRight,
  TrendingUp,
  Plus,
  Award,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Line,
  Legend,
  ReferenceLine,
} from 'recharts';
import { translations } from '../../translations';
import { AdCampaignMetric } from '../../types/agency';

export const AdsTab: React.FC = () => {
  const { campaigns, updateCampaign, addCampaign, language, direction } = useAgency();
  const t = translations[language];

  // ROAS & ROI Module Controls
  const [platformScope, setPlatformScope] = useState<'all' | 'meta'>('all');
  const [roasSortBy, setRoasSortBy] = useState<'roas' | 'profit'>('roas');
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);

  // New Campaign Modal Form State
  const [newCampName, setNewCampName] = useState('');
  const [newCampPlatform, setNewCampPlatform] = useState<AdCampaignMetric['platform']>('meta');
  const [newCampSpend, setNewCampSpend] = useState('2500');
  const [newCampRevenue, setNewCampRevenue] = useState('12500');
  const [newCampLeads, setNewCampLeads] = useState('18');
  const [newCampDeals, setNewCampDeals] = useState('2');

  // Aggregate Funnel Metrics across campaigns
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalLandingVisitors = campaigns.reduce((sum, c) => sum + (c.landingPageVisitors || 0), 0);
  const totalVideoStarted = campaigns.reduce((sum, c) => sum + (c.videoStartedCount || 0), 0);
  const totalVideoCompleted = campaigns.reduce((sum, c) => sum + (c.videoCompletedCount || 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsGenerated || 0), 0);
  const totalShowedUp = campaigns.reduce((sum, c) => sum + (c.meetingsShowedUp || 0), 0);
  const totalNoShow = campaigns.reduce((sum, c) => sum + (c.meetingsNoShow || 0), 0);

  // Conversion & Drop-off Calculations
  const ctrPercent = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const dropoffImpToClick = (100 - parseFloat(ctrPercent)).toFixed(2);

  const clickToLeadPercent = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) : '0';
  const dropoffClickToLead = (100 - parseFloat(clickToLeadPercent)).toFixed(1);

  const leadToAttendancePercent = totalLeads > 0 ? ((totalShowedUp / totalLeads) * 100).toFixed(1) : '0';
  const dropoffLeadToAttendance = (100 - parseFloat(leadToAttendancePercent)).toFixed(1);

  const attendanceRate =
    totalShowedUp + totalNoShow > 0
      ? Math.round((totalShowedUp / (totalShowedUp + totalNoShow)) * 100)
      : 0;

  // ROAS & ROI Profitability Calculations per Campaign
  const roasRows = useMemo(() => {
    const filtered =
      platformScope === 'meta'
        ? campaigns.filter((c) => c.platform === 'meta')
        : campaigns;

    const computed = filtered.map((c) => {
      const spend = Math.max(0, c.spend || 0);
      const revenue = Math.max(0, c.revenueGenerated ?? 0);
      const netProfit = revenue - spend;
      const roas = spend > 0 ? revenue / spend : 0;
      const roiPct = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;

      // Concise short name for X-axis readability
      const cleanShortName = c.campaignName.includes(' - ')
        ? c.campaignName.split(' - ')[0] + ' · ' + c.campaignName.split(' - ')[1].slice(0, 18) + '...'
        : c.campaignName.length > 26
        ? c.campaignName.slice(0, 26) + '...'
        : c.campaignName;

      return {
        ...c,
        spend,
        revenue,
        netProfit,
        roas,
        roasFixed: Number(roas.toFixed(2)),
        roiPct,
        roiFixed: Number(roiPct.toFixed(1)),
        shortName: cleanShortName,
      };
    });

    return [...computed].sort((a, b) =>
      roasSortBy === 'roas' ? b.roas - a.roas : b.netProfit - a.netProfit
    );
  }, [campaigns, platformScope, roasSortBy]);

  const roasTotals = useMemo(() => {
    const sumSpend = roasRows.reduce((s, r) => s + r.spend, 0);
    const sumRevenue = roasRows.reduce((s, r) => s + r.revenue, 0);
    const sumProfit = sumRevenue - sumSpend;
    const blendedRoas = sumSpend > 0 ? sumRevenue / sumSpend : 0;
    const blendedRoiPct = sumSpend > 0 ? ((sumRevenue - sumSpend) / sumSpend) * 100 : 0;
    const topWinner = roasRows[0] || null;
    return { sumSpend, sumRevenue, sumProfit, blendedRoas, blendedRoiPct, topWinner };
  }, [roasRows]);

  const roasCopy = {
    ar: {
      sectionTitle: 'حاسبة وتقييم ربحية الحملات الإعلانية (ROAS & ROI)',
      sectionSub: 'أدخل مصاريف إعلانات ميتا وإجمالي الإيرادات لكل حملة لحساب العائد الفعلي (ROAS) والعائد على الاستثمار (ROI) وتحديد الحملات الأكثر ربحية',
      scopeAll: 'كافة المنصات',
      scopeMeta: 'حملات ميتا فقط',
      sortByRoas: 'ترتيب حسب أعلى ROAS',
      sortByProfit: 'ترتيب حسب صافي الربح',
      addCampaignBtn: '+ إضافة حملة جديدة',
      kpiSpend: 'إجمالي الإنفاق الإعلاني',
      kpiRevenue: 'إجمالي الإيرادات المحققة',
      kpiBlendedRoas: 'معدل العائد على الإنفاق (ROAS)',
      kpiBlendedRoi: 'صافي الربح ونسبة ROI',
      chartTitle: 'مقارنة الإنفاق الإعلاني مقابل الإيرادات و ROAS لكل حملة',
      legendSpend: 'الإنفاق الإعلاني (MAD)',
      legendRevenue: 'إجمالي الإيرادات (MAD)',
      legendRoas: 'العائد ROAS (x)',
      colCampaign: 'الحملة الإعلانية',
      colSpendInput: 'الإنفاق الإعلاني (MAD)',
      colRevenueInput: 'إجمالي الإيرادات (MAD)',
      colNetProfit: 'صافي الربح',
      colRoas: 'ROAS',
      colRoi: 'ROI %',
      colVerdict: 'التقييم',
      topWinnerTag: 'الأكثر ربحية #1',
      statusScale: 'ممتاز للتوسيع',
      statusProfitable: 'حملة رابحة',
      statusLow: 'عائد منخفض / خسارة',
      breakEvenLine: 'نقطة التعادل 1x',
      modalTitle: 'إضافة حملة إعلانية لتتبع ROAS و ROI',
      fieldName: 'اسم الحملة الإعلانية:',
      fieldNamePh: 'مثال: Meta Ads - حملة وكالات الرباط...',
      fieldPlatform: 'المنصة:',
      fieldSpend: 'الإنفاق الإعلاني (درهم):',
      fieldRevenue: 'إجمالي الإيرادات المحققة (درهم):',
      fieldLeads: 'عدد العملاء المحتملين:',
      fieldDeals: 'عدد الصفقات المغلقة:',
      btnCancel: 'إلغاء',
      btnSave: 'حفظ الحملة وحساب العائد',
      previewLabel: 'المعاينة المباشرة:',
    },
    fr: {
      sectionTitle: 'Calculateur & Rentabilité des Campagnes (ROAS & ROI)',
      sectionSub: 'Saisissez vos dépenses Meta Ads et le revenu total par campagne pour calculer et visualiser le ROAS et le ROI réels',
      scopeAll: 'Toutes les plateformes',
      scopeMeta: 'Meta Ads uniquement',
      sortByRoas: 'Trier : Meilleur ROAS',
      sortByProfit: 'Trier : Profit Net',
      addCampaignBtn: '+ Ajouter une campagne',
      kpiSpend: 'Dépenses Pubs Totales',
      kpiRevenue: 'Revenu Total Généré',
      kpiBlendedRoas: 'ROAS Global Moyen',
      kpiBlendedRoi: 'Bénéfice Net & ROI',
      chartTitle: 'Dépenses vs Revenus & ROAS par Campagne',
      legendSpend: 'Dépense Pub (MAD)',
      legendRevenue: 'Revenu Total (MAD)',
      legendRoas: 'ROAS (x)',
      colCampaign: 'Campagne Publicitaire',
      colSpendInput: 'Dépense Meta / Pub (MAD)',
      colRevenueInput: 'Revenu Total (MAD)',
      colNetProfit: 'Profit Net',
      colRoas: 'ROAS',
      colRoi: 'ROI %',
      colVerdict: 'Performance',
      topWinnerTag: 'Top Rentabilité #1',
      statusScale: 'À scaler',
      statusProfitable: 'Rentable',
      statusLow: 'Faible / Perte',
      breakEvenLine: 'Seuil 1x',
      modalTitle: 'Ajouter une campagne (Suivi ROAS & ROI)',
      fieldName: 'Nom de la campagne :',
      fieldNamePh: 'Ex : Meta Ads - Leads Agences Rabat...',
      fieldPlatform: 'Plateforme :',
      fieldSpend: 'Budget Dépensé (MAD) :',
      fieldRevenue: 'Revenu Total Généré (MAD) :',
      fieldLeads: 'Leads générés :',
      fieldDeals: 'Deals conclus :',
      btnCancel: 'Annuler',
      btnSave: 'Enregistrer la campagne',
      previewLabel: 'Aperçu en direct :',
    },
    en: {
      sectionTitle: 'Campaign Profitability & ROAS / ROI Analyzer',
      sectionSub: 'Input Meta ad spend and total revenue generated per campaign to calculate actual ROAS and ROI and spotlight top-performing ads',
      scopeAll: 'All Platforms',
      scopeMeta: 'Meta Ads Only',
      sortByRoas: 'Sort: Highest ROAS',
      sortByProfit: 'Sort: Net Profit',
      addCampaignBtn: '+ Add Campaign',
      kpiSpend: 'Total Ad Spend',
      kpiRevenue: 'Total Campaign Revenue',
      kpiBlendedRoas: 'Blended ROAS',
      kpiBlendedRoi: 'Net Profit & ROI',
      chartTitle: 'Ad Spend vs. Total Revenue & ROAS by Campaign',
      legendSpend: 'Ad Spend (MAD)',
      legendRevenue: 'Total Revenue (MAD)',
      legendRoas: 'Actual ROAS (x)',
      colCampaign: 'Ad Campaign',
      colSpendInput: 'Meta / Ad Spend (MAD)',
      colRevenueInput: 'Total Revenue (MAD)',
      colNetProfit: 'Net Profit',
      colRoas: 'ROAS',
      colRoi: 'ROI %',
      colVerdict: 'Status',
      topWinnerTag: '#1 Most Profitable',
      statusScale: 'Scale Winner',
      statusProfitable: 'Profitable',
      statusLow: 'Low / Loss',
      breakEvenLine: 'Break-even 1x',
      modalTitle: 'Add Ad Campaign for ROAS & ROI Tracking',
      fieldName: 'Campaign Name:',
      fieldNamePh: 'e.g. Meta Ads - Casablanca Luxury Retargeting...',
      fieldPlatform: 'Platform:',
      fieldSpend: 'Ad Spend (MAD):',
      fieldRevenue: 'Total Revenue (MAD):',
      fieldLeads: 'Leads Generated:',
      fieldDeals: 'Deals Closed:',
      btnCancel: 'Cancel',
      btnSave: 'Save Campaign',
      previewLabel: 'Live Preview:',
    },
  }[language];

  const handleAddCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;
    const spendNum = Math.max(0, Number(newCampSpend) || 0);
    const revNum = Math.max(0, Number(newCampRevenue) || 0);
    const leadsNum = Math.max(0, Number(newCampLeads) || 0);
    const dealsNum = Math.max(0, Number(newCampDeals) || 0);

    addCampaign({
      campaignName: newCampName.trim(),
      platform: newCampPlatform,
      spend: spendNum,
      revenueGenerated: revNum,
      impressions: Math.max(leadsNum * 320, spendNum * 6),
      clicks: Math.max(leadsNum * 12, Math.round(spendNum * 0.2)),
      landingPageVisitors: Math.max(leadsNum * 10, Math.round(spendNum * 0.16)),
      videoStartedCount: Math.max(leadsNum * 8, Math.round(spendNum * 0.12)),
      videoCompletedCount: Math.max(leadsNum * 4, Math.round(spendNum * 0.07)),
      leadsGenerated: leadsNum,
      meetingsBooked: Math.max(dealsNum * 2, Math.round(leadsNum * 0.35)),
      meetingsShowedUp: Math.max(dealsNum, Math.round(leadsNum * 0.25)),
      meetingsNoShow: Math.max(0, Math.round(leadsNum * 0.08)),
      dealsClosed: dealsNum,
      startDate: new Date().toISOString().slice(0, 10),
      status: 'active',
    });

    setShowAddCampaignModal(false);
    setNewCampName('');
  };

  const adsText = {
    channelsBadge:
      language === 'ar'
        ? 'إعلانات ميتا وجوجل B2B'
        : language === 'fr'
        ? 'Meta & Google B2B'
        : 'Meta & Google B2B',
    conversionPct:
      language === 'ar' ? 'نسبة التحويل' : language === 'fr' ? 'Conversion %' : 'Conversion %',
    dropoffPct:
      language === 'ar' ? 'نسبة التسرب' : language === 'fr' ? 'Abandon %' : 'Drop-off %',
    landingTag:
      language === 'ar' ? 'صفحة الهبوط' : language === 'fr' ? 'Page de capture' : 'Landing Page',
    visitorsUnit:
      language === 'ar' ? 'زائر' : language === 'fr' ? 'visiteurs' : 'visitors',
    videoPlaysTag:
      language === 'ar' ? 'مشاهدة الفيديو' : language === 'fr' ? 'Lecture vidéo' : 'Video Plays',
    videoStartedTitle:
      language === 'ar' ? 'بدؤوا مشاهدة الفيديو' : language === 'fr' ? 'Vidéo démarrée' : 'Video Started',
    viewsUnit:
      language === 'ar' ? 'مشاهدة' : language === 'fr' ? 'vues' : 'views',
    completed100Tag:
      language === 'ar' ? 'أكملوا 100%' : language === 'fr' ? 'Complété 100%' : 'Completed 100%',
    vslFullUnit:
      language === 'ar' ? 'فيديو كامل' : language === 'fr' ? 'Vidéo 100%' : '100% Video',
    showUpRateTag:
      language === 'ar' ? 'معدل الحضور' : language === 'fr' ? 'Taux présence' : 'Show-Up Rate',
    noShowTag:
      language === 'ar' ? 'تخلف عن الحضور' : language === 'fr' ? 'Absences' : 'No-Show',
    noShowsUnit:
      language === 'ar' ? 'موعد غائب' : language === 'fr' ? 'absences' : 'no-shows',
    colCampaign:
      language === 'ar' ? 'الحملة الإعلانية' : language === 'fr' ? 'Campagne' : 'Campaign',
    colPlatform:
      language === 'ar' ? 'المنصة' : language === 'fr' ? 'Plateforme' : 'Platform',
    vslCol:
      language === 'ar' ? 'أكمل الفيديو 100%' : language === 'fr' ? 'Vidéo 100%' : 'Full Video',
  };

  const funnelDropoffData = [
    {
      step: t.stepImpressions,
      name: t.stepImpressions,
      volume: totalImpressions,
      conversionRate: 100,
      dropoffRate: 0,
      color: '#3B82F6',
    },
    {
      step: t.stepClicks,
      name: t.stepClicks,
      volume: totalClicks,
      conversionRate: parseFloat(ctrPercent),
      dropoffRate: parseFloat(dropoffImpToClick),
      color: '#6366F1',
    },
    {
      step: t.stepLeads,
      name: t.stepLeads,
      volume: totalLeads,
      conversionRate: parseFloat(clickToLeadPercent),
      dropoffRate: parseFloat(dropoffClickToLead),
      color: '#F59E0B',
    },
    {
      step: t.stepAttended,
      name: t.stepAttended,
      volume: totalShowedUp,
      conversionRate: parseFloat(leadToAttendancePercent),
      dropoffRate: parseFloat(dropoffLeadToAttendance),
      color: '#10B981',
    },
  ];

  const stepTransitions = [
    {
      from: t.stepImpressions,
      to: t.stepClicks,
      convRate: `${ctrPercent}%`,
      dropoffRate: `${dropoffImpToClick}%`,
    },
    {
      from: t.stepClicks,
      to: t.stepLeads,
      convRate: `${clickToLeadPercent}%`,
      dropoffRate: `${dropoffClickToLead}%`,
    },
    {
      from: t.stepLeads,
      to: t.stepAttended,
      convRate: `${leadToAttendancePercent}%`,
      dropoffRate: `${dropoffLeadToAttendance}%`,
    },
  ];

  const modalSpendNum = Math.max(0, Number(newCampSpend) || 0);
  const modalRevNum = Math.max(0, Number(newCampRevenue) || 0);
  const modalPreviewRoas = modalSpendNum > 0 ? modalRevNum / modalSpendNum : 0;
  const modalPreviewRoi = modalSpendNum > 0 ? ((modalRevNum - modalSpendNum) / modalSpendNum) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-900 border border-blue-200">
              {t.adsHeaderTag}
            </span>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {adsText.channelsBadge}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.adsHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {t.adsHeaderDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-center font-mono text-xs shrink-0">
          <div
            className={`w-full md:w-auto bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl ${
              direction === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            <span className="text-[10px] text-slate-500 block font-sans font-bold">
              {t.kpiTotalAdSpend}
            </span>
            <span className="text-lg font-bold tabular-nums text-slate-900">
              {totalSpend.toLocaleString()} {t.mad}
            </span>
          </div>
        </div>
      </div>

      {/* 1B. DEDICATED CAMPAIGN ROAS & ROI PROFITABILITY MODULE */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
        {/* Header & Interactive Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-orange-50 text-[#FF6600] border border-orange-200">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {roasCopy.sectionTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {roasCopy.sectionSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start xl:self-center">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPlatformScope('all')}
                className={`px-3 min-h-[36px] text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  platformScope === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {roasCopy.scopeAll}
              </button>
              <button
                type="button"
                onClick={() => setPlatformScope('meta')}
                className={`px-3 min-h-[36px] text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  platformScope === 'meta'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {roasCopy.scopeMeta}
              </button>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRoasSortBy('roas')}
                className={`px-3 min-h-[36px] text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  roasSortBy === 'roas'
                    ? 'bg-[#082E35] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {roasCopy.sortByRoas}
              </button>
              <button
                type="button"
                onClick={() => setRoasSortBy('profit')}
                className={`px-3 min-h-[36px] text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  roasSortBy === 'profit'
                    ? 'bg-[#082E35] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {roasCopy.sortByProfit}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCampaignModal(true)}
              className="min-h-[40px] px-4 py-2 bg-[#FF6600] hover:bg-[#E65500] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{roasCopy.addCampaignBtn}</span>
            </button>
          </div>
        </div>

        {/* Blended ROAS / ROI Tabular Executive Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">{roasCopy.kpiSpend}</span>
            <span className="text-base sm:text-xl font-extrabold font-mono tabular-nums text-[#FF6600] mt-0.5 block">
              -{roasTotals.sumSpend.toLocaleString()} {t.mad}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">{roasCopy.kpiRevenue}</span>
            <span className="text-base sm:text-xl font-extrabold font-mono tabular-nums text-[#082E35] mt-0.5 block">
              {roasTotals.sumRevenue.toLocaleString()} {t.mad}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">{roasCopy.kpiBlendedRoas}</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className={`text-base sm:text-xl font-extrabold font-mono tabular-nums ${
                  roasTotals.blendedRoas >= 2 ? 'text-emerald-700' : roasTotals.blendedRoas >= 1 ? 'text-amber-700' : 'text-rose-600'
                }`}
              >
                {roasTotals.blendedRoas.toFixed(2)}x
              </span>
              {roasTotals.topWinner && (
                <span className="text-[11px] font-mono tabular-nums text-slate-500 truncate max-w-[140px]">
                  ({roasTotals.topWinner.roasFixed.toFixed(2)}x max)
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block">{roasCopy.kpiBlendedRoi}</span>
            <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
              <span
                className={`text-base sm:text-xl font-extrabold font-mono tabular-nums ${
                  roasTotals.sumProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {roasTotals.blendedRoiPct >= 0 ? '+' : ''}
                {roasTotals.blendedRoiPct.toFixed(0)}%
              </span>
              <span className="text-xs font-mono tabular-nums font-bold text-slate-600">
                ({roasTotals.sumProfit >= 0 ? '+' : ''}
                {roasTotals.sumProfit.toLocaleString()} {t.mad})
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Spend vs Revenue & ROAS Visualization */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-3">{roasCopy.chartTitle}</h4>
          <div className="h-72 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={roasRows} margin={{ top: 12, right: 14, left: -4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="shortName"
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  interval={0}
                />
                <YAxis
                  yAxisId="mad"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
                />
                <YAxis
                  yAxisId="roas"
                  orientation="right"
                  domain={[0, 'auto']}
                  tick={{ fontSize: 11, fill: '#16A34A', fontWeight: 700 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}x`}
                />
                <ReferenceLine
                  yAxisId="roas"
                  y={1}
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  label={{
                    value: roasCopy.breakEvenLine,
                    position: 'insideTopRight',
                    fill: '#64748B',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const row = payload[0]?.payload as (typeof roasRows)[number] | undefined;
                    if (!row) return null;
                    return (
                      <div
                        dir={direction}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5 min-w-[230px] max-w-xs"
                      >
                        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 leading-snug">
                          {row.campaignName}
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-600">{roasCopy.legendSpend}</span>
                          <span className="font-mono tabular-nums font-bold text-[#FF6600]">
                            -{row.spend.toLocaleString()} {t.mad}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-600">{roasCopy.legendRevenue}</span>
                          <span className="font-mono tabular-nums font-bold text-[#082E35]">
                            {row.revenue.toLocaleString()} {t.mad}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-600">{roasCopy.colNetProfit}</span>
                          <span
                            className={`font-mono tabular-nums font-bold ${
                              row.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {row.netProfit >= 0 ? '+' : ''}
                            {row.netProfit.toLocaleString()} {t.mad}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-4 font-bold">
                          <span className="text-slate-900">{roasCopy.colRoas}</span>
                          <span className="font-mono tabular-nums text-emerald-700">
                            {row.roasFixed.toFixed(2)}x
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 font-bold">
                          <span className="text-slate-900">{roasCopy.colRoi}</span>
                          <span
                            className={`font-mono tabular-nums ${
                              row.roiPct >= 0 ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {row.roiPct >= 0 ? '+' : ''}
                            {row.roiFixed.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 700 }}
                />
                <Bar
                  yAxisId="mad"
                  dataKey="spend"
                  name={roasCopy.legendSpend}
                  fill="#FF6600"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
                <Bar
                  yAxisId="mad"
                  dataKey="revenue"
                  name={roasCopy.legendRevenue}
                  fill="#082E35"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={30}
                />
                <Line
                  yAxisId="roas"
                  type="monotone"
                  dataKey="roasFixed"
                  name={roasCopy.legendRoas}
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#16A34A', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Per-Campaign Input & ROAS/ROI Table */}
        <div className="border-t border-slate-200 pt-4">
          <div className="overflow-x-auto">
            <table
              className={`w-full text-xs whitespace-nowrap ${
                direction === 'rtl' ? 'text-right' : 'text-left'
              }`}
            >
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">{roasCopy.colCampaign}</th>
                  <th className="p-3">{roasCopy.colSpendInput}</th>
                  <th className="p-3">{roasCopy.colRevenueInput}</th>
                  <th className="p-3">{roasCopy.colNetProfit}</th>
                  <th className="p-3">{roasCopy.colRoas}</th>
                  <th className="p-3">{roasCopy.colRoi}</th>
                  <th className="p-3">{roasCopy.colVerdict}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roasRows.map((row, idx) => {
                  const isTopWinner = idx === 0 && row.roas > 0;
                  const statusLabel =
                    row.roas >= 4
                      ? roasCopy.statusScale
                      : row.roas >= 1.5
                      ? roasCopy.statusProfitable
                      : roasCopy.statusLow;

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isTopWinner ? 'bg-emerald-50/40' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="p-3 max-w-[260px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold uppercase text-slate-500">
                            {row.platform}
                          </span>
                          {isTopWinner && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{roasCopy.topWinnerTag}</span>
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-slate-900 block truncate mt-0.5" title={row.campaignName}>
                          {row.campaignName}
                        </span>
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={row.spend}
                          onChange={(e) =>
                            updateCampaign(row.id, {
                              spend: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          aria-label={`${roasCopy.colSpendInput} - ${row.campaignName}`}
                          className="w-28 min-h-[40px] px-2.5 bg-slate-50 border border-slate-300 focus:border-[#FF6600] focus:bg-white rounded-xl font-mono tabular-nums font-bold text-slate-900 focus:outline-none"
                        />
                      </td>

                      <td className="p-3">
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={row.revenue}
                          onChange={(e) =>
                            updateCampaign(row.id, {
                              revenueGenerated: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          aria-label={`${roasCopy.colRevenueInput} - ${row.campaignName}`}
                          className="w-32 min-h-[40px] px-2.5 bg-slate-50 border border-slate-300 focus:border-[#082E35] focus:bg-white rounded-xl font-mono tabular-nums font-bold text-slate-900 focus:outline-none"
                        />
                      </td>

                      <td className="p-3 font-mono tabular-nums font-extrabold">
                        <span className={row.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                          {row.netProfit >= 0 ? '+' : ''}
                          {row.netProfit.toLocaleString()} {t.mad}
                        </span>
                      </td>

                      <td className="p-3 font-mono tabular-nums font-extrabold text-sm">
                        <span
                          className={
                            row.roas >= 3
                              ? 'text-emerald-700'
                              : row.roas >= 1.5
                              ? 'text-[#082E35]'
                              : 'text-rose-600'
                          }
                        >
                          {row.roasFixed.toFixed(2)}x
                        </span>
                      </td>

                      <td className="p-3 font-mono tabular-nums font-extrabold">
                        <span className={row.roiPct >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                          {row.roiPct >= 0 ? '+' : ''}
                          {row.roiFixed.toFixed(1)}%
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                            row.roas >= 4
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : row.roas >= 1.5
                              ? 'bg-slate-100 text-slate-800 border-slate-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. Funnel Drop-Off Visualization Section */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-100 text-[#FF6600]">
                <BarChart2 className="w-5 h-5 stroke-[2.5]" />
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {t.funnelSectionTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t.funnelSectionSub}</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold text-slate-500">{t.metricAttendedRate}:</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
              {leadToAttendancePercent}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 h-64 sm:h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelDropoffData}
                margin={{ top: 15, right: 12, left: 4, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="step"
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#FF6600' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [value, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar yAxisId="left" dataKey="volume" name={t.leads} radius={[8, 8, 0, 0]} maxBarSize={55}>
                  {funnelDropoffData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  name="%"
                  stroke="#FF6600"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#FF6600', strokeWidth: 2, stroke: '#FFFFFF' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              {t.funnelSectionTitle}
            </h4>

            {stepTransitions.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-orange-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 gap-2">
                  <span className="truncate">{step.from}</span>
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
                  <span className="truncate">{step.to}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 font-mono text-xs">
                  <div
                    className={`bg-emerald-50 border border-emerald-200 p-2 rounded-lg ${
                      direction === 'rtl' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span className="text-[10px] text-emerald-800 font-sans font-bold block">
                      {adsText.conversionPct}
                    </span>
                    <span className="text-base font-extrabold text-emerald-700">{step.convRate}</span>
                  </div>
                  <div
                    className={`bg-rose-50 border border-rose-200 p-2 rounded-lg ${
                      direction === 'rtl' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <span className="text-[10px] text-rose-800 font-sans font-bold block">
                      {adsText.dropoffPct}
                    </span>
                    <span className="text-base font-extrabold text-rose-700">{step.dropoffRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Funnel Cards (Uniform 2-Column Mobile Grid -> 5-Column Desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
        <div className="bg-gradient-to-br from-white to-blue-50/40 p-3.5 sm:p-4.5 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700 shrink-0">
              <Eye className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full truncate">
              {adsText.landingTag}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">
            {t.kpiLandingVisitors}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-slate-900">
              {totalLandingVisitors.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-bold">{adsText.visitorsUnit}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50/40 p-3.5 sm:p-4.5 rounded-2xl border border-indigo-200">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
              <PlayCircle className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100/80 px-2 py-0.5 rounded-full truncate">
              {adsText.videoPlaysTag}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">
            {adsText.videoStartedTitle}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-indigo-900">
              {totalVideoStarted.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-bold">{adsText.viewsUnit}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50/40 p-3.5 sm:p-4.5 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700 shrink-0">
              <CheckCheck className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full truncate">
              {adsText.completed100Tag}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">
            {t.kpiVideoWatch}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-purple-900">
              {totalVideoCompleted.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-bold">{adsText.vslFullUnit}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50/40 p-3.5 sm:p-4.5 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full truncate">
              {adsText.showUpRateTag}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">
            {t.attended}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-emerald-700">
              {totalShowedUp}
            </span>
            <span className="text-[11px] text-slate-500 font-bold">{t.clientsUnit}</span>
            <span className="text-[11px] text-emerald-700 font-mono tabular-nums font-bold ms-auto">
              {attendanceRate}%
            </span>
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-white to-rose-50/40 p-3.5 sm:p-4.5 rounded-2xl border border-rose-200">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700 shrink-0">
              <UserX className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full truncate">
              {adsText.noShowTag}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 block truncate">
            {t.notAttended}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums text-rose-700">
              {totalNoShow}
            </span>
            <span className="text-[11px] text-slate-500 font-bold">{adsText.noShowsUnit}</span>
          </div>
        </div>
      </div>

      {/* 4. Detailed Campaign Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t.adsHeaderTitle}</h3>
            <span className="text-xs text-slate-500">{t.adsHeaderDesc}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            className={`w-full text-xs whitespace-nowrap ${
              direction === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">{adsText.colCampaign}</th>
                <th className="p-3.5">{adsText.colPlatform}</th>
                <th className="p-3.5">{t.kpiTotalAdSpend}</th>
                <th className="p-3.5 text-center bg-blue-50/40 text-blue-900">{t.stepImpressions}</th>
                <th className="p-3.5 text-center bg-indigo-50/40 text-indigo-900">{t.stepClicks}</th>
                <th className="p-3.5 text-center bg-purple-50/40 text-purple-900">{adsText.vslCol}</th>
                <th className="p-3.5 text-center">{t.stepLeads}</th>
                <th className="p-3.5 text-center bg-emerald-50/40 text-emerald-900">{t.attended}</th>
                <th className="p-3.5 text-center bg-rose-50/40 text-rose-900">{t.notAttended}</th>
                <th className="p-3.5 text-center">{t.stepClosed}</th>
                <th className="p-3.5">{t.colSystemStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">{camp.campaignName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-100 text-slate-800">
                      {camp.platform}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-slate-900">
                    {camp.spend.toLocaleString()} {t.mad}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-blue-800 text-center bg-blue-50/20">
                    {camp.impressions.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-indigo-800 text-center bg-indigo-50/20">
                    {camp.clicks.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-purple-800 text-center bg-purple-50/20">
                    {camp.videoCompletedCount || 0}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums text-slate-700 font-bold text-center">
                    {camp.leadsGenerated}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-emerald-700 text-center bg-emerald-50/20">
                    {camp.meetingsShowedUp || 0}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-rose-600 text-center bg-rose-50/20">
                    {camp.meetingsNoShow || 0}
                  </td>
                  <td className="p-3.5 font-mono tabular-nums font-bold text-emerald-800 text-center">
                    {camp.dealsClosed}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {t.active}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Campaign Modal */}
      {showAddCampaignModal && (
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
              <span className="text-sm">{roasCopy.modalTitle}</span>
              <button
                type="button"
                onClick={() => setShowAddCampaignModal(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCampaignSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{roasCopy.fieldName}</label>
                <input
                  type="text"
                  required
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder={roasCopy.fieldNamePh}
                  className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{roasCopy.fieldPlatform}</label>
                  <select
                    value={newCampPlatform}
                    onChange={(e) => setNewCampPlatform(e.target.value as AdCampaignMetric['platform'])}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    <option value="meta">Meta Ads</option>
                    <option value="google">Google Ads</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="referral">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{roasCopy.fieldSpend}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCampSpend}
                    onChange={(e) => setNewCampSpend(e.target.value)}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{roasCopy.fieldRevenue}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newCampRevenue}
                    onChange={(e) => setNewCampRevenue(e.target.value)}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{roasCopy.fieldLeads}</label>
                  <input
                    type="number"
                    min={0}
                    value={newCampLeads}
                    onChange={(e) => setNewCampLeads(e.target.value)}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{roasCopy.fieldDeals}</label>
                  <input
                    type="number"
                    min={0}
                    value={newCampDeals}
                    onChange={(e) => setNewCampDeals(e.target.value)}
                    className="w-full min-h-[44px] px-3 bg-slate-50 border border-slate-200 rounded-xl font-mono tabular-nums font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Instant ROAS & ROI Preview */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <span className="font-bold text-slate-600">{roasCopy.previewLabel}</span>
                <div className="flex items-center gap-4 font-mono tabular-nums font-extrabold">
                  <span className="text-emerald-700">
                    ROAS: {modalPreviewRoas.toFixed(2)}x
                  </span>
                  <span className={modalPreviewRoi >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                    ROI: {modalPreviewRoi >= 0 ? '+' : ''}
                    {modalPreviewRoi.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="px-4 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  {roasCopy.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-5 min-h-[44px] bg-[#FF6600] hover:bg-[#E65500] text-white rounded-xl font-bold cursor-pointer"
                >
                  {roasCopy.btnSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
