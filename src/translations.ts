export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandTagline: string;
  addClientBtn: string;
  searchPlaceholder: string;
  notificationsTitle: string;
  urgentTrialsAlert: string;
  viewDeal: string;
  languageSelect: string;
  notificationsEmpty: string;
  alertsCount: string;

  // Sidebar Groups & Items
  navLeadershipGroup: string;
  navExecutionGroup: string;
  navOverview: string;
  navPipeline: string;
  navMeetings: string;
  navAds: string;
  navDelivery: string;
  navRetainers: string;
  navClients: string;
  navPackages: string;
  navBookingSettings: string;
  sidebarBadge: string;

  // Common Units & Statuses
  mad: string;
  perMonth: string;
  days: string;
  leads: string;
  leadsCountSuffix: string;
  meetingsUnit: string;
  clientsUnit: string;
  projectsUnit: string;
  active: string;
  pending: string;
  completed: string;
  paid: string;
  overdue: string;
  all: string;
  call: string;
  whatsapp: string;
  statusScheduled: string;
  statusCompleted: string;
  statusNoShow: string;
  statusTrial: string;
  filterByTier: string;
  filterByCity: string;
  filterByStatus: string;
  allTiers: string;
  dragDropHere: string;
  changeStageBtn: string;
  selectTargetStage: string;
  rejectionReasonLabel: string;

  // Overview Tab
  overviewTitle: string;
  overviewSub: string;
  kpiRetainerMRR: string;
  kpiRetainerMRRSub: string;
  kpiSetupCash: string;
  kpiSetupCashSub: string;
  kpiAttendanceRate: string;
  kpiAttendanceRateSub: string;
  kpiActiveTrials: string;
  kpiActiveTrialsSub: string;
  alertMeetingIn30: string;
  alertUnpaidInvoice: string;
  alertTrialUrgent: string;
  btnNewContract: string;
  chartRevenueTitle: string;
  chartRevenueSub: string;
  btnWeeklyView: string;
  btnMonthlyView: string;
  dealsFunnelTitle: string;
  dealsFunnelSub: string;

  // Pipeline Tab
  pipelineHeaderTag: string;
  pipelineHeaderTitle: string;
  pipelineHeaderDesc: string;
  colAdLeadsTitle: string;
  colAdLeadsSub: string;
  colAttendedTitle: string;
  colAttendedSub: string;
  colNoShowTitle: string;
  colNoShowSub: string;
  colFollowUpTitle: string;
  colFollowUpSub: string;
  kpiDealCloseRate: string;
  kpiAppointmentAttendance: string;
  kpiTotalBookedMeetings: string;
  kpiCompletedMeetings: string;
  kpiNoShowMeetings: string;
  colRole: string;
  colTeamSize: string;
  colDailyInquiries: string;
  colMeetingsTitle: string;
  colMeetingsSub: string;
  colTrialTitle: string;
  colTrialSub: string;
  colDeliveryTitle: string;
  colDeliverySub: string;
  colRetainerTitle: string;
  colRetainerSub: string;
  colLostTitle: string;
  colLostSub: string;
  trialExpiresIn: string;
  trialUrgentWarning: string;
  btnStartTrial: string;
  btnAcceptTrial: string;

  // Meetings Tab
  meetingsHeaderTag: string;
  meetingsHeaderTitle: string;
  meetingsHeaderDesc: string;
  btnAddMeeting: string;
  metricAvgTeam: string;
  metricAvgDailyLeads: string;
  metricActiveTrials: string;
  metricAttendedRate: string;
  colAgencyClient: string;
  colDateTime: string;
  colCommunication: string;
  colTeamLeadsProblem: string;
  colStatusAttendance: string;
  colTrialDates: string;
  colPaymentRetainer: string;
  colActions: string;
  btnDirectCall: string;
  btnWhatsAppChat: string;
  attended: string;
  notAttended: string;

  // Agenda, Performance & Tasks Views
  subtabAgenda: string;
  subtabPerformance: string;
  subtabTasks: string;
  subtabAllMeetings: string;
  subtabBookingHours: string;
  agendaTodayTitle: string;
  agendaTodaySub: string;
  reminderStatus: string;
  reminderSent: string;
  reminderNotSent: string;
  confirmationStatus: string;
  confirmedByClient: string;
  notConfirmedYet: string;
  convertedStatus: string;
  convertedToDeal: string;
  notConverted: string;
  dailyPerformanceTitle: string;
  dailyConductedMeetings: string;
  dailyConvertedDeals: string;
  dailyConversionRate: string;
  weeklyPerformanceTitle: string;
  weeklyTotalMeetings: string;
  weeklyConductedMeetings: string;
  weeklyConvertedDeals: string;
  weeklyConversionRate: string;
  tasksSectionTitle: string;
  tasksSectionSub: string;
  btnAddTask: string;
  taskTitleLabel: string;
  taskPriorityLabel: string;
  taskDueDateLabel: string;
  taskCategoryLabel: string;
  taskFilterAll: string;
  taskFilterPending: string;
  taskFilterCompleted: string;

  // Dates & Daily Chart
  today: string;
  yesterday: string;
  tomorrow: string;
  dailyChartTitle: string;
  dailyChartSub: string;
  chartLegendScheduled: string;
  chartLegendConducted: string;
  chartLegendConverted: string;
  chartLegendConversionRate: string;
  hourlyBreakdownTitle: string;
  starterPackage: string;
  growthPackage: string;
  enterprisePackage: string;

  // Ads Tab
  adsHeaderTag: string;
  adsHeaderTitle: string;
  adsHeaderDesc: string;
  kpiTotalAdSpend: string;
  kpiLandingVisitors: string;
  kpiVideoWatch: string;
  kpiAttendanceRateAds: string;
  funnelSectionTitle: string;
  funnelSectionSub: string;
  stepImpressions: string;
  stepClicks: string;
  stepLanding: string;
  stepLeads: string;
  stepAttended: string;
  stepClosed: string;

  // Delivery Tab specific
  deliveryHeaderTag: string;
  deliveryHeaderTitle: string;
  deliveryHeaderDesc: string;
  cardInBuildTitle: string;
  cardInBuildSub: string;
  cardDeliveredTitle: string;
  cardDeliveredSub: string;
  cardTrialTitle: string;
  cardTrialSub: string;
  cardRetainersTitle: string;
  cardRetainersSub: string;
  deliveryTableTitle: string;
  deliveryTableSub: string;
  colClientAgency: string;
  colPackageChosen: string;
  colStartDate: string;
  colTimeRemaining: string;
  colProgressPct: string;
  colActionDelivery: string;
  btnCompleteDelivery: string;
  activeRetainersTableTitle: string;
  activeRetainersTableSub: string;
  colCity: string;
  colSetupFeeCollected: string;
  colMonthlyRetainer: string;
  colNextRenewal: string;
  colSystemStatus: string;
  statusRunningLive: string;

  // Retainers Tab
  retainersHeaderTag: string;
  retainersHeaderTitle: string;
  retainersHeaderDesc: string;
  ribBoxTitle: string;
  btnCopyRib: string;
  btnCopiedRib: string;
  btnSendWhatsAppInvoice: string;
  subtabClients: string;
  subtabExpenses: string;
  subtabInvoices: string;
  subtabTickets: string;

  // Clients Directory Tab
  clientsHeaderTag: string;
  clientsHeaderTitle: string;
  clientsHeaderDesc: string;
  btnExportCsv: string;
  badgeReferralPartner: string;
  badgeStandardClient: string;
  colContact: string;
  colStage: string;
  colTier: string;
  colRevenue: string;

  // Packages Tab
  packagesHeaderTag: string;
  packagesHeaderTitle: string;
  packagesHeaderDesc: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    brandTitle: 'IBONDA أوتوميشن',
    brandTagline: 'لوحة التحكم المركزية للأوتوميشن والصيانة الشهرية',
    addClientBtn: '+ إضافة عميل جديد',
    searchPlaceholder: 'بحث بوكالة، مدينة، هاتف...',
    notificationsTitle: 'تنبيهات التجربة والمواعيد',
    urgentTrialsAlert: 'تنبيه تجربة 7 أيام',
    viewDeal: 'فحص ومتابعة الصفقة ←',
    languageSelect: 'اختيار لغة لوحة التحكم',
    notificationsEmpty: 'لا توجد تنبيهات حالياً',
    alertsCount: 'تنبيهات',

    navLeadershipGroup: 'القيادة والمسار التجاري',
    navExecutionGroup: 'التنفيذ وعقود الصيانة',
    navOverview: 'نظرة عامة والمؤشرات القيادية',
    navPipeline: 'مسار الصفقات',
    navMeetings: 'المواعيد ومكالمات الاستشارة',
    navAds: 'حملات الإعلانات والتسويق',
    navDelivery: 'مشاريع تسليم الأوتوميشن',
    navRetainers: 'عقود واشتراكات الصيانة',
    navClients: 'دليل الوكالات والعملاء',
    navPackages: 'هيكلة وتسعير الباقات الثلاث',
    navBookingSettings: 'أوقات العمل ونظام الحجز',
    sidebarBadge: 'لوحة التحكم',

    mad: 'درهم مغربي',
    perMonth: 'درهم/شهر',
    days: 'أيام',
    leads: 'عميل محتمل',
    leadsCountSuffix: 'عميل محتمل',
    meetingsUnit: 'موعد',
    clientsUnit: 'وكالات',
    projectsUnit: 'مشاريع',
    active: 'نشط',
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    paid: 'تم الدفع',
    overdue: 'متأخر',
    all: 'الكل',
    call: 'مكالمة هاتفية',
    whatsapp: 'دردشة واتساب',
    statusScheduled: 'مجدول',
    statusCompleted: 'حضر وتمت المقابلة',
    statusNoShow: 'لم يحضر (غائب)',
    statusTrial: 'بدأت التجربة',
    filterByTier: 'تصفية حسب الباقة:',
    filterByCity: 'تصفية حسب المدينة:',
    filterByStatus: 'تصفية حسب الحالة:',
    allTiers: 'كافة الباقات المعتمدة',
    dragDropHere: 'اسحب وأفلت صفقة هنا',
    changeStageBtn: 'تحويل المرحلة ▾',
    selectTargetStage: 'اختر المرحلة المستهدفة:',
    rejectionReasonLabel: 'سبب الرفض / عدم الاتفاق:',

    overviewTitle: 'نظرة عامة والمؤشرات القيادية للوكالة',
    overviewSub: 'متابعة مباشرة للإيرادات الشهرية المتكررة، مبالغ الإعداد، ونسب حضور المواعيد والصفقات',
    kpiRetainerMRR: 'اشتراكات الصيانة الشهرية المتكررة',
    kpiRetainerMRRSub: 'مداخيل شهرية مضمونة ومستمرة',
    kpiSetupCash: 'كاش رسوم الإعداد المحصلة',
    kpiSetupCashSub: 'إجمالي مدفوعات ربط وبرمجة الأنظمة',
    kpiAttendanceRate: 'نسبة حضور المواعيد والمكالمات',
    kpiAttendanceRateSub: 'مكالمات استشارية مكتملة بنجاح',
    kpiActiveTrials: 'تجارب 7 أيام جارية حالياً',
    kpiActiveTrialsSub: 'وكالات تختبر سيناريوهات الأوتوميشن',
    alertMeetingIn30: 'موعد استشارة سيبدأ خلال 30 دقيقة',
    alertUnpaidInvoice: 'فاتورة صيانة غير مدفوعة تحتاج تذكيراً',
    alertTrialUrgent: 'تجربة 7 أيام تقترب من الانتهاء (أقل من 48 ساعة)',
    btnNewContract: '+ إضافة عقد جديد',
    chartRevenueTitle: 'تطور الإيرادات المتكررة وكاش الإعداد',
    chartRevenueSub: 'مقارنة بين كاش الإعداد ورسوم الصيانة الشهرية المتراكمة',
    btnWeeklyView: 'عرض أسبوعي',
    btnMonthlyView: 'عرض شهري',
    dealsFunnelTitle: 'مسار تحويل الصفقات ومراحل الوكالات',
    dealsFunnelSub: 'توزيع الوكالات من استفسار الإعلان حتى عقد الصيانة الشهري',

    pipelineHeaderTag: 'مسار الصفقات والتجربة المجانية',
    pipelineHeaderTitle: 'لوحة الصفقات التفاعلية: تحويل الوكالات بالسحب أو تعديل الحالة',
    pipelineHeaderDesc: 'سحب وإفلات بطاقات الصفقات بين المراحل، مع تتبع أسباب الرفض وعدد العملاء المحتملين في كل مرحلة',
    colAdLeadsTitle: '1. عميل جديد',
    colAdLeadsSub: 'استمارات فيسبوك وجوجل الواردة',
    colMeetingsTitle: '2. تمت جدولة الموعد',
    colMeetingsSub: 'مكالمات ديمو ومقابلة صاحب الوكالة',
    colAttendedTitle: '3. حضر الموعد',
    colAttendedSub: 'تم إجراء الاجتماع أو المكالمة',
    colNoShowTitle: '4. غاب عن الموعد',
    colNoShowSub: 'مواعيد لم يحضرها العميل',
    colFollowUpTitle: '7. قيد التفاوض والمتابعة',
    colFollowUpSub: 'متابعة العرض واستكمال التفاوض',
    kpiDealCloseRate: 'معدل إغلاق الصفقات',
    kpiAppointmentAttendance: 'نسبة حضور المواعيد',
    kpiTotalBookedMeetings: 'إجمالي المواعيد المحجوزة',
    kpiCompletedMeetings: 'المواعيد المكتملة',
    kpiNoShowMeetings: 'حالات عدم الحضور',
    colRole: 'الدور داخل الوكالة',
    colTeamSize: 'حجم الفريق',
    colDailyInquiries: 'الطلبات اليومية',
    colTrialTitle: '3. تجربة 7 أيام مجانية',
    colTrialSub: 'اختبار حي للأوتوميشن وسرعة الرد',
    colDeliveryTitle: '4. مشاريع قيد التسليم',
    colDeliverySub: 'برمجة وربط وتخصيص الأنظمة',
    colRetainerTitle: '8. صفقة ناجحة',
    colRetainerSub: 'تم الاتفاق وإغلاق الصفقة بنجاح',
    colLostTitle: '9. صفقة غير مكتملة',
    colLostSub: 'دراسة أسباب الرفض لإعادة الاستهداف',
    trialExpiresIn: 'متبقي في التجربة',
    trialUrgentWarning: 'تنتهي اليوم أو غداً!',
    btnStartTrial: '⚡ بدء تجربة 7 أيام فوراً',
    btnAcceptTrial: '✓ وافق على الباقة واستلام الإعداد',

    meetingsHeaderTag: 'المرحلة 2: أجندة المواعيد ومكالمات الاستشارة العقارية',
    meetingsHeaderTitle: 'جدول مواعيد الديمو والاستشارة وأتمتة الاتصال',
    meetingsHeaderDesc: 'سجل تفاصيل الوكالة، حجم الفريق، الاستفسارات اليومية، وتتبع تجربة الـ 7 أيام مع إطلاق المكالمات ودردشة واتساب بنقرة واحدة.',
    btnAddMeeting: '+ حجز موعد جديد',
    metricAvgTeam: 'متوسط أفراد الوكالة',
    metricAvgDailyLeads: 'متوسط الطلبات/يوم',
    metricActiveTrials: 'تجارب 7 أيام جارية',
    metricAttendedRate: 'نسبة الحضور',
    colAgencyClient: 'الوكالة العقارية والمسؤول',
    colDateTime: 'تاريخ ووقت الموعد',
    colCommunication: 'الإتصال والمراسلة التلقائية',
    colTeamLeadsProblem: 'الفريق والطلبات / المشكل الحالي',
    colStatusAttendance: 'حالة الموعد والنتيجة',
    colTrialDates: 'تجربة 7 أيام (البدء والانتهاء)',
    colPaymentRetainer: 'الباقة وحالة الدفع والتجديد',
    colActions: 'الإجراءات',
    btnDirectCall: 'مكالمة هاتفية',
    btnWhatsAppChat: 'دردشة واتساب',
    attended: 'حضر الموعد',
    notAttended: 'لم يحضر',

    // الأجندة والأداء والمهام
    subtabAgenda: 'الأجندة ومواعيد اليوم',
    subtabPerformance: 'مؤشرات الأداء والتحويل اليومي والأسبوعي',
    subtabTasks: 'قائمة المهام اليومية',
    subtabAllMeetings: 'سجل المواعيد الشامل',
    subtabBookingHours: 'أوقات العمل والحجز',
    agendaTodayTitle: 'أجندة مواعيد اليوم وتأكيد الحضور',
    agendaTodaySub: 'تتبع المواعيد المجدولة لليوم، فحص إرسال التذكيرات وتأكيد العملاء، وإطلاق المحادثات بنقرة واحدة.',
    reminderStatus: 'حالة إرسال التذكير',
    reminderSent: 'تم إرسال التذكير',
    reminderNotSent: 'لم يُرسل بعد',
    confirmationStatus: 'تأكيد العميل للحضور',
    confirmedByClient: 'أكد الحضور',
    notConfirmedYet: 'في انتظار التأكيد',
    convertedStatus: 'حالة التحويل لصفقة',
    convertedToDeal: 'تم التحويل (صفقة/تجربة)',
    notConverted: 'لم يُحول بعد',
    dailyPerformanceTitle: 'الأداء اليومي للمواعيد (اليوم)',
    dailyConductedMeetings: 'مواعيد تم إجراؤها اليوم',
    dailyConvertedDeals: 'تم تحويلها لصفقة / تجربة',
    dailyConversionRate: 'معدل التحويل اليومي',
    weeklyPerformanceTitle: 'الأداء الأسبوعي للمواعيد (هذا الأسبوع)',
    weeklyTotalMeetings: 'إجمالي مواعيد الأسبوع',
    weeklyConductedMeetings: 'مواعيد تم إجراؤها هذا الأسبوع',
    weeklyConvertedDeals: 'صفقات وتجارب تم إغلاقها',
    weeklyConversionRate: 'معدل التحويل الأسبوعي',
    tasksSectionTitle: 'قائمة مهام العمليات والمتابعة اليومية',
    tasksSectionSub: 'متابعة اتصالات التذكير، عقود تجربة 7 أيام، وتجهيز سيناريوهات الأوتوميشن بنظام إنجاز المهام اليومية.',
    btnAddTask: '+ إضافة مهمة جديدة',
    taskTitleLabel: 'عنوان المهمة',
    taskPriorityLabel: 'درجة الأولوية',
    taskDueDateLabel: 'تاريخ الإنجاز',
    taskCategoryLabel: 'فئة المهمة',
    taskFilterAll: 'جميع المهام',
    taskFilterPending: 'المهام قيد الانتظار',
    taskFilterCompleted: 'المهام المكتملة',

    // التواريخ ومخطط الأداء اليومي
    today: 'اليوم',
    yesterday: 'الأمس',
    tomorrow: 'غداً',
    dailyChartTitle: 'مخطط أداء المواعيد والتحويل اليومي',
    dailyChartSub: 'مقارنة بيانية لعدد المواعيد المحجوزة، المنعقدة، والصفقات المحولة على مدار الأيام',
    chartLegendScheduled: 'مواعيد مجدولة',
    chartLegendConducted: 'مواعيد منعقدة',
    chartLegendConverted: 'صفقات محولة',
    chartLegendConversionRate: 'معدل التحويل (%)',
    hourlyBreakdownTitle: 'توزيع مواعيد اليوم حسب التوقيت الزمني',
    starterPackage: 'الباقة الأساسية',
    growthPackage: 'باقة النمو والتوسع',
    enterprisePackage: 'باقة النخبة الشاملة',

    adsHeaderTag: 'حملات الإعلانات والتسويق وتحليل مسار التحويل',
    adsHeaderTitle: 'أداء الإعلانات ومسار التحويل والتسرب',
    adsHeaderDesc: 'تحليل دقيق لزوار صفحة الهبوط، نسب مشاهدة الفيديو، ومعدلات التسرب في كل مرحلة من الظهور إلى حضور الموعد.',
    kpiTotalAdSpend: 'إجمالي الميزانية الإعلانية',
    kpiLandingVisitors: 'زوار صفحة الهبوط',
    kpiVideoWatch: 'مشاهدات الفيديو الترويجي كاملاً',
    kpiAttendanceRateAds: 'نسبة حضور المواعيد المحجوزة',
    funnelSectionTitle: 'مخطط معدلات التسرب والتحويل في مسار المبيعات',
    funnelSectionSub: 'نسبة التحويل ونسبة التسرب بين كل مرحلة وأخرى في المسار الإعلاني',
    stepImpressions: 'الظهور الإعلاني',
    stepClicks: 'النقرات نحو الصفحة',
    stepLanding: 'زوار صفحة الهبوط',
    stepLeads: 'استمارات واستفسارات العملاء',
    stepAttended: 'حضور موعد الاستشارة',
    stepClosed: 'إغلاق الصفقة وتفعيل الصيانة الشهرية',

    deliveryHeaderTag: 'مشاريع تسليم أنظمة الأتمتة',
    deliveryHeaderTitle: 'تسليم المشاريع ومتابعة تقدمها',
    deliveryHeaderDesc: 'تحديد وتحديث نسبة تقدم المشروع بسهولة (اختيار النسبة المئوية %)، متابعة الوقت المتبقي للتسليم، وتفعيل الاشتراك الشهري فور اكتمال الإعداد.',
    cardInBuildTitle: 'قيد البرمجة والتجهيز',
    cardInBuildSub: 'مشاريع قيد الربط والتطوير',
    cardDeliveredTitle: 'تم استلامها وتسليمها',
    cardDeliveredSub: 'أنظمة تم تسليمها بنجاح',
    cardTrialTitle: 'مشاريع للتجربة (7 أيام)',
    cardTrialSub: 'وكالات تختبر الأوتوميشن',
    cardRetainersTitle: 'رسمياً تم الاتفاق وشغال',
    cardRetainersSub: 'عقود صيانة شهرية نشطة',
    deliveryTableTitle: 'جدول تسليم ومتابعة مشاريع الأوتوميشن الجارية',
    deliveryTableSub: 'حدد نسبة الإنجاز والتقدم بنقرة زر واحدة بدون تعقيدات',
    colClientAgency: 'العميل والوكالة العقارية',
    colPackageChosen: 'الباقة المختارة',
    colStartDate: 'تاريخ الاستلام والبدء',
    colTimeRemaining: 'الوقت المتبقي لإرساله وتسليمه',
    colProgressPct: 'نسبة التقدم المئوية %',
    colActionDelivery: 'إجراء التسليم النهائي',
    btnCompleteDelivery: '✓ تم التسليم وتفعيل الصيانة',
    activeRetainersTableTitle: 'قائمة الوكالات التي تم تسليمها وتعمل رسمياً تحت عقد الصيانة الشهري',
    activeRetainersTableSub: 'مداخيل الصيانة الشهرية المتكررة المنتظمة',
    colCity: 'المدينة',
    colSetupFeeCollected: 'رسوم الإعداد المحصلة',
    colMonthlyRetainer: 'اشتراك الصيانة الشهري',
    colNextRenewal: 'تاريخ التجديد القادم',
    colSystemStatus: 'حالة النظام',
    statusRunningLive: 'شغال ورسمي',

    retainersHeaderTag: 'عقود واشتراكات الصيانة الشهرية',
    retainersHeaderTitle: 'إدارة مداخيل الصيانة الشهرية وتذكيرات الفواتير عبر واتساب',
    retainersHeaderDesc: 'إرسال بيانات الحساب البنكي وتذكيرات الفواتير الشهرية تلقائياً عبر واتساب لتسريع تحصيل الاشتراكات.',
    ribBoxTitle: 'بيانات الحساب البنكي لتحصيل اشتراكات الصيانة',
    btnCopyRib: 'نسخ رقم الحساب البنكي',
    btnCopiedRib: '✓ تم نسخ رقم الحساب بنجاح',
    btnSendWhatsAppInvoice: 'إرسال تذكير وفاتورة عبر واتساب',
    subtabClients: 'وكالات عقود الصيانة',
    subtabExpenses: 'مصاريف واشتراكات العملاء',
    subtabInvoices: 'فواتير الصيانة',
    subtabTickets: 'تذاكر الدعم والصيانة',

    clientsHeaderTag: 'دليل الوكالات والعملاء العقاريين',
    clientsHeaderTitle: 'دليل الوكالات والعملاء',
    clientsHeaderDesc: 'إدارة بيانات الوكالات والعملاء المحتملين وتصنيفهم حسب الحالة والباقة.',
    btnExportCsv: 'تصدير القائمة كملف جدول',
    badgeReferralPartner: 'شريك إحالة معتمد',
    badgeStandardClient: 'عميل وكالة',
    colContact: 'المسؤول ومعلومات الاتصال',
    colStage: 'مرحلة الصفقة',
    colTier: 'الباقة',
    colRevenue: 'الإيراد المحصل',

    packagesHeaderTag: 'هيكلة وتسعير باقات الأوتوميشن والصيانة',
    packagesHeaderTitle: 'الباقات الثلاث المعتمدة: رسوم الإعداد والصيانة الشهرية',
    packagesHeaderDesc: 'هيكلة باقات الأوتوميشن العقاري مع الرسوم الشهرية المتكررة وخصائص كل باقة.',
  },

  fr: {
    brandTitle: 'IBONDA Automation',
    brandTagline: "Tableau de Bord Central d'Automatisation & Maintenance",
    addClientBtn: '+ Ajouter un Client',
    searchPlaceholder: 'Rechercher agence, ville, tél...',
    notificationsTitle: 'Alertes Essais & Rendez-vous',
    urgentTrialsAlert: 'Alerte Essai 7 Jours',
    viewDeal: 'Suivre le deal ←',
    languageSelect: 'Langue / Language',
    notificationsEmpty: 'Aucune alerte active pour le moment',
    alertsCount: 'alertes',

    navLeadershipGroup: 'Pilotage commercial',
    navExecutionGroup: 'Opérations & maintenance',
    navOverview: 'Vue d’ensemble',
    navPipeline: 'Suivi commercial',
    navMeetings: 'Rendez-vous & consultations',
    navAds: 'Campagnes Publicitaires',
    navDelivery: 'Livraison des Projets',
    navRetainers: 'Contrats de Maintenance',
    navClients: 'Répertoire des agences',
    navPackages: 'Offres et tarification',
    navBookingSettings: 'Horaires & Réservation',
    sidebarBadge: 'ESPACE DE PILOTAGE',

    mad: 'MAD',
    perMonth: 'MAD/mois',
    days: 'jours',
    leads: 'prospects',
    leadsCountSuffix: 'prospects',
    meetingsUnit: 'RDV',
    clientsUnit: 'agences',
    projectsUnit: 'projets',
    active: 'Actif',
    pending: 'En attente',
    completed: 'Terminé',
    paid: 'Payé',
    overdue: 'En retard',
    all: 'Tous',
    call: 'Appel direct',
    whatsapp: 'Chat WhatsApp',
    statusScheduled: 'Planifié',
    statusCompleted: 'Présent & Réalisé',
    statusNoShow: 'Absent (No-Show)',
    statusTrial: 'Essai Démarré',
    filterByTier: 'Filtrer par offre:',
    filterByCity: 'Filtrer par ville:',
    filterByStatus: 'Filtrer par statut:',
    allTiers: 'Toutes les offres (Starter, Growth, Enterprise)',
    dragDropHere: 'Déposez une opportunité ici',
    changeStageBtn: 'Changer d’étape ▾',
    selectTargetStage: 'Choisir l’étape suivante :',
    rejectionReasonLabel: 'Motif du refus / non-accord:',

    overviewTitle: 'Vue Globale & Indicateurs KPIs',
    overviewSub: 'Suivi direct des revenus récurrents (MRR), cash setup et taux de présence aux rendez-vous',
    kpiRetainerMRR: 'Revenus Récurrents Mensuels (MRR)',
    kpiRetainerMRRSub: 'Contrats de maintenance stables et sécurisés',
    kpiSetupCash: 'Cash Setup Encaissé',
    kpiSetupCashSub: 'Frais de déploiement et configuration perçus',
    kpiAttendanceRate: 'Taux de Présence aux RDV',
    kpiAttendanceRateSub: 'Appels de démonstration honorés avec succès',
    kpiActiveTrials: 'Périodes d’Essai 7 Jours Actives',
    kpiActiveTrialsSub: 'Agences testant actuellement l’automatisation',
    alertMeetingIn30: 'Rendez-vous dans moins de 30 minutes',
    alertUnpaidInvoice: 'Facture de maintenance impayée à relancer',
    alertTrialUrgent: 'Essai 7 jours arrivant à terme (< 48 heures)',
    btnNewContract: '+ Nouveau Contrat',
    chartRevenueTitle: 'Évolution du Cash Setup & MRR Récurrent',
    chartRevenueSub: 'Comparaison entre le cash de configuration et les abonnements mensuels cumulés',
    btnWeeklyView: 'Hebdomadaire (Weekly)',
    btnMonthlyView: 'Mensuel (Monthly)',
    dealsFunnelTitle: 'Entonnoir de Conversion des Agences',
    dealsFunnelSub: 'Progression des prospects de la pub jusqu’au contrat de maintenance',

    pipelineHeaderTag: 'Suivi commercial',
    pipelineHeaderTitle: 'Pilotage du pipeline commercial',
    pipelineHeaderDesc: 'Suivez chaque agence, de la prise de contact jusqu’à la conclusion du contrat.',
    colAdLeadsTitle: '1. Nouveau client',
    colAdLeadsSub: 'Formulaires Meta & Google Ads entrants',
    colMeetingsTitle: '2. Rendez-vous planifié',
    colMeetingsSub: 'Appels de consultation avec les dirigeants',
    colAttendedTitle: '3. Rendez-vous effectué',
    colAttendedSub: 'Consultation réalisée',
    colNoShowTitle: '4. Absence au rendez-vous',
    colNoShowSub: 'Le contact ne s’est pas présenté',
    colFollowUpTitle: '7. Négociation & suivi',
    colFollowUpSub: 'Relance commerciale et prochaines étapes',
    kpiDealCloseRate: 'Taux de closing',
    kpiAppointmentAttendance: 'Taux de présence aux rendez-vous',
    kpiTotalBookedMeetings: 'Total des rendez-vous réservés',
    kpiCompletedMeetings: 'Rendez-vous effectués',
    kpiNoShowMeetings: 'Absences aux rendez-vous',
    colRole: 'Fonction dans l’agence',
    colTeamSize: 'Effectif de l’équipe',
    colDailyInquiries: 'Demandes quotidiennes',
    colTrialTitle: '3. Essai Gratuit 7 Jours',
    colTrialSub: 'Test de la solution en conditions réelles',
    colDeliveryTitle: '4. Projets en Livraison',
    colDeliverySub: 'Intégration, APIs et paramétrages sur-mesure',
    colRetainerTitle: '8. Deal conclu',
    colRetainerSub: 'Accord conclu et vente confirmée',
    colLostTitle: '9. Deal non conclu',
    colLostSub: 'Analyse des motifs pour relance future',
    trialExpiresIn: 'Temps restant essai',
    trialUrgentWarning: 'Expire aujourd’hui ou demain !',
    btnStartTrial: '⚡ Lancer l’essai 7 jours',
    btnAcceptTrial: '✓ Offre acceptée & Lancer livraison',

    meetingsHeaderTag: 'Rendez-vous commerciaux & consultations',
    meetingsHeaderTitle: 'Gestion des rendez-vous et consultations',
    meetingsHeaderDesc: 'Suivi de l’effectif de l’agence, du volume quotidien des demandes et de la période d’essai de 7 jours, avec prise de contact par téléphone ou WhatsApp.',
    btnAddMeeting: '+ Nouveau Rendez-vous',
    metricAvgTeam: 'Effectif de l’équipe',
    metricAvgDailyLeads: 'Demandes quotidiennes',
    metricActiveTrials: 'Essais gratuits de 7 jours en cours',
    metricAttendedRate: 'Taux de présence',
    colAgencyClient: 'Agence Immobilière & Responsable',
    colDateTime: 'Date & Heure du RDV',
    colCommunication: 'Canal de contact',
    colTeamLeadsProblem: 'Effectif, demandes et besoin principal',
    colStatusAttendance: 'Présence et résultat du rendez-vous',
    colTrialDates: 'Période d’essai (7 jours)',
    colPaymentRetainer: 'Offre, règlement et renouvellement',
    colActions: 'Actions Rapides',
    btnDirectCall: 'Appel Téléphonique',
    btnWhatsAppChat: 'WhatsApp',
    attended: 'Présent au RDV',
    notAttended: 'Absent (No-Show)',

    // Agenda, Performance & Tâches
    subtabAgenda: 'Agenda et rendez-vous du jour',
    subtabPerformance: 'Performance commerciale (jour/semaine)',
    subtabTasks: 'Tâches opérationnelles',
    subtabAllMeetings: 'Historique des rendez-vous',
    subtabBookingHours: 'Horaires & Réservation',
    agendaTodayTitle: 'Agenda du Jour & Statuts de Confirmation',
    agendaTodaySub: 'Suivi des réunions du jour, rappels envoyés, confirmations clients et déclenchement d’actions immédiates.',
    reminderStatus: 'Statut du Rappel',
    reminderSent: 'Rappel Envoyé',
    reminderNotSent: 'Non Envoyé',
    confirmationStatus: 'Confirmation Client',
    confirmedByClient: 'Confirmé par le client',
    notConfirmedYet: 'En attente de confirmation',
    convertedStatus: 'Statut Conversion',
    convertedToDeal: 'Converti (Essai/Deal)',
    notConverted: 'Non Converti',
    dailyPerformanceTitle: 'Performance Quotidienne (Aujourd’hui)',
    dailyConductedMeetings: 'RDV Effectués Aujourd’hui',
    dailyConvertedDeals: 'Deals/Essais Convertis',
    dailyConversionRate: 'Taux de Conversion Quotidien',
    weeklyPerformanceTitle: 'Performance Hebdomadaire (Cette Semaine)',
    weeklyTotalMeetings: 'Total RDV de la Semaine',
    weeklyConductedMeetings: 'RDV Effectués cette Semaine',
    weeklyConvertedDeals: 'Deals Convertis cette Semaine',
    weeklyConversionRate: 'Taux de Conversion Hebdomadaire',
    tasksSectionTitle: 'Tâches Opérationnelles de l’Agence',
    tasksSectionSub: 'Suivi des rappels, contrats d’essai et paramétrages techniques.',
    btnAddTask: '+ Ajouter une Tâche',
    taskTitleLabel: 'Titre de la tâche',
    taskPriorityLabel: 'Priorité',
    taskDueDateLabel: 'Échéance',
    taskCategoryLabel: 'Catégorie',
    taskFilterAll: 'Toutes les tâches',
    taskFilterPending: 'En attente',
    taskFilterCompleted: 'Terminées',

    // Dates et Graphique de Performance Quotidienne
    today: 'Aujourd’hui',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    dailyChartTitle: 'Graphique de Performance Quotidienne des Rendez-vous',
    dailyChartSub: 'Comparaison des rendez-vous réservés, tenus et convertis au fil des jours',
    chartLegendScheduled: 'RDV Réservés',
    chartLegendConducted: 'RDV Effectués',
    chartLegendConverted: 'Deals Convertis',
    chartLegendConversionRate: 'Taux de Conversion (%)',
    hourlyBreakdownTitle: 'Répartition Horaire des Rendez-vous du Jour',
    starterPackage: 'Pack Starter',
    growthPackage: 'Pack Croissance',
    enterprisePackage: 'Pack Entreprise VIP',

    adsHeaderTag: 'Campagnes publicitaires & conversion',
    adsHeaderTitle: 'Performance des campagnes publicitaires',
    adsHeaderDesc: 'Visualisation précise des visiteurs, complétion vidéo VSL et taux de déperdition à chaque palier.',
    kpiTotalAdSpend: 'Budget Publicitaire Total',
    kpiLandingVisitors: 'Visiteurs Landing Page',
    kpiVideoWatch: 'Vidéos VSL Vues Intégralement',
    kpiAttendanceRateAds: 'Taux de Présence aux RDV',
    funnelSectionTitle: 'Parcours de conversion des prospects',
    funnelSectionSub: 'Taux de passage et taux de chute entre chaque étape générés via Recharts',
    stepImpressions: 'Impressions Pubs',
    stepClicks: 'Clics vers Landing',
    stepLanding: 'Visites de la Page',
    stepLeads: 'Formulaires Reçus',
    stepAttended: 'Présence au Rendez-vous',
    stepClosed: 'Contrats Signés & MRR',

    deliveryHeaderTag: 'Étape 4: Progression de Livraison (Project Delivery)',
    deliveryHeaderTitle: "Suivi de l'Avancement et Livraison des Automatisations",
    deliveryHeaderDesc: "Ajustez le pourcentage d'avancement (%), surveillez les délais restants et activez le forfait de maintenance mensuelle dès livraison.",
    cardInBuildTitle: 'En Cours de Configuration',
    cardInBuildSub: 'Scénarios & APIs en développement',
    cardDeliveredTitle: 'Systèmes Livrés avec Succès',
    cardDeliveredSub: 'Prêts et opérationnels',
    cardTrialTitle: 'Essais en Cours (7 jours)',
    cardTrialSub: 'Agences en phase de test',
    cardRetainersTitle: 'Contrats Signés & Actifs',
    cardRetainersSub: 'Maintenance mensuelle active',
    deliveryTableTitle: "Tableau d'Avancement des Projets d'Automatisation",
    deliveryTableSub: "Sélectionnez le pourcentage d'achèvement en un clic",
    colClientAgency: 'Client & Agence Immobilière',
    colPackageChosen: 'Offre Choisie',
    colStartDate: 'Date de Début',
    colTimeRemaining: 'Temps Restant avant Livraison',
    colProgressPct: 'Pourcentage de Progression %',
    colActionDelivery: 'Validation Finale',
    btnCompleteDelivery: '✓ Valider la Livraison & Activer Maintenance',
    activeRetainersTableTitle: 'Agences Livrées et Actives sous Contrat de Maintenance Mensuelle',
    activeRetainersTableSub: 'Revenus mensuels récurrents sécurisés',
    colCity: 'Ville',
    colSetupFeeCollected: 'Frais de configuration encaissés',
    colMonthlyRetainer: 'Abonnement mensuel de maintenance',
    colNextRenewal: 'Prochain Renouvellement',
    colSystemStatus: 'Statut Système',
    statusRunningLive: 'En Production & Actif',

    retainersHeaderTag: 'Contrats de maintenance & facturation',
    retainersHeaderTitle: 'Suivi des abonnements et relances de paiement',
    retainersHeaderDesc: 'Transmission du RIB officiel et rappels automatiques via WhatsApp pour fluidifier les encaissements.',
    ribBoxTitle: 'Coordonnées Bancaires Officielles (RIB) pour Encaissement des Forfaits',
    btnCopyRib: 'Copier le numéro RIB',
    btnCopiedRib: '✓ RIB copié dans le presse-papier',
    btnSendWhatsAppInvoice: 'Envoyer facture & RIB par WhatsApp',
    subtabClients: 'Agences sous Contrat',
    subtabExpenses: 'Charges et marge nette',
    subtabInvoices: 'Factures de maintenance',
    subtabTickets: 'Demandes d’assistance',

    clientsHeaderTag: 'Répertoire des agences immobilières',
    clientsHeaderTitle: 'Fichier clients, filtres par ville et export',
    clientsHeaderDesc: 'Filtrez les agences par ville, offre et statut commercial.',
    btnExportCsv: 'Exporter la Liste (CSV)',
    badgeReferralPartner: 'Partenaire de recommandation',
    badgeStandardClient: 'Agence cliente',
    colContact: 'Responsable & Contact',
    colStage: 'Étape commerciale',
    colTier: 'Offre',
    colRevenue: 'Chiffre d’affaires généré',

    packagesHeaderTag: 'Offres et tarification',
    packagesHeaderTitle: 'Grille tarifaire des trois offres',
    packagesHeaderDesc: 'Détail des trois offres d’automatisation immobilière, des frais de configuration et de la maintenance mensuelle.',
  },

  en: {
    brandTitle: 'IBONDA Automation',
    brandTagline: 'Central Control Hub for Automation & Monthly Maintenance Retainers',
    addClientBtn: '+ Add New Client',
    searchPlaceholder: 'Search agency, city, phone...',
    notificationsTitle: 'Trial & Meeting Alerts',
    urgentTrialsAlert: '7-Day Trial Urgent Alert',
    viewDeal: 'Inspect deal ←',
    languageSelect: 'Language',
    notificationsEmpty: 'No urgent notifications at the moment',
    alertsCount: 'alerts',

    navLeadershipGroup: 'Commercial Management',
    navExecutionGroup: 'Operations & Maintenance',
    navOverview: 'Executive Overview',
    navPipeline: 'Sales Pipeline',
    navMeetings: 'Appointments & Consultations',
    navAds: 'Ad Campaigns & Funnel',
    navDelivery: 'Project Delivery Progress',
    navRetainers: 'Maintenance Retainers',
    navClients: 'Agency Directory',
    navPackages: 'Service Packages & Pricing',
    navBookingSettings: 'Working Hours & Booking',
    sidebarBadge: 'CONTROL HUB',

    mad: 'MAD',
    perMonth: 'MAD/mo',
    days: 'days',
    leads: 'prospects',
    leadsCountSuffix: 'prospects',
    meetingsUnit: 'meetings',
    clientsUnit: 'agencies',
    projectsUnit: 'projects',
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    paid: 'Paid',
    overdue: 'Overdue',
    all: 'All',
    call: 'Direct Call',
    whatsapp: 'WhatsApp Chat',
    statusScheduled: 'Scheduled',
    statusCompleted: 'Attended & Done',
    statusNoShow: 'Absent (No-Show)',
    statusTrial: 'Trial Started',
    filterByTier: 'Filter by tier:',
    filterByCity: 'Filter by city:',
    filterByStatus: 'Filter by status:',
    allTiers: 'All Tiers (Starter, Growth, Enterprise)',
    dragDropHere: 'Drag and drop deal card here',
    changeStageBtn: 'Move Stage ▾',
    selectTargetStage: 'Select target stage:',
    rejectionReasonLabel: 'Rejection reason / lost deal note:',

    overviewTitle: 'Executive Overview & Agency KPIs',
    overviewSub: 'Real-time monitoring of monthly recurring revenue (MRR), setup cash, and meeting attendance rates',
    kpiRetainerMRR: 'Monthly Retainer MRR',
    kpiRetainerMRRSub: 'Guaranteed predictable monthly cashflow',
    kpiSetupCash: 'Collected Setup Fees',
    kpiSetupCashSub: 'Total workflow setup and onboarding fees',
    kpiAttendanceRate: 'Meeting Attendance Rate',
    kpiAttendanceRateSub: 'Consultation & demo calls successfully attended',
    kpiActiveTrials: 'Active 7-Day Trials',
    kpiActiveTrialsSub: 'Agencies actively testing live automation',
    alertMeetingIn30: 'Consultation meeting starts in under 30 minutes',
    alertUnpaidInvoice: 'Unpaid monthly retainer invoice awaiting reminder',
    alertTrialUrgent: '7-day trial expiring soon (under 48 hours remaining)',
    btnNewContract: '+ Add New Contract',
    chartRevenueTitle: 'Revenue Trajectory: Setup Cash vs Monthly MRR',
    chartRevenueSub: 'Growth trajectory comparing upfront setup cash and cumulative monthly retainers',
    btnWeeklyView: 'Weekly View',
    btnMonthlyView: 'Monthly View',
    dealsFunnelTitle: 'Agency Deal Conversion Funnel',
    dealsFunnelSub: 'Conversion breakdown from incoming ad lead to active monthly retainer',

    pipelineHeaderTag: 'Sales Pipeline',
    pipelineHeaderTitle: 'Sales pipeline management',
    pipelineHeaderDesc: 'Track each agency from initial contact through negotiation and deal closure.',
    colAdLeadsTitle: '1. New client',
    colAdLeadsSub: 'New enquiries from Meta and Google campaigns',
    colMeetingsTitle: '2. Appointment scheduled',
    colMeetingsSub: 'Scheduled demo calls with agency owners',
    colAttendedTitle: '3. Meeting attended',
    colAttendedSub: 'Consultation successfully completed',
    colNoShowTitle: '4. No-show',
    colNoShowSub: 'The contact did not attend',
    colFollowUpTitle: '7. Negotiation & follow-up',
    colFollowUpSub: 'Commercial follow-up and next steps',
    kpiDealCloseRate: 'Deal close rate',
    kpiAppointmentAttendance: 'Appointment attendance rate',
    kpiTotalBookedMeetings: 'Total appointments booked',
    kpiCompletedMeetings: 'Completed appointments',
    kpiNoShowMeetings: 'No-show appointments',
    colRole: 'Agency role',
    colTeamSize: 'Team size',
    colDailyInquiries: 'Daily inquiries',
    colTrialTitle: '3. 7-Day Free Trial',
    colTrialSub: 'Real-world trial of the automation service',
    colDeliveryTitle: '4. Projects In Delivery',
    colDeliverySub: 'Workflow build, testing, and CRM setup',
    colRetainerTitle: '8. Deal won',
    colRetainerSub: 'Commercial agreement successfully closed',
    colLostTitle: '9. Deal not completed',
    colLostSub: 'Loss reasons tracked for future retargeting',
    trialExpiresIn: 'Trial time remaining',
    trialUrgentWarning: 'Expires today or tomorrow!',
    btnStartTrial: '⚡ Start 7-Day Trial Now',
    btnAcceptTrial: '✓ Deal Won & Start Delivery',

    meetingsHeaderTag: 'Phase 2: Meeting Agenda & Real Estate Consultations',
    meetingsHeaderTitle: 'Appointments & consultation management',
    meetingsHeaderDesc: 'Record agency size, daily lead volume, track 7-day trials, and trigger direct phone calls or WhatsApp messages with 1 click.',
    btnAddMeeting: '+ Schedule Meeting',
    metricAvgTeam: 'Agency team size',
    metricAvgDailyLeads: 'Daily enquiries',
    metricActiveTrials: 'Active 7-day trials',
    metricAttendedRate: 'Attendance Rate',
    colAgencyClient: 'Agency & primary contact',
    colDateTime: 'Meeting Date & Time',
    colCommunication: 'Contact channel',
    colTeamLeadsProblem: 'Team size, daily enquiries & main need',
    colStatusAttendance: 'Appointment status & outcome',
    colTrialDates: 'Trial period',
    colPaymentRetainer: 'Package, payment & renewal',
    colActions: 'Quick Actions',
    btnDirectCall: 'Direct Call',
    btnWhatsAppChat: 'WhatsApp',
    attended: 'Attended Meeting',
    notAttended: 'No-Show (Absent)',

    // Agenda, Performance & Tasks
    subtabAgenda: 'Daily Agenda & Meetings',
    subtabPerformance: 'Daily & Weekly Performance',
    subtabTasks: 'Operational Tasks',
    subtabAllMeetings: 'Appointment History',
    subtabBookingHours: 'Working Hours & Booking',
    agendaTodayTitle: 'Daily Agenda & Confirmation Hub',
    agendaTodaySub: 'Track today’s scheduled demo calls, check reminder deliveries, client confirmations, and trigger instant WhatsApp messages.',
    reminderStatus: 'Reminder Status',
    reminderSent: 'Reminder Sent',
    reminderNotSent: 'Not Sent Yet',
    confirmationStatus: 'Client Confirmation',
    confirmedByClient: 'Confirmed by Client',
    notConfirmedYet: 'Awaiting Confirmation',
    convertedStatus: 'Conversion Status',
    convertedToDeal: 'Converted to Deal/Trial',
    notConverted: 'Not Converted',
    dailyPerformanceTitle: 'Daily Meeting Performance (Today)',
    dailyConductedMeetings: 'Conducted Today',
    dailyConvertedDeals: 'Converted to Trial/Deal',
    dailyConversionRate: 'Daily Conversion Rate',
    weeklyPerformanceTitle: 'Weekly Meeting Performance (This Week)',
    weeklyTotalMeetings: 'Total Scheduled This Week',
    weeklyConductedMeetings: 'Conducted This Week',
    weeklyConvertedDeals: 'Deals/Trials Won',
    weeklyConversionRate: 'Weekly Conversion Rate',
    tasksSectionTitle: 'Agency Operations & Follow-up Tasks (To-Do)',
    tasksSectionSub: 'Keep team focused on reminders, 7-day trial renewals, and automation delivery milestones.',
    btnAddTask: '+ Add New Task',
    taskTitleLabel: 'Task Title',
    taskPriorityLabel: 'Priority',
    taskDueDateLabel: 'Due Date',
    taskCategoryLabel: 'Category',
    taskFilterAll: 'All Tasks',
    taskFilterPending: 'Pending',
    taskFilterCompleted: 'Completed',

    // Dates & Daily Chart
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    dailyChartTitle: 'Daily Consultation Performance Chart',
    dailyChartSub: 'Day-by-day comparison of scheduled, conducted and converted meetings',
    chartLegendScheduled: 'Scheduled Meetings',
    chartLegendConducted: 'Conducted Meetings',
    chartLegendConverted: 'Converted Deals',
    chartLegendConversionRate: 'Conversion Rate (%)',
    hourlyBreakdownTitle: 'Today’s Hourly Meeting Breakdown',
    starterPackage: 'Starter Package',
    growthPackage: 'Growth Package',
    enterprisePackage: 'Enterprise VIP',

    adsHeaderTag: 'Advertising Campaigns & Conversion',
    adsHeaderTitle: 'Advertising Campaign Performance',
    adsHeaderDesc: 'Detailed tracking of landing visitors, video completion rates, and stage-by-stage drop-off from impressions to attendance.',
    kpiTotalAdSpend: 'Total Ad Spend',
    kpiLandingVisitors: 'Landing Page Visitors',
    kpiVideoWatch: 'Full VSL Video Watches',
    kpiAttendanceRateAds: 'Meeting Attendance Rate',
    funnelSectionTitle: 'Lead-to-Appointment Conversion Funnel',
    funnelSectionSub: 'Recharts visualization of retention and drop-off percentage across all funnel stages',
    stepImpressions: 'Ad Impressions',
    stepClicks: 'Ad Clicks',
    stepLanding: 'Landing Page Visitors',
    stepLeads: 'Form Leads',
    stepAttended: 'Meeting Attended',
    stepClosed: 'Closed Deals (MRR)',

    deliveryHeaderTag: 'Phase 4: Project Delivery Progress Hub',
    deliveryHeaderTitle: 'Automation Delivery Progress & Milestone Tracking',
    deliveryHeaderDesc: 'Update project completion percentages (%), track time remaining to launch, and activate recurring monthly maintenance upon delivery.',
    cardInBuildTitle: 'In Build & Setup',
    cardInBuildSub: 'Workflows & APIs in configuration',
    cardDeliveredTitle: 'Delivered Projects',
    cardDeliveredSub: 'Successfully completed setups',
    cardTrialTitle: '7-Day Trials Active',
    cardTrialSub: 'Agencies testing automation',
    cardRetainersTitle: 'Official Active Retainers',
    cardRetainersSub: 'Monthly maintenance revenue',
    deliveryTableTitle: 'Active Automation Delivery Pipeline',
    deliveryTableSub: 'Set progress percentages with one click',
    colClientAgency: 'Client & Real Estate Agency',
    colPackageChosen: 'Selected Tier',
    colStartDate: 'Start Date',
    colTimeRemaining: 'Time Left to Deadline',
    colProgressPct: 'Completion Progress %',
    colActionDelivery: 'Final Delivery Action',
    btnCompleteDelivery: '✓ Complete Delivery & Activate Retainer',
    activeRetainersTableTitle: 'Agencies Successfully Delivered & Under Active Monthly Maintenance',
    activeRetainersTableSub: 'Predictable Monthly Recurring Revenue (MRR)',
    colCity: 'City',
    colSetupFeeCollected: 'Implementation Fee Collected',
    colMonthlyRetainer: 'Monthly Maintenance Fee',
    colNextRenewal: 'Next Billing Date',
    colSystemStatus: 'System Status',
    statusRunningLive: 'Live & Active',

    retainersHeaderTag: 'Maintenance Contracts & Billing',
    retainersHeaderTitle: 'Subscription Management & Payment Reminders',
    retainersHeaderDesc: 'Directly dispatch official bank RIB and automated invoice reminders via WhatsApp to accelerate monthly collections.',
    ribBoxTitle: 'Official Agency Bank Details (RIB) for Retainer Payments',
    btnCopyRib: 'Copy RIB Number',
    btnCopiedRib: '✓ RIB copied to clipboard',
    btnSendWhatsAppInvoice: 'Send Invoice & RIB via WhatsApp',
    subtabClients: 'Retainer Clients',
    subtabExpenses: 'Operating Costs & Net Margin',
    subtabInvoices: 'Maintenance Invoices',
    subtabTickets: 'Support Requests',

    clientsHeaderTag: 'Real Estate Agency Directory',
    clientsHeaderTitle: 'Agency Directory & Client Records',
    clientsHeaderDesc: 'Filter agencies by city, service package and commercial status.',
    btnExportCsv: 'Export Directory (CSV)',
    badgeReferralPartner: 'Referral Partner',
    badgeStandardClient: 'Standard Client',
    colContact: 'Contact Person & Phone',
    colStage: 'Sales Stage',
    colTier: 'Package Tier',
    colRevenue: 'Revenue Collected',

    packagesHeaderTag: 'Service Packages & Pricing',
    packagesHeaderTitle: 'Three Service Packages: Implementation & Maintenance',
    packagesHeaderDesc: 'Detailed pricing structure for setup fees and monthly ongoing maintenance across Starter, Growth, and Enterprise.',
  },
};
