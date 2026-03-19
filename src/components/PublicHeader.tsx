import { Link, useLocation } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageCurrencyToggle } from '@/components/LanguageCurrencyToggle';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

type PublicHeaderProps = {
  showNavLinks?: boolean;
};

export const PublicHeader = ({ showNavLinks = true }: PublicHeaderProps) => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 px-6 py-4 backdrop-blur-lg md:px-12">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="truncate text-xl font-bold text-foreground">RefundPayPro</span>
        </Link>

        {showNavLinks && (
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'transition-colors hover:text-foreground',
                  location.pathname === item.to && 'text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="hidden items-center gap-2 md:flex">
          <LanguageCurrencyToggle />
          <Link to="/login">
            <Button variant="ghost">{t('nav.signIn')}</Button>
          </Link>
          <Link to="/register">
            <Button className="gradient-primary border-0 text-primary-foreground">{t('nav.getStarted')}</Button>
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm border-l border-border bg-background">
              <div className="mt-8 flex flex-col gap-6">
                {showNavLinks && (
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          className={cn(
                            'rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                            location.pathname === item.to && 'bg-muted text-foreground',
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                )}

                <div className="border-t border-border pt-6">
                  <LanguageCurrencyToggle />
                </div>

                <div className="flex flex-col gap-3">
                  <SheetClose asChild>
                    <Link to="/login">
                      <Button variant="outline" className="w-full">
                        {t('nav.signIn')}
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to="/register">
                      <Button className="w-full gradient-primary border-0 text-primary-foreground">
                        {t('nav.getStarted')}
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
