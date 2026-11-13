import {
  AgencyClient,
  MeetingItem,
  AgencyTask,
  PackageConfig,
  AdCampaignMetric,
  MaintenanceInvoice,
  MaintenanceTicket,
} from '../types/agency';

export type Language = 'ar' | 'fr' | 'en';

interface LocalizedTriplet {
  ar: string;
  fr: string;
  en: string;
}

// =========================================================================
// 1. AGENCY NAMES
// =========================================================================
export const agencyNamesMap: Record<string, LocalizedTriplet> = {
  'أطلس العقارية بريميوم': {
    ar: 'أطلس العقارية بريميوم',
    fr: 'Atlas Immobilier Premium',
    en: 'Atlas Real Estate Premium',
  },
  'مجموعة النخيل برستيج': {
    ar: 'مجموعة النخيل برستيج',
    fr: 'Groupe Palmier Prestige',
    en: 'Palmier Prestige Group',
  },
  'بوغاز كابيتال العقارية': {
    ar: 'بوغاز كابيتال العقارية',
    fr: 'Détroit Capital Immobilier',
    en: 'Detroit Capital Real Estate',
  },
  'سيتي سنتر بروبيرتيز': {
    ar: 'سيتي سنتر بروبيرتيز',
    fr: 'City Center Immobilier',
    en: 'City Center Properties',
  },
  'كازا ليدينغ هومز': {
    ar: 'كازا ليدينغ هومز',
    fr: 'Casa Leading Homes',
    en: 'Casa Leading Homes',
  },
  'المنارة العقارية العاصمة': {
    ar: 'المنارة العقارية العاصمة',
    fr: 'Al Manara Immobilier Capitale',
    en: 'Al Manara Capital Real Estate',
  },
  'أكادير باي إنفست': {
    ar: 'أكادير باي إنفست',
    fr: 'Agadir Bay Invest',
    en: 'Agadir Bay Invest',
  },
  'كاب نورد كونسلتينغ': {
    ar: 'كاب نورد كونسلتينغ',
    fr: 'Cap Nord Consulting',
    en: 'Cap Nord Consulting',
  },
  'سيتي فيو العقارية': {
    ar: 'سيتي فيو العقارية',
    fr: 'City View Immobilier',
    en: 'City View Real Estate',
  },
  'سيتي فيو العقارية (City View)': {
    ar: 'سيتي فيو العقارية',
    fr: 'City View Immobilier',
    en: 'City View Real Estate',
  },
  'أندلس إيمو فاس': {
    ar: 'أندلس إيمو فاس',
    fr: 'Andalous Immo Fès',
    en: 'Andalous Immo Fez',
  },
  'ريف برستيج العقارية': {
    ar: 'ريف برستيج العقارية',
    fr: 'Rif Prestige Immobilier',
    en: 'Rif Prestige Real Estate',
  },
};

// =========================================================================
// 2. CONTACT PERSONS
// =========================================================================
export const contactPersonsMap: Record<string, LocalizedTriplet> = {
  'ياسين بنجلون': { ar: 'ياسين بنجلون', fr: 'Yassine Benjelloun', en: 'Yassine Benjelloun' },
  'عمر التازي': { ar: 'عمر التازي', fr: 'Omar Tazi', en: 'Omar Tazi' },
  'كريم العمراني': { ar: 'كريم العمراني', fr: 'Karim El Amrani', en: 'Karim El Amrani' },
  'ليلى برادة': { ar: 'ليلى برادة', fr: 'Leïla Berrada', en: 'Leila Berrada' },
  'طارق فيلالي': { ar: 'طارق فيلالي', fr: 'Tariq Filali', en: 'Tariq Filali' },
  'سارة العلمي': { ar: 'سارة العلمي', fr: 'Sara El Alami', en: 'Sara El Alami' },
  'حسن أيت باها': { ar: 'حسن أيت باها', fr: 'Hassan Ait Baha', en: 'Hassan Ait Baha' },
  'نبيل شريف': { ar: 'نبيل شريف', fr: 'Nabil Cherif', en: 'Nabil Cherif' },
  'فاطمة الزهراء الشرايبي': { ar: 'فاطمة الزهراء الشرايبي', fr: 'Fatima-Zahra Chraïbi', en: 'Fatima-Zahra Chraibi' },
  'حمزة المرابط': { ar: 'حمزة المرابط', fr: 'Hamza El Morabit', en: 'Hamza El Morabit' },
  'سفيان الريفي': { ar: 'سفيان الريفي', fr: 'Soufiane Rifi', en: 'Soufiane Rifi' },
};

// =========================================================================
// 3. CITIES (BIDIRECTIONAL: AR <-> FR <-> EN)
// =========================================================================
export const citiesMap: Record<string, LocalizedTriplet> = {
  'الدار البيضاء (أنفا)': { ar: 'الدار البيضاء (أنفا)', fr: 'Casablanca (Anfa)', en: 'Casablanca (Anfa)' },
  'الدار البيضاء (غوتيي)': { ar: 'الدار البيضاء (غوتيي)', fr: 'Casablanca (Gauthier)', en: 'Casablanca (Gauthier)' },
  'الدار البيضاء (المعاريف)': { ar: 'الدار البيضاء (المعاريف)', fr: 'Casablanca (Maârif)', en: 'Casablanca (Maarif)' },
  'الدار البيضاء': { ar: 'الدار البيضاء', fr: 'Casablanca', en: 'Casablanca' },
  'Casablanca': { ar: 'الدار البيضاء', fr: 'Casablanca', en: 'Casablanca' },
  'مراكش (جيليز)': { ar: 'مراكش (جيليز)', fr: 'Marrakech (Guéliz)', en: 'Marrakech (Gueliz)' },
  'مراكش': { ar: 'مراكش', fr: 'Marrakech', en: 'Marrakech' },
  'Marrakech': { ar: 'مراكش', fr: 'Marrakech', en: 'Marrakech' },
  'طنجة (مالاباطا)': { ar: 'طنجة (مالاباطا)', fr: 'Tanger (Malabata)', en: 'Tangier (Malabata)' },
  'طنجة (المركز)': { ar: 'طنجة (المركز)', fr: 'Tanger (Centre)', en: 'Tangier (City Center)' },
  'طنجة': { ar: 'طنجة', fr: 'Tanger', en: 'Tangier' },
  'Tanger': { ar: 'طنجة', fr: 'Tanger', en: 'Tangier' },
  'Tangier': { ar: 'طنجة', fr: 'Tanger', en: 'Tangier' },
  'الرباط (أكدال)': { ar: 'الرباط (أكدال)', fr: 'Rabat (Agdal)', en: 'Rabat (Agdal)' },
  'الرباط': { ar: 'الرباط', fr: 'Rabat', en: 'Rabat' },
  'Rabat': { ar: 'الرباط', fr: 'Rabat', en: 'Rabat' },
  'أكادير (فونتي)': { ar: 'أكادير (فونتي)', fr: 'Agadir (Founty)', en: 'Agadir (Founty)' },
  'أكادير': { ar: 'أكادير', fr: 'Agadir', en: 'Agadir' },
  'Agadir': { ar: 'أكادير', fr: 'Agadir', en: 'Agadir' },
  'فاس': { ar: 'فاس', fr: 'Fès', en: 'Fez' },
  'Fes': { ar: 'فاس', fr: 'Fès', en: 'Fez' },
  'Fès': { ar: 'فاس', fr: 'Fès', en: 'Fez' },
  'Fez': { ar: 'فاس', fr: 'Fès', en: 'Fez' },
  'تطوان': { ar: 'تطوان', fr: 'Tétouan', en: 'Tetouan' },
  'Tétouan': { ar: 'تطوان', fr: 'Tétouan', en: 'Tetouan' },
  'Tetouan': { ar: 'تطوان', fr: 'Tétouan', en: 'Tetouan' },
};

