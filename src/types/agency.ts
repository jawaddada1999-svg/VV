export type PackageTier = 'starter' | 'growth' | 'enterprise';

export type ClientStage =
  | 'ad_lead'                 // ليد جديد قادم من الإعلانات
  | 'meeting_scheduled'        // تم حجز موعد مكالمة استشارية
  | 'meeting_completed'        // تمت المكالمة وبانتظار الموافقة
  | 'trial_7_days'             // مرحلة التجربة المجانية 7 أيام
  | 'deal_won'                 // تم قبول العقد وبدء دفع الإعداد
  | 'delivery_in_progress'     // مشروع الأوتوميشن قيد البرمجة والتسليم
  | 'active_retainer'          // تم التسليم واشتراك الصيانة الشهري نشط
  | 'paused'                   // متوقف مؤقتاً
  | 'lost';                    // لم يتم الاتفاق

export type AutomationWorkflowType =
  | 'whatsapp_instant_lead'    // رد واتساب فوري خلال 60 ثانية
  | 'google_calendar_sync'     // مزامنة تقويم المعاينات العقارية
  | 'lead_qualification_bot'   // بوت واتساب ذكي لتأهيل المشترين
  | 'crm_pipeline_sync'        // مزامنة مراحل الصفقات مع الـ CRM
  | 'meta_instant_forms';      // ربط إعلانات نماذج ميتا الفورية

export interface PackageConfig {
  id: PackageTier;
  name: string;
  nameAr: string;
  setupFee: number;            // ثمن الإعداد والأوتوميشن (MAD)
  monthlyRetainer: number;     // ثمن الصيانة الشهري (MAD)
  tagline: string;
  features: string[];
}

export interface AgencyClient {
  id: string;
  agencyName: string;          // اسم الوكالة العقارية (مثال: أطلس العقارية)
  contactPerson: string;       // اسم المدير / المالك
  city: string;                // المدينة (كازا، مراكش، طنجة...)
  phone: string;               // الهاتف / واتساب
  email: string;
  packageTier: PackageTier;
  setupFee: number;            // ثمن بناء الأوتوميشن
  monthlyRetainer: number;     // ثمن الصيانة الشهري
  stage: ClientStage;
  adSource: string;            // الحملة التي جاء منها (Meta, Google...)
  createdAt: string;

  // تفاصيل حجم العمل والمشكلة
  agencyManager?: string;      // الشخص المسؤول عن الوكالة لدى العميل
  teamSize?: number;           // عدد أفراد الوكالة
  dailyInquiries?: number;     // عدد الطلبات يومياً
  mainProblem?: string;        // المشكل الذي يعاني منه

  // مرحلة التجربة 7 أيام
  trialStartDate?: string;     // تاريخ استلام وبداية التجربة المجانية
  trialEndDate?: string;       // تاريخ آخر يوم في تجربة 7 أيام
  trialAccepted?: boolean;     // وافق أولا لا
  rejectionReason?: string;    // سبب الرفض في حالة عدم الاتفاق

  // مرحلة تسليم الأوتوميشن
  deliveryProgressPct?: number;// نسبة إنجاز الأوتوميشن (0 - 100%)
  targetDeliveryDate?: string; // موعد التسليم المتفق عليه
  workflowsEnabled?: AutomationWorkflowType[];

  // مرحلة التعاقد والفوترة
  contractDate?: string;       // تاريخ استلام العقد
  setupPaymentStatus?: 'paid' | 'pending' | 'overdue'; // حالة الدفع
  maintenanceStartDate?: string;
  nextBillingDate?: string;    // التاريخ اللي غايبقا اخلص فيه كل شهر
  maintenanceStatus?: 'up_to_date' | 'payment_due' | 'support_needed';
  isReferralPartner?: boolean; // واش الوكالة شريكة كاتجيب لينا زبناء آخرين (Parrainage)

  notes: string;
  noteHistory?: ClientNoteEntry[];
  expenses?: ClientExpenseItem[];
}

export type ExpenseCategory =
  | 'whatsapp_api'
  | 'automation_platform'
  | 'ai_tokens'
  | 'hosting_domain'
  | 'crm_calendar'
  | 'other';

export interface ClientExpenseItem {
  id: string;
  name: string;
  provider?: string;
  category: ExpenseCategory;
  monthlyCost: number;
  billingCycle: 'monthly' | 'yearly';
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export type NoteType = 'meeting_summary' | 'follow_up' | 'call' | 'whatsapp' | 'contract' | 'general';

export interface ClientNoteEntry {
  id: string;
  clientId: string;
  createdAt: string;
  author: string;
  type: NoteType;
  title: string;
  content: string;
  followUpDate?: string;
  outcome?: string;
  isPinned?: boolean;
}

export interface MeetingItem {
  id: string;
  clientId: string;
  clientName: string;
  agencyName: string;
  phone: string;
  city: string;
  scheduledTime: string;       // توقيت المكالمة
  status: 'scheduled' | 'completed' | 'no_show' | 'rescheduled';
  meetingOutcome?: 'accepted_trial' | 'follow_up' | 'rejected';
  meetingNotes?: string;
  packageInterest: PackageTier;

