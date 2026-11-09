import React, { useState } from 'react';
import { useInternal } from '../../context/InternalContext';
import {
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  X,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

export const TopAlertBanner: React.FC = () => {
  const { criticalAlerts, restartAutomation, retryInvoicePayment, setSelectedAgencyId } = useInternal();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || criticalAlerts.length === 0) return null;

  const topAlert = criticalAlerts[0];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-between gap-3 text-xs font-medium transition-all">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 bg-white/20 rounded-lg shrink-0">
          <ShieldAlert className="w-4 h-4 text-white" />
        </div>
        <div className="truncate">
          <span className="font-bold ml-1.5">تنبيه فوري ({criticalAlerts.length}):</span>
          <span className="text-amber-100 font-semibold">{topAlert.title}</span>
          <span className="hidden md:inline text-amber-200 mr-2 text-[11px] truncate">
            — {topAlert.description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {topAlert.actionType === 'restart_automation' && (
          <button
            onClick={() => topAlert.agencyId && restartAutomation(topAlert.id.replace('alert-auto-', ''))}
            className="px-2.5 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-md font-bold text-[11px] cursor-pointer transition-colors"
          >
            إعادة تشغيل فورية
          </button>
        )}
        {topAlert.actionType === 'retry_invoice' && (
          <button
            onClick={() => topAlert.agencyId && retryInvoicePayment(topAlert.id.replace('alert-inv-', ''))}
            className="px-2.5 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-md font-bold text-[11px] cursor-pointer transition-colors"
          >
            إعادة الخصم
          </button>
        )}
        {topAlert.actionType === 'view_agency' && (
          <button
            onClick={() => topAlert.agencyId && setSelectedAgencyId(topAlert.agencyId)}
            className="px-2.5 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded-md font-bold text-[11px] cursor-pointer transition-colors"
          >
            فحص الوكالة
          </button>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-white/80 hover:text-white rounded-md cursor-pointer"
          title="إخفاء التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
