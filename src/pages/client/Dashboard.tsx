import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Wallet, ArrowDownCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const chartData = [
  { month: 'Jan', refunds: 400, withdrawals: 200 },
  { month: 'Feb', refunds: 600, withdrawals: 350 },
  { month: 'Mar', refunds: 900, withdrawals: 500 },
  { month: 'Apr', refunds: 750, withdrawals: 450 },
  { month: 'May', refunds: 1100, withdrawals: 700 },
  { month: 'Jun', refunds: 850, withdrawals: 600 },
];

const ClientDashboard = () => {
  const { user, transactions, withdrawals } = useAuth();
  const myTransactions = transactions.filter(t => t.userId === user?.id).slice(0, 5);
  const pendingW = withdrawals.filter(w => w.userId === user?.id && w.status === 'pending');
  const totalRefunded = transactions.filter(t => t.userId === user?.id && t.type === 'refund' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your account activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Balance" value={`$${user?.balance?.toFixed(2) || '0.00'}`} icon={<Wallet className="w-5 h-5 text-primary" />} gradient />
          <StatCard title="Pending Withdrawals" value={String(pendingW.length)} icon={<ArrowDownCircle className="w-5 h-5 text-warning" />} />
          <StatCard title="Total Refunded" value={`$${totalRefunded.toFixed(2)}`} icon={<RefreshCw className="w-5 h-5 text-success" />} change="+12.5%" positive />
          <StatCard title="Transactions" value={String(myTransactions.length)} icon={<TrendingUp className="w-5 h-5 text-primary" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Activity Overview</h3>
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
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {myTransactions.length === 0 && <p className="text-muted-foreground text-sm">No transactions yet</p>}
              {myTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(t.createdAt), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${t.type === 'refund' ? 'text-success' : 'text-foreground'}`}>
                      {t.type === 'refund' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                    <StatusBadge status={t.status} />
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
