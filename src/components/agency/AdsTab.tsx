import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Target,
  DollarSign,
  TrendingUp,
  Plus,
  BarChart2,
  Calendar,
  CheckCircle2,
  Video,
  PlayCircle,
  CheckCheck,
  UserCheck,
  UserX,
  Users,
  Eye,
  ArrowRight,
  ExternalLink,
  MousePointerClick,
  FileText,
  TrendingDown,
  Filter,
  Layers,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Line,
} from 'recharts';
import { translations } from '../../translations';

export const AdsTab: React.FC = () => {
  const { campaigns, metrics, language, direction } = useAgency();
  const t = translations[language];

  // Aggregate Funnel Metrics across campaigns
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalLandingVisitors = campaigns.reduce((sum, c) => sum + (c.landingPageVisitors || 0), 0);
  const totalVideoStarted = campaigns.reduce((sum, c) => sum + (c.videoStartedCount || 0), 0);
  const totalVideoCompleted = campaigns.reduce((sum, c) => sum + (c.videoCompletedCount || 0), 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.leadsGenerated || 0), 0);
  const totalMeetingsBooked = campaigns.reduce((sum, c) => sum + (c.meetingsBooked || 0), 0);
  const totalShowedUp = campaigns.reduce((sum, c) => sum + (c.meetingsShowedUp || 0), 0);
  const totalNoShow = campaigns.reduce((sum, c) => sum + (c.meetingsNoShow || 0), 0);
  const totalDealsClosed = campaigns.reduce((sum, c) => sum + (c.dealsClosed || 0), 0);

  // Conversion & Drop-off Calculations
  const ctrPercent = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';
  const dropoffImpToClick = (100 - parseFloat(ctrPercent)).toFixed(2);

  const clickToLeadPercent = totalClicks > 0 ? ((totalLeads / totalClicks) * 100).toFixed(1) : '0';
  const dropoffClickToLead = (100 - parseFloat(clickToLeadPercent)).toFixed(1);

  const leadToAttendancePercent = totalLeads > 0 ? ((totalShowedUp / totalLeads) * 100).toFixed(1) : '0';
  const dropoffLeadToAttendance = (100 - parseFloat(leadToAttendancePercent)).toFixed(1);

  const videoCompletionRate = totalVideoStarted > 0 ? Math.round((totalVideoCompleted / totalVideoStarted) * 100) : 0;
  const attendanceRate = (totalShowedUp + totalNoShow) > 0 ? Math.round((totalShowedUp / (totalShowedUp + totalNoShow)) * 100) : 0;

  // Funnel drop-off visualization data for Recharts
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

  // Side-by-side transition steps for drop-off comparison
  const stepTransitions = [
    {
      from: t.stepImpressions,
      to: t.stepClicks,
      fromVal: totalImpressions,
      toVal: totalClicks,
      convRate: `${ctrPercent}%`,
      dropoffRate: `${dropoffImpToClick}%`,
      status: 'CTR B2B',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      from: t.stepClicks,
      to: t.stepLeads,
      fromVal: totalClicks,
      toVal: totalLeads,
      convRate: `${clickToLeadPercent}%`,
      dropoffRate: `${dropoffClickToLead}%`,
      status: 'Landing Page',
      statusColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
    {
      from: t.stepLeads,
      to: t.stepAttended,
      fromVal: totalLeads,
      toVal: totalShowedUp,
      convRate: `${leadToAttendancePercent}%`,
      dropoffRate: `${dropoffLeadToAttendance}%`,
      status: 'Show-Up',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              {t.adsHeaderTag}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
              Meta Ads & Google B2B
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.adsHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {t.adsHeaderDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center font-mono text-xs shrink-0">
          <div className={`bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <span className="text-[10px] text-slate-400 block font-sans font-bold">{t.kpiTotalAdSpend}</span>
            <span className="text-lg font-bold text-slate-900">
              {totalSpend.toLocaleString()} {t.mad}
            </span>
          </div>
        </div>
      </div>

      {/* 2. RECHARTS FUNNEL DROP-OFF DATA VISUALIZATION SECTION */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                <BarChart2 className="w-5 h-5 stroke-[2.5]" />
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {t.funnelSectionTitle}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.funnelSectionSub}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold text-slate-500">{t.metricAttendedRate}:</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
              {leadToAttendancePercent}%
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart: Volumes & Drop-off Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelDropoffData}
                margin={{ top: 20, right: 20, left: 10, bottom: 25 }}
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
                  tick={{ fontSize: 10, fill: '#FF5500' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    return [value, name];
                  }}
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
                  stroke="#FF5500"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#FF5500', strokeWidth: 2, stroke: '#FFFFFF' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Drop-off Breakdown Cards */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {t.funnelSectionTitle}
            </h4>

            {stepTransitions.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-orange-300 transition-all shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="truncate">{step.from}</span>
                  <ArrowDownRight className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span className="truncate">{step.to}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 font-mono text-xs">
                  <div className={`bg-emerald-50 border border-emerald-200 p-2 rounded-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] text-emerald-800 font-sans font-bold block">Conversion %</span>
                    <span className="text-base font-extrabold text-emerald-700">{step.convRate}</span>
                  </div>
                  <div className={`bg-rose-50 border border-rose-200 p-2 rounded-lg ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[10px] text-rose-800 font-sans font-bold block">Drop-off %</span>
                    <span className="text-base font-extrabold text-rose-700">{step.dropoffRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Funnel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Landing Page Visitors */}
        <div className="bg-gradient-to-br from-white to-blue-50/40 p-4.5 rounded-2xl border-2 border-blue-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Eye className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded-full font-mono">
              Landing Page
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.kpiLandingVisitors}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {totalLandingVisitors.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">visitors</span>
          </div>
        </div>

        {/* Card 2: Video Started */}
        <div className="bg-gradient-to-br from-white to-indigo-50/40 p-4.5 rounded-2xl border-2 border-indigo-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <PlayCircle className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded-full font-mono">
              Video Plays
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">Video Started</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-900">
              {totalVideoStarted.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">views</span>
          </div>
        </div>

        {/* Card 3: Video Completed (100%) */}
        <div className="bg-gradient-to-br from-white to-purple-50/40 p-4.5 rounded-2xl border-2 border-purple-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <CheckCheck className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-100/70 px-2 py-0.5 rounded-full font-mono">
              Completed 100%
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.kpiVideoWatch}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-900">
              {totalVideoCompleted.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-bold">100% VSL</span>
          </div>
        </div>

        {/* Card 4: Meetings Showed Up */}
        <div className="bg-gradient-to-br from-white to-emerald-50/40 p-4.5 rounded-2xl border-2 border-emerald-300 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <UserCheck className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
              Show-Up Rate
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.attended}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-700">
              {totalShowedUp}
            </span>
            <span className="text-xs text-slate-500 font-bold">{t.clientsUnit}</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-2 block font-medium">
            {attendanceRate}%
          </span>
        </div>

        {/* Card 5: Meetings No-Show */}
        <div className="bg-gradient-to-br from-white to-rose-50/40 p-4.5 rounded-2xl border-2 border-rose-200 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <UserX className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-mono">
              No-Show
            </span>
          </div>
          <span className="text-xs font-bold text-slate-600 block">{t.notAttended}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700">
              {totalNoShow}
            </span>
            <span className="text-xs text-slate-500 font-bold">no-shows</span>
          </div>
        </div>
      </div>

      {/* 4. Detailed Campaign Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t.adsHeaderTitle}
            </h3>
            <span className="text-xs text-slate-500">
              {t.adsHeaderDesc}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3.5">Campaign</th>
                <th className="p-3.5">Platform</th>
                <th className="p-3.5">{t.kpiTotalAdSpend}</th>
                <th className="p-3.5 text-center bg-blue-50/40 text-blue-900">{t.stepImpressions}</th>
                <th className="p-3.5 text-center bg-indigo-50/40 text-indigo-900">{t.stepClicks}</th>
                <th className="p-3.5 text-center bg-purple-50/40 text-purple-900">VSL 100%</th>
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
                  <td className="p-3.5 font-mono font-bold text-slate-900">
                    {camp.spend.toLocaleString()} {t.mad}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-blue-800 text-center bg-blue-50/20">
                    {camp.impressions.toLocaleString()}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-indigo-800 text-center bg-indigo-50/20">
                    {camp.clicks.toLocaleString()}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-purple-800 text-center bg-purple-50/20">
                    {camp.videoCompletedCount || 0}
                  </td>

                  <td className="p-3.5 font-mono text-slate-700 font-bold text-center">
                    {camp.leadsGenerated}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-emerald-700 text-center bg-emerald-50/20">
                    {camp.meetingsShowedUp || 0}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-rose-600 text-center bg-rose-50/20">
                    {camp.meetingsNoShow || 0}
                  </td>

                  <td className="p-3.5 font-mono font-bold text-emerald-800 text-center">
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
    </div>
  );
};
