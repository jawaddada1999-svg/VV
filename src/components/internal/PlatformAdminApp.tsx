import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, BarChart3, Building2, CalendarDays, ChartNoAxesCombined,
  ClipboardList, CreditCard, FileText, Globe, LayoutDashboard, LogOut,
  Menu, MessageSquare, Settings, ShieldCheck, Users, X, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { InternalProvider, useInternal } from '../../context/InternalContext';
import { OverviewTab } from './OverviewTab';
import { ClientsTab } from './ClientsTab';
import { PlatformAppointmentsTab } from './PlatformAppointmentsTab';
import { PlatformCrmTab } from './PlatformCrmTab';
import { LandingPagesTab } from './LandingPagesTab';
import { AdsAnalyticsTab } from './AdsAnalyticsTab';
import { AutomationTab } from './AutomationTab';
import { FinanceTab } from './FinanceTab';
import { GrowthTab } from './GrowthTab';
import { ReportsTab } from './ReportsTab';
import { PlatformHealthTab } from './PlatformHealthTab';
import { SettingsTab } from './SettingsTab';
import { GlobalFilterBar } from './GlobalFilterBar';
import { TopAlertBanner } from './TopAlertBanner';

type AccessState = 'checking' | 'allowed' | 'denied' | 'error';

const navItems = [
  { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'clients', label: 'الوكالات', icon: Building2 },
  { id: 'appointments', label: 'المواعيد', icon: CalendarDays },
  { id: 'crm', label: 'CRM والمنظومة', icon: Users },
  { id: 'landing', label: 'Landing Pages', icon: Globe },
  { id: 'ads', label: 'تحليلات الإعلانات', icon: ChartNoAxesCombined },
  { id: 'automation', label: 'الأوتوميشن', icon: Zap },
  { id: 'finance', label: 'المالية والاشتراكات', icon: CreditCard },
  { id: 'growth', label: 'النمو والعملاء المحتملون', icon: BarChart3 },
  { id: 'reports', label: 'التقارير', icon: FileText },
  { id: 'health', label: 'حالة المنصة', icon: Activity },
  { id: 'settings', label: 'الإعدادات', icon: Settings },
];

const LoginScreen: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.error) setError('تعذر تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور، ثم حاول مجدداً.');
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#061F25] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0F5662] to-[#082F36] border border-white/10 flex items-center justify-center shadow-xl">
            <ShieldCheck className="w-7 h-7 text-[#FF8A3D]" />
          </div>
          <p className="text-[#FF8A3D] text-xs font-bold tracking-[0.22em]">IBONDA PLATFORM</p>
          <h1 className="text-white text-2xl font-bold mt-2">لوحة التحكم المركزية</h1>
          <p className="text-slate-400 text-sm mt-2">سجّل الدخول بحساب Super Admin للمتابعة</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
            <input id="admin-email" type="email" autoComplete="username" required value={email}
              onChange={e => setEmail(e.target.value)} placeholder="name@example.com"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#0F5662] focus:ring-4 focus:ring-[#0F5662]/10" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#0F5662] focus:ring-4 focus:ring-[#0F5662]/10" />
          </div>
          {error && <p role="alert" className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>}
          <button type="submit" disabled={busy} className="w-full h-12 rounded-xl bg-[#0B434C] hover:bg-[#0F5662] disabled:opacity-60 text-white font-bold transition-colors">
            {busy ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
          <button type="button" onClick={async () => {
            setError('');
            if (!email.trim()) {
              setError('دخل البريد الإلكتروني أولاً باش نصيفطو ليك رابط الاسترجاع.');
              return;
            }
            if (!supabase) {
              setError('إعدادات Supabase غير مكتملة.');
              return;
            }
            setBusy(true);
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
              redirectTo: 'https://vv-p9yk1vvw8-jawaddada1999-svgs-projects.vercel.app/admin?reset=1',
            });
            setBusy(false);
            if (resetError) setError('ما قدرناش نصيفطو رابط الاسترجاع. تأكد من إعدادات البريد الإلكتروني وحاول مجدداً.');
            else setError('تم إرسال رابط استرجاع كلمة المرور إلى بريدك الإلكتروني. تفقد صندوق الوارد والرسائل غير المرغوب فيها.');
          }} disabled={busy} className="w-full text-sm font-semibold text-[#0B5964] hover:underline disabled:opacity-60">
            نسيت كلمة المرور؟
          </button>
          <p className="text-[11px] text-slate-400 text-center">الدخول مخصص للحسابات المصرح بها فقط.</p>
        </form>
      </div>
    </main>
  );
};

const ResetPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password.length < 8) {
      setError('كلمة المرور خاصها تكون على الأقل 8 أحرف.');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }
    if (!supabase) {
      setError('إعدادات Supabase غير مكتملة.');
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError('تعذر تغيير كلمة المرور. افتح رابط الاسترجاع من آخر رسالة وصلاتك، أو طلب رابطاً جديداً.');
      return;
    }
    setMessage('تبدلات كلمة المرور بنجاح. يمكنك الآن الدخول إلى لوحة IBONDA.');
    window.history.replaceState({}, document.title, '/admin');
    window.setTimeout(() => window.location.reload(), 1800);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[#061F25] flex items-center justify-center px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="text-center mb-2">
          <div className="text-[#FF8A3D] text-xs font-bold tracking-[0.22em]">IBONDA PLATFORM</div>
          <h1 className="text-slate-900 text-2xl font-bold mt-2">تعيين كلمة مرور جديدة</h1>
          <p className="text-slate-500 text-sm mt-2">اختَر كلمة مرور جديدة وآمنة لحساب الإدارة.</p>
        </div>
        <div>
          <label htmlFor="new-admin-password" className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور الجديدة</label>
          <input id="new-admin-password" type="password" autoComplete="new-password" minLength={8} required value={password}
            onChange={e => setPassword(e.target.value)} placeholder="8 أحرف على الأقل"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#0F5662] focus:ring-4 focus:ring-[#0F5662]/10" />
        </div>
        <div>
          <label htmlFor="confirm-admin-password" className="block text-sm font-bold text-slate-700 mb-2">تأكيد كلمة المرور</label>
          <input id="confirm-admin-password" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} placeholder="أعد كتابة كلمة المرور"
            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:border-[#0F5662] focus:ring-4 focus:ring-[#0F5662]/10" />
        </div>
        {error && <p role="alert" className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">{error}</p>}
        {message && <p role="status" className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">{message}</p>}
        <button type="submit" disabled={busy} className="w-full h-12 rounded-xl bg-[#0B434C] hover:bg-[#0F5662] disabled:opacity-60 text-white font-bold transition-colors">
          {busy ? 'جارٍ حفظ كلمة المرور...' : 'حفظ كلمة المرور الجديدة'}
        </button>
      </form>
    </main>
  );
};

const AccessGate: React.FC = () => {
  const { user, loading, configured, signOut } = useAuth();
  const [access, setAccess] = useState<AccessState>('checking');
  const [accessError, setAccessError] = useState('');
  const isPasswordRecovery = new URLSearchParams(window.location.search).get('reset') === '1';

  useEffect(() => {
    let active = true;
    if (loading) return;
    if (!user) {
      setAccess('denied');
      return;
    }
    if (!supabase) {
      setAccessError('إعدادات Supabase غير مكتملة في هذا النشر.');
      setAccess('error');
      return;
    }
    setAccess('checking');
    supabase.rpc('is_platform_admin').then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setAccessError('تعذر التحقق من صلاحيات الحساب. لم يتم فتح لوحة الإدارة حفاظاً على الأمان.');
        setAccess('error');
      } else if (data === true) {
        setAccess('allowed');
      } else {
        setAccess('denied');
      }
    });
    return () => { active = false; };
  }, [user, loading, configured]);

  if (isPasswordRecovery) {
    if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-600" dir="rtl">جارٍ التحقق من رابط الاسترجاع...</div>;
    if (!user) return <main dir="rtl" className="min-h-screen bg-[#061F25] flex items-center justify-center p-6"><div className="max-w-md bg-white rounded-2xl p-6 text-center"><h2 className="font-bold text-slate-900 text-lg">رابط الاسترجاع غير صالح أو انتهت صلاحيته</h2><p className="text-sm text-slate-600 mt-2">ارجع لصفحة الدخول واطلب رابط استرجاع جديد.</p><a href="/admin" className="inline-block mt-5 px-4 py-2 rounded-lg bg-[#0B434C] text-white text-sm">العودة لتسجيل الدخول</a></div></main>;
    return <ResetPasswordScreen />;
  }
  if (loading || access === 'checking') {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-600" dir="rtl">جارٍ التحقق من الجلسة والصلاحيات...</div>;
  }
  if (!user) return <LoginScreen />;
  if (access === 'error') {
    return <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-slate-50"><div className="max-w-lg bg-white border border-amber-200 rounded-2xl p-6 text-center"><ShieldCheck className="w-9 h-9 text-amber-600 mx-auto mb-3"/><h2 className="font-bold text-slate-900 text-lg">تعذر التحقق من الصلاحيات</h2><p className="text-sm text-slate-600 mt-2">{accessError}</p><button onClick={() => void signOut()} className="mt-5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">تسجيل الخروج</button></div></div>;
  }
  if (access === 'denied') {
    return <div dir="rtl" className="min-h-screen flex items-center justify-center p-6 bg-slate-50"><div className="max-w-lg bg-white border border-slate-200 rounded-2xl p-6 text-center"><ShieldCheck className="w-9 h-9 text-rose-600 mx-auto mb-3"/><h2 className="font-bold text-slate-900 text-lg">هذا الحساب لا يملك صلاحية الإدارة</h2><p className="text-sm text-slate-600 mt-2">تم تسجيل الدخول، لكن حسابك غير مسجل كمسؤول في منصة IBONDA.</p><button onClick={() => void signOut()} className="mt-5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">تسجيل الخروج</button></div></div>;
  }
  return <InternalProvider><PlatformDashboard /></InternalProvider>;
};

