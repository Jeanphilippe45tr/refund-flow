import React, { createContext, useContext, useState, useCallback } from 'react';

export type Currency = 'USD' | 'EUR';

const EUR_RATE = 0.92; // 1 USD = 0.92 EUR (approximate)

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatAmount: (amountUsd: number) => string;
  convertAmount: (amountUsd: number) => number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem('currency');
    return (stored === 'EUR' ? 'EUR' : 'USD') as Currency;
  });

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('currency', c);
  }, []);

  const convertAmount = useCallback((amountUsd: number): number => {
    return currency === 'EUR' ? amountUsd * EUR_RATE : amountUsd;
  }, [currency]);

  const symbol = currency === 'EUR' ? '€' : '$';

  const formatAmount = useCallback((amountUsd: number): string => {
    const converted = currency === 'EUR' ? amountUsd * EUR_RATE : amountUsd;
    return `${currency === 'EUR' ? '€' : '$'}${converted.toFixed(2)}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount, convertAmount, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};
