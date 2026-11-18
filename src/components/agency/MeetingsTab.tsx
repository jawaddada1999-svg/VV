import React, { useState, useMemo } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  MessageSquare,
  Building2,
  Users,
  Inbox,
  AlertTriangle,
  CreditCard,
  PhoneCall,
  Check,
  Edit2,
  TrendingUp,
  Search,
  Filter,
  Flame,
  Send,
  Timer,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Eye,
  ShieldCheck,
  Activity,
  CheckSquare,
  Square,
  Trash2,
  ArrowUpRight,
  Target,
  BarChart3,
  ListTodo,
  CalendarDays,
  RefreshCw,
  Zap,
  Bell,
  CheckCheck,
  UserCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
  Area,
} from 'recharts';
import { MeetingItem, PackageTier, AgencyTask } from '../../types/agency';
import { translations } from '../../translations';
import { BookingSettingsTab } from './BookingSettingsTab';
import { DAY_ORDER, generateTimeOptions } from '../../utils/bookingSlots';

export const MeetingsTab: React.FC = () => {
  const {
    meetings,
    clients,
    tasks,
    packages,
    addMeeting,
    updateMeeting,
    updateMeetingStatus,
    toggleMeetingReminder,
    toggleMeetingConfirmation,
    toggleMeetingConverted,
    addTask,
    toggleTask,
    deleteTask,
    start7DayTrial,
    setSelectedClientId,
    bookingSettings,
    language,
    direction,
  } = useAgency();

  const t = translations[language];

  // Active Sub-Tab: 'agenda' | 'performance' | 'tasks' | 'all_meetings' | 'booking_hours'
  const [activeSubTab, setActiveSubTab] = useState<'agenda' | 'performance' | 'tasks' | 'all_meetings' | 'booking_hours'>('agenda');

  // Agenda Date Selector (defaults to today's date YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const timeOptions = useMemo(() => generateTimeOptions(6, 23, 15), []);
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string>(todayStr);

  // Modals state
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Add Meeting Form State
  const [selectedClientForMeeting, setSelectedClientForMeeting] = useState(clients[0]?.id || '');
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [scheduledTime, setScheduledTime] = useState('15:00');
  const [packageInterest, setPackageInterest] = useState<PackageTier>('growth');
  const [teamSize, setTeamSize] = useState<number>(5);
  const [dailyInquiries, setDailyInquiries] = useState<number>(30);
  const [mainProblem, setMainProblem] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Add Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [taskDueDate, setTaskDueDate] = useState(todayStr);
  const [taskCategory, setTaskCategory] = useState<AgencyTask['category']>('reminder');
  const [taskRelatedAgency, setTaskRelatedAgency] = useState('');
  const [taskFilterStatus, setTaskFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  // Filtering & search for master table
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'trial'>('all');

  // Trigger feedback state for automated communications
  const [lastActionTriggered, setLastActionTriggered] = useState<{
    id: string;
    type: 'call' | 'whatsapp' | 'reminder';
    message: string;
  } | null>(null);

  // Quick Date Helpers
  const yesterdayStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  // Weekly Agenda Navigation & View Modes
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [agendaViewMode, setAgendaViewMode] = useState<'weekly_grid' | 'daily_timeline'>('weekly_grid');

  // Calculate the 7 Days of the Active Week (Monday to Sunday)
  const currentWeekDays = useMemo(() => {
    const today = new Date();
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() + weekOffset * 7);

    // Get Monday of that week
    const day = baseDate.getDay();
    const diffToMonday = baseDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(baseDate.setDate(diffToMonday));

    const dayNamesAr = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
    const dayNamesFr = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const dayNamesEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const days = [];
    const todayISO = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const isToday = dateStr === todayISO;

      const dayName =
        language === 'ar'
          ? dayNamesAr[i]
          : language === 'fr'
          ? dayNamesFr[i]
          : dayNamesEn[i];

      const formattedDate = d.toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
        day: 'numeric',
        month: 'short',
      });

      const dayNumber = d.getDate();

      const dayMeetings = meetings
        .filter((m) => m.scheduledTime.slice(0, 10) === dateStr)
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

      days.push({
        date: dateStr,
        dayName,
        formattedDate,
        dayNumber,
        isToday,
        meetings: dayMeetings,
      });
    }

    return days;
  }, [weekOffset, meetings, language]);

  const weekRangeLabel = useMemo(() => {
    if (currentWeekDays.length === 0) return '';
    return `${currentWeekDays[0].formattedDate} — ${currentWeekDays[6].formattedDate}`;
  }, [currentWeekDays]);

  const weekTotalMeetings = useMemo(() => {
    return currentWeekDays.reduce((sum, d) => sum + d.meetings.length, 0);
  }, [currentWeekDays]);

  // Meetings filtered by the selected agenda date
  const agendaMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const meetDate = m.scheduledTime.slice(0, 10);
      return meetDate === selectedAgendaDate;
    });
  }, [meetings, selectedAgendaDate]);

  // Daily Performance Metrics (Calculated for Today)
  const dailyPerformance = useMemo(() => {
    const todayMeetings = meetings.filter((m) => m.scheduledTime.slice(0, 10) === todayStr);
    const totalScheduled = todayMeetings.length;
    const conducted = todayMeetings.filter((m) => m.status === 'completed').length;
    const converted = todayMeetings.filter((m) => m.convertedToDeal || m.trialResult === 'accepted').length;
    const remindersSentCount = todayMeetings.filter((m) => m.reminderSent).length;
    const confirmedCount = todayMeetings.filter((m) => m.reminderConfirmed).length;
    const conversionRate = conducted > 0 ? Math.round((converted / conducted) * 100) : 0;
    const confirmationRate = totalScheduled > 0 ? Math.round((confirmedCount / totalScheduled) * 100) : 0;

    return {
      totalScheduled,
      conducted,
      converted,
      remindersSentCount,
      confirmedCount,
      conversionRate,
      confirmationRate,
    };
  }, [meetings, todayStr]);

  // Weekly Performance Metrics (Calculated for the last 7 days + upcoming week)
  const weeklyPerformance = useMemo(() => {
    const nowMs = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const weekMeetings = meetings.filter((m) => {
      const meetMs = new Date(m.scheduledTime).getTime();
      return Math.abs(nowMs - meetMs) <= oneWeekMs;
    });

    const totalScheduled = weekMeetings.length;
    const conducted = weekMeetings.filter((m) => m.status === 'completed').length;
    const converted = weekMeetings.filter((m) => m.convertedToDeal || m.trialResult === 'accepted').length;
    const noShow = weekMeetings.filter((m) => m.status === 'no_show').length;
    const pendingUpcoming = weekMeetings.filter((m) => m.status === 'scheduled').length;
    const conversionRate = conducted > 0 ? Math.round((converted / conducted) * 100) : 0;
    const attendanceRate = totalScheduled > 0 ? Math.round((conducted / (conducted + noShow || 1)) * 100) : 0;

    return {
      totalScheduled,
      conducted,
      converted,
      noShow,
      pendingUpcoming,
      conversionRate,
      attendanceRate,
    };
  }, [meetings]);

  // Tasks statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const dueToday = tasks.filter((t) => t.dueDate === todayStr && !t.completed).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, dueToday, completionRate };
  }, [tasks, todayStr]);

  // Filtered Tasks list
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (taskFilterStatus === 'pending') return !t.completed;
      if (taskFilterStatus === 'completed') return t.completed;
      return true;
    });
  }, [tasks, taskFilterStatus]);

  // Daily Performance Chart Data (Last 7 Days)
  const dailyChartData = useMemo(() => {
    const days = [];
    const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const dayNamesFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayOfWeek = d.getDay();

      const dayName =
        language === 'ar'
          ? (i === 0 ? t.today : dayNamesAr[dayOfWeek])
          : language === 'fr'
          ? (i === 0 ? t.today : dayNamesFr[dayOfWeek])
          : (i === 0 ? t.today : dayNamesEn[dayOfWeek]);

      const dayMeetings = meetings.filter((m) => m.scheduledTime.slice(0, 10) === dateStr);
      const scheduled = dayMeetings.length;
      const conducted = dayMeetings.filter((m) => m.status === 'completed').length;
      const converted = dayMeetings.filter((m) => m.convertedToDeal || m.trialResult === 'accepted').length;
      const conversionRate = conducted > 0 ? Math.round((converted / conducted) * 100) : 0;

      days.push({
        date: dateStr,
        dayName,
        scheduled,
        conducted,
        converted,
        conversionRate,
      });
    }

    return days;
  }, [meetings, language, t.today]);

  // Hourly Breakdown for Selected Agenda Date
  const hourlyChartData = useMemo(() => {
    const slots = [
      {
        slotKey: 'morning',
        label: language === 'ar' ? 'الصباح (09h - 12h)' : language === 'fr' ? 'Matin (09h - 12h)' : 'Morning (09h - 12h)',
        startHour: 9,
        endHour: 12,
      },
      {
        slotKey: 'midday',
        label: language === 'ar' ? 'الظهيرة (12h - 15h)' : language === 'fr' ? 'Midi (12h - 15h)' : 'Midday (12h - 15h)',
        startHour: 12,
        endHour: 15,
      },
      {
        slotKey: 'afternoon',
        label: language === 'ar' ? 'بعد الزوال (15h - 18h)' : language === 'fr' ? 'Après-midi (15h - 18h)' : 'Afternoon (15h - 18h)',
        startHour: 15,
        endHour: 18,
      },
      {
        slotKey: 'evening',
        label: language === 'ar' ? 'المساء (18h - 21h)' : language === 'fr' ? 'Soirée (18h - 21h)' : 'Evening (18h - 21h)',
        startHour: 18,
        endHour: 21,
      },
    ];

    const targetMeetings = meetings.filter((m) => m.scheduledTime.slice(0, 10) === selectedAgendaDate);

    return slots.map((slot) => {
      const inSlot = targetMeetings.filter((m) => {
        const timePart = m.scheduledTime.includes('T') ? m.scheduledTime.split('T')[1] : '12:00';
        const hour = parseInt(timePart.slice(0, 2), 10) || 12;
        return hour >= slot.startHour && hour < slot.endHour;
      });

      const count = inSlot.length;
      const confirmed = inSlot.filter((m) => m.reminderConfirmed).length;
      const converted = inSlot.filter((m) => m.convertedToDeal || m.trialResult === 'accepted').length;

      return {
        label: slot.label,
        count,
        confirmed,
        converted,
      };
    });
  }, [meetings, selectedAgendaDate, language]);

  // Computed summary metrics for the whole pipeline
  const summaryMetrics = useMemo(() => {
    const totalMeetings = meetings.length;
    const totalTeamMembers = meetings.reduce((sum, m) => sum + (m.teamSize || 0), 0);
    const avgTeamSize = totalMeetings > 0 ? (totalTeamMembers / totalMeetings).toFixed(1) : '0';

    const totalDailyInquiries = meetings.reduce((sum, m) => sum + (m.dailyInquiries || 0), 0);
    const avgDailyLeadsPerAgency = totalMeetings > 0 ? Math.round(totalDailyInquiries / totalMeetings) : 0;

    const trialsActive = meetings.filter((m) => m.trialStartDate && m.trialEndDate);
    const trialsAccepted = meetings.filter((m) => m.trialResult === 'accepted').length;

    const urgentDeadlines = trialsActive.filter((m) => {
      if (!m.trialEndDate) return false;
      const end = new Date(m.trialEndDate).getTime();
      const diffDays = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 2;
    }).length;

    return {
      totalMeetings,
      totalTeamMembers,
      avgTeamSize,
      totalDailyInquiries,
      avgDailyLeadsPerAgency,
      activeTrialsCount: trialsActive.length,
      trialsAccepted,
      urgentDeadlines,
    };
  }, [meetings]);

  // Filtered meetings for master appointments table
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchSearch =
        m.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        (m.mainProblem && m.mainProblem.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchStatus = true;
      if (statusFilter === 'scheduled') matchStatus = m.status === 'scheduled';
      else if (statusFilter === 'completed') matchStatus = m.status === 'completed';
      else if (statusFilter === 'trial') matchStatus = Boolean(m.trialStartDate);

      return matchSearch && matchStatus;
    });
  }, [meetings, searchQuery, statusFilter]);

  // Localized package label helper
  const getPackageName = (tier?: PackageTier) => {
    if (tier === 'starter') return t.starterPackage;
    if (tier === 'growth') return t.growthPackage;
    if (tier === 'enterprise') return t.enterprisePackage;
    return t.growthPackage;
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientForMeeting);
    if (!client) return;

    addMeeting({
      clientId: client.id,
      clientName: client.contactPerson,
      agencyName: client.agencyName,
      phone: client.phone,
      city: client.city,
      scheduledTime: `${scheduledDate}T${scheduledTime}:00Z`,
      status: 'scheduled',
      reminderSent: false,
      reminderConfirmed: false,
      convertedToDeal: false,
      packageInterest,
      teamSize,
      dailyInquiries,
      mainProblem:
        mainProblem ||
        (language === 'ar'
          ? 'تأخر الرد على استفسارات العقارات عبر واتساب'
          : language === 'fr'
          ? 'Retard de réponse aux prospects immobiliers'
          : 'Slow WhatsApp response to real estate inquiries'),
      setupPaymentStatus: 'pending',
      meetingNotes,
    });

    setShowAddMeetingModal(false);
    setMeetingNotes('');
    setMainProblem('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      priority: taskPriority,
      dueDate: taskDueDate,
      completed: false,
      category: taskCategory,
      relatedAgencyName: taskRelatedAgency.trim() || undefined,
    });

    setShowAddTaskModal(false);
    setTaskTitle('');
    setTaskDescription('');
    setTaskRelatedAgency('');
  };

  // Automated WhatsApp / Call Triggers with Reminder Messaging
  const handleTriggerAction = (meet: MeetingItem, type: 'call' | 'whatsapp' | 'reminder') => {
    const cleanPhone = meet.phone.replace(/[^0-9]/g, '');

    if (type === 'call') {
      setLastActionTriggered({
        id: meet.id,
        type: 'call',
        message: `${t.call}: ${meet.clientName} (${meet.phone})`,
      });
      window.location.href = `tel:${meet.phone}`;
    } else if (type === 'reminder') {
      const timeOnly = meet.scheduledTime.includes('T')
        ? meet.scheduledTime.split('T')[1].slice(0, 5)
        : meet.scheduledTime;
      const reminderMsg = encodeURIComponent(
        language === 'ar'
          ? `السلام عليكم أستاذ ${meet.clientName}،\nنذكركم بموعد مكالمة استشارة أتمتة التسويق العقاري لوكالتكم "${meet.agencyName}" المقرر اليوم على الساعة ${timeOnly}.\n\nالمرجو تأكيد حضوركم بالرد بكلمة "مؤكد" لتثبيت الرابط.\nشكراً، فريق IBONDA.`
          : language === 'fr'
          ? `Bonjour M./Mme ${meet.clientName},\nNous vous rappelons votre rendez-vous de démonstration d'automatisation immobilière pour votre agence "${meet.agencyName}" prévu aujourd'hui à ${timeOnly}.\n\nMerci de confirmer votre présence en répondant "Confirmé".\nCordialement, l'équipe IBONDA.`
          : `Hello ${meet.clientName},\nThis is a reminder for your real estate automation consultation call for "${meet.agencyName}" scheduled today at ${timeOnly}.\n\nPlease reply with "Confirmed" to confirm your attendance.\nBest regards, IBONDA Team.`
      );
      setLastActionTriggered({
        id: meet.id,
        type: 'reminder',
        message: `${t.reminderSent}: ${meet.clientName}`,
      });
      if (!meet.reminderSent) {
        toggleMeetingReminder(meet.id);
      }
      window.open(`https://wa.me/${cleanPhone}?text=${reminderMsg}`, '_blank');
    } else {
      const waMessage = encodeURIComponent(
        language === 'ar'
          ? `السلام عليكم أستاذ ${meet.clientName}، معكم فريق IBONDA لأتمتة التسويق العقاري. نؤكد معكم تفاصيل استشارة وكالة "${meet.agencyName}". تم رصد حجم فريقكم (${meet.teamSize || 5} أفراد) ومعدل طلباتكم (${meet.dailyInquiries || 25} طلب/يوم) لتجهيز تجربة الـ 7 أيام المجانية.`
          : language === 'fr'
          ? `Bonjour M./Mme ${meet.clientName}, équipe IBONDA Automatisation. Nous préparons la consultation pour votre agence "${meet.agencyName}". Vos données ont été prises en compte pour initialiser votre essai gratuit de 7 jours.`
          : `Hello ${meet.clientName}, IBONDA Automation team. We are preparing the consultation for "${meet.agencyName}". Your agency profile is recorded to initialize your 7-day free trial.`
      );
      setLastActionTriggered({
        id: meet.id,
        type: 'whatsapp',
        message: `${t.whatsapp}: ${meet.clientName}`,
      });
      window.open(`https://wa.me/${cleanPhone}?text=${waMessage}`, '_blank');
    }

    setTimeout(() => {
      setLastActionTriggered(null);
    }, 4500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-200">
              {t.meetingsHeaderTag}
            </span>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {meetings.length} {t.meetingsUnit}
            </span>
            <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{dailyPerformance.totalScheduled} {t.today}</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              <span>{weeklyPerformance.conversionRate}% {t.weeklyConversionRate}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.meetingsHeaderTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            {t.meetingsHeaderDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <ListTodo className="w-4 h-4 text-orange-400" />
            <span>{t.btnAddTask}</span>
          </button>
          <button
            onClick={() => setShowAddMeetingModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF5500] hover:from-orange-600 hover:to-[#D93800] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.btnAddMeeting}</span>
          </button>
        </div>
      </div>

      {/* 2. Automated Action Feedback Banner */}
      {lastActionTriggered && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xs transition-all animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold">{t.colCommunication}:</span>
            <span>{lastActionTriggered.message}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold bg-white/70 px-2 py-0.5 rounded border border-emerald-200">
            ✓ {t.completed}
          </span>
        </div>
      )}

      {/* 3. Sub-Tab Navigation Bar */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200 overflow-x-auto text-xs">
        {/* Subtab 1: Daily Agenda */}
        <button
          onClick={() => setActiveSubTab('agenda')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'agenda'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <CalendarDays className={`w-4 h-4 ${activeSubTab === 'agenda' ? 'text-orange-500' : 'text-slate-400'}`} />
          <span>{t.subtabAgenda}</span>
          <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            activeSubTab === 'agenda' ? 'bg-orange-100 text-orange-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {dailyPerformance.totalScheduled}
          </span>
        </button>

        {/* Subtab 2: Performance Analytics */}
        <button
          onClick={() => setActiveSubTab('performance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'performance'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeSubTab === 'performance' ? 'text-blue-600' : 'text-slate-400'}`} />
          <span>{t.subtabPerformance}</span>
          <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            activeSubTab === 'performance' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {weeklyPerformance.conversionRate}%
          </span>
        </button>

        {/* Subtab 3: Agency To-Do List */}
        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'tasks'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ListTodo className={`w-4 h-4 ${activeSubTab === 'tasks' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>{t.subtabTasks}</span>
          <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            activeSubTab === 'tasks' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {taskStats.pending} {t.pending}
          </span>
        </button>

        {/* Subtab 4: All Appointments Master Table */}
        <button
          onClick={() => setActiveSubTab('all_meetings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'all_meetings'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Building2 className={`w-4 h-4 ${activeSubTab === 'all_meetings' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <span>{t.subtabAllMeetings}</span>
          <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            activeSubTab === 'all_meetings' ? 'bg-indigo-100 text-indigo-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {meetings.length}
          </span>
        </button>

        {/* Subtab 5: Working Hours & Booking Form Settings */}
        <button
          onClick={() => setActiveSubTab('booking_hours')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
            activeSubTab === 'booking_hours'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Clock className={`w-4 h-4 ${activeSubTab === 'booking_hours' ? 'text-orange-600' : 'text-slate-400'}`} />
          <span>{t.subtabBookingHours}</span>
          <span className={`text-[11px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
            activeSubTab === 'booking_hours' ? 'bg-orange-100 text-orange-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {DAY_ORDER.filter((d) => bookingSettings.schedule[d]?.enabled).length}/7
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: WEEKLY & DAILY VISUAL AGENDA HUB                */}
      {/* ======================================================== */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Week Navigation & Control Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Week Navigation */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((prev) => prev - 1)}
                    className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title={language === 'ar' ? 'الأسبوع السابق' : language === 'fr' ? 'Semaine précédente' : 'Previous Week'}
                  >
                    {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeekOffset(0)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      weekOffset === 0
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {language === 'ar' ? 'هذا الأسبوع (الحالي)' : language === 'fr' ? 'Cette semaine' : 'Current Week'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeekOffset((prev) => prev + 1)}
                    className="p-1.5 hover:bg-white text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title={language === 'ar' ? 'الأسبوع القادم' : language === 'fr' ? 'Semaine suivante' : 'Next Week'}
                  >
                    {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-950 px-3.5 py-1.5 rounded-xl text-xs font-bold">
                  <CalendarDays className="w-4 h-4 text-orange-600 shrink-0" />
                  <span className="font-mono">{weekRangeLabel}</span>
                </div>
              </div>

              {/* View Mode Switcher & Quick Add */}
              <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setAgendaViewMode('weekly_grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      agendaViewMode === 'weekly_grid'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'جدول المواعيد الأسبوعي (7 أيام)' : language === 'fr' ? 'Agenda Hebdomadaire' : 'Weekly Agenda'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAgendaViewMode('daily_timeline')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      agendaViewMode === 'daily_timeline'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تفاصيل اليوم' : language === 'fr' ? 'Vue Journalière' : 'Daily View'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setScheduledDate(todayStr);
                    setShowAddMeetingModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-[#FF5500] hover:from-orange-600 hover:to-[#D93800] text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.btnAddMeeting}</span>
                </button>
              </div>
            </div>

            {/* Week Summary Stats Bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">
                  {language === 'ar' ? 'إجمالي مواعيد الأسبوع:' : language === 'fr' ? 'Total RDV de la semaine :' : 'Total Week Meetings:'}
                </span>
                <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {weekTotalMeetings}
                </span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">
                  {language === 'ar' ? 'مواعيد اليوم:' : language === 'fr' ? 'RDV d’aujourd’hui :' : 'Today’s Meetings:'}
                </span>
                <span className="font-mono font-extrabold text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                  {dailyPerformance.totalScheduled}
                </span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">
                  {language === 'ar' ? 'مؤكدة من العملاء:' : language === 'fr' ? 'Confirmés :' : 'Confirmed:'}
                </span>
                <span className="font-mono font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {currentWeekDays.reduce((sum, d) => sum + d.meetings.filter((m) => m.reminderConfirmed).length, 0)}
                </span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium">
                  {language === 'ar' ? 'تم تحويلها لصفقات:' : language === 'fr' ? 'Convertis en deals :' : 'Converted:'}
                </span>
                <span className="font-mono font-extrabold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                  {currentWeekDays.reduce((sum, d) => sum + d.meetings.filter((m) => m.convertedToDeal || m.trialResult === 'accepted').length, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SUB-MODE A: 7-DAY VISUAL WEEKLY COLUMNS GRID            */}
          {/* ======================================================== */}
          {agendaViewMode === 'weekly_grid' && (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 lg:grid lg:grid-cols-7 lg:gap-3.5 lg:overflow-visible lg:pb-0 items-stretch no-scrollbar">
              {currentWeekDays.map((day) => {
                return (
                  <div
                    key={day.date}
                    className={`min-w-[272px] sm:min-w-[290px] lg:min-w-0 snap-center shrink-0 rounded-2xl border flex flex-col transition-all min-h-[340px] ${
                      day.isToday
                        ? 'bg-orange-50/20 border-orange-400 ring-1 ring-orange-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Day Column Header */}
                    <div
                      className={`p-3 rounded-t-2xl border-b flex items-center justify-between ${
                        day.isToday
                          ? 'bg-gradient-to-r from-orange-500 to-[#FF5500] text-white border-orange-500'
                          : 'bg-slate-50 text-slate-900 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs">{day.dayName}</span>
                          {day.isToday && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-white text-orange-600 shadow-2xs">
                              {t.today}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-mono block ${day.isToday ? 'text-orange-100' : 'text-slate-400'}`}>
                          {day.formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded-full ${
                            day.isToday
                              ? 'bg-white/20 text-white'
                              : day.meetings.length > 0
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {day.meetings.length}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setScheduledDate(day.date);
                            setShowAddMeetingModal(true);
                          }}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            day.isToday
                              ? 'hover:bg-white/20 text-white'
                              : 'hover:bg-slate-200 text-slate-500'
                          }`}
                          title={language === 'ar' ? `حجز موعد جديد ليوم ${day.dayName}` : 'Add meeting'}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Day Column Meeting Cards */}
                    <div className="p-2.5 flex-1 space-y-2.5">
                      {day.meetings.length === 0 ? (
                        <div className="h-full min-h-[140px] flex flex-col items-center justify-center p-3 text-center border border-dashed border-slate-200 rounded-xl text-slate-400">
                          <Calendar className="w-5 h-5 text-slate-300 mb-1" />
                          <span className="text-[11px] font-medium text-slate-400">
                            {language === 'ar' ? 'لا توجد مواعيد' : language === 'fr' ? 'Aucun RDV' : 'No meetings'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setScheduledDate(day.date);
                              setShowAddMeetingModal(true);
                            }}
                            className="mt-2 text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{language === 'ar' ? 'حجز موعد' : language === 'fr' ? 'Ajouter' : 'Schedule'}</span>
                          </button>
                        </div>
                      ) : (
                        day.meetings.map((meet) => {
                          const timeOnly = meet.scheduledTime.includes('T')
                            ? meet.scheduledTime.split('T')[1].slice(0, 5)
                            : meet.scheduledTime;
                          const isConverted = Boolean(meet.convertedToDeal || meet.trialResult === 'accepted');

                          return (
                            <div
                              key={meet.id}
                              className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between gap-2.5 ${
                                isConverted
                                  ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                                  : meet.reminderConfirmed
                                  ? 'bg-blue-50/30 border-blue-200 hover:border-blue-300 shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-orange-300 shadow-2xs'
                              }`}
                            >
                              {/* Exact Highlighted Time Badge & Status */}
                              <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                                <div
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg font-mono font-black text-xs shadow-2xs ${
                                    isConverted
                                      ? 'bg-emerald-600 text-white'
                                      : meet.reminderConfirmed
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-slate-900 text-white'
                                  }`}
                                >
                                  <Clock className="w-3 h-3 text-orange-400 shrink-0" />
                                  <span>{timeOnly}</span>
                                </div>

                                <span
                                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${
                                    meet.packageInterest === 'enterprise'
                                      ? 'bg-purple-100 text-purple-900'
                                      : meet.packageInterest === 'growth'
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'bg-orange-100 text-orange-900'
                                  }`}
                                >
                                  {getPackageName(meet.packageSelected || meet.packageInterest)}
                                </span>
                              </div>

                              {/* Agency & Client Details */}
                              <div className="space-y-1">
                                <h5 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1" title={meet.agencyName}>
                                  {meet.agencyName}
                                </h5>

                                <div className="text-[11px] text-slate-600 font-medium flex items-center justify-between">
                                  <span>{meet.clientName}</span>
                                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-orange-500" />
                                    <span>{meet.city}</span>
                                  </span>
                                </div>

                                <div className="font-mono text-[10px] text-slate-500" dir="ltr">
                                  {meet.phone}
                                </div>
                              </div>

                              {/* Action Controls & Status Buttons */}
                              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                {/* Reminder & Confirmation Row */}
                                <div className="grid grid-cols-2 gap-1 text-[10px]">
                                  {/* Reminder Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleMeetingReminder(meet.id)}
                                    className={`py-1 px-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                      meet.reminderSent
                                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                    title={t.reminderStatus}
                                  >
                                    <Bell className="w-2.5 h-2.5" />
                                    <span className="truncate">{meet.reminderSent ? t.reminderSent : t.reminderNotSent}</span>
                                  </button>

                                  {/* Confirmation Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleMeetingConfirmation(meet.id)}
                                    className={`py-1 px-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                      meet.reminderConfirmed
                                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                    }`}
                                    title={t.confirmationStatus}
                                  >
                                    <UserCheck className="w-2.5 h-2.5" />
                                    <span className="truncate">{meet.reminderConfirmed ? t.confirmedByClient : t.notConfirmedYet}</span>
                                  </button>
                                </div>

                                {/* Status Switch & Conversion */}
                                <div className="flex items-center justify-between gap-1">
                                  <select
                                    value={meet.status}
                                    onChange={(e) => updateMeetingStatus(meet.id, e.target.value as MeetingItem['status'])}
                                    className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer flex-1"
                                  >
                                    <option value="scheduled">{t.statusScheduled}</option>
                                    <option value="completed">{t.statusCompleted}</option>
                                    <option value="no_show">{t.statusNoShow}</option>
                                  </select>

                                  {/* Deal Conversion Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleMeetingConverted(meet.id)}
                                    className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                      isConverted
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700'
                                    }`}
                                    title={isConverted ? t.convertedToDeal : (language === 'ar' ? 'تحويل لصفقة 7 أيام' : 'Convert to Deal')}
                                  >
                                    <Zap className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* Quick Inspect Client Details & Direct Comm Links */}
                                <div className="flex items-center justify-between pt-1 text-[10px]">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedClientId(meet.clientId)}
                                    className="text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>{language === 'ar' ? 'فحص الملف' : language === 'fr' ? 'Détails client' : 'Client Profile'}</span>
                                  </button>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleTriggerAction(meet, 'reminder')}
                                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                                      title={language === 'ar' ? 'إرسال تذكير واتساب' : 'WhatsApp'}
                                    >
                                      <Send className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleTriggerAction(meet, 'call')}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                                      title={language === 'ar' ? 'اتصال هاتفي' : 'Call'}
                                    >
                                      <PhoneCall className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* SUB-MODE B: FOCUSED DAILY AGENDA & TIMELINE             */}
          {/* ======================================================== */}
          {agendaViewMode === 'daily_timeline' && (
            <div className="space-y-4">
              {/* Day Selector Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>{language === 'ar' ? 'اختر اليوم المحدد:' : language === 'fr' ? 'Choisir la date :' : 'Select Date:'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedAgendaDate(yesterdayStr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedAgendaDate === yesterdayStr
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t.yesterday}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAgendaDate(todayStr)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selectedAgendaDate === todayStr
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : 'bg-orange-100 text-orange-950 hover:bg-orange-200'
                    }`}
                  >
                    <span>{t.today}</span>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAgendaDate(tomorrowStr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedAgendaDate === tomorrowStr
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t.tomorrow}
                  </button>

                  <input
                    type="date"
                    value={selectedAgendaDate}
                    onChange={(e) => setSelectedAgendaDate(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-medium">
                    {language === 'ar' ? 'مواعيد هذا اليوم:' : language === 'fr' ? 'RDV du jour :' : 'Meetings:'}
                  </span>
                  <span className="font-mono font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {agendaMeetings.length}
                  </span>
                </div>
              </div>

              {/* Day Cards List */}
              {agendaMeetings.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">
                    {language === 'ar' ? `لا توجد مواعيد مسجلة لتاريخ ${selectedAgendaDate}` : language === 'fr' ? `Aucun rendez-vous pour le ${selectedAgendaDate}` : `No meetings scheduled for ${selectedAgendaDate}`}
                  </h3>
                  <button
                    onClick={() => {
                      setScheduledDate(selectedAgendaDate);
                      setShowAddMeetingModal(true);
                    }}
                    className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ {t.btnAddMeeting}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {agendaMeetings.map((meet) => {
                    const timeOnly = meet.scheduledTime.includes('T')
                      ? meet.scheduledTime.split('T')[1].slice(0, 5)
                      : meet.scheduledTime;
                    const isConverted = Boolean(meet.convertedToDeal || meet.trialResult === 'accepted');

                    return (
                      <div
                        key={meet.id}
                        className={`bg-white rounded-2xl border-2 transition-all p-5 shadow-2xs hover:shadow-md ${
                          isConverted
                            ? 'border-emerald-300 bg-gradient-to-r from-emerald-50/20 to-white'
                            : meet.reminderConfirmed
                            ? 'border-blue-200'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 text-white min-w-[76px] text-center shadow-xs">
                              <Clock className="w-4 h-4 text-orange-400 mb-1" />
                              <span className="font-mono text-base font-extrabold tracking-tight">{timeOnly}</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-extrabold text-slate-900">
                                  {meet.agencyName}
                                </h4>
                                <span className="text-xs text-slate-500 font-bold">• {meet.city}</span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                                  {getPackageName(meet.packageSelected || meet.packageInterest)}
                                </span>
                                {isConverted && (
                                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                                    <span>{language === 'ar' ? 'تم التحويل بنجاح!' : language === 'fr' ? 'Converti avec succès !' : 'Successfully Converted!'}</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 flex-wrap">
                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{meet.clientName} ({meet.teamSize || 5} {t.clientsUnit})</span>
                                </span>
                                <span className="text-slate-300">|</span>
                                <span className="font-mono" dir="ltr">{meet.phone}</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-slate-500">{meet.dailyInquiries || 25} {t.leads}/{t.days}</span>
                              </div>

                              {meet.mainProblem && (
                                <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 max-w-2xl leading-relaxed">
                                  <span className="font-bold text-amber-700">
                                    {language === 'ar' ? 'المشكلة الرئيسية: ' : language === 'fr' ? 'Problème identifié : ' : 'Main problem: '}
                                  </span>
                                  <span>{meet.mainProblem}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                            {/* Reminder Sent Toggle */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                {t.reminderStatus}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => toggleMeetingReminder(meet.id)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    meet.reminderSent
                                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  {meet.reminderSent ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
                                  ) : (
                                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                  <span>{meet.reminderSent ? t.reminderSent : t.reminderNotSent}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleTriggerAction(meet, 'reminder')}
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-2xs transition-colors cursor-pointer"
                                  title={language === 'ar' ? 'إرسال تذكير الموعد المباشر عبر واتساب' : 'Envoyer rappel WhatsApp'}
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Confirmation Toggle */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                {t.confirmationStatus}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleMeetingConfirmation(meet.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  meet.reminderConfirmed
                                    ? 'bg-blue-100 text-blue-950 border border-blue-300 shadow-2xs'
                                    : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                                }`}
                              >
                                <UserCheck className={`w-3.5 h-3.5 ${meet.reminderConfirmed ? 'text-blue-700' : 'text-amber-600'}`} />
                                <span>{meet.reminderConfirmed ? t.confirmedByClient : t.notConfirmedYet}</span>
                              </button>
                            </div>

                            {/* Deal Conversion Toggle */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                                {t.convertedStatus}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleMeetingConverted(meet.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isConverted
                                    ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs hover:from-orange-600 hover:to-amber-600'
                                }`}
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>{isConverted ? t.convertedToDeal : (language === 'ar' ? 'تحويل لتجربة ⚡' : language === 'fr' ? 'Convertir en Essai ⚡' : 'Convert to Trial ⚡')}</span>
                              </button>
                            </div>

                            {/* View Profile */}
                            <button
                              type="button"
                              onClick={() => setSelectedClientId(meet.clientId)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer self-end sm:self-center"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Communication Buttons */}
                            <div className="flex items-center gap-1.5 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleTriggerAction(meet, 'call')}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                                title={t.btnDirectCall}
                              >
                                <PhoneCall className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTriggerAction(meet, 'whatsapp')}
                                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                                title={t.btnWhatsAppChat}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: DAILY & WEEKLY PERFORMANCE ANALYTICS & CHARTS    */}
      {/* ======================================================== */}
      {activeSubTab === 'performance' && (
        <div className="space-y-6 animate-fade-in">
          {/* SECTION 1: DEDICATED RECHARTS DAILY PERFORMANCE CHART (طلب المستخدم الخاص) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 font-mono bg-orange-50 px-2 py-0.5 rounded">
                  {t.subtabPerformance}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {t.dailyChartTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.dailyChartSub}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">{t.dailyConversionRate}:</span>
                <span className="font-mono text-base font-extrabold text-orange-600 bg-orange-100 px-3 py-1 rounded-xl border border-orange-200">
                  {dailyPerformance.conversionRate}%
                </span>
              </div>
            </div>

            {/* Recharts Daily Bar + Line Chart */}
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="dayName"
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    allowDecimals={false}
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fill: '#10B981', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '11px',
                      fontWeight: 600,
                      direction: direction,
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === 'conversionRate') return [`${value}%`, t.chartLegendConversionRate];
                      if (name === 'scheduled') return [value, t.chartLegendScheduled];
                      if (name === 'conducted') return [value, t.chartLegendConducted];
                      if (name === 'converted') return [value, t.chartLegendConverted];
                      return [value, name];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => {
                      if (value === 'scheduled') return <span className="text-slate-700 font-bold text-xs">{t.chartLegendScheduled}</span>;
                      if (value === 'conducted') return <span className="text-slate-700 font-bold text-xs">{t.chartLegendConducted}</span>;
                      if (value === 'converted') return <span className="text-slate-700 font-bold text-xs">{t.chartLegendConverted}</span>;
                      if (value === 'conversionRate') return <span className="text-emerald-700 font-bold text-xs">{t.chartLegendConversionRate}</span>;
                      return value;
                    }}
                  />
                  <Bar yAxisId="left" dataKey="scheduled" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar yAxisId="left" dataKey="conducted" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar yAxisId="left" dataKey="converted" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversionRate"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10B981' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SECTION 2: DAILY PERFORMANCE CARDS (TODAY) */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.dailyPerformanceTitle} - {todayStr}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'متابعة كمية المواعيد التي تم عقدها اليوم، ونسبة تحويلها إلى تجربة مجانية أو صفقات رابحة' : language === 'fr' ? 'Suivi des réunions tenues aujourd’hui et taux de conversion' : 'Track consultations held today and their conversion into trials or retainers'}
                </p>
              </div>
            </div>

            {/* Daily KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 block">{language === 'ar' ? 'مواعيد اليوم المجدولة' : language === 'fr' ? 'RDV prévus aujourd’hui' : 'Scheduled Today'}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
                    {dailyPerformance.totalScheduled}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{t.meetingsUnit}</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  {language === 'ar' ? 'المؤكدة من العميل:' : language === 'fr' ? 'Confirmés:' : 'Confirmed:'} <span className="font-bold text-blue-700">{dailyPerformance.confirmedCount}</span>
                </div>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <span className="text-xs font-bold text-blue-900 block">{t.dailyConductedMeetings}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-900">
                    {dailyPerformance.conducted}
                  </span>
                  <span className="text-xs text-blue-700 font-bold">{t.attended}</span>
                </div>
                <div className="mt-2 text-[11px] text-blue-800 font-medium">
                  {t.reminderSent}: <span className="font-bold">{dailyPerformance.remindersSentCount}</span>
                </div>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 block">{t.dailyConvertedDeals}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-900">
                    {dailyPerformance.converted}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">{t.completed}</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-800 font-medium">
                  {t.dailyConversionRate}: <span className="font-bold font-mono">{dailyPerformance.conversionRate}%</span>
                </div>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-950 block">{language === 'ar' ? 'معدل تأكيد العملاء' : language === 'fr' ? 'Taux de confirmation' : 'Confirmation Rate'}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-900">
                    {dailyPerformance.confirmationRate}%
                  </span>
                  <span className="text-xs text-amber-700 font-bold">{t.active}</span>
                </div>
                <div className="mt-2 text-[11px] text-amber-800 font-medium">
                  {dailyPerformance.confirmedCount} / {dailyPerformance.totalScheduled} {t.confirmedByClient}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: WEEKLY PERFORMANCE CARDS */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.weeklyPerformanceTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'ar' ? 'إحصائيات المواعيد المجدولة، التي تمت، ونسبة الصفقات والتجارب المحولة طيلة الأسبوع' : language === 'fr' ? 'Statistiques des rendez-vous et conversions de la semaine' : 'Weekly scheduled consultations, attended calls, and trial conversions'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">{t.weeklyConversionRate}:</span>
                <span className="font-mono text-base font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300">
                  {weeklyPerformance.conversionRate}%
                </span>
              </div>
            </div>

            {/* Weekly KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 block">{t.weeklyTotalMeetings}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
                    {weeklyPerformance.totalScheduled}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{t.meetingsUnit}</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  {t.statusScheduled}: <span className="font-bold text-indigo-700">{weeklyPerformance.pendingUpcoming}</span>
                </div>
              </div>

              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200">
                <span className="text-xs font-bold text-indigo-950 block">{t.weeklyConductedMeetings}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-900">
                    {weeklyPerformance.conducted}
                  </span>
                  <span className="text-xs text-indigo-700 font-bold">{t.attended}</span>
                </div>
                <div className="mt-2 text-[11px] text-indigo-800 font-medium">
                  {t.metricAttendedRate}: <span className="font-bold font-mono">{weeklyPerformance.attendanceRate}%</span>
                </div>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 block">{t.weeklyConvertedDeals}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-900">
                    {weeklyPerformance.converted}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">{t.completed}</span>
                </div>
                <div className="mt-2 text-[11px] text-emerald-800 font-medium">
                  {t.weeklyConversionRate}: <span className="font-bold font-mono">{weeklyPerformance.conversionRate}%</span>
                </div>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
                <span className="text-xs font-bold text-rose-950 block">{t.notAttended}</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-900">
                    {weeklyPerformance.noShow}
                  </span>
                  <span className="text-xs text-rose-700 font-bold">{t.statusNoShow}</span>
                </div>
                <div className="mt-2 text-[11px] text-rose-800 font-medium">
                  {language === 'ar'
                    ? 'إعادة استهداف عبر واتساب'
                    : language === 'fr'
                    ? 'Relance WhatsApp'
                    : 'WhatsApp Follow-up'}
                </div>
              </div>
            </div>

            {/* Visual Conversion Funnel Progress Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 mb-3 block">
                {language === 'ar' ? 'مخطط مسار تحويل مواعيد الأسبوع:' : language === 'fr' ? 'Entonnoir de conversion hebdomadaire:' : 'Weekly Consultation Funnel:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-600 mb-1">
                    <span className="font-bold">1. {t.statusScheduled}</span>
                    <span className="font-mono font-bold">{weeklyPerformance.totalScheduled}</span>
                  </div>
                  <div className="w-full bg-slate-300 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-700 h-full w-full"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">100%</span>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between text-blue-900 mb-1">
                    <span className="font-bold">2. {t.reminderSent}</span>
                    <span className="font-mono font-bold">
                      {meetings.filter((m) => m.reminderSent).length}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((meetings.filter((m) => m.reminderSent).length / (weeklyPerformance.totalScheduled || 1)) * 100)
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-blue-700 mt-1 block">{t.whatsapp}</span>
                </div>

                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                  <div className="flex items-center justify-between text-indigo-900 mb-1">
                    <span className="font-bold">3. {t.attended}</span>
                    <span className="font-mono font-bold">{weeklyPerformance.conducted}</span>
                  </div>
                  <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full"
                      style={{ width: `${weeklyPerformance.attendanceRate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-indigo-700 mt-1 block font-mono">
                    {weeklyPerformance.attendanceRate}% {t.metricAttendedRate}
                  </span>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-950 mb-1">
                    <span className="font-bold">4. {t.convertedToDeal}</span>
                    <span className="font-mono font-bold">{weeklyPerformance.converted}</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${weeklyPerformance.conversionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-emerald-800 mt-1 block font-mono">
                    {weeklyPerformance.conversionRate}% {t.weeklyConversionRate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 3: AGENCY OPERATIONS TO-DO LIST                     */}
      {/* ======================================================== */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Task Stats */}
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {t.subtabTasks}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {taskStats.completed} / {taskStats.total} {t.completed}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {t.tasksSectionTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.tasksSectionSub}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Progress bar */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-700 font-mono">
                  {taskStats.completionRate}% {t.completed}
                </span>
                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden mt-1 border border-slate-200">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${taskStats.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>{t.btnAddTask}</span>
              </button>
            </div>
          </div>

          {/* Filter Bar for Tasks */}
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setTaskFilterStatus('all')}
                className={`px-3 py-1 font-bold rounded-md transition-colors ${
                  taskFilterStatus === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.taskFilterAll} ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilterStatus('pending')}
                className={`px-3 py-1 font-bold rounded-md transition-colors ${
                  taskFilterStatus === 'pending'
                    ? 'bg-white text-orange-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.taskFilterPending} ({taskStats.pending})
              </button>
              <button
                onClick={() => setTaskFilterStatus('completed')}
                className={`px-3 py-1 font-bold rounded-md transition-colors ${
                  taskFilterStatus === 'completed'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.taskFilterCompleted} ({taskStats.completed})
              </button>
            </div>

            <span className="text-xs text-slate-500">
              {language === 'ar' ? 'مهام مستعجلة لليوم:' : language === 'fr' ? 'Tâches du jour:' : 'Due Today:'}{' '}
              <span className="font-bold text-rose-600">{taskStats.dueToday}</span>
            </span>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <span className="font-bold text-sm block">
                  {language === 'ar' ? 'لا توجد مهام في هذه القائمة حالياً' : language === 'fr' ? 'Aucune tâche dans cette liste' : 'No tasks in this list'}
                </span>
                <span className="text-xs">
                  {language === 'ar' ? 'اضغط على زر إضافة مهمة جديدة لجدولة عمل جديد لفريقك.' : language === 'fr' ? 'Cliquez sur Ajouter une tâche pour créer un nouveau suivi.' : 'Click Add New Task to schedule work for your team.'}
                </span>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isDueToday = task.dueDate === todayStr;

                // Localized category label without foreign words
                const getCategoryLabel = (cat: AgencyTask['category']) => {
                  if (language === 'ar') {
                    if (cat === 'reminder') return 'تذكير بموعد';
                    if (cat === 'meeting') return 'موعد ومتابعة';
                    if (cat === 'build') return 'برمجة وتسليم';
                    if (cat === 'payment') return 'فوترة وصيانة';
                    return 'عام';
                  } else if (language === 'fr') {
                    if (cat === 'reminder') return 'Rappel';
                    if (cat === 'meeting') return 'RDV';
                    if (cat === 'build') return 'Livraison';
                    if (cat === 'payment') return 'Paiement';
                    return 'Général';
                  } else {
                    if (cat === 'reminder') return 'Reminder';
                    if (cat === 'meeting') return 'Meeting';
                    if (cat === 'build') return 'Delivery';
                    if (cat === 'payment') return 'Payment';
                    return 'General';
                  }
                };

                const getPriorityLabel = (pri: AgencyTask['priority']) => {
                  if (language === 'ar') {
                    if (pri === 'high') return 'أولوية قصوى';
                    if (pri === 'medium') return 'متوسطة';
                    return 'عادية';
                  } else if (language === 'fr') {
                    if (pri === 'high') return 'Haute';
                    if (pri === 'medium') return 'Moyenne';
                    return 'Basse';
                  } else {
                    if (pri === 'high') return 'High';
                    if (pri === 'medium') return 'Medium';
                    return 'Low';
                  }
                };

                return (
                  <div
                    key={task.id}
                    className={`bg-white p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-3 shadow-2xs ${
                      task.completed
                        ? 'border-slate-200 bg-slate-50/70 opacity-75'
                        : task.priority === 'high'
                        ? 'border-orange-200 hover:border-orange-400'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer shrink-0"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-bold text-sm text-slate-900 ${
                              task.completed ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {task.title}
                          </span>

                          {/* Category Badge */}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {getCategoryLabel(task.category)}
                          </span>

                          {/* Priority Badge */}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              task.priority === 'high'
                                ? 'bg-rose-100 text-rose-900'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>

                          {/* Related Agency */}
                          {task.relatedAgencyName && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                              {task.relatedAgencyName}
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 font-mono">
                          <span>
                            {t.taskDueDateLabel}:{' '}
                            <span
                              className={`font-bold ${
                                isDueToday && !task.completed
                                  ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded'
                                  : 'text-slate-800'
                              }`}
                            >
                              {task.dueDate} {isDueToday && `(${t.today})`}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                      title={language === 'ar' ? 'حذف المهمة' : 'Supprimer'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 4: ALL APPOINTMENTS MASTER TABLE                    */}
      {/* ======================================================== */}
      {activeSubTab === 'all_meetings' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Team Size Tracking */}
            <div className="bg-white p-4.5 rounded-2xl border-2 border-slate-200 shadow-2xs hover:border-orange-500 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Users className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full font-mono">
                  {t.metricAvgTeam}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 block">{t.metricAvgTeam}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
                  {summaryMetrics.totalTeamMembers}
                </span>
                <span className="text-xs text-slate-500 font-bold">{t.clientsUnit}</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t.metricAvgTeam}:</span>
                <span className="font-bold text-slate-900">{summaryMetrics.avgTeamSize}</span>
              </div>
            </div>

            {/* Metric 2: Daily Lead Volume Tracking */}
            <div className="bg-white p-4.5 rounded-2xl border-2 border-slate-200 shadow-2xs hover:border-orange-500 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <Inbox className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full font-mono">
                  {t.metricAvgDailyLeads}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 block">{t.metricAvgDailyLeads}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-900">
                  {summaryMetrics.totalDailyInquiries}
                </span>
                <span className="text-xs text-slate-500 font-bold">{t.leads}/{t.days}</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t.metricAvgDailyLeads}:</span>
                <span className="font-bold text-indigo-900">{summaryMetrics.avgDailyLeadsPerAgency}</span>
              </div>
            </div>

            {/* Metric 3: Trial Status Tracking */}
            <div className="bg-white p-4.5 rounded-2xl border-2 border-amber-200 shadow-2xs hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <Timer className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                  {t.metricActiveTrials}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 block">{t.metricActiveTrials}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-700">
                  {summaryMetrics.activeTrialsCount}
                </span>
                <span className="text-xs text-slate-500 font-bold">7 {t.days}</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t.completed}:</span>
                <span className="font-bold text-emerald-700">{summaryMetrics.trialsAccepted}</span>
              </div>
            </div>

            {/* Metric 4: Trial Deadlines & Urgency */}
            <div className="bg-white p-4.5 rounded-2xl border-2 border-rose-200 shadow-2xs hover:border-rose-400 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-700">
                  <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${
                  summaryMetrics.urgentDeadlines > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-100 text-rose-900'
                }`}>
                  {summaryMetrics.urgentDeadlines > 0 ? (language === 'ar' ? 'أجل مستعجل' : 'Urgent') : (language === 'ar' ? 'مسار منتظم' : 'OK')}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 block">{t.alertTrialUrgent}</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-700">
                  {summaryMetrics.urgentDeadlines}
                </span>
                <span className="text-xs text-slate-500 font-bold">&lt; 48h</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>{t.colActions}:</span>
                <span className="font-bold text-rose-700">{t.btnDirectCall}</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className={`w-4 h-4 absolute ${direction === 'rtl' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full ${direction === 'rtl' ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500`}
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-slate-500 font-semibold">{t.filterByStatus}</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 font-bold rounded-md transition-colors ${
                    statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.all} ({meetings.length})
                </button>
                <button
                  onClick={() => setStatusFilter('scheduled')}
                  className={`px-3 py-1 font-bold rounded-md transition-colors ${
                    statusFilter === 'scheduled' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.statusScheduled}
                </button>
                <button
                  onClick={() => setStatusFilter('trial')}
                  className={`px-3 py-1 font-bold rounded-md transition-colors ${
                    statusFilter === 'trial' ? 'bg-white text-amber-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  7 {t.days}
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1 font-bold rounded-md transition-colors ${
                    statusFilter === 'completed' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.statusCompleted}
                </button>
              </div>
            </div>
          </div>

          {/* Master Appointments Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{t.subtabAllMeetings}</span>
                  <span className="text-[11px] font-mono text-slate-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                    {filteredMeetings.length}
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">{t.metricAttendedRate}:</span>
                <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                  {weeklyPerformance.attendanceRate}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className={`w-full text-xs whitespace-nowrap ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">{t.colAgencyClient}</th>
                    <th className="p-3.5 text-center bg-blue-100/60 text-blue-950 border-x-2 border-blue-200">
                      <div className="flex items-center justify-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-blue-700" />
                        <span>{t.colCommunication}</span>
                      </div>
                    </th>
                    <th className="p-3.5 text-center">{t.reminderStatus} & {t.confirmationStatus}</th>
                    <th className="p-3.5 text-center">{t.metricAvgTeam}</th>
                    <th className="p-3.5 text-center">{t.metricAvgDailyLeads}</th>
                    <th className="p-3.5 min-w-[200px]">{t.colTeamLeadsProblem}</th>
                    <th className="p-3.5 text-center">{t.colStatusAttendance}</th>
                    <th className="p-3.5">{t.colTrialDates}</th>
                    <th className="p-3.5">{t.days}</th>
                    <th className="p-3.5 text-center">{t.metricActiveTrials}</th>
                    <th className="p-3.5">{t.colPackageChosen}</th>
                    <th className="p-3.5 text-center">{t.colPaymentRetainer}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMeetings.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-slate-400 font-medium">
                        {t.notificationsEmpty}
                      </td>
                    </tr>
                  ) : (
                    filteredMeetings.map((meet) => {
                      const isUpcoming = meet.status === 'scheduled';

                      // Calculate trial countdown & deadline status
                      let deadlineBadge = null;
                      if (meet.trialEndDate) {
                        const diffDays = Math.ceil(
                          (new Date(meet.trialEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        );

                        if (diffDays <= 0) {
                          deadlineBadge = (
                            <span className="font-mono text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                              0 {t.days}
                            </span>
                          );
                        } else if (diffDays <= 2) {
                          deadlineBadge = (
                            <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 animate-pulse">
                              {diffDays} {t.days} ({t.trialUrgentWarning})
                            </span>
                          );
                        } else {
                          deadlineBadge = (
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              {diffDays} {t.days}
                            </span>
                          );
                        }
                      }

                      return (
                        <tr key={meet.id} className="hover:bg-slate-50/90 transition-colors">
                          {/* Agency & Responsible Person */}
                          <td className="p-3.5 font-sans">
                            <span className="font-bold text-slate-900 block text-xs">{meet.agencyName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-600 font-medium">{meet.clientName}</span>
                              <span className="text-[10px] text-slate-400">• {meet.city}</span>
                              <span className="text-[10px] font-mono text-slate-500" dir="ltr">{meet.phone}</span>
                            </div>
                          </td>

                          {/* Action Triggers */}
                          <td className="p-2.5 text-center bg-blue-50/40 border-x-2 border-blue-100">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleTriggerAction(meet, 'call')}
                                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                                title={t.btnDirectCall}
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>{t.call}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleTriggerAction(meet, 'whatsapp')}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                                title={t.btnWhatsAppChat}
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{t.whatsapp}</span>
                              </button>
                            </div>
                          </td>

                          {/* Reminder & Confirmation Badges */}
                          <td className="p-3.5 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                onClick={() => toggleMeetingReminder(meet.id)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border ${
                                  meet.reminderSent
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                              >
                                {meet.reminderSent ? `✓ ${t.reminderSent}` : t.reminderNotSent}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleMeetingConfirmation(meet.id)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border ${
                                  meet.reminderConfirmed
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                {meet.reminderConfirmed ? `✓ ${t.confirmedByClient}` : t.notConfirmedYet}
                              </button>
                            </div>
                          </td>

                          {/* Team Size */}
                          <td className="p-3.5 font-mono text-center">
                            <span className="inline-flex items-center gap-1.5 font-extrabold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span>{meet.teamSize || 5}</span>
                            </span>
                          </td>

                          {/* Daily Lead Volume */}
                          <td className="p-3.5 font-mono text-center">
                            <span className="inline-flex items-center gap-1 font-extrabold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                              <Activity className="w-3 h-3 text-slate-600" />
                              <span>{meet.dailyInquiries || 25} / {t.days}</span>
                            </span>
                          </td>

                          {/* Broker Pain Point */}
                          <td className="p-3.5 text-slate-700 max-w-xs whitespace-normal text-[11px] leading-relaxed">
                            <div className="flex items-start gap-1">
                              <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                              <span>
                                {meet.mainProblem ||
                                  (language === 'ar'
                                    ? 'تأخر الرد على استفسارات العقارات في المساء وضياع الزبائن'
                                    : language === 'fr'
                                    ? 'Retard de réponse'
                                    : 'Slow lead response')}
                              </span>
                            </div>
                          </td>

                          {/* Status / Attended */}
                          <td className="p-3.5 text-center">
                            {isUpcoming ? (
                              <button
                                onClick={() => {
                                  updateMeetingStatus(meet.id, 'completed', 'accepted_trial');
                                  updateMeeting(meet.id, {
                                    trialStartDate: new Date().toISOString().slice(0, 10),
                                    trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                                    trialResult: 'accepted',
                                    convertedToDeal: true,
                                  });
                                }}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{t.btnStartTrial}</span>
                              </button>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                meet.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{meet.status === 'completed' ? t.attended : t.notAttended}</span>
                              </span>
                            )}
                          </td>

                          {/* Trial Start Date */}
                          <td className="p-3.5 font-mono text-slate-700 text-[11px]">
                            {meet.trialStartDate || '-'}
                          </td>

                          {/* Trial Deadlines */}
                          <td className="p-3.5">
                            <div className="space-y-1">
                              <span className="font-mono text-[11px] font-bold text-slate-900 block">
                                {meet.trialEndDate || '-'}
                              </span>
                              {deadlineBadge}
                            </div>
                          </td>

                          {/* Trial Result */}
                          <td className="p-3.5 text-center">
                            <select
                              value={meet.trialResult || 'pending'}
                              onChange={(e) => {
                                const val = e.target.value as 'accepted' | 'rejected' | 'pending';
                                updateMeeting(meet.id, {
                                  trialResult: val,
                                  convertedToDeal: val === 'accepted',
                                });
                              }}
                              className={`font-bold text-[11px] rounded-lg px-2.5 py-1 border cursor-pointer font-sans transition-colors ${
                                meet.trialResult === 'accepted'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : meet.trialResult === 'rejected'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="accepted">✓ {t.completed}</option>
                              <option value="pending">⏳ {t.pending}</option>
                              <option value="rejected">✕ {t.overdue}</option>
                            </select>
                          </td>

                          {/* Selected Package */}
                          <td className="p-3.5">
                            <select
                              value={meet.packageSelected || meet.packageInterest}
                              onChange={(e) => {
                                updateMeeting(meet.id, { packageSelected: e.target.value as PackageTier });
                              }}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-[11px] text-slate-900 font-sans cursor-pointer"
                            >
                              <option value="starter">{t.starterPackage} (1,200 {t.perMonth})</option>
                              <option value="growth">{t.growthPackage} (2,500 {t.perMonth})</option>
                              <option value="enterprise">{t.enterprisePackage} (4,500 {t.perMonth})</option>
                            </select>
                          </td>

                          {/* Setup Payment Status */}
                          <td className="p-3.5 text-center">
                            <select
                              value={meet.setupPaymentStatus || 'pending'}
                              onChange={(e) => {
                                updateMeeting(meet.id, {
                                  setupPaymentStatus: e.target.value as 'paid' | 'pending' | 'overdue',
                                });
                              }}
                              className={`font-bold text-[10px] rounded-lg px-2.5 py-1 border cursor-pointer font-sans ${
                                meet.setupPaymentStatus === 'paid'
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                  : 'bg-amber-100 text-amber-950 border-amber-300'
                              }`}
                            >
                              <option value="paid">✓ {t.paid}</option>
                              <option value="pending">⏳ {t.pending}</option>
                              <option value="overdue">⚠️ {t.overdue}</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 5: WORKING HOURS & LANDING PAGE BOOKING SETTINGS    */}
      {/* ======================================================== */}
      {activeSubTab === 'booking_hours' && (
        <div className="animate-fade-in">
          <BookingSettingsTab compact />
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD MEETING                                     */}
      {/* ======================================================== */}
      {showAddMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-3 overflow-y-auto">
          <div className={`bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" />
                <span>{t.btnAddMeeting}</span>
              </h3>
              <button
                onClick={() => setShowAddMeetingModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-4 sm:p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.colAgencyClient} *</label>
                <select
                  required
                  value={selectedClientForMeeting}
                  onChange={(e) => setSelectedClientForMeeting(e.target.value)}
                  className="w-full px-3 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.agencyName} ({c.contactPerson} - {c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.colDateTime} *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{language === 'ar' ? 'التوقيت *' : language === 'fr' ? 'Heure *' : 'Time *'}</label>
                  <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-orange-500 rounded-xl px-3 min-h-[44px]">
                    <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                    <select
                      required
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      dir="ltr"
                      className="w-full bg-transparent font-mono tabular-nums font-extrabold text-sm text-slate-900 focus:outline-none px-2 py-2 cursor-pointer"
                    >
                      {timeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.metricAvgTeam}</label>
                  <input
                    type="number"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.metricAvgDailyLeads}</label>
                  <input
                    type="number"
                    min={1}
                    value={dailyInquiries}
                    onChange={(e) => setDailyInquiries(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.colTeamLeadsProblem}</label>
                <input
                  type="text"
                  value={mainProblem}
                  onChange={(e) => setMainProblem(e.target.value)}
                  placeholder={language === 'ar' ? 'المشكل الذي تعاني منه الوكالة...' : 'Description du problème...'}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.colPackageChosen}</label>
                <select
                  value={packageInterest}
                  onChange={(e) => setPackageInterest(e.target.value as PackageTier)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                >
                  <option value="growth">{t.growthPackage} (8,500 {t.mad} + 2,500 {t.perMonth})</option>
                  <option value="enterprise">{t.enterprisePackage} (16,000 {t.mad} + 4,500 {t.perMonth})</option>
                  <option value="starter">{t.starterPackage} (4,000 {t.mad} + 1,200 {t.perMonth})</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.overviewSub}</label>
                <textarea
                  rows={2}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMeetingModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold cursor-pointer transition-colors"
                >
                  {t.btnAddMeeting}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD AGENCY TASK                                 */}
      {/* ======================================================== */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-3 overflow-y-auto">
          <div className={`bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-emerald-400" />
                <span>{t.btnAddTask}</span>
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.taskTitleLabel} *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: إرسال تذكير الموعد عبر واتساب قبل ساعتين...' : 'Ex: Rappel de rendez-vous WhatsApp...'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'ar' ? 'الوكالة المعنية (اختياري)' : language === 'fr' ? 'Agence concernée (optionnel)' : 'Related Agency (optional)'}</label>
                <input
                  type="text"
                  value={taskRelatedAgency}
                  onChange={(e) => setTaskRelatedAgency(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: أكادير باي إنفست، أطلس العقارية...' : 'Nom de l’agence...'}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.taskCategoryLabel}</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value as AgencyTask['category'])}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="reminder">{language === 'ar' ? 'تذكير بموعد' : language === 'fr' ? 'Rappel de RDV' : 'Reminder'}</option>
                    <option value="meeting">{language === 'ar' ? 'موعد ومتابعة' : language === 'fr' ? 'Rendez-vous & Suivi' : 'Meeting'}</option>
                    <option value="build">{language === 'ar' ? 'برمجة وتسليم' : language === 'fr' ? 'Livraison' : 'Build & Delivery'}</option>
                    <option value="payment">{language === 'ar' ? 'فوترة وصيانة' : language === 'fr' ? 'Facturation' : 'Payment & Retainer'}</option>
                    <option value="general">{language === 'ar' ? 'عام' : language === 'fr' ? 'Général' : 'General'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.taskPriorityLabel}</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="high">{language === 'ar' ? 'أولوية قصوى' : language === 'fr' ? 'Haute' : 'High'}</option>
                    <option value="medium">{language === 'ar' ? 'أولوية متوسطة' : language === 'fr' ? 'Moyenne' : 'Medium'}</option>
                    <option value="low">{language === 'ar' ? 'أولوية عادية' : language === 'fr' ? 'Basse' : 'Low'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.taskDueDateLabel} *</label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{language === 'ar' ? 'تفاصيل إضافية' : 'Détails'}</label>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder={language === 'ar' ? 'ملاحظات لتنفيذ المهمة...' : 'Notes...'}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer transition-colors"
                >
                  {t.btnAddTask}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
