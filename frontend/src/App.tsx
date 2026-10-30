import { lazy, Suspense } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Shell } from './components/Shell';
import { Empty, Skeleton } from './components/ui';
import { GlowCard } from './components/fx';
import Dashboard from './pages/Dashboard';
import { Login, Register } from './pages/Auth';

// Các trang còn lại tách bundle riêng để vào trang đầu nhanh hơn
const Transactions = lazy(() => import('./pages/Transactions'));
const Budgets = lazy(() => import('./pages/Budgets'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));

function RequireAuth() {
  const { user } = useAuth();
  return user ? <Shell /> : <Navigate to="/login" replace />;
}

const Fallback = () => <div><Skeleton w={280} h={36} r={12} className="mb-3" /><Skeleton h={200} r={26} /></div>;

function NotFound() {
  return <GlowCard><Empty icon={Compass} title="Không tìm thấy trang này" text="Đường dẫn có thể đã đổi hoặc không tồn tại." action={<Link to="/dashboard" className="btn btn--primary btn--sm">Về trang tổng quan</Link>} /></GlowCard>;
}

export default function App() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Navigate to="/settings/category" replace />} />
          <Route path="/settings/:tab" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </Suspense>
  );
}
