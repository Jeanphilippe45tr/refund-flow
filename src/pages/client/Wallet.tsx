import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const WalletPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  const { data: myTx = [] } = useQuery({
    queryKey: ['wallet-transactions', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const totalIn = myTx.filter((t: any) => t.type === 'refund').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const totalOut = myTx.filter((t: any) => t.type === 'withdrawal' && t.status === 'completed').reduce((s: number, t: any) => s + Number(t.amount), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{t('wallet.title')}</h1>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="gradient-primary rounded-2xl p-8 text-primary-foreground">
          <p className="text-sm opacity-80 mb-1">{t('wallet.availableBalance')}</p>
          <p className="text-4xl font-bold">{formatAmount(user?.balance || 0)}</p>
          <div className="flex gap-4 mt-6">
            <div className="bg-primary-foreground/20 rounded-lg px-4 py-2">
              <p className="text-xs opacity-80">{t('wallet.totalIn')}</p>
              <p className="font-semibold">{formatAmount(totalIn)}</p>
            </div>
            <div className="bg-primary-foreground/20 rounded-lg px-4 py-2">
              <p className="text-xs opacity-80">{t('wallet.totalOut')}</p>
              <p className="font-semibold">{formatAmount(totalOut)}</p>
            </div>
          </div>
        </motion.div>
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border"><h3 className="font-semibold text-foreground">{t('wallet.timeline')}</h3></div>
          <div className="divide-y divide-border">
            {myTx.map((tx: any, i: number) => (
              <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'refund' ? 'bg-success/10' : 'bg-accent'}`}>
                    {tx.type === 'refund' ? <ArrowDownRight className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description || tx.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${tx.type === 'refund' ? 'text-success' : ''}`}>
                    {tx.type === 'refund' ? '+' : '-'}{formatAmount(Number(tx.amount))}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
              </motion.div>
            ))}
            {myTx.length === 0 && <p className="p-6 text-center text-muted-foreground">{t('dashboard.noTransactions')}</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WalletPage;
