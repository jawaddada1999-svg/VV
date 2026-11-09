import React from 'react';
import {
  Globe,
  Layers,
  Sparkles,
  Smartphone,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const LandingPagesTab: React.FC = () => {
  const templates = [
    {
      name: 'قالب التفويض الحصري (Exclusive Mandate)',
      niche: 'شقق وفلل البيع في كازا والرباط',
      activeSites: 8,
      avgConversion: '7.4%',
      speedScore: '98/100',
    },
    {
      name: 'قالب الاستثمار السياحي الفاخر (Luxury Villas)',
      niche: 'مراكش وأكادير وطنجة',
      activeSites: 6,
      avgConversion: '5.9%',
      speedScore: '96/100',
    },
    {
      name: 'قالب المشاريع العقارية قيد الإنجاز (Off-Plan)',
      niche: 'المطورين العقاريين والمشاريع السكنية',
      activeSites: 4,
      avgConversion: '6.2%',
      speedScore: '97/100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] صفحات الهبوط
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              High-Converting Funnels
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            نظام استضافة صفحات الهبوط العقارية
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة سرعة التحميل، الزيارات المجمعة، ونسب تحويل نماذج حجز المعاينات
          </p>
        </div>
      </div>

      {/* 2. Platform Landing Page KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">إجمالي الزيارات الشهرية</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">112,400</span>
            <span className="text-xs text-slate-500 font-bold">زيارة</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">88% زوار هواتف ذكية (Mobile)</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">متوسط معدل التحويل (CVR)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">6.8%</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-2 block">أعلى من متوسط مواقع العقار (2.5%)</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">سرعة تحميل الصفحة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">1.1</span>
            <span className="text-xs text-slate-500 font-bold">ثانية</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">بفضل سيرفرات CDN المحلية</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">الصفحات المستضافة النشطة</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">18</span>
            <span className="text-xs text-slate-500 font-bold">صفحة</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">مع شهادة SSL ونطاقات مخصصة</span>
        </div>
      </div>

      {/* 3. Templates Directory */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          قوالب صفحات الهبوط المعتمدة لدى IBONDA
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          قوالب مطورة خصيصاً للوكالات العقارية في المغرب وتدعم اللغة العربية والفرنسية
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tpl, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">{tpl.name}</h4>
                <span className="text-[11px] text-slate-500 block mt-1">{tpl.niche}</span>
              </div>

              <div className="my-3 space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">وكالات تستخدمه:</span>
                  <span className="font-mono font-bold text-slate-800">{tpl.activeSites}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">نسبة التحويل:</span>
                  <span className="font-mono font-bold text-emerald-600">{tpl.avgConversion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">نتيجة السرعة:</span>
                  <span className="font-mono font-bold text-petrol-800">{tpl.speedScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
