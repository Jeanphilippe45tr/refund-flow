import {
  LayoutDashboard, Wallet, ArrowDownCircle, History, User, LifeBuoy, Bell,
  Users, CreditCard, RefreshCw, BarChart3, Shield, LogOut, Zap, FileCheck, FileText,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const clientItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Wallet', url: '/wallet', icon: Wallet },
  { title: 'Withdraw', url: '/withdraw', icon: ArrowDownCircle },
  { title: 'Documents', url: '/documents', icon: FileText },
  { title: 'Transactions', url: '/transactions', icon: History },
  { title: 'Notifications', url: '/notifications', icon: Bell },
  { title: 'Support', url: '/support', icon: LifeBuoy },
  { title: 'Profile', url: '/profile', icon: User },
];

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Withdrawals', url: '/admin/withdrawals', icon: CreditCard },
  { title: 'Refunds', url: '/admin/refunds', icon: RefreshCw },
  { title: 'Documents', url: '/admin/documents', icon: FileCheck },
  { title: 'Support Tickets', url: '/admin/support', icon: LifeBuoy },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Activity Log', url: '/admin/logs', icon: Shield },
  { title: 'Notifications', url: '/admin/notifications', icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, logout } = useAuth();
  const items = user?.role === 'admin' ? adminItems : clientItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-4">
        <div className={`px-4 mb-6 ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-2">
            <img src="/RefunPayPro-logo.png" alt="RefundPayPro" className="h-8 w-auto" />
            {!collapsed && <span className="text-lg font-bold text-sidebar-primary-foreground">RefundPayPro</span>}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{user?.role === 'admin' ? 'Administration' : 'Menu'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
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
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
