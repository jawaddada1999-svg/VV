import React, { useState } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const { platformKPIs, agencies } = useInternal();
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);

  const reportsList = [
    {
      id: 'rep-monthly',
      title: 'التقرير التنفيذي الشهري الشامل (Monthly SaaS Executive Report)',
      period: 'شهر نونبر 2026',
      description: 'تحليل نمو الـ MRR، صافي الوكالات المكتسبة، نسبة الـ Churn، ومتوسط إيراد كل وكالة ARPU.',
      size: '2.4 MB PDF',
    },
    {
      id: 'rep-health',
      title: 'تقرير التدقيق التقني وصحة المنصة (Platform Health & Uptime Audit)',
      period: 'آخر 30 يوم',
      description: 'سجل زمن استجابة الـ APIs، نسبة استقرار الأوتوميشن 99.4%، وتقارير أخطاء ربط Google و WhatsApp.',
      size: '1.8 MB PDF',
    },
    {
      id: 'rep-upsell',
      title: 'تقرير فرص الترقية والـ Expansion (Agency Upsell Pipeline)',
      period: 'الربع الأخير Q4',
      description: 'قائمة بالوكالات المرشحة للانتقال من Starter إلى Growth أو Enterprise لزيادة +24,000 د.م. MRR.',
      size: '950 KB CSV',
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloadingReport(id);
    setTimeout(() => {
      setDownloadingReport(null);
      // Simulate file download
      const element = document.createElement('a');
      const file = new Blob([`IBONDA REPORT: ${title}\nGenerated on: ${new Date().toISOString()}\nMRR: ${platformKPIs.currentMRR} MAD\nAgencies: ${platformKPIs.activeAgenciesCount}`], {
        type: 'text/plain',
      });
      element.href = URL.createObjectURL(file);
      element.download = `${id}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-petrol-50 text-petrol-800 border border-petrol-200/80">
              [Platform] مركز التقارير
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Automated Exports
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            التقارير التنفيذية وسجلات الأداء
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            توليد وتنزيل تقارير دورية للمالك والمستثمرين بصيغ PDF و CSV
          </p>
        </div>
      </div>

      {/* 2. Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportsList.map((rep) => (
          <div
            key={rep.id}
            className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 font-mono">
                  {rep.period}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{rep.size}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {rep.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleDownload(rep.id, rep.title)}
                disabled={downloadingReport === rep.id}
                className="w-full py-2 bg-petrol-800 hover:bg-petrol-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingReport === rep.id ? 'جاري التوليد...' : 'تنزيل التقرير الآن'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
