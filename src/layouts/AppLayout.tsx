import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, Moon, Sun, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LanguageCurrencyToggle } from '@/components/LanguageCurrencyToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { SpotlightBackground } from '@/components/SpotlightBackground';
import { PageTransition } from '@/components/PageTransition';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user, darkMode, toggleDarkMode } = useAuth();
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
      return count || 0;
    },
    enabled: !!user,
  });

  const notificationsLink = user?.role === 'admin' ? '/admin/notifications' : '/notifications';

  return (
    <SidebarProvider>
      <SpotlightBackground />
      <div className="min-h-screen flex w-full relative">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border/60 bg-card/80 backdrop-blur-xl px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted flex-shrink-0">
                <img src="/RefunPayPro-logo.png" alt="RefundPayPro Home" className="h-8 w-auto" />
              </Link>
              <SidebarTrigger className="flex-shrink-0" />
              <span className="text-sm text-muted-foreground hidden md:block">
                {t('header.welcomeBack')} <span className="font-semibold text-foreground">{user?.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isMobile ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">{language === 'fr' ? 'Plus' : 'More'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <LanguageCurrencyToggle />
                      <DropdownMenuItem onClick={toggleDarkMode} className="cursor-pointer">
                        {language === 'fr' ? `Activer le mode ${darkMode ? 'clair' : 'sombre'}` : `Toggle ${darkMode ? 'Light' : 'Dark'} Mode`}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={notificationsLink} className="w-full">
                          {language === 'fr' ? 'Notifications' : 'Notifications'} {unreadCount > 0 && <Badge className="ml-2 h-5 w-6 text-xs">{unreadCount}</Badge>}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
                    {user?.name?.charAt(0)}
                  </div>
                </>
              ) : (
                <>
                  <LanguageCurrencyToggle />
                  <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <Link to={notificationsLink} className="p-2 rounded-lg hover:bg-muted transition-colors relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-primary border-0 text-primary-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {user?.name?.charAt(0)}
                  </div>
                </>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