// =========================================================================
// 4. AD CAMPAIGNS & SOURCES
// =========================================================================
export const adSourcesMap: Record<string, LocalizedTriplet> = {
  'إعلانات ميتا - حملة مضاعفة المعاينات': {
    ar: 'إعلانات ميتا - حملة مضاعفة المعاينات',
    fr: 'Meta Ads - Campagne Visites Immobilières',
    en: 'Meta Ads - Property Viewing Scale Campaign',
  },
  'إعلانات غوغل - أتمتة عقارات المغرب': {
    ar: 'إعلانات غوغل - أتمتة عقارات المغرب',
    fr: 'Google Ads - Automatisation Immo Maroc',
    en: 'Google Ads - Morocco Real Estate Automation',
  },
  'إعلانات ميتا - حملة استقطاب الوكالات': {
    ar: 'إعلانات ميتا - حملة استقطاب الوكالات',
    fr: 'Meta Ads - Acquisition Agences Immobilières',
    en: 'Meta Ads - Agency Client Acquisition',
  },
  'تزكية وتوصية مباشرة': {
    ar: 'تزكية وتوصية مباشرة',
    fr: 'Recommandation Réseau Direct',
    en: 'Direct Network Referral',
  },
  'إعلانات ميتا لإعادة الاستهداف': {
    ar: 'إعلانات ميتا لإعادة الاستهداف',
    fr: 'Meta Ads - Campagne Retargeting',
    en: 'Meta Ads - Retargeting Campaign',
  },
  'إعلانات ميتا الموجهة للشركات': {
    ar: 'إعلانات ميتا الموجهة للشركات',
    fr: 'Meta Ads - Campagne B2B Agences',
    en: 'Meta Ads - B2B Real Estate Agencies',
  },
  'إعلانات ميتا - حملة حجز المعاينات': {
    ar: 'إعلانات ميتا - حملة حجز المعاينات',
    fr: 'Meta Ads - Réservation de Visites',
    en: 'Meta Ads - Property Viewings Booking',
  },
  'استمارة إعلانات ميتا الفورية': {
    ar: 'استمارة إعلانات ميتا الفورية',
    fr: 'Formulaire Instantané Meta Ads',
    en: 'Meta Ads Instant Lead Form',
  },
  'إعلانات ميتا': {
    ar: 'إعلانات ميتا',
    fr: 'Meta Ads',
    en: 'Meta Ads',
  },
  'Meta Ads': {
    ar: 'إعلانات ميتا',
    fr: 'Meta Ads',
    en: 'Meta Ads',
  },
  'Meta Ads - كيف تضمن حضور 80% من مواعيد المعاينات للوكالات': {
    ar: 'إعلانات ميتا - كيف تضمن حضور 80% من مواعيد المعاينات للوكالات',
    fr: 'Meta Ads - Garantir 80 % de présence aux visites immobilières',
    en: 'Meta Ads - Guarantee 80% Property Viewing Show-Up Rate',
  },
  'Google Search - خدمة أوتوميشن وواتساب للوكالات العقارية بالمغرب': {
    ar: 'بحث غوغل - خدمة أوتوميشن وواتساب للوكالات العقارية بالمغرب',
    fr: 'Google Search - Automatisation & WhatsApp Agences Maroc',
    en: 'Google Search - WhatsApp Automation for Morocco Agencies',
  },
  'Meta Retargeting - جرب الأوتوميشن مجاناً 7 أيام لوكالتك العقارية': {
    ar: 'إعادة استهداف ميتا - جرب الأوتوميشن مجاناً 7 أيام لوكالتك العقارية',
    fr: 'Meta Retargeting - Essai gratuit 7 jours automatisation immo',
    en: 'Meta Retargeting - 7-Day Free Agency Automation Trial',
  },
};

// =========================================================================
// 5. PROBLEMS & PAIN POINTS
// =========================================================================
export const problemsMap: Record<string, LocalizedTriplet> = {
  'تأخر الرد على رسائل واتساب وضياع مشتري الشقق الفاخرة': {
    ar: 'تأخر الرد على رسائل واتساب وضياع مشتري الشقق الفاخرة',
    fr: 'Retard de réponse sur WhatsApp et perte d’acquéreurs d’appartements de standing.',
    en: 'Slow response on WhatsApp leading to lost luxury apartment buyers.',
  },
  'صعوبة تأهيل الزبناء الأجانب لمشاريع الفلل في مراكش وتحديد الميزانية': {
    ar: 'صعوبة تأهيل الزبناء الأجانب لمشاريع الفلل في مراكش وتحديد الميزانية',
    fr: 'Difficulté à qualifier les acheteurs étrangers et vérifier les budgets pour les villas à Marrakech.',
    en: 'Difficulty qualifying foreign buyers and confirming budgets for luxury villas in Marrakech.',
  },
  'صعوبة تأهيل الزبناء الأجانب لمشاريع الفلل وتحديد الميزانية الصالحة للزيارة': {
    ar: 'صعوبة تأهيل الزبناء الأجانب لمشاريع الفلل وتحديد الميزانية الصالحة للزيارة',
    fr: 'Difficulté à qualifier les acheteurs étrangers et vérifier le budget avant la visite.',
    en: 'Difficulty qualifying foreign buyers and verifying budgets prior to villa viewings.',
  },
  'عدم حضور الزبائن لمواعيد المعاينات العقارية ونقص التذكيرات': {
    ar: 'عدم حضور الزبائن لمواعيد المعاينات العقارية ونقص التذكيرات',
    fr: 'Taux élevé d’absentéisme aux visites immobilières en l’absence de rappels automatisés.',
    en: 'High no-show rates at property viewings due to lack of automated reminders.',
  },
  'عدم حضور الزبائن لمواعيد المعاينات العقارية ونقص التذكيرات التلقائية': {
    ar: 'عدم حضور الزبائن لمواعيد المعاينات العقارية ونقص التذكيرات التلقائية',
    fr: 'Absentéisme élevé aux visites en raison du manque de rappels automatiques.',
    en: 'High viewing no-shows caused by lack of automated appointment reminders.',
  },
  'فوضى في تتبع الصفقات وربط المكالمات بملفات العقار': {
    ar: 'فوضى في تتبع الصفقات وربط المكالمات بملفات العقار',
    fr: 'Désorganisation dans le suivi des mandats et le traitement des appels entrants.',
    en: 'Disorganized deal pipeline and inability to track phone leads with listings.',
  },
  'عدم مزامنة أوقات المعاينات مع تقويم هواتف الوسطاء': {
    ar: 'عدم مزامنة أوقات المعاينات مع تقويم هواتف الوسطاء',
    fr: 'Absence de synchronisation des visites avec les agendas mobiles des agents.',
    en: 'Property viewings not synchronized with field agents’ smartphone calendars.',
  },
  'تشتت الرسائل بين واتساب الشخصي والمهني': {
    ar: 'تشتت الرسائل بين واتساب الشخصي والمهني',
    fr: 'Dispersion des demandes clients entre comptes WhatsApp personnels et pro.',
    en: 'Client inquiries scattered between personal and professional WhatsApp accounts.',
  },
  'صعوبة تأكيد المواعيد مع زبائن الجالية المقيمة بالخارج': {
    ar: 'صعوبة تأكيد المواعيد مع زبائن الجالية المقيمة بالخارج',
    fr: 'Difficultés à confirmer les rendez-vous avec la diaspora et les acheteurs internationaux.',
    en: 'Challenges confirming viewing dates with diaspora and international investors.',
  },
  'فقدان أرقام الزبناء في رسائل إنستغرام بدون متابعة سريعة': {
    ar: 'فقدان أرقام الزبناء في رسائل إنستغرام بدون متابعة سريعة',
    fr: 'Perte de coordonnées dans les messages Instagram sans prise en charge immédiate.',
    en: 'Losing buyer contact info in Instagram DMs without instant automated capture.',
  },
  'تأخر الرد على رسائل واتساب وضياع مشتري الشقق الفاخرة بالمعاريف وأنفا': {
    ar: 'تأخر الرد على رسائل واتساب وضياع مشتري الشقق الفاخرة بالمعاريف وأنفا',
    fr: 'Retard de réponse WhatsApp et perte d’acquéreurs pour Maârif et Anfa.',
    en: 'Delayed WhatsApp responses causing loss of premium buyers in Maarif & Anfa.',
  },
  'صعوبة تأكيد المواعيد مع زبائن الجالية المقيمة بالخارج وتأخر الرد في المساء': {
    ar: 'صعوبة تأكيد المواعيد مع زبائن الجالية المقيمة بالخارج وتأخر الرد في المساء',
    fr: 'Confirmation laborieuse des rendez-vous avec les MRE et absence de permanence le soir.',
    en: 'Difficulty confirming appointments with diaspora buyers and lack of evening coverage.',
  },
  'ضياع استفسارات كراء المكاتب والشقق المفروشة في المساء': {
    ar: 'ضياع استفسارات كراء المكاتب والشقق المفروشة في المساء',
    fr: 'Perte des demandes de location meublée et bureaux en soirée.',
    en: 'Lost office rental and furnished apartment inquiries during off-hours.',
  },
  'يعاني من ضياع أرقام الليدات في رسائل إنستغرام ويريد ربطها بواتساب': {
    ar: 'يعاني من ضياع أرقام الليدات في رسائل إنستغرام ويريد ربطها بواتساب',
    fr: 'Perte de leads sur Instagram et besoin urgent d’intégration WhatsApp.',
    en: 'Losing Instagram DM leads and needs automated routing directly to WhatsApp.',
  },
  'تأخر الرد في عطلات نهاية الأسبوع مما يسبب فقدان الزبائن للوكالات المنافسة': {
    ar: 'تأخر الرد في عطلات نهاية الأسبوع مما يسبب فقدان الزبائن للوكالات المنافسة',
    fr: 'Absence de réactivité les week-ends entraînant le départ des acheteurs vers la concurrence.',
    en: 'Weekend response lag causing prospective buyers to book with competitor agencies.',
  },
  'نقص في تنظيم مواعيد المعاينات': {
    ar: 'نقص في تنظيم مواعيد المعاينات',
    fr: 'Manque de structure et de rappels pour l’agenda des visites immobilières.',
    en: 'Lack of organized scheduling and automated alerts for property viewings.',
  },
};

