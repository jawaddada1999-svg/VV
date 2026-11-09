import React from 'react';
import {
  TrendingUp,
  Target,
  DollarSign,
  BarChart2,
  Globe,
  Share2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const AdsAnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] تحليلات الإعلانات
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Meta & Google Ads Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            مؤشرات الإعلانات المجمعة ومعايير الأداء
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            معايير تكلفة الليد (CPL)، العائد على الإنفاق (ROAS)، ومتوسط نسبة النقر (CTR) عبر كافة حملات الوكالات
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Meta Marketing API v19 متصل
          </span>
        </div>
      </div>

      {/* 2. Platform Benchmarks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">إجمالي الإنفاق الإعلاني المدار</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">145,000</span>
            <span className="text-xs text-slate-500 font-bold">د.م./شهر</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">عبر 12 وكالة عقارية</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">متوسط تكلفة الليد (Platform CPL)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600">32.4</span>
            <span className="text-xs text-slate-500 font-bold">د.م.</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-2 block">أقل من متوسط السوق (55 د.م.)</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">متوسط نسبة النقر (CTR)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">2.65%</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">المعيار الذهبي 2.2%</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">متوسط العائد الإعلاني (ROAS)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-petrol-800">4.2x</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">من قيمة العمولات المحصلة</span>
        </div>
      </div>

      {/* 3. Top Formats & Creatives Benchmark */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          أفضل صيغ الإعلانات تحقيقاً للتحويل (Creative Formats Benchmark)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          بيانات مجمعة تساعد فريق IBONDA على إرشاد الوكالات لتصوير الإعلانات الرابحة
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-xs font-bold text-petrol-900 block">فيديو Facecam مع جولة عقارية</span>
            <span className="text-lg font-bold font-mono text-emerald-600 mt-1 block">4.8% CVR</span>
            <p className="text-[11px] text-slate-600 mt-1">أعلى نسبة ثقة وحجز مواعيد معاينة حقيقية</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-xs font-bold text-petrol-900 block">ألبوم كاروسيل للفلل الفاخرة</span>
            <span className="text-lg font-bold font-mono text-slate-800 mt-1 block">3.2% CVR</span>
            <p className="text-[11px] text-slate-600 mt-1">ممتاز للمستثمرين الباحثين عن مواصفات محددة</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-xs font-bold text-petrol-900 block">نماذج ميتا الفورية (Instant Forms)</span>
            <span className="text-lg font-bold font-mono text-slate-800 mt-1 block">6.1% CVR</span>
            <p className="text-[11px] text-slate-600 mt-1">أعلى سرعة استجابة على هواتف الزوار</p>
          </div>
        </div>
      </div>
    </div>
  );
};
