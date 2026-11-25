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
    brandTitle: 'IBONDA للأتمتة',
    brandTagline: 'منصة الإدارة التجارية والتشغيلية وخدمات الصيانة',
    addClientBtn: '+ إضافة عميل جديد',
    searchPlaceholder: 'بحث بوكالة، مدينة، هاتف...',
    notificationsTitle: 'تنبيهات التجربة والمواعيد',
    urgentTrialsAlert: 'تنبيه تجربة 7 أيام',
    viewDeal: 'فحص ومتابعة الفرصة التجارية ←',
    languageSelect: 'اختيار لغة لوحة التحكم',
    notificationsEmpty: 'لا توجد تنبيهات حالياً',
    alertsCount: 'تنبيهات',

    navLeadershipGroup: 'الإدارة التجارية',
    navExecutionGroup: 'العمليات والعقود',
    navOverview: 'نظرة عامة ومؤشرات الأداء',
    navPipeline: 'مسار الصفقات',
    navMeetings: 'المواعيد ومكالمات الاستشارة',
    navAds: 'الحملات الإعلانية',
    navDelivery: 'مشاريع التنفيذ والتسليم',
    navRetainers: 'عقود واشتراكات الصيانة',
    navClients: 'دليل الوكالات والعملاء',
    navPackages: 'الباقات والأسعار',
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
    whatsapp: 'مراسلة واتساب',
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

    overviewTitle: 'نظرة عامة ومؤشرات الأداء للوكالة',
    overviewSub: 'متابعة مباشرة للإيرادات الشهرية المتكررة، مبالغ الإعداد، ونسب حضور المواعيد والصفقات',
    kpiRetainerMRR: 'اشتراكات الصيانة الشهرية المتكررة',
    kpiRetainerMRRSub: 'إيرادات شهرية متكررة',
    kpiSetupCash: 'رسوم الإعداد المحصلة',
    kpiSetupCashSub: 'إجمالي رسوم تهيئة الأنظمة وتفعيلها',
    kpiAttendanceRate: 'نسبة حضور المواعيد والمكالمات',
    kpiAttendanceRateSub: 'مكالمات استشارية مكتملة بنجاح',
    kpiActiveTrials: 'فترات تجربة نشطة (7 أيام)',
    kpiActiveTrialsSub: 'وكالات تختبر أنظمة الأتمتة',
    alertMeetingIn30: 'موعد استشارة سيبدأ خلال 30 دقيقة',
    alertUnpaidInvoice: 'فاتورة صيانة غير مدفوعة تحتاج تذكيراً',
    alertTrialUrgent: 'تجربة 7 أيام تقترب من الانتهاء (أقل من 48 ساعة)',
    btnNewContract: '+ إضافة عقد جديد',
    chartRevenueTitle: 'تطور الإيرادات المتكررة ورسوم الإعداد',
    chartRevenueSub: 'مقارنة رسوم الإعداد بإيرادات الصيانة الشهرية',
    btnWeeklyView: 'عرض أسبوعي',
    btnMonthlyView: 'عرض شهري',
    dealsFunnelTitle: 'مسار تحويل الفرص التجارية',
    dealsFunnelSub: 'تتبع انتقال الوكالات من الاستفسار الإعلاني إلى عقد الصيانة',

    pipelineHeaderTag: 'مسار المبيعات وفترة التجربة',
    pipelineHeaderTitle: 'إدارة مسار المبيعات: نقل الوكالات بين المراحل أو تحديث الحالة',
    pipelineHeaderDesc: 'نقل الوكالات بين مراحل المسار، مع متابعة أسباب خسارة الفرص وعدد العملاء في كل مرحلة',
    colAdLeadsTitle: '1. عميل جديد',
    colAdLeadsSub: 'الاستفسارات الواردة من حملات Meta وGoogle',
    colMeetingsTitle: '2. تمت جدولة الموعد',
    colMeetingsSub: 'مواعيد عرض الخدمة مع مسؤولي الوكالات',
    colAttendedTitle: '3. حضر الموعد',
    colAttendedSub: 'تم إجراء الاجتماع أو المكالمة',
    colNoShowTitle: '4. غاب عن الموعد',
    colNoShowSub: 'مواعيد لم يحضرها العميل',
    colFollowUpTitle: '7. قيد التفاوض والمتابعة',
    colFollowUpSub: 'متابعة العرض التجاري واستكمال التفاوض',
    kpiDealCloseRate: 'معدل تحويل الفرص إلى عقود',
    kpiAppointmentAttendance: 'نسبة حضور المواعيد',
    kpiTotalBookedMeetings: 'إجمالي المواعيد المحجوزة',
    kpiCompletedMeetings: 'المواعيد المكتملة',
    kpiNoShowMeetings: 'حالات عدم الحضور',
    colRole: 'الدور داخل الوكالة',
    colTeamSize: 'حجم الفريق',
    colDailyInquiries: 'الاستفسارات اليومية',
    colTrialTitle: '5. تجربة مجانية لمدة 7 أيام',
    colTrialSub: 'اختبار حي للالأتمتة وسرعة الرد',
    colDeliveryTitle: '6. مشاريع قيد التسليم',
    colDeliverySub: 'برمجة وربط وتخصيص الأنظمة',
    colRetainerTitle: '8. صفقة ناجحة',
    colRetainerSub: 'تم توقيع العقد وإتمام البيع',
    colLostTitle: '9. صفقة غير مكتملة',
    colLostSub: 'تحليل أسباب خسارة الفرص لتحسين الاستهداف',
    trialExpiresIn: 'متبقي في التجربة',
    trialUrgentWarning: 'تنتهي اليوم أو غداً!',
    btnStartTrial: '⚡ بدء تجربة 7 أيام فوراً',
    btnAcceptTrial: '✓ وافق على الباقة واستلام الإعداد',

    meetingsHeaderTag: 'إدارة المواعيد والاجتماعات التجارية',
    meetingsHeaderTitle: 'إدارة مواعيد العروض والاجتماعات التجارية',
    meetingsHeaderDesc: 'إدارة بيانات الوكالة وحجم الفريق وحجم الاستفسارات، ومتابعة فترة التجربة (7 أيام) مع التواصل عبر الهاتف أو واتساب.',
    btnAddMeeting: '+ حجز موعد جديد',
    metricAvgTeam: 'متوسط أفراد الوكالة',
    metricAvgDailyLeads: 'متوسط الاستفسارات اليومية',
    metricActiveTrials: 'تجارب 7 أيام جارية',
    metricAttendedRate: 'نسبة الحضور',
    colAgencyClient: 'الوكالة العقارية والمسؤول',
    colDateTime: 'تاريخ ووقت الموعد',
    colCommunication: 'قنوات التواصل',
    colTeamLeadsProblem: 'حجم الفريق، الاستفسارات، والاحتياج الرئيسي',
    colStatusAttendance: 'حالة الموعد والنتيجة',
    colTrialDates: 'تجربة 7 أيام (البدء والانتهاء)',
    colPaymentRetainer: 'الباقة وحالة الدفع والتجديد',
    colActions: 'الإجراءات',
    btnDirectCall: 'مكالمة هاتفية',
    btnWhatsAppChat: 'مراسلة واتساب',
    attended: 'حضر الموعد',
    notAttended: 'لم يحضر',

    // الأجندة والأداء والمهام
    subtabAgenda: 'الأجندة ومواعيد اليوم',
    subtabPerformance: 'مؤشرات الأداء التجاري اليومية والأسبوعية',
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
    convertedToDeal: 'تم تحويل الفرصة إلى تجربة أو عقد',
    notConverted: 'لم يُحول بعد',
    dailyPerformanceTitle: 'الأداء اليومي للمواعيد (اليوم)',
    dailyConductedMeetings: 'مواعيد تم إجراؤها اليوم',
    dailyConvertedDeals: 'تم تحويلها إلى تجربة أو عقد',
    dailyConversionRate: 'معدل التحويل اليومي',
    weeklyPerformanceTitle: 'الأداء الأسبوعي للمواعيد (هذا الأسبوع)',
    weeklyTotalMeetings: 'إجمالي مواعيد الأسبوع',
    weeklyConductedMeetings: 'مواعيد تم إجراؤها هذا الأسبوع',
    weeklyConvertedDeals: 'عقود وفترات تجربة مفعّلة',
    weeklyConversionRate: 'معدل التحويل الأسبوعي',
    tasksSectionTitle: 'مهام التشغيل والمتابعة',
    tasksSectionSub: 'متابعة التذكيرات وفترات التجربة (7 أيام) ومراحل تنفيذ مشاريع الأتمتة عبر قائمة مهام يومية.',
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

    adsHeaderTag: 'الحملات الإعلانية وتحليل مسار التحويل',
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
    stepClosed: 'إغلاق الفرصة التجارية وتفعيل الصيانة الشهرية',

    deliveryHeaderTag: 'مشاريع تنفيذ أنظمة الأتمتة',
    deliveryHeaderTitle: 'تسليم المشاريع ومتابعة تقدمها',
    deliveryHeaderDesc: 'تحديد وتحديث نسبة تقدم المشروع بسهولة (اختيار النسبة المئوية %)، متابعة الوقت المتبقي للتسليم، وتفعيل الاشتراك الشهري فور اكتمال الإعداد.',
    cardInBuildTitle: 'قيد التنفيذ والتهيئة',
    cardInBuildSub: 'مشاريع قيد التهيئة والتطوير',
    cardDeliveredTitle: 'تم استلامها وتسليمها',
    cardDeliveredSub: 'أنظمة تم تسليمها بنجاح',
    cardTrialTitle: 'مشاريع للتجربة (7 أيام)',
    cardTrialSub: 'وكالات تختبر الأتمتة',
    cardRetainersTitle: 'عقود مفعّلة',
    cardRetainersSub: 'اشتراكات صيانة شهرية نشطة',
    deliveryTableTitle: 'جدول تسليم ومتابعة مشاريع الأتمتة الجارية',
    deliveryTableSub: 'حدد نسبة الإنجاز والتقدم بنقرة زر واحدة بدون تعقيدات',
    colClientAgency: 'العميل والوكالة العقارية',
    colPackageChosen: 'الباقة المختارة',
    colStartDate: 'تاريخ الاستلام والبدء',
    colTimeRemaining: 'الوقت المتبقي للتسليم',
    colProgressPct: 'نسبة التقدم المئوية %',
    colActionDelivery: 'إجراء التسليم النهائي',
    btnCompleteDelivery: '✓ تم التسليم وتفعيل الصيانة',
    activeRetainersTableTitle: 'قائمة الوكالات التي تم تسليمها وتعمل رسمياً تحت عقد الصيانة الشهري',
    activeRetainersTableSub: 'إيرادات الصيانة الشهرية المتكررة',
    colCity: 'المدينة',
    colSetupFeeCollected: 'رسوم الإعداد المحصلة',
    colMonthlyRetainer: 'اشتراك الصيانة الشهري',
    colNextRenewal: 'تاريخ التجديد القادم',
    colSystemStatus: 'حالة النظام',
    statusRunningLive: 'قيد التشغيل',

    retainersHeaderTag: 'عقود واشتراكات الصيانة الشهرية',
    retainersHeaderTitle: 'إدارة الاشتراكات والفوترة والتحصيل',
    retainersHeaderDesc: 'إرسال بيانات الحساب البنكي وتذكيرات الفواتير عبر واتساب لتسهيل تحصيل الاشتراكات.',
    ribBoxTitle: 'بيانات الحساب البنكي لتحصيل اشتراكات الصيانة',
    btnCopyRib: 'نسخ رقم الحساب البنكي',
    btnCopiedRib: '✓ تم نسخ رقم الحساب بنجاح',
    btnSendWhatsAppInvoice: 'إرسال تذكير وفاتورة عبر واتساب',
    subtabClients: 'وكالات عقود الصيانة',
    subtabExpenses: 'مصاريف واشتراكات العملاء',
    subtabInvoices: 'فواتير الصيانة',
    subtabTickets: 'طلبات الدعم الفني',

    clientsHeaderTag: 'إدارة الوكالات والعملاء',
    clientsHeaderTitle: 'دليل الوكالات والعملاء',
    clientsHeaderDesc: 'إدارة بيانات الوكالات وتصنيفها حسب المرحلة التجارية والباقات.',
    btnExportCsv: 'تصدير القائمة كملف جدول',
    badgeReferralPartner: 'شريك إحالة معتمد',
    badgeStandardClient: 'عميل وكالة',
    colContact: 'المسؤول ومعلومات الاتصال',
    colStage: 'مرحلة الفرصة التجارية',
    colTier: 'الباقة',
    colRevenue: 'الإيرادات المحصلة',

    packagesHeaderTag: 'الباقات والأسعار وخدمات الصيانة',
    packagesHeaderTitle: 'الباقات الثلاث المعتمدة: رسوم الإعداد والصيانة الشهرية',
    packagesHeaderDesc: 'تفاصيل باقات الأتمتة العقارية ورسوم التهيئة والاشتراك الشهري ومزايا كل باقة.',
  },

  fr: {
    brandTitle: 'IBONDA Automation',
    brandTagline: "Plateforme de pilotage commercial et opérationnel",
    addClientBtn: '+ Ajouter un Client',
    searchPlaceholder: 'Rechercher agence, ville, tél...',
    notificationsTitle: 'Alertes Essais & Rendez-vous',
    urgentTrialsAlert: 'Alerte Essai 7 Jours',
    viewDeal: 'Suivre l’opportunité commerciale ←',
    languageSelect: 'Langue / Language',
    notificationsEmpty: 'Aucune alerte active pour le moment',
    alertsCount: 'alertes',

    navLeadershipGroup: 'Gestion commerciale',
    navExecutionGroup: 'Opérations & contrats',
    navOverview: 'Vue d’ensemble & indicateurs',
    navPipeline: 'Pipeline commercial',
    navMeetings: 'Rendez-vous & consultations',
    navAds: 'Campagnes publicitaires',
    navDelivery: 'Déploiement des projets',
    navRetainers: 'Contrats & maintenance',
    navClients: 'Répertoire des agences',
    navPackages: 'Offres et tarification',
    navBookingSettings: 'Horaires & prise de rendez-vous',
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
    call: 'Appel téléphonique',
    whatsapp: 'WhatsApp',
    statusScheduled: 'Planifié',
    statusCompleted: 'RDV honoré',
    statusNoShow: 'RDV manqué',
    statusTrial: 'Essai Démarré',
    filterByTier: 'Filtrer par offre:',
    filterByCity: 'Filtrer par ville:',
    filterByStatus: 'Filtrer par statut:',
    allTiers: 'Toutes les offres',
    dragDropHere: 'Déplacer l’opportunité ici',
    changeStageBtn: 'Changer d’étape ▾',
    selectTargetStage: 'Choisir l’étape suivante :',
    rejectionReasonLabel: 'Motif de perte / refus :',

    overviewTitle: 'Vue d’ensemble & indicateurs de performance',
    overviewSub: 'Suivi du revenu récurrent mensuel (MRR), des frais de mise en service et du taux de présence aux rendez-vous',
    kpiRetainerMRR: 'Revenus Récurrents Mensuels (MRR)',
    kpiRetainerMRRSub: 'Contrats de maintenance stables et sécurisés',
    kpiSetupCash: 'Frais de mise en service encaissés',
    kpiSetupCashSub: 'Total des frais de configuration et de mise en service encaissés',
    kpiAttendanceRate: 'Taux de Présence aux RDV',
    kpiAttendanceRateSub: 'Appels de démonstration honorés avec succès',
    kpiActiveTrials: 'Essais gratuits de 7 jours en cours',
    kpiActiveTrialsSub: 'Agences testant actuellement l’automatisation',
    alertMeetingIn30: 'Rendez-vous dans moins de 30 minutes',
    alertUnpaidInvoice: 'Facture de maintenance impayée à relancer',
    alertTrialUrgent: 'Essai 7 jours arrivant à terme (< 48 heures)',
    btnNewContract: '+ Nouveau Contrat',
    chartRevenueTitle: 'Évolution du Frais de mise en service & MRR Récurrent',
    chartRevenueSub: 'Comparaison des frais de mise en service et des abonnements mensuels cumulés',
    btnWeeklyView: 'Hebdomadaire (Weekly)',
    btnMonthlyView: 'Mensuel (Monthly)',
    dealsFunnelTitle: 'Entonnoir de Conversion des Agences',
    dealsFunnelSub: 'Progression des prospects de la pub jusqu’au contrat de maintenance',

    pipelineHeaderTag: 'Pipeline commercial',
    pipelineHeaderTitle: 'Pilotage du pipeline commercial',
    pipelineHeaderDesc: 'Suivez chaque agence, de la prise de contact jusqu’à la conclusion du contrat.',
    colAdLeadsTitle: '1. Nouveau prospect',
    colAdLeadsSub: 'Formulaires Meta & Google Ads entrants',
    colMeetingsTitle: '2. RDV planifié',
    colMeetingsSub: 'Appels de consultation avec les dirigeants',
    colAttendedTitle: '3. RDV honoré',
    colAttendedSub: 'Consultation réalisée',
    colNoShowTitle: '4. RDV manqué',
    colNoShowSub: 'Le contact ne s’est pas présenté',
    colFollowUpTitle: '7. Négociation & relance',
    colFollowUpSub: 'Relance commerciale et prochaines étapes',
    kpiDealCloseRate: 'Taux de closing',
    kpiAppointmentAttendance: 'Taux de présence aux rendez-vous',
    kpiTotalBookedMeetings: 'Total des rendez-vous réservés',
    kpiCompletedMeetings: 'Rendez-vous effectués',
    kpiNoShowMeetings: 'Absences aux rendez-vous',
    colRole: 'Fonction dans l’agence',
    colTeamSize: 'Effectif de l’équipe',
    colDailyInquiries: 'Demandes quotidiennes',
    colTrialTitle: '5. Essai gratuit (7 jours)',
    colTrialSub: 'Test de la solution en conditions réelles',
    colDeliveryTitle: '6. Projets en cours de déploiement',
    colDeliverySub: 'Intégrations et configuration sur mesure',
    colRetainerTitle: '8. Contrat signé',
    colRetainerSub: 'Accord conclu et vente confirmée',
    colLostTitle: '9. Opportunité perdue',
    colLostSub: 'Analyse des motifs pour relance future',
    trialExpiresIn: 'Temps restant essai',
    trialUrgentWarning: 'Expire aujourd’hui ou demain !',
    btnStartTrial: '⚡ Lancer l’essai 7 jours',
    btnAcceptTrial: '✓ Offre acceptée & Lancer livraison',

    meetingsHeaderTag: 'Rendez-vous commerciaux',
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
    attended: 'RDV honoré',
    notAttended: 'RDV manqué',

    // Agenda, Performance & Tâches
    subtabAgenda: 'Agenda commercial',
    subtabPerformance: 'Performance commerciale (jour / semaine)',
    subtabTasks: 'Tâches opérationnelles',
    subtabAllMeetings: 'Historique des rendez-vous',
    subtabBookingHours: 'Horaires & prise de rendez-vous',
    agendaTodayTitle: 'Agenda du jour & confirmations',
    agendaTodaySub: 'Suivi des réunions du jour, rappels envoyés, confirmations clients et déclenchement d’actions immédiates.',
    reminderStatus: 'Statut du Rappel',
    reminderSent: 'Rappel Envoyé',
    reminderNotSent: 'Non Envoyé',
    confirmationStatus: 'Confirmation Client',
    confirmedByClient: 'Confirmé par le client',
    notConfirmedYet: 'En attente de confirmation',
    convertedStatus: 'Statut de conversion',
    convertedToDeal: 'Converti (essai / contrat)',
    notConverted: 'Non converti',
    dailyPerformanceTitle: 'Performance Quotidienne (Aujourd’hui)',
    dailyConductedMeetings: 'RDV Effectués Aujourd’hui',
    dailyConvertedDeals: 'Contrats / essais activés',
    dailyConversionRate: 'Taux de Conversion Quotidien',
    weeklyPerformanceTitle: 'Performance Hebdomadaire (Cette Semaine)',
    weeklyTotalMeetings: 'Total RDV de la Semaine',
    weeklyConductedMeetings: 'RDV Effectués cette Semaine',
    weeklyConvertedDeals: 'Contrats conclus cette Semaine',
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
    chartLegendConverted: 'Contrats conclus',
    chartLegendConversionRate: 'Taux de Conversion (%)',
    hourlyBreakdownTitle: 'Répartition Horaire des Rendez-vous du Jour',
    starterPackage: 'Pack Starter',
    growthPackage: 'Pack Croissance',
    enterprisePackage: 'Pack Entreprise',

    adsHeaderTag: 'Campagnes publicitaires & conversion',
    adsHeaderTitle: 'Performance des campagnes publicitaires',
    adsHeaderDesc: 'Suivi des visiteurs, du taux de visionnage complet de la VSL et des pertes à chaque étape du parcours.',
    kpiTotalAdSpend: 'Budget Publicitaire Total',
    kpiLandingVisitors: 'Visiteurs de la page d’atterrissage',
    kpiVideoWatch: 'VSL visionnées intégralement',
    kpiAttendanceRateAds: 'Taux de Présence aux RDV',
    funnelSectionTitle: 'Funnel de conversion commercial',
    funnelSectionSub: 'Taux de passage et taux de chute entre chaque étape générés via Recharts',
    stepImpressions: 'Impressions publicitaires',
    stepClicks: 'Clics vers la page d’atterrissage',
    stepLanding: 'Visites de la Page',
    stepLeads: 'Formulaires Reçus',
    stepAttended: 'Présence au Rendez-vous',
    stepClosed: 'Contrats signés & MRR',

    deliveryHeaderTag: 'Déploiement des projets d’automatisation',
    deliveryHeaderTitle: "Suivi de l'Avancement et Livraison des Automatisations",
    deliveryHeaderDesc: "Ajustez le pourcentage d'avancement (%), surveillez les délais restants et activez le forfait de maintenance mensuelle dès livraison.",
    cardInBuildTitle: 'En cours de déploiement',
    cardInBuildSub: 'Automatisations & intégrations en cours de configuration',
    cardDeliveredTitle: 'Systèmes Livrés avec Succès',
    cardDeliveredSub: 'Prêts et opérationnels',
    cardTrialTitle: 'Essais gratuits en cours (7 jours)',
    cardTrialSub: 'Agences en phase de test',
    cardRetainersTitle: 'Contrats actifs',
    cardRetainersSub: 'Maintenance mensuelle active',
    deliveryTableTitle: "Suivi du déploiement des projets d’automatisation",
    deliveryTableSub: "Sélectionnez le pourcentage d'achèvement en un clic",
    colClientAgency: 'Client & Agence Immobilière',
    colPackageChosen: 'Offre Choisie',
    colStartDate: 'Date de Début',
    colTimeRemaining: 'Délai avant livraison',
    colProgressPct: 'Avancement du projet (%)',
    colActionDelivery: 'Validation Finale',
    btnCompleteDelivery: '✓ Valider la Livraison & Activer Maintenance',
    activeRetainersTableTitle: 'Agences déployées avec contrat de maintenance actif',
    activeRetainersTableSub: 'Revenu récurrent mensuel (MRR)',
    colCity: 'Ville',
    colSetupFeeCollected: 'Frais de configuration encaissés',
    colMonthlyRetainer: 'Abonnement de maintenance mensuel',
    colNextRenewal: 'Prochain Renouvellement',
    colSystemStatus: 'Statut Système',
    statusRunningLive: 'En Production & Actif',

    retainersHeaderTag: 'Contrats de maintenance & facturation',
    retainersHeaderTitle: 'Gestion des abonnements et suivi des encaissements',
    retainersHeaderDesc: 'Transmission du RIB officiel et rappels automatiques via WhatsApp pour fluidifier les encaissements.',
    ribBoxTitle: 'Coordonnées Bancaires Officielles (RIB) pour Encaissement des Forfaits',
    btnCopyRib: 'Copier le numéro RIB',
    btnCopiedRib: '✓ RIB copié dans le presse-papiers',
    btnSendWhatsAppInvoice: 'Envoyer facture & RIB par WhatsApp',
    subtabClients: 'Agences sous Contrat',
    subtabExpenses: 'Charges & rentabilité',
    subtabInvoices: 'Factures de maintenance',
    subtabTickets: 'Demandes d’assistance',

    clientsHeaderTag: 'Répertoire des agences immobilières',
    clientsHeaderTitle: 'Portefeuille clients, filtres et export',
    clientsHeaderDesc: 'Filtrez les agences par ville, offre et statut commercial.',
    btnExportCsv: 'Exporter la Liste (CSV)',
    badgeReferralPartner: 'Partenaire de recommandation',
    badgeStandardClient: 'Agence cliente',
    colContact: 'Responsable & Contact',
    colStage: 'Étape commerciale',
    colTier: 'Offre',
    colRevenue: 'Chiffre d’affaires encaissé',

    packagesHeaderTag: 'Offres et tarification',
    packagesHeaderTitle: 'Grille tarifaire des trois offres',
    packagesHeaderDesc: 'Détail des trois offres d’automatisation immobilière, des frais de configuration et de la maintenance mensuelle.',
  },

  en: {
    brandTitle: 'IBONDA Automation',
    brandTagline: 'Commercial & Operations Management Platform',
    addClientBtn: '+ Add New Client',
    searchPlaceholder: 'Search agency, city, phone...',
    notificationsTitle: 'Trial & Meeting Alerts',
    urgentTrialsAlert: '7-Day Trial Urgent Alert',
    viewDeal: 'View sales opportunity ←',
    languageSelect: 'Language',
    notificationsEmpty: 'No urgent notifications at the moment',
    alertsCount: 'alerts',

    navLeadershipGroup: 'Sales Management',
    navExecutionGroup: 'Operations & Contracts',
    navOverview: 'Overview & Performance',
    navPipeline: 'Sales Pipeline',
    navMeetings: 'Appointments & Consultations',
    navAds: 'Advertising Campaigns',
    navDelivery: 'Project Deployment',
    navRetainers: 'Maintenance Contracts',
    navClients: 'Agency Directory',
    navPackages: 'Packages & Pricing',
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
    call: 'Call',
    whatsapp: 'WhatsApp Chat',
    statusScheduled: 'Scheduled',
    statusCompleted: 'Attended',
    statusNoShow: 'No-show',
    statusTrial: 'Trial Started',
    filterByTier: 'Filter by tier:',
    filterByCity: 'Filter by city:',
    filterByStatus: 'Filter by status:',
    allTiers: 'All Packages',
    dragDropHere: 'Move opportunity here',
    changeStageBtn: 'Move to Stage ▾',
    selectTargetStage: 'Select target stage:',
    rejectionReasonLabel: 'Loss reason / notes:',

    overviewTitle: 'Overview & Performance & Agency KPIs',
    overviewSub: 'Monitor monthly recurring revenue (MRR), implementation fees, and appointment attendance',
    kpiRetainerMRR: 'Monthly Recurring Revenue (MRR)',
    kpiRetainerMRRSub: 'Predictable recurring monthly revenue',
    kpiSetupCash: 'Implementation Fees Collected',
    kpiSetupCashSub: 'Total setup, integration, and onboarding fees collected',
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
    dealsFunnelTitle: 'Sales Conversion Funnel',
    dealsFunnelSub: 'Conversion breakdown from incoming ad lead to active monthly retainer',

    pipelineHeaderTag: 'Sales Pipeline',
    pipelineHeaderTitle: 'Sales pipeline management',
    pipelineHeaderDesc: 'Track each agency from initial contact through negotiation and deal closure.',
    colAdLeadsTitle: '1. New prospect',
    colAdLeadsSub: 'New enquiries from Meta and Google campaigns',
    colMeetingsTitle: '2. Appointment scheduled',
    colMeetingsSub: 'Scheduled demo calls with agency owners',
    colAttendedTitle: '3. Appointment attended',
    colAttendedSub: 'Consultation successfully completed',
    colNoShowTitle: '4. Appointment missed',
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
    colTrialTitle: '5. 7-Day Free Trial',
    colTrialSub: 'Real-world trial of the automation service',
    colDeliveryTitle: '6. Projects in Deployment',
    colDeliverySub: 'Workflow build, testing, and CRM setup',
    colRetainerTitle: '8. Contract Signed',
    colRetainerSub: 'Commercial agreement successfully closed',
    colLostTitle: '9. Opportunity Lost',
    colLostSub: 'Loss reasons tracked for future retargeting',
    trialExpiresIn: 'Trial time remaining',
    trialUrgentWarning: 'Expires today or tomorrow!',
    btnStartTrial: '⚡ Start 7-Day Trial Now',
    btnAcceptTrial: '✓ Deal Won & Start Delivery',

    meetingsHeaderTag: 'Phase 2: Meeting Agenda & Real Estate Consultations',
    meetingsHeaderTitle: 'Appointments & consultation management',
    meetingsHeaderDesc: 'Record agency size, daily lead volume, track 7-day trials, and trigger direct phone calls or WhatsApp messages with 1 click.',
    btnAddMeeting: '+ Schedule Meeting',
    metricAvgTeam: 'Agency Team Size',
    metricAvgDailyLeads: 'Daily Inquiries',
    metricActiveTrials: 'Active 7-day trials',
    metricAttendedRate: 'Attendance Rate',
    colAgencyClient: 'Agency & primary contact',
    colDateTime: 'Meeting Date & Time',
    colCommunication: 'Communication Channel',
    colTeamLeadsProblem: 'Team size, daily enquiries & main need',
    colStatusAttendance: 'Appointment status & outcome',
    colTrialDates: 'Trial period',
    colPaymentRetainer: 'Package, payment & renewal',
    colActions: 'Actions',
    btnDirectCall: 'Call',
    btnWhatsAppChat: 'WhatsApp',
    attended: 'Attended Meeting',
    notAttended: 'No-Show (Absent)',

    // Agenda, Performance & Tasks
    subtabAgenda: 'Daily Agenda',
    subtabPerformance: 'Daily & Weekly Sales Performance',
    subtabTasks: 'Operational Tasks',
    subtabAllMeetings: 'Appointment History',
    subtabBookingHours: 'Working Hours & Booking',
    agendaTodayTitle: 'Daily Agenda & Confirmations',
    agendaTodaySub: 'Track today’s scheduled demo calls, check reminder deliveries, client confirmations, and trigger instant WhatsApp messages.',
    reminderStatus: 'Reminder Status',
    reminderSent: 'Reminder Sent',
    reminderNotSent: 'Not Sent Yet',
    confirmationStatus: 'Client Confirmation',
    confirmedByClient: 'Confirmed by Client',
    notConfirmedYet: 'Awaiting Confirmation',
    convertedStatus: 'Conversion Status',
    convertedToDeal: 'Converted to Trial/Contract',
    notConverted: 'Not Converted',
    dailyPerformanceTitle: 'Daily Meeting Performance (Today)',
    dailyConductedMeetings: 'Conducted Today',
    dailyConvertedDeals: 'Converted to Trial/Contract',
    dailyConversionRate: 'Daily Conversion Rate',
    weeklyPerformanceTitle: 'Weekly Meeting Performance (This Week)',
    weeklyTotalMeetings: 'Total Scheduled This Week',
    weeklyConductedMeetings: 'Conducted This Week',
    weeklyConvertedDeals: 'Contracts & Trials Activated',
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
    kpiVideoWatch: 'Completed VSL Views',
    kpiAttendanceRateAds: 'Meeting Attendance Rate',
    funnelSectionTitle: 'Lead-to-Appointment Funnel',
    funnelSectionSub: 'Recharts visualization of retention and drop-off percentage across all funnel stages',
    stepImpressions: 'Ad Impressions',
    stepClicks: 'Clicks',
    stepLanding: 'Landing Page Visitors',
    stepLeads: 'Form Leads',
    stepAttended: 'Meeting Attended',
    stepClosed: 'Contracts Signed (MRR)',

    deliveryHeaderTag: 'Phase 4: Project Deployment Hub',
    deliveryHeaderTitle: 'Automation Delivery Progress & Milestone Tracking',
    deliveryHeaderDesc: 'Update project completion percentages (%), track time remaining to launch, and activate recurring monthly maintenance upon delivery.',
    cardInBuildTitle: 'In Deployment',
    cardInBuildSub: 'Automation workflows & integrations being configured',
    cardDeliveredTitle: 'Delivered Projects',
    cardDeliveredSub: 'Successfully completed setups',
    cardTrialTitle: '7-Day Trials Active',
    cardTrialSub: 'Agencies testing automation',
    cardRetainersTitle: 'Active Maintenance Contracts',
    cardRetainersSub: 'Recurring maintenance revenue',
    deliveryTableTitle: 'Automation Project Delivery Tracker',
    deliveryTableSub: 'Set progress percentages with one click',
    colClientAgency: 'Client & Real Estate Agency',
    colPackageChosen: 'Selected Tier',
    colStartDate: 'Start Date',
    colTimeRemaining: 'Time to Delivery',
    colProgressPct: 'Project Completion (%)',
    colActionDelivery: 'Final Delivery Action',
    btnCompleteDelivery: '✓ Complete Delivery & Activate Retainer',
    activeRetainersTableTitle: 'Agencies with Active Maintenance Contracts',
    activeRetainersTableSub: 'Monthly Recurring Revenue (MRR)',
    colCity: 'City',
    colSetupFeeCollected: 'Implementation Fee Collected',
    colMonthlyRetainer: 'Monthly Maintenance Subscription',
    colNextRenewal: 'Next Billing Date',
    colSystemStatus: 'System Status',
    statusRunningLive: 'Live & Active',

    retainersHeaderTag: 'Maintenance Contracts & Billing',
    retainersHeaderTitle: 'Subscription Billing & Payment Follow-up',
    retainersHeaderDesc: 'Directly dispatch official bank RIB and automated invoice reminders via WhatsApp to accelerate monthly collections.',
    ribBoxTitle: 'Official Agency Bank Details (RIB) for Retainer Payments',
    btnCopyRib: 'Copy RIB Number',
    btnCopiedRib: '✓ RIB copied to clipboard',
    btnSendWhatsAppInvoice: 'Send Invoice & RIB via WhatsApp',
    subtabClients: 'Retainer Clients',
    subtabExpenses: 'Operating Costs & Profit Margin',
    subtabInvoices: 'Maintenance Invoices',
    subtabTickets: 'Support Requests',

    clientsHeaderTag: 'Real Estate Agency Directory',
    clientsHeaderTitle: 'Agency Directory & Client Portfolio',
    clientsHeaderDesc: 'Filter agencies by city, service package and commercial status.',
    btnExportCsv: 'Export Directory (CSV)',
    badgeReferralPartner: 'Referral Partner',
    badgeStandardClient: 'Standard Client',
    colContact: 'Contact Person & Phone',
    colStage: 'Sales Stage',
    colTier: 'Package Tier',
    colRevenue: 'Revenue Collected',

    packagesHeaderTag: 'Packages & Pricing',
    packagesHeaderTitle: 'Three Service Packages: Implementation & Maintenance',
    packagesHeaderDesc: 'Detailed pricing structure for setup fees and monthly ongoing maintenance across Starter, Growth, and Enterprise.',
  },
};