// =========================================================================
// 6. NOTES & OUTCOMES
// =========================================================================
export const notesMap: Record<string, LocalizedTriplet> = {
  'العميل معجب جداً بسرعة الرد التلقائي عبر واتساب، تم تسجيل 14 موعداً خلال أول يومين من التجربة.': {
    ar: 'العميل معجب جداً بسرعة الرد التلقائي عبر واتساب، تم تسجيل 14 موعداً خلال أول يومين من التجربة.',
    fr: 'Client très satisfait de la réactivité WhatsApp : 14 visites enregistrées dès les 2 premiers jours d’essai.',
    en: 'Client highly impressed by instant WhatsApp reply: 14 confirmed viewings booked in first 2 trial days.',
  },
  'تنبيه: تنتهي فترة التجربة غداً! الاتصال به اليوم لتأكيد العقد النهائي وإصدار فاتورة الإعداد 16,000 درهم.': {
    ar: 'تنبيه: تنتهي فترة التجربة غداً! الاتصال به اليوم لتأكيد العقد النهائي وإصدار فاتورة الإعداد 16,000 درهم.',
    fr: 'Alerte : Essai de 7 jours se termine demain ! Appel requis pour valider le contrat final et la facture setup (16 000 MAD).',
    en: 'Alert: 7-day trial ends tomorrow! Call today to finalize retainer contract and invoice setup fee (16,000 MAD).',
  },
  'تم ربط صفحة فيسبوك ونماذج ميتا بنجاح، جاري ضبط سيناريو التقويم السحابي وتأكيد أوقات العمل.': {
    ar: 'تم ربط صفحة فيسبوك ونماذج ميتا بنجاح، جاري ضبط سيناريو التقويم السحابي وتأكيد أوقات العمل.',
    fr: 'Page Facebook et formulaires Meta connectés. Finalisation de la synchronisation de l’agenda en cours.',
    en: 'Facebook page and Meta forms linked. Finalizing cloud calendar synchronization and working hours.',
  },
  'عميل ممتاز يدفع اشتراك الصيانة 4,500 درهم بانتظام في بداية كل شهر.': {
    ar: 'عميل ممتاز يدفع اشتراك الصيانة 4,500 درهم بانتظام في بداية كل شهر.',
    fr: 'Client régulier payant l’abonnement de maintenance (4 500 MAD) au début de chaque mois.',
    en: 'Punctual key client paying monthly maintenance retainer (4,500 MAD) at the start of each month.',
  },
  'السيناريو شغال بكفاءة عالية، يرسل حوالي 40 إشعار واتساب يومياً للوسطاء.': {
    ar: 'السيناريو شغال بكفاءة عالية، يرسل حوالي 40 إشعار واتساب يومياً للوسطاء.',
    fr: 'Scénario pleinement opérationnel : envoie environ 40 notifications WhatsApp par jour aux agents.',
    en: 'Automation running smoothly: dispatching ~40 instant WhatsApp notifications daily to agents.',
  },
  'طلبت تعديل رقم واتساب المستقبل لإشعارات العملاء لتوظيف وسيطة عقارية جديدة.': {
    ar: 'طلبت تعديل رقم واتساب المستقبل لإشعارات العملاء لتوظيف وسيطة عقارية جديدة.',
    fr: 'Demande de modification du numéro WhatsApp de notification pour une nouvelle commerciale.',
    en: 'Requested update to notification WhatsApp number to onboard a newly hired sales agent.',
  },
  'موعد المكالمة اليوم على الساعة 15:30 عبر مكالمة مرئية سحابية. مهتم بأتمتة فلل أكادير وتذكيرات المعاينات.': {
    ar: 'موعد المكالمة اليوم على الساعة 15:30 عبر مكالمة مرئية سحابية. مهتم بأتمتة فلل أكادير وتذكيرات المعاينات.',
    fr: 'Rendez-vous visio aujourd’hui à 15h30. Très intéressé par l’automatisation des villas à Agadir et les rappels de visites.',
    en: 'Video consultation today at 15:30. Highly interested in Agadir luxury villas automation & reminder bot.',
  },
  'سجل في نموذج إعلانات إنستغرام، يحتاج اتصال هاتفي سريع لتأكيد موعد اللقاء الاستشاري.': {
    ar: 'سجل في نموذج إعلانات إنستغرام، يحتاج اتصال هاتفي سريع لتأكيد موعد اللقاء الاستشاري.',
    fr: 'Inscrit via formulaire Instagram : appel rapide requis pour confirmer le rendez-vous de consultation.',
    en: 'Captured via Instagram Lead Form: quick callback needed to lock in discovery consultation.',
  },
  'يريد معرفة كيف يعمل بوت واتساب لتأكيد مواعيد زيارة الفلل الفاخرة.': {
    ar: 'يريد معرفة كيف يعمل بوت واتساب لتأكيد مواعيد زيارة الفلل الفاخرة.',
    fr: 'Souhaite découvrir le fonctionnement du bot WhatsApp pour confirmer les visites de villas de luxe.',
    en: 'Wants to see how the WhatsApp bot confirms high-ticket luxury villa viewing appointments.',
  },
  'انعقد الموعد بنجاح صباح اليوم وتم تحويلها فوراً لبدء تجربة 7 أيام المجانية لباقة Growth.': {
    ar: 'انعقد الموعد بنجاح صباح اليوم وتم تحويلها فوراً لبدء تجربة 7 أيام المجانية لباقة النمو.',
    fr: 'Rendez-vous tenu ce matin avec succès : conversion immédiate vers l’essai gratuit de 7 jours (Forfait Croissance).',
    en: 'Meeting conducted successfully this morning: immediately converted to 7-Day Free Trial (Growth Package).',
  },
  'يعاني من ضياع أرقام الليدات في رسائل إنستغرام ويريد ربطها بواتساب.': {
    ar: 'يعاني من ضياع أرقام الليدات في رسائل إنستغرام ويريد ربطها بواتساب.',
    fr: 'Perd les coordonnées des prospects sur Instagram et souhaite une passerelle directe vers WhatsApp.',
    en: 'Losing Instagram lead contacts in DMs; wants automated transfer to WhatsApp.',
  },
  'أكد الموعد واقتنع بأهمية الرد خلال 60 ثانية، وافق على التجربة المجانية.': {
    ar: 'أكد الموعد واقتنع بأهمية الرد خلال 60 ثانية، وافق على التجربة المجانية.',
    fr: 'A confirmé le rendez-vous et validé l’importance de répondre sous 60s ; a accepté l’essai gratuit.',
    en: 'Confirmed appointment and agreed on the 60-second response rule; accepted free trial.',
  },
  'لم يحضر الموعد، تم إرسال رسالة واتساب لإعادة الجدولة.': {
    ar: 'لم يحضر الموعد، تم إرسال رسالة واتساب لإعادة الجدولة.',
    fr: 'Absent au rendez-vous. Message WhatsApp automatique envoyé pour reprogrammer la session.',
    en: 'No-show for meeting. Automated WhatsApp sent to reschedule.',
  },
  'مكالمة ممتازة، وافق فوراً على بدء تجربة 7 أيام المجانية لباقة Growth.': {
    ar: 'مكالمة ممتازة، وافق فوراً على بدء تجربة 7 أيام المجانية لباقة النمو.',
    fr: 'Excellente consultation : accord immédiat pour activer l’essai de 7 jours (Forfait Croissance).',
    en: 'Excellent discovery call: immediately agreed to activate 7-Day Free Trial for Growth Package.',
  },
  'اختار باقة النخبة VIP لاختبار بوت الذكاء الاصطناعي مع زبناء الفلل الأجانب.': {
    ar: 'اختار باقة النخبة الشاملة لاختبار بوت الذكاء الاصطناعي مع زبناء الفلل الأجانب.',
    fr: 'A choisi le Forfait Entreprise pour tester le bot IA avec sa clientèle internationale.',
    en: 'Selected Enterprise Package to test AI buyer qualification bot with international clients.',
  },
  'أنهى التجربة بنجاح باهر وسدد رسوم الإعداد 8,500 د.م، المشروع قيد التسليم حالياً.': {
    ar: 'أنهى التجربة بنجاح باهر وسدد رسوم الإعداد 8,500 درهم، المشروع قيد التسليم حالياً.',
    fr: 'A terminé l’essai avec succès et réglé les frais de setup (8 500 MAD). Déploiement en cours.',
    en: 'Completed trial with flying colors and paid setup fee (8,500 MAD). System build in progress.',
  },
  'تم تسجيل العميل في المنظومة': {
    ar: 'تم تسجيل العميل في المنظومة',
    fr: 'Client enregistré dans le système',
    en: 'Client registered in the system',
  },
  'Client enregistré dans le système': {
    ar: 'تم تسجيل العميل في المنظومة',
    fr: 'Client enregistré dans le système',
    en: 'Client registered in the system',
  },
};

