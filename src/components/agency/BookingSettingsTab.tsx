import React, { useMemo, useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Clock,
  CalendarDays,
  CalendarOff,
  Check,
  Copy,
  RotateCcw,
  Plus,
  Trash2,
  Coffee,
  Globe,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { DayOfWeekKey } from '../../types/agency';
import {
  DAY_ORDER,
  DAY_LABELS,
  countTheoreticalSlotsForDay,
  generateAvailableSlotsForDate,
  generateTimeOptions,
  timeToMinutes,
} from '../../utils/bookingSlots';

interface BookingSettingsTabProps {
  compact?: boolean;
}

export const BookingSettingsTab: React.FC<BookingSettingsTabProps> = ({ compact = false }) => {
  const {
    bookingSettings,
    updateBookingSettings,
    updateDaySchedule,
    applyDayScheduleToAllActive,
    applySchedulePreset,
    addBlockedDate,
    removeBlockedDate,
    resetBookingSettings,
    meetings,
    language,
    direction,
  } = useAgency();

  const timeOptions = useMemo(() => generateTimeOptions(6, 23, 15), []);

  const copy = useMemo(() => {
    if (language === 'ar') {
      return {
        title: 'أوقات العمل وقواعد الحجز لصفحة الهبوط',
        subtitle:
          'تحكم بسهولة ووضوح في أيام العمل، ساعات الاستشارة، فترات الراحة، وأيام العطل المعتمدة في استمارة الحجز.',
        bookingOpen: 'استقبال الحجوزات مفعّل',
        bookingPaused: 'الحجوزات متوقفة مؤقتاً',
        presetsLabel: 'نماذج توقيت جاهزة:',
        presetStandard: 'دوام المغرب (09:00 - 18:00)',
        presetExtended: 'دوام ممتد للسبت (09:30 - 19:00)',
        presetContinuous: 'توقيت مستمر (09:00 - 17:00)',
        presetEvening: 'مكالمات مسائية (14:00 - 21:00)',
        resetBtn: 'استعادة الافتراضي',
        weeklyHoursTitle: 'أيام وساعات العمل الأسبوعية',
        weeklyHoursSub: 'فعّل أو عطّل أي يوم، واختر وقت البداية والنهاية والاستراحة بوضوح',
        dayActive: 'مفتوح للحجز',
        dayClosed: 'عطلة أسبوعية',
        shiftHoursLabel: 'ساعات العمل:',
        breakHoursLabel: 'فترة الاستراحة:',
        startLabel: 'من',
        endLabel: 'إلى',
        breakToggle: 'استراحة منتصف اليوم',
        slotsCountSuffix: 'موعد',
        copyToAllBtn: 'تطبيق على باقي الأيام',
        copiedToAllFeedback: 'تم التعميم بنجاح!',
        rulesTitle: 'قواعد وتوقيت استمارة الحجز',
        rulesSub: 'ضبط مدة المكالمة، الفواصل الزمنية، والحد الأقصى اليومي',
        durationLabel: 'مدة المكالمة',
        bufferLabel: 'فاصل بين المواعيد',
        minNoticeLabel: 'أقل مهلة قبل الحجز',
        advanceWindowLabel: 'أفق الحجز المسبق',
        maxPerDayLabel: 'الحد الأقصى يومياً',
        timezoneLabel: 'المنطقة الزمنية',
        timezoneValue: 'الدار البيضاء (توقيت المغرب)',
        minutesUnit: 'د',
        hoursUnit: 'ساعات',
        hourUnit: 'ساعة',
        daysUnit: 'يوم',
        callsPerDayUnit: 'مواعيد / يوم',
        blockedDatesTitle: 'العطل والأيام المغلقة استثنائياً',
        blockedDatesSub: 'أضف تواريخ الأعياد أو الأيام غير المتاحة في استمارة الحجز',
        blockedDatePlaceholder: 'السبب (مثال: عيد وطني، سفر عمل...)',
        addBlockedBtn: 'حظر التاريخ',
        noBlockedDates: 'لا توجد أيام عطلة مضافة حالياً',
        previewTitle: 'معاينة حية لاستمارة الحجز في صفحة الهبوط',
        previewSub: 'شاهد التواريخ والأوقات الفعلية المتاحة للعملاء الآن',
        availableBadge: 'متاح',
        bookedBadge: 'محجوز',
        closedBadge: 'مغلق',
        noSlotsDay: 'لا توجد مواعيد متاحة في هذا اليوم',
        reasonPaused: 'الحجوزات متوقفة مؤقتاً من لوحة التحكم',
        reasonDayOff: 'هذا اليوم مضبوط كعطلة أسبوعية',
        reasonBlocked: 'تاريخ مغلق:',
        reasonCap: 'تم بلوغ الحد الأقصى للمواعيد اليومية',
        selectedSlotBanner: 'تم اختيار الموعد التجريبي:',
        bookedTotalDay: 'محجوز:',
        availableTotalDay: 'متاح:',
        activeDaysSummary: 'أيام العمل النشطة',
        weeklySlotsTotal: 'موعد متاح أسبوعياً',
      };
    }

    if (language === 'fr') {
      return {
        title: 'Horaires de Travail & Règles de Réservation',
        subtitle:
          'Configurez clairement les jours ouvrés, plages horaires de consultation, pauses et jours fériés affichés sur votre formulaire de réservation.',
        bookingOpen: 'Réservations Ouvertes',
        bookingPaused: 'Réservations en Pause',
        presetsLabel: 'Modèles rapides :',
        presetStandard: 'Standard Maroc (09h00 - 18h00)',
        presetExtended: 'Étendu Lun-Sam (09h30 - 19h00)',
        presetContinuous: 'Journée continue (09h00 - 17h00)',
        presetEvening: 'Créneaux Soirée (14h00 - 21h00)',
        resetBtn: 'Réinitialiser',
        weeklyHoursTitle: 'Planning Hebdomadaire des Horaires',
        weeklyHoursSub: 'Activez chaque jour et choisissez vos heures d’ouverture et de pause',
        dayActive: 'Ouvert',
        dayClosed: 'Fermé',
        shiftHoursLabel: 'Plage horaire :',
        breakHoursLabel: 'Pause déjeuner :',
        startLabel: 'De',
        endLabel: 'À',
        breakToggle: 'Pause midi',
        slotsCountSuffix: 'créneaux',
        copyToAllBtn: 'Appliquer à tous',
        copiedToAllFeedback: 'Appliqué !',
        rulesTitle: 'Règles & Capacité du Formulaire',
        rulesSub: 'Durée des appels, temps tampon et limite quotidienne',
        durationLabel: 'Durée d’appel',
        bufferLabel: 'Battement',
        minNoticeLabel: 'Préavis minimum',
        advanceWindowLabel: 'Fenêtre de réservation',
        maxPerDayLabel: 'Max RDV / jour',
        timezoneLabel: 'Fuseau horaire',
        timezoneValue: 'Africa/Casablanca (GMT+1)',
        minutesUnit: 'm',
        hoursUnit: 'heures',
        hourUnit: 'heure',
        daysUnit: 'jours',
        callsPerDayUnit: 'RDV / jour',
        blockedDatesTitle: 'Jours Fériés & Dates Bloquées',
        blockedDatesSub: 'Bloquez des dates spécifiques (fêtes, déplacements, congés)',
        blockedDatePlaceholder: 'Motif (ex : Jour férié, Congé...)',
        addBlockedBtn: 'Bloquer',
        noBlockedDates: 'Aucune date bloquée pour le moment',
        previewTitle: 'Aperçu en Direct du Formulaire de Réservation',
        previewSub: 'Testez les créneaux exacts proposés aux prospects sur votre page',
        availableBadge: 'Disponible',
        bookedBadge: 'Réservé',
        closedBadge: 'Fermé',
        noSlotsDay: 'Aucun créneau disponible ce jour-là',
        reasonPaused: 'Les réservations sont actuellement en pause',
        reasonDayOff: 'Jour configuré comme fermé',
        reasonBlocked: 'Date bloquée :',
        reasonCap: 'Limite quotidienne de rendez-vous atteinte',
        selectedSlotBanner: 'Créneau sélectionné :',
        bookedTotalDay: 'Réservés :',
        availableTotalDay: 'Libres :',
        activeDaysSummary: 'Jours actifs',
        weeklySlotsTotal: 'Créneaux / semaine',
      };
    }

    return {
      title: 'Working Days, Hours & Booking Rules',
      subtitle:
        'Configure working days, consultation hours, breaks, and blocked holidays used by your landing page booking form.',
      bookingOpen: 'Bookings Open',
      bookingPaused: 'Bookings Paused',
      presetsLabel: 'Quick Presets:',
      presetStandard: 'Standard Mon–Fri (09:00–18:00)',
      presetExtended: 'Extended Mon–Sat (09:30–19:00)',
      presetContinuous: 'Continuous (09:00–17:00)',
      presetEvening: 'Evening Calls (14:00–21:00)',
      resetBtn: 'Reset Defaults',
      weeklyHoursTitle: 'Weekly Working Days & Hours',
      weeklyHoursSub: 'Toggle any day and clearly pick opening hours and optional lunch breaks',
      dayActive: 'Open',
      dayClosed: 'Day Off',
      shiftHoursLabel: 'Working Hours:',
      breakHoursLabel: 'Break Window:',
      startLabel: 'From',
      endLabel: 'To',
      breakToggle: 'Midday Break',
      slotsCountSuffix: 'slots',
      copyToAllBtn: 'Apply to all',
      copiedToAllFeedback: 'Applied!',
      rulesTitle: 'Booking Form Rules & Limits',
      rulesSub: 'Configure slot duration, buffer time, notice, and daily cap',
      durationLabel: 'Meeting Duration',
      bufferLabel: 'Buffer Time',
      minNoticeLabel: 'Minimum Notice',
      advanceWindowLabel: 'Booking Window',
      maxPerDayLabel: 'Max Calls / Day',
      timezoneLabel: 'Timezone',
      timezoneValue: 'Africa/Casablanca (GMT+1)',
      minutesUnit: 'm',
      hoursUnit: 'hours',
      hourUnit: 'hour',
      daysUnit: 'days',
      callsPerDayUnit: 'calls / day',
      blockedDatesTitle: 'Holidays & Blocked Dates',
      blockedDatesSub: 'Block specific off-days or holidays from the booking form',
      blockedDatePlaceholder: 'Reason (e.g. National Holiday, Travel...)',
      addBlockedBtn: 'Block Date',
      noBlockedDates: 'No blocked dates configured',
      previewTitle: 'Live Booking Form Preview',
      previewSub: 'Inspect exact dates and time slots prospects see, synced with booked meetings',
      availableBadge: 'Available',
      bookedBadge: 'Booked',
      closedBadge: 'Closed',
      noSlotsDay: 'No bookable slots on this date',
      reasonPaused: 'Bookings are currently paused from the dashboard',
      reasonDayOff: 'This weekday is set as closed',
      reasonBlocked: 'Blocked date:',
      reasonCap: 'Daily booking limit reached',
      selectedSlotBanner: 'Selected preview slot:',
      bookedTotalDay: 'Booked:',
      availableTotalDay: 'Available:',
      activeDaysSummary: 'Active working days',
      weeklySlotsTotal: 'Weekly slots',
    };
  }, [language]);

  const [copiedDayKey, setCopiedDayKey] = useState<DayOfWeekKey | null>(null);
  const [blockedDateInput, setBlockedDateInput] = useState<string>('');
  const [blockedReasonInput, setBlockedReasonInput] = useState<string>('');

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [previewDate, setPreviewDate] = useState<string>(todayStr);
  const [selectedPreviewSlot, setSelectedPreviewSlot] = useState<string | null>(null);

  const previewDatesList = useMemo(() => {
    const count = Math.min(10, bookingSettings.maxAdvanceDays);
    const list = [];
    for (let i = 0; i < count; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const avail = generateAvailableSlotsForDate(dateStr, bookingSettings, meetings);
      const dayLabel = DAY_LABELS[language][avail.dayKey].short;
      const dateNum = d.getDate();
      const monthLabel = d.toLocaleDateString(
        language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-FR' : 'en-US',
        { month: 'short' }
      );
      list.push({
        dateStr,
        dayLabel,
        dateNum,
        monthLabel,
        avail,
      });
    }
    return list;
  }, [bookingSettings, meetings, language]);

  const activeDayPreview = useMemo(() => {
    return generateAvailableSlotsForDate(previewDate, bookingSettings, meetings);
  }, [previewDate, bookingSettings, meetings]);

  const activeDaysCount = useMemo(() => {
    return DAY_ORDER.filter((d) => bookingSettings.schedule[d].enabled).length;
  }, [bookingSettings]);

  const weeklySlotsTotal = useMemo(() => {
    return DAY_ORDER.reduce((sum, d) => {
      return (
        sum +
        countTheoreticalSlotsForDay(
          bookingSettings.schedule[d],
          bookingSettings.slotDurationMinutes,
          bookingSettings.bufferMinutes
        )
      );
    }, 0);
  }, [bookingSettings]);

  const handleCopyDayToAll = (day: DayOfWeekKey) => {
    applyDayScheduleToAllActive(day);
    setCopiedDayKey(day);
    setTimeout(() => setCopiedDayKey(null), 2200);
  };

  const handleAddBlocked = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockedDateInput) return;
    addBlockedDate(blockedDateInput, blockedReasonInput);
    setBlockedDateInput('');
    setBlockedReasonInput('');
  };

  // Clear, high-contrast, touch-friendly time dropdown helper
  const renderTimeSelector = (
    label: string,
    value: string,
    onChange: (newVal: string) => void,
    variant: 'shift' | 'break' = 'shift',
    minTime?: string
  ) => {
    const isBreak = variant === 'break';
    const filteredOptions = minTime
      ? timeOptions.filter((opt) => timeToMinutes(opt) > timeToMinutes(minTime))
      : timeOptions;

    return (
      <div
        className={`relative flex items-center justify-between gap-2 rounded-xl border px-3 min-h-[44px] transition-colors ${
          isBreak
            ? 'bg-white border-amber-300 focus-within:border-amber-500'
            : 'bg-white border-slate-200 focus-within:border-orange-500 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0 pointer-events-none">
          <Clock className={`w-3.5 h-3.5 ${isBreak ? 'text-amber-600' : 'text-orange-500'}`} />
          <span className={`text-[11px] font-bold ${isBreak ? 'text-amber-900' : 'text-slate-500'}`}>
            {label}
          </span>
        </div>

        <div className="relative flex items-center flex-1 justify-end">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            dir="ltr"
            aria-label={label}
            className={`appearance-none bg-transparent font-mono tabular-nums text-sm font-extrabold cursor-pointer focus:outline-none py-2 w-full text-end ${
              direction === 'rtl' ? 'pl-5 pr-1' : 'pr-5 pl-1'
            } ${isBreak ? 'text-amber-950' : 'text-slate-900'}`}
          >
            {filteredOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`w-3.5 h-3.5 pointer-events-none shrink-0 ${
              direction === 'rtl' ? 'order-first mr-0' : ''
            } ${isBreak ? 'text-amber-600' : 'text-slate-400'}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 sm:space-y-6" dir={direction}>
      {/* 1. Top Control Header */}
      {!compact && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium flex-wrap">
              <span className="font-mono tabular-nums text-slate-800 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                {activeDaysCount}/7 {copy.activeDaysSummary}
              </span>
              <span className="font-mono tabular-nums text-orange-700 font-bold bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                {weeklySlotsTotal} {copy.weeklySlotsTotal}
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-petrol-700" />
                {copy.timezoneValue}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{copy.title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">{copy.subtitle}</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            <button
              type="button"
              onClick={() => updateBookingSettings({ isBookingOpen: !bookingSettings.isBookingOpen })}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 min-h-[44px] rounded-xl text-xs font-bold transition-colors cursor-pointer border whitespace-nowrap ${
                bookingSettings.isBookingOpen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100'
              }`}
            >
              {bookingSettings.isBookingOpen ? (
                <>
                  <PlayCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{copy.bookingOpen}</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{copy.bookingPaused}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetBookingSettings}
              className="flex items-center justify-center gap-1.5 px-3.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-slate-200 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{copy.resetBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Quick Schedule Presets Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 shrink-0">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>{copy.presetsLabel}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
          <button
            type="button"
            onClick={() => applySchedulePreset('morocco_standard')}
            className="px-3.5 min-h-[40px] bg-slate-50 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-300 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copy.presetStandard}
          </button>
          <button
            type="button"
            onClick={() => applySchedulePreset('extended_sat')}
            className="px-3.5 min-h-[40px] bg-slate-50 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-300 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copy.presetExtended}
          </button>
          <button
            type="button"
            onClick={() => applySchedulePreset('continuous')}
            className="px-3.5 min-h-[40px] bg-slate-50 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-300 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copy.presetContinuous}
          </button>
          <button
            type="button"
            onClick={() => applySchedulePreset('evening')}
            className="px-3.5 min-h-[40px] bg-slate-50 hover:bg-orange-50 hover:text-orange-900 hover:border-orange-300 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {copy.presetEvening}
          </button>

          {compact && (
            <button
              type="button"
              onClick={() => updateBookingSettings({ isBookingOpen: !bookingSettings.isBookingOpen })}
              className={`flex items-center gap-1.5 px-3.5 min-h-[40px] rounded-xl text-xs font-bold cursor-pointer border whitespace-nowrap shrink-0 ${
                bookingSettings.isBookingOpen
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {bookingSettings.isBookingOpen ? (
                <PlayCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <PauseCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{bookingSettings.isBookingOpen ? copy.bookingOpen : copy.bookingPaused}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main 2-Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN (7/12): Weekly Working Hours + Rules + Blocked Dates */}
        <div className="xl:col-span-7 space-y-5">
          {/* A. Weekly Working Hours Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{copy.weeklyHoursTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{copy.weeklyHoursSub}</p>
              </div>
              <div className="text-xs font-mono tabular-nums font-bold text-petrol-900 bg-petrol-50 px-3 py-1.5 rounded-xl border border-petrol-200 shrink-0">
                {weeklySlotsTotal} {copy.slotsCountSuffix}
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {DAY_ORDER.map((dayKey) => {
                const cfg = bookingSettings.schedule[dayKey];
                const dayName = DAY_LABELS[language][dayKey].full;
                const slotCount = countTheoreticalSlotsForDay(
                  cfg,
                  bookingSettings.slotDurationMinutes,
                  bookingSettings.bufferMinutes
                );

                return (
                  <div
                    key={dayKey}
                    className={`p-4 transition-colors ${
                      cfg.enabled ? 'bg-white' : 'bg-slate-50/90'
                    }`}
                  >
                    {/* Top Row: Day Switch + Day Name + Slot Badge + Apply to All */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={cfg.enabled}
                          onClick={() => updateDaySchedule(dayKey, { enabled: !cfg.enabled })}
                          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                            cfg.enabled ? 'bg-orange-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xs transition-transform ${
                              cfg.enabled
                                ? direction === 'rtl'
                                  ? '-translate-x-5'
                                  : 'translate-x-5'
                                : 'translate-x-0'
                            }`}
                          />
                        </button>

                        <div>
                          <span
                            className={`text-sm font-bold block ${
                              cfg.enabled ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {dayName}
                          </span>
                          <span
                            className={`text-[11px] font-medium block ${
                              cfg.enabled ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {cfg.enabled ? copy.dayActive : copy.dayClosed}
                          </span>
                        </div>
                      </div>

                      {cfg.enabled ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono tabular-nums font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {slotCount} {copy.slotsCountSuffix}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopyDayToAll(dayKey)}
                            className="px-3 min-h-[36px] rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-petrol-800 hover:text-white text-slate-700 border border-slate-200 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                          >
                            {copiedDayKey === dayKey ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>{copy.copiedToAllFeedback}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{copy.copyToAllBtn}</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
                          {copy.dayClosed}
                        </span>
                      )}
                    </div>

                    {/* Active Controls: Clear Time Pickers Grid */}
                    {cfg.enabled && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5">
                        {/* Shift Window */}
                        <div className="bg-slate-50/90 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-700">
                              {copy.shiftHoursLabel}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateDaySchedule(dayKey, { hasBreak: !cfg.hasBreak })}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                                cfg.hasBreak
                                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              <Coffee className="w-3.5 h-3.5" />
                              <span>{copy.breakToggle}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            {renderTimeSelector(
                              copy.startLabel,
                              cfg.startTime,
                              (val) => {
                                const updates: { startTime: string; endTime?: string } = { startTime: val };
                                if (timeToMinutes(cfg.endTime) <= timeToMinutes(val)) {
                                  const nextOpt = timeOptions.find(
                                    (opt) => timeToMinutes(opt) >= timeToMinutes(val) + 60
                                  );
                                  if (nextOpt) updates.endTime = nextOpt;
                                }
                                updateDaySchedule(dayKey, updates);
                              },
                              'shift'
                            )}

                            {renderTimeSelector(
                              copy.endLabel,
                              cfg.endTime,
                              (val) => updateDaySchedule(dayKey, { endTime: val }),
                              'shift',
                              cfg.startTime
                            )}
                          </div>
                        </div>

                        {/* Optional Break Window */}
                        {cfg.hasBreak && (
                          <div className="bg-amber-50/60 p-2.5 sm:p-3 rounded-xl border border-amber-200/90 space-y-2">
                            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                              <Coffee className="w-3.5 h-3.5 text-amber-600" />
                              <span>{copy.breakHoursLabel}</span>
                            </span>

                            <div className="grid grid-cols-2 gap-2.5">
                              {renderTimeSelector(
                                copy.startLabel,
                                cfg.breakStart,
                                (val) => {
                                  const updates: { breakStart: string; breakEnd?: string } = { breakStart: val };
                                  if (timeToMinutes(cfg.breakEnd) <= timeToMinutes(val)) {
                                    const nextOpt = timeOptions.find(
                                      (opt) => timeToMinutes(opt) >= timeToMinutes(val) + 30
                                    );
                                    if (nextOpt) updates.breakEnd = nextOpt;
                                  }
                                  updateDaySchedule(dayKey, updates);
                                },
                                'break'
                              )}

                              {renderTimeSelector(
                                copy.endLabel,
                                cfg.breakEnd,
                                (val) => updateDaySchedule(dayKey, { breakEnd: val }),
                                'break',
                                cfg.breakStart
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. Booking Rules & Limits */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">{copy.rulesTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{copy.rulesSub}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Globe className="w-4 h-4 text-petrol-700" />
                <span>{copy.timezoneValue}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* Slot Duration */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">{copy.durationLabel}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {([15, 30, 45, 60] as const).map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => updateBookingSettings({ slotDurationMinutes: min })}
                      className={`min-h-[40px] rounded-xl font-mono tabular-nums font-bold transition-colors cursor-pointer ${
                        bookingSettings.slotDurationMinutes === min
                          ? 'bg-petrol-800 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {min}{copy.minutesUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buffer Minutes */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">{copy.bufferLabel}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {([0, 10, 15, 30] as const).map((buf) => (
                    <button
                      key={buf}
                      type="button"
                      onClick={() => updateBookingSettings({ bufferMinutes: buf })}
                      className={`min-h-[40px] rounded-xl font-mono tabular-nums font-bold transition-colors cursor-pointer ${
                        bookingSettings.bufferMinutes === buf
                          ? 'bg-petrol-800 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {buf}{copy.minutesUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Notice */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">{copy.minNoticeLabel}</label>
                <select
                  value={bookingSettings.minNoticeHours}
                  onChange={(e) =>
                    updateBookingSettings({
                      minNoticeHours: Number(e.target.value) as 1 | 2 | 4 | 12 | 24,
                    })
                  }
                  className="w-full px-3 min-h-[40px] bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value={1}>1 {copy.hourUnit}</option>
                  <option value={2}>2 {copy.hoursUnit}</option>
                  <option value={4}>4 {copy.hoursUnit}</option>
                  <option value={12}>12 {copy.hoursUnit}</option>
                  <option value={24}>24 {copy.hoursUnit}</option>
                </select>
              </div>

              {/* Advance Window */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-700">{copy.advanceWindowLabel}</label>
                <select
                  value={bookingSettings.maxAdvanceDays}
                  onChange={(e) =>
                    updateBookingSettings({
                      maxAdvanceDays: Number(e.target.value) as 7 | 14 | 21 | 30 | 60,
                    })
                  }
                  className="w-full px-3 min-h-[40px] bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value={7}>7 {copy.daysUnit}</option>
                  <option value={14}>14 {copy.daysUnit}</option>
                  <option value={21}>21 {copy.daysUnit}</option>
                  <option value={30}>30 {copy.daysUnit}</option>
                  <option value={60}>60 {copy.daysUnit}</option>
                </select>
              </div>

              {/* Daily Booking Cap */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">{copy.maxPerDayLabel}</label>
                  <span className="font-mono tabular-nums font-bold text-orange-600">
                    {bookingSettings.maxBookingsPerDay} {copy.callsPerDayUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={bookingSettings.maxBookingsPerDay}
                  onChange={(e) => updateBookingSettings({ maxBookingsPerDay: Number(e.target.value) })}
                  className="w-full accent-orange-500 cursor-pointer h-6"
                />
              </div>
            </div>
          </div>

          {/* C. Blocked Dates / Holidays */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                <CalendarOff className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{copy.blockedDatesTitle}</h3>
                <p className="text-xs text-slate-500">{copy.blockedDatesSub}</p>
              </div>
            </div>

            <form onSubmit={handleAddBlocked} className="flex flex-col sm:flex-row gap-2.5 text-xs">
              <input
                type="date"
                required
                min={todayStr}
                value={blockedDateInput}
                onChange={(e) => setBlockedDateInput(e.target.value)}
                className="px-3 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                value={blockedReasonInput}
                onChange={(e) => setBlockedReasonInput(e.target.value)}
                placeholder={copy.blockedDatePlaceholder}
                className="flex-1 px-3 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="px-4 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>{copy.addBlockedBtn}</span>
              </button>
            </form>

            {bookingSettings.blockedDates.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3 border border-dashed border-slate-200 rounded-xl">
                {copy.noBlockedDates}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookingSettings.blockedDates.map((b) => (
                  <div
                    key={b.id}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs"
                  >
                    <span className="font-mono tabular-nums font-bold text-rose-900">{b.date}</span>
                    {b.reason && <span className="text-rose-700">· {b.reason}</span>}
                    <button
                      type="button"
                      onClick={() => removeBlockedDate(b.id)}
                      className="text-rose-500 hover:text-rose-800 cursor-pointer p-0.5"
                      aria-label="Remove blocked date"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5/12): Live Landing Page Booking Simulator */}
        <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-24">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-petrol-900 text-white flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{copy.previewTitle}</span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">{copy.previewSub}</p>
              </div>
              <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-orange-300 shrink-0">
                {bookingSettings.slotDurationMinutes}{copy.minutesUnit}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Date Strip */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 snap-x no-scrollbar">
                {previewDatesList.map((item) => {
                  const isSelected = previewDate === item.dateStr;
                  const isAvailable = item.avail.isOpen;

                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => {
                        setPreviewDate(item.dateStr);
                        setSelectedPreviewSlot(null);
                      }}
                      className={`min-w-[68px] py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer shrink-0 snap-start ${
                        isSelected
                          ? 'bg-orange-500 border-orange-600 text-white'
                          : isAvailable
                          ? 'bg-white border-slate-200 hover:border-orange-300 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold block ${
                          isSelected ? 'text-orange-100' : 'text-slate-500'
                        }`}
                      >
                        {item.dayLabel}
                      </span>
                      <span className="text-base font-mono tabular-nums font-extrabold block leading-tight my-0.5">
                        {item.dateNum}
                      </span>
                      <span
                        className={`text-[10px] block ${
                          isSelected ? 'text-orange-100' : 'text-slate-400'
                        }`}
                      >
                        {item.monthLabel}
                      </span>
                      <span
                        className={`mt-1 inline-block text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isAvailable
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isAvailable ? item.avail.availableCount : copy.closedBadge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status Summary Row */}
              <div className="flex items-center justify-between text-xs px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-mono font-bold text-slate-800">{previewDate}</span>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span className="text-emerald-700 font-bold">
                    {copy.availableTotalDay} {activeDayPreview.availableCount}
                  </span>
                  <span className="text-slate-500 font-semibold">
                    {copy.bookedTotalDay} {activeDayPreview.bookedCount}/{bookingSettings.maxBookingsPerDay}
                  </span>
                </div>
              </div>

              {/* Time Slots Grid */}
              {activeDayPreview.slots.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-1.5">
                  <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">{copy.noSlotsDay}</p>
                  <p className="text-[11px] text-slate-500">
                    {activeDayPreview.reasonClosed === 'paused'
                      ? copy.reasonPaused
                      : activeDayPreview.reasonClosed === 'blocked_date'
                      ? `${copy.reasonBlocked} ${activeDayPreview.blockedReason || previewDate}`
                      : activeDayPreview.reasonClosed === 'daily_cap'
                      ? copy.reasonCap
                      : copy.reasonDayOff}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-0.5">
                  {activeDayPreview.slots.map((slot) => {
                    const isBooked = slot.status === 'booked';
                    const isCap = slot.status === 'daily_cap_reached';
                    const isSelected = selectedPreviewSlot === slot.time;

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isBooked || isCap}
                        onClick={() => setSelectedPreviewSlot(slot.time)}
                        title={isBooked ? `${copy.bookedBadge}: ${slot.bookedByAgency}` : slot.time}
                        className={`min-h-[44px] py-2 px-2 rounded-xl border font-mono tabular-nums text-xs font-bold transition-all ${
                          isBooked || isCap
                            ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-orange-500 border-orange-600 text-white cursor-pointer'
                            : 'bg-white border-slate-200 hover:border-orange-400 text-slate-900 cursor-pointer'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedPreviewSlot && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{copy.selectedSlotBanner}</span>
                  </span>
                  <span className="font-mono tabular-nums font-extrabold">
                    {previewDate} · {selectedPreviewSlot}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
