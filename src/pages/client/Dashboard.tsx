import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Wallet, ArrowDownCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const chartData = [
  { month: 'Jan', refunds: 400, withdrawals: 200 },
  { month: 'Feb', refunds: 600, withdrawals: 350 },
  { month: 'Mar', refunds: 900, withdrawals: 500 },
  { month: 'Apr', refunds: 750, withdrawals: 450 },
  { month: 'May', refunds: 1100, withdrawals: 700 },
  { month: 'Jun', refunds: 850, withdrawals: 600 },
];

const ClientDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();

  const { data: transactions = [] } = useQuery({
    queryKey: ['my-transactions', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['pending-withdrawals-count', user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from('withdraw_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('status', 'pending');
      return count || 0;
    },
    enabled: !!user,
  });

  const { data: totalRefunded = 0 } = useQuery({
    queryKey: ['total-refunded', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user!.id)
        .eq('type', 'refund')
        .eq('status', 'completed');
      return data?.reduce((s, t) => s + Number(t.amount), 0) || 0;
    },
    enabled: !!user,
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.overview')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t('dashboard.balance')} value={formatAmount(user?.balance || 0)} icon={<Wallet className="w-5 h-5 text-primary" />} gradient />
          <StatCard title={t('dashboard.pendingWithdrawals')} value={String(pendingCount)} icon={<ArrowDownCircle className="w-5 h-5 text-warning" />} />
          <StatCard title={t('dashboard.totalRefunded')} value={formatAmount(totalRefunded)} icon={<RefreshCw className="w-5 h-5 text-success" />} change="+12.5%" positive />
          <StatCard title={t('dashboard.transactions')} value={String(transactions.length)} icon={<TrendingUp className="w-5 h-5 text-primary" />} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4 text-foreground">{t('dashboard.activityOverview')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="refunds" stroke="hsl(220, 100%, 56%)" fill="url(#refundGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4 text-foreground">{t('dashboard.recentTransactions')}</h3>
            <div className="space-y-3">
              {transactions.length === 0 && <p className="text-muted-foreground text-sm">{t('dashboard.noTransactions')}</p>}
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description || tx.type}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${tx.type === 'refund' ? 'text-success' : 'text-foreground'}`}>
                      {tx.type === 'refund' ? '+' : '-'}{formatAmount(Number(tx.amount))}
                    </span>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ClientDashboard;