// Detailed Client Note History Dictionary (by Note ID)
export const noteEntriesMap: Record<
  string,
  {
    ar: { title: string; content: string; author: string; outcome?: string };
    fr: { title: string; content: string; author: string; outcome?: string };
    en: { title: string; content: string; author: string; outcome?: string };
  }
> = {
  'note-cli1-1': {
    ar: {
      author: 'فريق المبيعات والاستشارات',
      title: 'ملخص جلسة الاستشارة الأولية وتحديد متطلبات الأتمتة',
      content:
        'انعقدت المكالمة الاستشارية مع السيد ياسين بنجلون. تم التطرق لمشكل تأخر الوسطاء في الإجابة على استفسارات فيسبوك وواتساب للشقق الفاخرة بأنفا. وافق على باقة النمو وبدء التجربة المجانية 7 أيام لاختبار سرعة الاستجابة اللحظية.',
      outcome: 'قبول بدء التجربة الميدانية 7 أيام لباقة النمو',
    },
    fr: {
      author: 'Équipe Ventes & Conseil',
      title: 'Compte-rendu de consultation initiale et besoins d’automatisation',
      content:
        'Appel de découverte tenu avec M. Yassine Benjelloun. Discussion autour du retard de réponse des agents sur Facebook et WhatsApp pour les appartements de standing à Anfa. Accord validé sur le forfait Croissance avec lancement de l’essai gratuit de 7 jours.',
      outcome: 'Essai gratuit de 7 jours validé (Forfait Croissance)',
    },
    en: {
      author: 'Sales & Consulting Team',
      title: 'Initial Consultation Summary & Automation Scoping',
      content:
        'Completed discovery call with Mr. Yassine Benjelloun. Addressed slow broker replies on Facebook & WhatsApp leads for luxury apartments in Anfa. Approved Growth Tier onboarding and started the 7-day live trial.',
      outcome: 'Approved 7-day live field trial on Growth package',
    },
  },
  'note-cli1-2': {
    ar: {
      author: 'مسؤول المتابعة التقنية',
      title: 'متابعة سير اليوم الثاني من التجربة المجانية',
      content:
        'تواصلنا معه عبر واتساب للتأكد من وصول كافة الإشعارات الفورية للوسطاء. أفاد بأنهم سجلوا 14 موعد معاينة مؤكد بنجاح دون أي تسرب للعملاء، وأبدى ارتياحاً كبيراً لسرعة الروبوت.',
      outcome: 'نتائج إيجابية جداً والعميل متحمس للعقد النهائي',
    },
    fr: {
      author: 'Responsable Suivi Technique',
      title: 'Suivi du Jour 2 de la période d’essai gratuit',
      content:
        'Contact via WhatsApp pour vérifier la réception des alertes instantanées par les agents. L’agence a confirmé 14 rendez-vous de visite qualifiés sans aucune perte de lead et salue la réactivité du bot.',
      outcome: 'Résultats très positifs — client prêt pour le contrat final',
    },
    en: {
      author: 'Technical Success Lead',
      title: 'Day 2 Free Trial Check-In & Performance Review',
      content:
        'Followed up via WhatsApp to confirm instant broker alerts were firing properly. Client reported 14 confirmed property viewings with zero lead leakage and praised the bot speed.',
      outcome: 'Strong trial KPIs — client eager to sign full contract',
    },
  },
  'note-cli2-1': {
    ar: {
      author: 'مستشار الحلول الرقمية',
      title: 'ملخص اجتماع دراسة مشروع فلل النخيل بمراكش',
      content:
        'اجتماع تقني مع عمر التازي. الوكالة تتلقى أكثر من 70 طلباً يومياً أغلبهم مغاربة العالم وأجانب. تم الاتفاق على نشر روبوت تأهيل ميزانية المشترين وتجهيز صفحة هبوط خاصة قبل تفعيل باقة النخبة.',
      outcome: 'تفعيل تجربة باقة النخبة الشاملة',
    },
    fr: {
      author: 'Consultant Solutions Digitales',
      title: 'Synthèse technique du projet Villas Palmier Marrakech',
      content:
        'Réunion technique avec Omar Tazi. L’agence traite plus de 70 demandes quotidiennes, principalement de la diaspora et d’acheteurs internationaux. Accord pour déployer le bot de qualification budgétaire et une landing page dédiée.',
      outcome: 'Activation de l’essai Forfait Entreprise',
    },
    en: {
      author: 'Digital Solutions Consultant',
      title: 'Technical Scoping Meeting — Marrakech Luxury Villas',
      content:
        'Technical session with Omar Tazi. Agency handles 70+ daily inquiries mostly from international and diaspora buyers. Agreed to deploy budget-qualification AI bot and dedicated landing page for Enterprise trial.',
      outcome: 'Activated Enterprise VIP trial setup',
    },
  },
  'note-cli2-2': {
    ar: {
      author: 'مدير الصفقات والإغلاق',
      title: 'مكالمة متابعة اليوم الأخير قبل انتهاء التجربة',
      content:
        'مكالمة هاتفية مع عمر التازي، أكد موافقته النهائية على إبرام العقد وتسديد رسوم الإعداد 16,000 درهم غداً صباحاً عبر تحويل بنكي.',
      outcome: 'جاهز لتوقيع العقد وسداد الفاتورة',
    },
    fr: {
      author: 'Directeur Closing & Contrats',
      title: 'Appel de suivi J-1 avant fin de l’essai',
      content:
        'Appel téléphonique avec Omar Tazi. Il a confirmé son accord définitif pour signer le contrat et régler les frais d’installation (16 000 MAD) demain matin par virement bancaire.',
      outcome: 'Prêt pour signature et règlement de la facture',
    },
    en: {
      author: 'Head of Closing',
      title: 'Final Day Trial Check-In & Contract Confirmation',
      content:
        'Phone call with Omar Tazi. Confirmed final approval to sign the Enterprise agreement and wire the 16,000 MAD setup fee tomorrow morning.',
      outcome: 'Ready to sign contract and clear setup invoice',
    },
  },
};

