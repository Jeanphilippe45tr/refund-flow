import {
  LayoutDashboard, Wallet, ArrowDownCircle, History, User, LifeBuoy, Bell,
  Users, CreditCard, RefreshCw, BarChart3, Shield, LogOut, Zap, FileCheck, FileText,
  UserPlus, Lock, Receipt, PenTool,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();

  const clientItems = [
    { title: t('sidebar.dashboard'), url: '/dashboard', icon: LayoutDashboard },
    { title: t('sidebar.wallet'), url: '/wallet', icon: Wallet },
    { title: t('sidebar.withdraw'), url: '/withdraw', icon: ArrowDownCircle },
    { title: t('sidebar.documents'), url: '/documents', icon: FileText },
    { title: t('sidebar.transactions'), url: '/transactions', icon: History },
    { title: t('sidebar.notifications'), url: '/notifications', icon: Bell },
    { title: t('sidebar.support'), url: '/support', icon: LifeBuoy },
    { title: t('sidebar.profile'), url: '/profile', icon: User },
  ];

  const adminItems = [
    { title: t('sidebar.dashboard'), url: '/admin', icon: LayoutDashboard },
    { title: t('sidebar.users'), url: '/admin/users', icon: Users },
    { title: t('sidebar.withdrawals'), url: '/admin/withdrawals', icon: CreditCard },
    { title: t('sidebar.refunds'), url: '/admin/refunds', icon: RefreshCw },
    { title: t('sidebar.documents'), url: '/admin/documents', icon: FileCheck },
    { title: t('sidebar.supportTickets'), url: '/admin/support', icon: LifeBuoy },
    { title: t('sidebar.analytics'), url: '/admin/analytics', icon: BarChart3 },
    { title: t('sidebar.activityLog'), url: '/admin/logs', icon: Shield },
    { title: t('sidebar.notifications'), url: '/admin/notifications', icon: Bell },
    ...(user?.role === 'super_admin' ? [{ title: language === 'fr' ? 'Gérer les admins' : 'Manage Admins', url: '/admin/manage-admins', icon: UserPlus }] : []),
    { title: language === 'fr' ? 'Mot de passe' : 'Change Password', url: '/admin/change-password', icon: Lock },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const items = isAdmin ? adminItems : clientItems;

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent className="pt-4">
        <div className={`px-4 mb-6 ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-2">
            <img src="/RefunPayPro-logo.png" alt="RefundPayPro" className="h-8 w-auto" />
            {!collapsed && <span className="text-lg font-bold text-sidebar-primary-foreground">RefundPayPro</span>}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? t('sidebar.administration') : t('sidebar.menu')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/admin'} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <button onClick={logout} className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors w-full px-2 py-2 rounded-lg hover:bg-sidebar-accent/50">
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm">{t('sidebar.logout')}</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
