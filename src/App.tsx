import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import RefundPolicyPage from "./pages/legal/RefundPolicyPage";
import TermsOfService from "./pages/legal/TermsOfService";
import CookiePolicy from "./pages/legal/CookiePolicy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/client/Dashboard";
import WalletPage from "./pages/client/Wallet";
import WithdrawPage from "./pages/client/Withdraw";
import DocumentsPage from "./pages/client/Documents";
import TransactionsPage from "./pages/client/Transactions";
import ProfilePage from "./pages/client/Profile";
import NotificationsPage from "./pages/client/Notifications";
import SupportPage from "./pages/client/Support";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import WithdrawalManagement from "./pages/admin/WithdrawalManagement";
import RefundManagement from "./pages/admin/RefundManagement";
import DocumentReview from "./pages/admin/DocumentReview";
import AdminSupport from "./pages/admin/AdminSupport";
import Analytics from "./pages/admin/Analytics";
import ActivityLog from "./pages/admin/ActivityLog";
import NotFound from "./pages/NotFound";
import AdminManagement from "./pages/admin/AdminManagement";
import ChangePassword from "./pages/admin/ChangePassword";
const queryClient = new QueryClient();

const isAdminRole = (role: string) => role === 'admin' || role === 'super_admin';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'admin' | 'client' }) => {
  const { user, loading } = useAuth();
  if (loading) return <DashboardSkeleton />;
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'admin' && !isAdminRole(user.role)) return <Navigate to="/dashboard" replace />;
  if (role === 'client' && isAdminRole(user.role)) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

const NotificationListener = () => {
  useBrowserNotifications();
  return null;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <DashboardSkeleton />;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={isAdminRole(user.role) ? '/admin' : '/dashboard'} replace /> : <Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicyPage />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookies" element={<CookiePolicy />} />
      <Route path="/login" element={user ? <Navigate to={isAdminRole(user.role) ? '/admin' : '/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Client */}
      <Route path="/dashboard" element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute role="client"><WalletPage /></ProtectedRoute>} />
      <Route path="/withdraw" element={<ProtectedRoute role="client"><WithdrawPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute role="client"><DocumentsPage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute role="client"><TransactionsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute role="client"><NotificationsPage /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute role="client"><SupportPage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/withdrawals" element={<ProtectedRoute role="admin"><WithdrawalManagement /></ProtectedRoute>} />
      <Route path="/admin/refunds" element={<ProtectedRoute role="admin"><RefundManagement /></ProtectedRoute>} />
      <Route path="/admin/documents" element={<ProtectedRoute role="admin"><DocumentReview /></ProtectedRoute>} />
      <Route path="/admin/support" element={<ProtectedRoute role="admin"><AdminSupport /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><Analytics /></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute role="admin"><ActivityLog /></ProtectedRoute>} />
      <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><NotificationsPage /></ProtectedRoute>} />
      <Route path="/admin/manage-admins" element={<ProtectedRoute role="admin"><AdminManagement /></ProtectedRoute>} />
      <Route path="/admin/change-password" element={<ProtectedRoute role="admin"><ChangePassword /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
