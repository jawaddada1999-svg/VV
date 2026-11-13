import {
  BookingAvailabilitySettings,
  DayOfWeekKey,
  DayScheduleConfig,
  MeetingItem,
} from '../types/agency';
import { Language } from '../translations';

export const DAY_ORDER: DayOfWeekKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const JS_DAY_TO_KEY: Record<number, DayOfWeekKey> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

export const DAY_LABELS: Record<Language, Record<DayOfWeekKey, { full: string; short: string }>> = {
  ar: {
    monday: { full: 'الإثنين', short: 'إث' },
    tuesday: { full: 'الثلاثاء', short: 'ثل' },
    wednesday: { full: 'الأربعاء', short: 'أر' },
    thursday: { full: 'الخميس', short: 'خم' },
    friday: { full: 'الجمعة', short: 'جم' },
    saturday: { full: 'السبت', short: 'سب' },
    sunday: { full: 'الأحد', short: 'أح' },
  },
  fr: {
    monday: { full: 'Lundi', short: 'Lun' },
    tuesday: { full: 'Mardi', short: 'Mar' },
    wednesday: { full: 'Mercredi', short: 'Mer' },
    thursday: { full: 'Jeudi', short: 'Jeu' },
    friday: { full: 'Vendredi', short: 'Ven' },
    saturday: { full: 'Samedi', short: 'Sam' },
    sunday: { full: 'Dimanche', short: 'Dim' },
  },
  en: {
    monday: { full: 'Monday', short: 'Mon' },
    tuesday: { full: 'Tuesday', short: 'Tue' },
    wednesday: { full: 'Wednesday', short: 'Wed' },
    thursday: { full: 'Thursday', short: 'Thu' },
    friday: { full: 'Friday', short: 'Fri' },
    saturday: { full: 'Saturday', short: 'Sat' },
    sunday: { full: 'Sunday', short: 'Sun' },
  },
};

export function timeToMinutes(hhmm: string): number {
  const [hStr, mStr] = hhmm.split(':');
  const h = parseInt(hStr || '0', 10);
  const m = parseInt(mStr || '0', 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function generateTimeOptions(startHour = 6, endHour = 23, stepMinutes = 15): string[] {
  const options: string[] = [];
  for (let m = startHour * 60; m <= endHour * 60; m += stepMinutes) {
    options.push(minutesToTime(m));
  }
  return options;
}

export function getDayKeyFromDate(dateStr: string): DayOfWeekKey {
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return JS_DAY_TO_KEY[dt.getDay()] || 'monday';
}

export interface GeneratedSlot {
  time: string;
  endTime: string;
  status: 'available' | 'booked' | 'daily_cap_reached';
  bookedByAgency?: string;
}

export interface DayAvailabilityResult {
  date: string;
  dayKey: DayOfWeekKey;
  isOpen: boolean;
  reasonClosed?: 'paused' | 'day_off' | 'blocked_date' | 'daily_cap';
  blockedReason?: string;
  bookedCount: number;
  slots: GeneratedSlot[];
  availableCount: number;
}

export function countTheoreticalSlotsForDay(
  dayConfig: DayScheduleConfig,
  slotDurationMinutes: number,
  bufferMinutes: number
): number {
  if (!dayConfig.enabled) return 0;
  const start = timeToMinutes(dayConfig.startTime);
  const end = timeToMinutes(dayConfig.endTime);
  if (end <= start) return 0;

  const step = Math.max(5, slotDurationMinutes + bufferMinutes);
  const breakStart = dayConfig.hasBreak ? timeToMinutes(dayConfig.breakStart) : -1;
  const breakEnd = dayConfig.hasBreak ? timeToMinutes(dayConfig.breakEnd) : -1;

  let count = 0;
  for (let cursor = start; cursor + slotDurationMinutes <= end; cursor += step) {
    const slotEnd = cursor + slotDurationMinutes;
    if (
      dayConfig.hasBreak &&
      breakEnd > breakStart &&
      cursor < breakEnd &&
      slotEnd > breakStart
    ) {
      continue;
    }
    count += 1;
  }
  return count;
}

export function generateAvailableSlotsForDate(
  dateStr: string,
  settings: BookingAvailabilitySettings,
  meetings: MeetingItem[]
): DayAvailabilityResult {
  const dayKey = getDayKeyFromDate(dateStr);

  if (!settings.isBookingOpen) {
    return {
      date: dateStr,
      dayKey,
      isOpen: false,
      reasonClosed: 'paused',
      bookedCount: 0,
      slots: [],
      availableCount: 0,
    };
  }

  const blocked = settings.blockedDates.find((b) => b.date === dateStr);
  if (blocked) {
    return {
      date: dateStr,
      dayKey,
      isOpen: false,
      reasonClosed: 'blocked_date',
      blockedReason: blocked.reason,
      bookedCount: 0,
      slots: [],
      availableCount: 0,
    };
  }

  const dayConfig = settings.schedule[dayKey];
  if (!dayConfig || !dayConfig.enabled) {
    return {
      date: dateStr,
      dayKey,
      isOpen: false,
      reasonClosed: 'day_off',
      bookedCount: 0,
      slots: [],
      availableCount: 0,
    };
  }

  const dayMeetings = meetings.filter(
    (m) => m.scheduledTime.slice(0, 10) === dateStr && m.status !== 'no_show'
  );
  const bookedCount = dayMeetings.length;
  const capReached = bookedCount >= settings.maxBookingsPerDay;

  const start = timeToMinutes(dayConfig.startTime);
  const end = timeToMinutes(dayConfig.endTime);
  const step = Math.max(5, settings.slotDurationMinutes + settings.bufferMinutes);
  const breakStart = dayConfig.hasBreak ? timeToMinutes(dayConfig.breakStart) : -1;
  const breakEnd = dayConfig.hasBreak ? timeToMinutes(dayConfig.breakEnd) : -1;

  const slots: GeneratedSlot[] = [];

  for (let cursor = start; cursor + settings.slotDurationMinutes <= end; cursor += step) {
    const slotEnd = cursor + settings.slotDurationMinutes;

    if (
      dayConfig.hasBreak &&
      breakEnd > breakStart &&
      cursor < breakEnd &&
      slotEnd > breakStart
    ) {
      continue;
    }

    const timeStr = minutesToTime(cursor);
    const endTimeStr = minutesToTime(slotEnd);

    const conflictingMeeting = dayMeetings.find((m) => {
      const timePart = m.scheduledTime.includes('T')
        ? m.scheduledTime.split('T')[1].slice(0, 5)
        : '12:00';
      const meetStart = timeToMinutes(timePart);
      const meetEnd = meetStart + settings.slotDurationMinutes + settings.bufferMinutes;
      return cursor < meetEnd && slotEnd + settings.bufferMinutes > meetStart;
    });

    if (conflictingMeeting) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        status: 'booked',
        bookedByAgency: conflictingMeeting.agencyName,
      });
    } else if (capReached) {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        status: 'daily_cap_reached',
      });
    } else {
      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        status: 'available',
      });
    }
  }

  const availableCount = slots.filter((s) => s.status === 'available').length;

  return {
    date: dateStr,
    dayKey,
    isOpen: availableCount > 0,
    reasonClosed: capReached && availableCount === 0 ? 'daily_cap' : undefined,
    bookedCount,
    slots,
    availableCount,
  };
}