// =========================================================================
// 7. PACKAGES, INVOICES, TICKETS DICTIONARIES
// =========================================================================
const packagesTextMap: Record<
  string,
  {
    ar: { name: string; tagline: string; features: string[] };
    fr: { name: string; tagline: string; features: string[] };
    en: { name: string; tagline: string; features: string[] };
  }
> = {
  starter: {
    ar: {
      name: 'باقة الأساس الفعالة',
      tagline: 'مثالية للوكالات الناشئة لتأمين عدم ضياع أي عميل محتمل من الإعلانات',
      features: [
        'ربط إعلانات ميتا (فيسبوك وإنستغرام) بنماذج الاستقبال الفورية',
        'إرسال رسالة واتساب ترحيبية فورية للزبون خلال 60 ثانية',
        'إشعار فوري لمدير الوكالة برقم ومعلومات العميل الجديد',
        'صيانة شهرية: مراقبة سريان السيناريو وتحديث الرسائل الترويجية',
        'دعم فني عبر الواتساب خلال أوقات العمل الرسمية',
      ],
    },
    fr: {
      name: 'Pack Starter Efficace',
      tagline: 'Idéal pour les agences émergentes afin de ne perdre aucun prospect issu des publicités',
      features: [
        'Connexion Meta Ads (Facebook & Instagram) aux formulaires instantanés',
        'Message WhatsApp d’accueil envoyé automatiquement en moins de 60 secondes',
        'Notification immédiate au gérant avec fiche complète du prospect',
        'Maintenance mensuelle : surveillance des scénarios et mise à jour des textes',
        'Support technique WhatsApp durant les horaires d’ouverture',
      ],
    },
    en: {
      name: 'Starter Automation',
      tagline: 'Built for growing agencies to eliminate lost leads from Meta & Google ads',
      features: [
        'Connect Meta Ads (Facebook & Instagram) instant lead forms',
        'Automated welcome WhatsApp message dispatched within 60 seconds',
        'Instant manager alert with full prospect phone and details',
        'Monthly maintenance: workflow monitoring and copy updates',
        'WhatsApp technical support during business hours',
      ],
    },
  },
  growth: {
    ar: {
      name: 'باقة النمو والتوسع',
      tagline: 'الأكثر طلباً للوكالات النشطة التي تستهدف مضاعفة مواعيد المعاينات',
      features: [
        'كافة ميزات باقة الأساس + ربط وتأهيل متعدد القنوات',
        'مزامنة تقويم المعاينات العقارية مع التقويم السحابي',
        'رسائل تذكير تلقائية للعميل قبل موعد المعاينة بساعتين وبـ 15 دقيقة',
        'روبوت واتساب مبسط لتحديد ميزانية المشتري ونوع العقار المطلوب',
        'صيانة دورية أسبوعية لفحص صلاحية الرموز وتفادي أي انقطاع',
        'دعم ذو أولوية وتعديل شهري للسيناريوهات بحسب العروض الجديدة',
      ],
    },
    fr: {
      name: 'Pack Croissance & Scale',
      tagline: 'Le choix favori des agences actives souhaitant doubler leurs visites immobilières',
      features: [
        'Toutes les fonctions Starter + routage et qualification multicanal',
        'Synchronisation complète avec l’agenda cloud des visites',
        'Rappels WhatsApp automatiques 2h et 15 min avant chaque rendez-vous',
        'Bot WhatsApp de pré-qualification (budget & type de bien souhaité)',
        'Maintenance hebdomadaire des jetons API pour garantir zéro coupure',
        'Support prioritaire et ajustements mensuels selon vos nouveaux biens',
      ],
    },
    en: {
      name: 'Growth Scaling',
      tagline: 'Most popular choice for active agencies scaling confirmed property viewings',
      features: [
        'Everything in Starter + multi-channel lead qualification',
        'Full real-time synchronization with cloud viewing calendars',
        'Automated WhatsApp reminders 2 hours and 15 minutes before viewings',
        'Guided WhatsApp bot capturing buyer budget and property type',
        'Weekly API health & token checks to guarantee zero downtime',
        'Priority support and monthly workflow tweaks for new listings',
      ],
    },
  },
  enterprise: {
    ar: {
      name: 'باقة النخبة الشاملة',
      tagline: 'منظومة أتمتة كاملة مع روبوت محادثة ذكي ودعم مخصص للمؤسسات',
      features: [
        'منظومة متكاملة: إعلانات + روبوت واتساب ذكي + تقويم + صفحة هبوط مستقلة',
        'روبوت واتساب مدرب بالذكاء الاصطناعي على كافة كتالوج عقارات الوكالة',
        'إعادة استهداف تلقائية للعملاء غير المتفاعلين بعد 48 ساعة',
        'لوحة تقارير حية لمتابعة عائد الإنفاق الإعلاني وسرعة إتمام الصفقات',
        'صيانة شاملة ومراقبة حية على مدار الساعة طوال أيام الأسبوع',
        'مدير حساب أتمتة مخصص واتصال هاتفي مباشر للحالات الطارئة',
      ],
    },
    fr: {
      name: 'Pack Entreprise VIP',
      tagline: 'Écosystème complet avec assistant IA sur catalogue et accompagnement dédié',
      features: [
        'Système intégral : Publicités + Bot IA + Agenda + Landing Page dédiée',
        'Assistant WhatsApp IA entraîné sur l’ensemble de votre catalogue immobilier',
        'Relance automatique des prospects inactifs après 48 heures',
        'Tableau analytique temps réel du ROI publicitaire et vélocité de closing',
        'Supervision continue 24/7 et maintenance corrective complète',
        'Account manager dédié avec ligne téléphonique directe prioritaire',
      ],
    },
    en: {
      name: 'Enterprise VIP',
      tagline: 'Full-stack automation suite with AI catalog assistant and dedicated VIP support',
      features: [
        'All-in-one stack: Ads + AI WhatsApp Bot + Calendar + Custom Landing Page',
        'AI WhatsApp assistant trained on your complete agency property catalog',
        'Automated 48-hour follow-up sequences for non-responsive leads',
        'Live ROI dashboard tracking ad spend returns and deal velocity',
        '24/7 uptime monitoring and full preventive system maintenance',
        'Dedicated automation account manager with direct emergency line',
      ],
    },
  },
};

