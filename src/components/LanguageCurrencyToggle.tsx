import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Language, LANGUAGE_LABELS } from '@/i18n/translations';
import { Globe, DollarSign } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageCurrencyToggle = () => {
  const { language, setLanguage } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{LANGUAGE_LABELS[language].short}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLanguage(lang)}
              className={language === lang ? 'bg-accent' : ''}
            >
              {LANGUAGE_LABELS[lang].flag} {LANGUAGE_LABELS[lang].label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">{currency}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setCurrency('USD')} className={currency === 'USD' ? 'bg-accent' : ''}>
            $ USD
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrency('EUR')} className={currency === 'EUR' ? 'bg-accent' : ''}>
            € EUR
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