const PlatformDashboard: React.FC = () => {
  const { activeTab, setActiveTab, adminUser } = useInternal();
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = useMemo(() => navItems.find(item => item.id === activeTab) ?? navItems[0], [activeTab]);
  const content = (() => {
    switch (activeTab) {
      case 'clients': return <ClientsTab />;
      case 'appointments': return <PlatformAppointmentsTab />;
      case 'crm': return <PlatformCrmTab />;
      case 'landing': return <LandingPagesTab />;
      case 'ads': return <AdsAnalyticsTab />;
      case 'automation': return <AutomationTab />;
      case 'finance': return <FinanceTab />;
      case 'growth': return <GrowthTab />;
      case 'reports': return <ReportsTab />;
      case 'health': return <PlatformHealthTab />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab />;
    }
  })();

  const sidebar = (
    <aside className="h-full w-72 bg-[#06252A] text-white flex flex-col">
      <div className="h-20 px-5 flex items-center border-b border-white/10">
        <div className="h-10 w-10 rounded-xl bg-[#0F5662] flex items-center justify-center text-[#FF8A3D] font-black text-lg">IB</div>
        <div className="mr-3"><div className="font-black tracking-[0.16em] text-white">IBONDA</div><div className="text-[10px] text-slate-400 mt-0.5">PLATFORM CONTROL</div></div>
      </div>
      <div className="px-4 py-4 border-b border-white/10">
        <div className="text-[10px] text-slate-400 mb-1">مساحة الإدارة</div>
        <div className="text-sm font-bold">لوحة التحكم المركزية</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const selected = activeTab === item.id;
          return <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${selected ? 'bg-[#0F5662] text-white shadow-lg' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <Icon className={`w-4 h-4 ${selected ? 'text-[#FF8A3D]' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </button>;
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white font-bold truncate">{adminUser.name}</div>
        <div className="text-[10px] text-slate-400 truncate mt-1">{adminUser.email}</div>
        <button onClick={() => void signOut()} className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 hover:bg-white/10 py-2.5 text-xs text-slate-200"><LogOut className="w-4 h-4"/> تسجيل الخروج</button>
      </div>
    </aside>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-[#F5F7F8] text-slate-900 flex">
      <div className="hidden lg:block fixed inset-y-0 right-0 z-30">{sidebar}</div>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="إغلاق القائمة" className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)}/><div className="absolute inset-y-0 right-0">{sidebar}</div></div>}
      <main className="min-w-0 flex-1 lg:mr-72">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-7 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="فتح القائمة"><Menu className="w-5 h-5"/></button>
            <div className="min-w-0"><div className="text-[10px] text-slate-400">IBONDA / PLATFORM</div><h1 className="font-bold text-base truncate">{activeItem.label}</h1></div>
          </div>
          <div className="flex items-center gap-2"><span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-[10px] font-bold text-amber-800"><ClipboardList className="w-3.5 h-3.5"/> وضع المعاينة ببيانات تجريبية</span><button onClick={() => void signOut()} className="lg:hidden p-2 rounded-lg hover:bg-slate-100" aria-label="تسجيل الخروج"><LogOut className="w-4 h-4"/></button></div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-5">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-xs leading-6">
            <strong>ملاحظة مهمة:</strong> هذه معاينة للواجهة الحالية ببيانات تجريبية محفوظة محلياً. عمليات الوكالات والاشتراكات لم تُربط بعد بقاعدة بيانات Supabase، ولن نعرضها كبيانات حقيقية حتى نكمل الربط.
          </div>
          <TopAlertBanner />
          <GlobalFilterBar />
          {content}
        </div>
      </main>
    </div>
  );
};

export const PlatformAdminApp: React.FC = () => <AccessGate />;