const ticketsTextMap: Record<string, Record<Language, { title: string; description: string }>> = {
  'tkt-1': {
    ar: {
      title: 'تغيير رقم واتساب المستلم لإشعارات الليدات',
      description: 'تم توظيف مسؤولة مبيعات جديدة ويرغبون في تحويل إشعارات نماذج الفيسبوك إلى رقمها المباشر.',
    },
    fr: {
      title: 'Changement du numéro WhatsApp récepteur des notifications',
      description: 'Recrutement d’une nouvelle commerciale : redirection souhaitée des alertes formulaires Facebook vers son numéro direct.',
    },
    en: {
      title: 'Update WhatsApp recipient number for lead alerts',
      description: 'Onboarded a new sales executive and requested routing instant Facebook form alerts to her direct phone.',
    },
  },
  'tkt-2': {
    ar: {
      title: 'إضافة مشروع سكني جديد لكتالوج الذكاء الاصطناعي',
      description: 'إدخال مواصفات مشروع "ريزيدنس النور" في قاعدة معرفة بوت الواتساب للرد التلقائي.',
    },
    fr: {
      title: 'Ajout d’un nouveau programme au catalogue IA',
      description: 'Intégration des fiches techniques du projet « Résidence Ennour » dans la base de connaissances du bot WhatsApp.',
    },
    en: {
      title: 'Add new residential project to AI knowledge base',
      description: 'Upload specifications and pricing for "Residence Ennour" into the WhatsApp AI assistant catalog.',
    },
  },
};

const expenseTextsMap: Record<string, LocalizedTriplet> = {
  'اشتراك واتساب API الرسمي': {
    ar: 'اشتراك واتساب API الرسمي',
    fr: 'Abonnement WhatsApp API Officiel',
    en: 'Official WhatsApp API Subscription',
  },
  'منصة الأتمتة والمزامنة': {
    ar: 'منصة الأتمتة والمزامنة',
    fr: 'Plateforme d’Automatisation & Sync',
    en: 'Automation & Sync Platform',
  },
  'اشتراك واتساب API متعدد اللغات': {
    ar: 'اشتراك واتساب API متعدد اللغات',
    fr: 'Abonnement WhatsApp API Multilingue',
    en: 'Multilingual WhatsApp API Subscription',
  },
  'رصيد الذكاء الاصطناعي للبوت': {
    ar: 'رصيد الذكاء الاصطناعي للبوت',
    fr: 'Crédits IA Assistant WhatsApp',
    en: 'AI Bot API Tokens & Usage',
  },
  'خادم n8n واستضافة صفحة الهبوط': {
    ar: 'خادم n8n واستضافة صفحة الهبوط',
    fr: 'Serveur n8n & Hébergement Landing Page',
    en: 'n8n Server & Landing Page Hosting',
  },
  'خطة Make.com الأساسية': {
    ar: 'خطة Make.com الأساسية',
    fr: 'Forfait Make.com Standard',
    en: 'Make.com Core Plan',
  },
  'اشتراك واتساب بيزنس API (باقة الأعمال)': {
    ar: 'اشتراك واتساب بيزنس API (باقة الأعمال)',
    fr: 'WhatsApp Business API (Forfait Pro)',
    en: 'WhatsApp Business API (Pro Tier)',
  },
  'منصة الأتمتة وتشغيل السيناريوهات': {
    ar: 'منصة الأتمتة وتشغيل السيناريوهات',
    fr: 'Moteur d’Automatisation & Scénarios',
    en: 'Automation Workflow Engine',
  },
  'رصيد الذكاء الاصطناعي للروبوت العقاري': {
    ar: 'رصيد الذكاء الاصطناعي للروبوت العقاري',
    fr: 'Consommation IA Bot Immobilier',
    en: 'Real Estate AI Assistant Usage',
  },
  'استضافة السيرفر والنطاق وشهادة الأمان': {
    ar: 'استضافة السيرفر والنطاق وشهادة الأمان',
    fr: 'Hébergement Serveur, Domaine & SSL',
    en: 'Cloud Server, Domain & SSL',
  },
  'اشتراك بوابة واتساب API': {
    ar: 'اشتراك بوابة واتساب API',
    fr: 'Passerelle WhatsApp Business API',
    en: 'WhatsApp API Gateway',
  },
  'اشتراك تشغيل سيناريوهات Make.com': {
    ar: 'اشتراك تشغيل سيناريوهات Make.com',
    fr: 'Scénarios & Opérations Make.com',
    en: 'Make.com Scenario Operations',
  },
  'استضافة ويب هوك ومزامنة التقويم': {
    ar: 'استضافة ويب هوك ومزامنة التقويم',
    fr: 'Hébergement Webhook & Sync Agenda',
    en: 'Webhook & Calendar Sync Hosting',
  },
  'خط اشتراك واتساب الأساسي': {
    ar: 'خط اشتراك واتساب الأساسي',
    fr: 'Ligne WhatsApp API Starter',
    en: 'Starter WhatsApp API Line',
  },
  'اشتراك عامل الأتمتة الشهري': {
    ar: 'اشتراك عامل الأتمتة الشهري',
    fr: 'Worker d’Automatisation Mensuel',
    en: 'Monthly Automation Worker',
  },
  'خط إشعارات فوري للوسطاء وتذكير المعاينات': {
    ar: 'خط إشعارات فوري للوسطاء وتذكير المعاينات',
    fr: 'Alertes courtiers & rappels visites',
    en: 'Instant broker alerts & viewing reminders',
  },
  'سيناريو ربط ميتا والتقويم السحابي': {
    ar: 'سيناريو ربط ميتا والتقويم السحابي',
    fr: 'Intégration Meta Ads & Agenda Cloud',
    en: 'Meta Ads & Cloud Calendar Bridge',
  },
  'حجم رسائل مرتفع للزبناء الأجانب': {
    ar: 'حجم رسائل مرتفع للزبناء الأجانب',
    fr: 'Volume élevé pour acheteurs internationaux',
    en: 'High message volume for international buyers',
  },
  'تأهيل المشترين ومراجعة كتالوج الفلل': {
    ar: 'تأهيل المشترين ومراجعة كتالوج الفلل',
    fr: 'Qualification des acheteurs & catalogue villas',
    en: 'Buyer qualification & villa catalog queries',
  },
  'تغطية 90 استفسار يومياً مع رسائل القوالب المعتمدة': {
    ar: 'تغطية 90 استفسار يومياً مع رسائل القوالب المعتمدة',
    fr: 'Couverture de 90 demandes/jour avec modèles Meta',
    en: 'Covers 90 daily inquiries with approved templates',
  },
  'تحليل طلبات المشترين والرد التلقائي على الكتالوج': {
    ar: 'تحليل طلبات المشترين والرد التلقائي على الكتالوج',
    fr: 'Analyse des demandes & réponses catalogue IA',
    en: 'Lead analysis & automated catalog responses',
  },
};

