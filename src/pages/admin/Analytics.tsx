import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyData = [
  { month: 'Jan', users: 10, refunds: 2400, withdrawals: 1200 },
  { month: 'Feb', users: 15, refunds: 3600, withdrawals: 2100 },
  { month: 'Mar', users: 22, refunds: 4200, withdrawals: 2800 },
  { month: 'Apr', users: 28, refunds: 3800, withdrawals: 2400 },
  { month: 'May', users: 35, refunds: 5100, withdrawals: 3200 },
  { month: 'Jun', users: 42, refunds: 4500, withdrawals: 3000 },
];

const Analytics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(220, 100%, 56%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="hsl(220, 100%, 56%)" fill="url(#userGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Refunds vs Withdrawals</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="refunds" fill="hsl(220, 100%, 56%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="hsl(45, 100%, 61%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
