import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class DashboardErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown dashboard error',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('IBONDA dashboard render error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main dir="rtl" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#F1F6F7', color: '#172B30', fontFamily: 'sans-serif' }}>
          <section style={{ width: '100%', maxWidth: 520, background: '#fff', border: '1px solid #DCE8EA', borderRadius: 18, padding: 24, boxShadow: '0 8px 30px rgba(4,24,27,.08)' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>وقع خطأ أثناء تحميل لوحة التحكم</h1>
            <p style={{ margin: '0 0 12px', lineHeight: 1.8 }}>ما ضاعت حتى بيانات. هاد الرسالة كتعاوننا نحددو سبب المشكل بدل الصفحة البيضاء.</p>
            <pre dir="ltr" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', background: '#F5F8F8', padding: 12, borderRadius: 10, fontSize: 12 }}>{this.state.message}</pre>
            <button onClick={() => window.location.reload()} style={{ marginTop: 12, border: 0, borderRadius: 10, padding: '11px 18px', background: '#0B434C', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>إعادة تحميل الصفحة</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DashboardErrorBoundary>
      <App />
    </DashboardErrorBoundary>
  </React.StrictMode>
);