// =========================================================================
// 8. FALLBACK TRANSLITERATION / CLEANUP FOR CUSTOM USER-CREATED ARABIC TEXT
// =========================================================================
const ARABIC_CHAR_REGEX = /[\u0600-\u06FF]/;

const ARABIC_TO_LATIN_MAP: Record<string, string> = {
  'أ': 'A', 'إ': 'I', 'آ': 'A', 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'ة': 'a', 'و': 'o', 'ي': 'y', 'ى': 'a', 'ئ': 'i', 'ؤ': 'o',
  'ء': '', 'َ': 'a', 'ُ': 'o', 'ِ': 'i', 'ْ': '', 'ّ': '', 'ً': 'an',
  '،': ',', '؛': ';', '؟': '?', 'ـ': '',
};

const CUSTOM_PHRASE_REPLACEMENTS: Array<[RegExp, string, string]> = [
  [/الدار البيضاء/g, 'Casablanca', 'Casablanca'],
  [/مراكش/g, 'Marrakech', 'Marrakech'],
  [/طنجة/g, 'Tanger', 'Tangier'],
  [/الرباط/g, 'Rabat', 'Rabat'],
  [/أكادير/g, 'Agadir', 'Agadir'],
  [/فاس/g, 'Fès', 'Fez'],
  [/تطوان/g, 'Tétouan', 'Tetouan'],
  [/العقارية/g, 'Immobilier', 'Real Estate'],
  [/عقارات/g, 'Immobilier', 'Real Estate'],
  [/عقارية/g, 'Immobilière', 'Real Estate'],
  [/مجموعة/g, 'Groupe', 'Group'],
  [/وكالة/g, 'Agence', 'Agency'],
  [/شركة/g, 'Société', 'Company'],
  [/واتساب/g, 'WhatsApp', 'WhatsApp'],
  [/إعلانات ميتا/g, 'Meta Ads', 'Meta Ads'],
  [/ميتا/g, 'Meta', 'Meta'],
  [/فيسبوك/g, 'Facebook', 'Facebook'],
  [/إنستغرام/g, 'Instagram', 'Instagram'],
  [/غوغل|جوجل/g, 'Google', 'Google'],
  [/موعد/g, 'Rendez-vous', 'Meeting'],
  [/اجتماع/g, 'Réunion', 'Meeting'],
  [/ملخص/g, 'Compte-rendu', 'Summary'],
  [/متابعة/g, 'Suivi', 'Follow-up'],
  [/تجربة/g, 'Essai', 'Trial'],
  [/تذكير/g, 'Rappel', 'Reminder'],
  [/فريق العمل/g, 'Équipe', 'Agency Staff'],
  [/فريق المتابعة والاستشارات/g, 'Équipe Conseil & Suivi', 'Consulting Team'],
  [/فريق/g, 'Équipe', 'Team'],
  [/مشاريع/g, 'Projets', 'Projects'],
  [/درهم/g, 'MAD', 'MAD'],
  [/د\.م/g, 'MAD', 'MAD'],
];