  // الحقول الجديدة التفصيلية
  teamSize: number;            // عدد أفراد الوكالة
  dailyInquiries: number;      // عدد الطلبات يومياً
  mainProblem: string;         // المشكل الذي يعاني منه (ضياع الليدات، تأخر الرد...)
  trialStartDate?: string;     // تاريخ استلام التجربة
  trialEndDate?: string;       // آخر يوم في تجربة 7 أيام
  trialResult?: 'accepted' | 'rejected' | 'pending'; // النتيجة: وافق أو لا
  packageSelected?: PackageTier; // الباقة التي اختار
  contractDate?: string;       // تاريخ استلام العقد
  setupPaymentStatus: 'paid' | 'pending' | 'overdue'; // حالة الدفع (واش خلص)
  recurringBillingDate?: string; // التاريخ اللي غايبقا اخلص فيه

  // ميزات الأجندة الجديدة وتأكيد المواعيد والتحويل
  reminderSent?: boolean;      // واش تصيفط ليه تذكير (Reminder Sent)
  reminderConfirmed?: boolean; // واش أكد الموعد (Confirmed by Client)
  convertedToDeal?: boolean;   // واش تحول لصفقة / تجربة (Converted)
}

export interface AgencyTask {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  relatedAgencyName?: string;
  category: 'meeting' | 'reminder' | 'build' | 'payment' | 'general';
  createdAt: string;
}

export interface AdCampaignMetric {
  id: string;
  campaignName: string;
  platform: 'meta' | 'google' | 'linkedin' | 'referral';
  spend: number;               // الميزانية المصروفة (MAD)
  revenueGenerated?: number;   // إجمالي الإيرادات المحققة من الحملة (MAD)
  impressions: number;
  clicks: number;
  landingPageVisitors: number; // عدد زوار صفحة الهبوط
  videoStartedCount: number;   // شحال من واحد بدا الفيديو
  videoCompletedCount: number; // شحال من واحد تفرج فالفيديو تالخر
  leadsGenerated: number;
  meetingsBooked: number;
  meetingsShowedUp: number;    // شحال من واحد حضر الموعد
  meetingsNoShow: number;      // شحال من واحد ماحضرش
  dealsClosed: number;
  startDate: string;
  status: 'active' | 'paused';
}

export interface MaintenanceInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  agencyName: string;
  amount: number;
  type: 'setup_fee' | 'monthly_retainer';
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
}

export interface MaintenanceTicket {
  id: string;
  clientId: string;
  agencyName: string;
  title: string;
  description: string;
  priority: 'urgent' | 'normal' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
}

export interface AgencyMetricsSummary {
  totalRevenueCash: number;     // إجمالي المداخيل المحصلة (إعداد + صيانة)
  currentMRR: number;           // المداخيل الشهرية المتكررة من الصيانة
  activeRetainerClients: number;// عملاء الصيانة النشطين
  trialsInProgress: number;     // عملاء في فترة الـ 7 أيام تجربة
  buildProjectsActive: number;  // مشاريع أوتوميشن قيد التسليم
  meetingsBookedThisMonth: number;
  totalAdSpendThisMonth: number;
  averageCAC: number;           // تكلفة اكتساب العميل
  totalMonthlyClientExpenses: number; // إجمالي مصاريف واشتراكات العملاء النشطين
  netRetainerProfit: number;          // صافي الربح الشهري المتبقي من الصيانة
}

export type DayOfWeekKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface DayScheduleConfig {
  day: DayOfWeekKey;
  enabled: boolean;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  hasBreak: boolean;
  breakStart: string; // HH:mm
  breakEnd: string;   // HH:mm
}

export interface BlockedDateItem {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface BookingAvailabilitySettings {
  isBookingOpen: boolean;
  timezone: string;
  slotDurationMinutes: 15 | 30 | 45 | 60;
  bufferMinutes: 0 | 10 | 15 | 30;
  minNoticeHours: 1 | 2 | 4 | 12 | 24;
  maxAdvanceDays: 7 | 14 | 21 | 30 | 60;
  maxBookingsPerDay: number;
  schedule: Record<DayOfWeekKey, DayScheduleConfig>;
  blockedDates: BlockedDateItem[];
}