export function fallbackCleanForLatin(text: string, lang: 'fr' | 'en'): string {
  if (!ARABIC_CHAR_REGEX.test(text)) return text;

  let processed = text;
  for (const [pattern, frRep, enRep] of CUSTOM_PHRASE_REPLACEMENTS) {
    processed = processed.replace(pattern, lang === 'fr' ? frRep : enRep);
  }

  if (!ARABIC_CHAR_REGEX.test(processed)) return processed;

  // Transliterate any remaining Arabic tokens word-by-word with clean title casing
  return processed
    .split(/(\s+)/)
    .map((token) => {
      if (!ARABIC_CHAR_REGEX.test(token)) return token;
      let out = '';
      for (const ch of token) {
        out += ARABIC_TO_LATIN_MAP[ch] ?? ch;
      }
      if (!out) return '';
      return out.charAt(0).toUpperCase() + out.slice(1);
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function pickFromTriplet(triplet: LocalizedTriplet | undefined, original: string, lang: Language): string {
  if (triplet) return triplet[lang];
  if (lang === 'ar') return original;
  return fallbackCleanForLatin(original, lang);
}

// =========================================================================
// 9. EXPORTED LOCALIZERS
// =========================================================================
export const localizeAgencyName = (name: string, lang: Language): string => {
  return pickFromTriplet(agencyNamesMap[name], name, lang);
};

export const localizeContactPerson = (person: string, lang: Language): string => {
  return pickFromTriplet(contactPersonsMap[person], person, lang);
};

export const localizeCity = (city: string, lang: Language): string => {
  if (!city) return '';
  if (citiesMap[city]) return citiesMap[city][lang];
  // Match partial city if district or extra text exists
  const trimmed = city.trim();
  if (citiesMap[trimmed]) return citiesMap[trimmed][lang];
  if (lang === 'ar') {
    for (const [key, val] of Object.entries(citiesMap)) {
      if (trimmed.toLowerCase() === key.toLowerCase()) return val.ar;
    }
    return trimmed;
  }
  return fallbackCleanForLatin(trimmed, lang);
};

export const localizeAdSource = (source: string, lang: Language): string => {
  if (!source) return '';
  return pickFromTriplet(adSourcesMap[source], source, lang);
};

export const localizeProblem = (problem: string | undefined, lang: Language): string => {
  if (!problem) return '';
  return pickFromTriplet(problemsMap[problem], problem, lang);
};

export const localizeNote = (note: string | undefined, lang: Language): string => {
  if (!note) return '';
  return pickFromTriplet(notesMap[note], note, lang);
};

export const localizeText = (text: string | undefined | null, lang: Language): string => {
  if (!text) return '';
  if (notesMap[text]) return notesMap[text][lang];
  if (problemsMap[text]) return problemsMap[text][lang];
  if (adSourcesMap[text]) return adSourcesMap[text][lang];
  if (agencyNamesMap[text]) return agencyNamesMap[text][lang];
  if (contactPersonsMap[text]) return contactPersonsMap[text][lang];
  if (citiesMap[text]) return citiesMap[text][lang];
  if (lang === 'ar') return text;
  return fallbackCleanForLatin(text, lang);
};

export const localizeClient = (client: AgencyClient, lang: Language): AgencyClient => {
  const localizedNotesHistory = client.noteHistory?.map((n) => {
    const preset = noteEntriesMap[n.id];
    if (preset) {
      const p = preset[lang];
      return {
        ...n,
        title: p.title,
        content: p.content,
        author: p.author,
        outcome: p.outcome ?? n.outcome,
      };
    }

    return {
      ...n,
      title: localizeText(n.title, lang),
      content: localizeText(n.content, lang),
      author: localizeText(n.author, lang),
      outcome: n.outcome ? localizeText(n.outcome, lang) : undefined,
    };
  });

  const localizedExpenses = client.expenses?.map((exp) => ({
    ...exp,
    name: pickFromTriplet(expenseTextsMap[exp.name], exp.name, lang),
    notes: exp.notes ? pickFromTriplet(expenseTextsMap[exp.notes], exp.notes, lang) : undefined,
  }));

  return {
    ...client,
    agencyName: localizeAgencyName(client.agencyName, lang),
    contactPerson: localizeContactPerson(client.contactPerson, lang),
    city: localizeCity(client.city, lang),
    adSource: localizeAdSource(client.adSource, lang),
    mainProblem: localizeProblem(client.mainProblem, lang),
    notes: localizeNote(client.notes, lang),
    noteHistory: localizedNotesHistory,
    expenses: localizedExpenses,
  };
};

export const localizeMeeting = (meeting: MeetingItem, lang: Language): MeetingItem => {
  return {
    ...meeting,
    agencyName: localizeAgencyName(meeting.agencyName, lang),
    clientName: localizeContactPerson(meeting.clientName, lang),
    city: localizeCity(meeting.city, lang),
    mainProblem: localizeProblem(meeting.mainProblem, lang),
    meetingNotes: localizeNote(meeting.meetingNotes, lang),
  };
};

const tasksMap: Record<string, Record<Language, { title: string; desc: string }>> = {
  'task-1': {
    ar: {
      title: 'إرسال تذكير واتساب للموعد قبل ساعتين (حسن أيت باها)',
      desc: 'مكالمة استشارة باقة النمو للربع الأخير بخصوص أتمتة عقارات أكادير',
    },
    fr: {
      title: 'Envoyer rappel WhatsApp 2h avant le rendez-vous (Hassan Ait Baha)',
      desc: 'Consultation Forfait Croissance pour l’automatisation des villas à Agadir.',
    },
    en: {
      title: 'Send WhatsApp reminder 2 hours prior to meeting (Hassan Ait Baha)',
      desc: 'Growth package consultation for real estate automation in Agadir.',
    },
  },
  'task-2': {
    ar: {
      title: 'مكالمة هاتفية لإغلاق عقد باقة النخبة الشاملة ومتابعة نهاية التجربة (7 أيام)',
      desc: 'تنتهي فترة التجربة غداً! إرسال العقد وفاتورة الإعداد 16,000 درهم لعمر التازي',
    },
    fr: {
      title: 'Appel de closing Forfait Entreprise et fin d’essai de 7 jours',
      desc: 'Fin d’essai demain ! Envoi du contrat final et facture de setup (16 000 MAD) à Omar Tazi.',
    },
    en: {
      title: 'Closing call for Enterprise Package & 7-Day Trial conclusion',
      desc: 'Trial ends tomorrow! Send agreement & setup invoice (16,000 MAD) to Omar Tazi.',
    },
  },
  'task-3': {
    ar: {
      title: 'ربط مزامنة تقويم المعاينات السحابي وتأكيد أوقات العمل',
      desc: 'إكمال السيناريو لمشروع تسليم بوغاز كابيتال العقارية في طنجة (نسبة الإنجاز 65%)',
    },
    fr: {
      title: 'Finaliser la synchronisation calendrier et plages horaires',
      desc: 'Projet de livraison Détroit Capital Immobilier à Tanger (Progression 65%).',
    },
    en: {
      title: 'Finalize calendar sync & operating hours configuration',
      desc: 'Delivery project for Detroit Capital Real Estate in Tangier (65% completed).',
    },
  },
  'task-4': {
    ar: {
      title: 'متابعة سداد فاتورة الصيانة الشهرية (1,200 درهم)',
      desc: 'فاتورة صيانة الباقة الأساسية معلقة للمنارة العقارية العاصمة',
    },
    fr: {
      title: 'Suivi du règlement de l’abonnement de maintenance (1 200 MAD)',
      desc: 'Facture maintenance forfait Starter en attente pour Al Manara Capitale.',
    },
    en: {
      title: 'Follow up on monthly maintenance retainer payment (1,200 MAD)',
      desc: 'Pending Starter retainer invoice for Al Manara Capital Real Estate.',
    },
  },
  'task-5': {
    ar: {
      title: 'تأكيد موعد مكالمة الغد مع نبيل شريف (كاب نورد كونسلتينغ)',
      desc: 'موعد مسجل عبر نماذج إنستغرام لمناقشة أوتوميشن استقبال العملاء المحتملين',
    },
    fr: {
      title: 'Confirmer l’appel de demain avec Nabil Cherif (Cap Nord)',
      desc: 'Rendez-vous via formulaire Instagram pour l’automatisation de capture de leads.',
    },
    en: {
      title: 'Confirm tomorrow’s call with Nabil Cherif (Cap Nord Consulting)',
      desc: 'Lead captured via Instagram forms to discuss instant lead qualification.',
    },
  },
  'task-6': {
    ar: {
      title: 'مراجعة حملة إعلانات ميتا (حملة مضاعفة المعاينات للربع الأخير)',
      desc: 'التأكد من تكلفة استقطاب العميل ومعدل التفاعل في إعلانات الدار البيضاء ومراكش',
    },
    fr: {
      title: 'Revue de la campagne Meta Ads (Campagne Visites Q4)',
      desc: 'Vérification du coût par prospect (CPL) et CTR pour Casablanca et Marrakech.',
    },
    en: {
      title: 'Review Meta Ads campaign performance (Q4 Viewings Scaling)',
      desc: 'Audit CPL and CTR metrics for Casablanca and Marrakech ad sets.',
    },
  },
};

export const localizeTask = (task: AgencyTask, lang: Language): AgencyTask => {
  const localizedData = tasksMap[task.id]?.[lang];
  if (localizedData) {
    return {
      ...task,
      title: localizedData.title,
      description: localizedData.desc,
      relatedAgencyName: task.relatedAgencyName ? localizeAgencyName(task.relatedAgencyName, lang) : undefined,
    };
  }

  return {
    ...task,
    title: localizeText(task.title, lang),
    description: task.description ? localizeText(task.description, lang) : undefined,
    relatedAgencyName: task.relatedAgencyName ? localizeAgencyName(task.relatedAgencyName, lang) : undefined,
  };
};

export const localizePackage = (pkg: PackageConfig, lang: Language): PackageConfig => {
  const data = packagesTextMap[pkg.id]?.[lang];
  if (!data) return pkg;
  return {
    ...pkg,
    name: data.name,
    nameAr: data.name,
    tagline: data.tagline,
    features: data.features,
  };
};

export const localizeCampaign = (campaign: AdCampaignMetric, lang: Language): AdCampaignMetric => {
  return {
    ...campaign,
    campaignName: localizeAdSource(campaign.campaignName, lang),
  };
};

export const localizeInvoice = (invoice: MaintenanceInvoice, lang: Language): MaintenanceInvoice => {
  return {
    ...invoice,
    agencyName: localizeAgencyName(invoice.agencyName, lang),
  };
};

export const localizeTicket = (ticket: MaintenanceTicket, lang: Language): MaintenanceTicket => {
  const data = ticketsTextMap[ticket.id]?.[lang];
  return {
    ...ticket,
    agencyName: localizeAgencyName(ticket.agencyName, lang),
    title: data ? data.title : localizeText(ticket.title, lang),
    description: data ? data.description : localizeText(ticket.description, lang),
  };
};
