import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatCard } from '@/components/StatCard';
import { Users, Wallet, RefreshCw, CreditCard, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const barData = [
  { month: 'Jan', refunds: 2400, withdrawals: 1200 },
  { month: 'Feb', refunds: 3600, withdrawals: 2100 },
  { month: 'Mar', refunds: 4200, withdrawals: 2800 },
  { month: 'Apr', refunds: 3800, withdrawals: 2400 },
  { month: 'May', refunds: 5100, withdrawals: 3200 },
  { month: 'Jun', refunds: 4500, withdrawals: 3000 },
];

const COLORS = ['hsl(220, 100%, 56%)', 'hsl(45, 100%, 61%)', 'hsl(152, 69%, 45%)', 'hsl(0, 84%, 60%)'];

const AdminDashboard = () => {
  const { language } = useLanguage();
  const text = language === 'fr'
    ? {
        approved: 'Approuvés',
        pending: 'En attente',
        rejected: 'Rejetés',
        title: 'Tableau de bord admin',
        subtitle: 'Vue d’ensemble et analyses de la plateforme',
        totalUsers: 'Utilisateurs',
        thisMonth: '+3 ce mois',
        platformBalance: 'Solde plateforme',
        totalRefunds: 'Remboursements',
        totalWithdrawn: 'Total retiré',
        monthlyOverview: 'Aperçu mensuel',
        withdrawalStatus: 'Statut des retraits',
      }
    : {
        approved: 'Approved',
        pending: 'Pending',
        rejected: 'Rejected',
        title: 'Admin Dashboard',
        subtitle: 'Platform overview and analytics',
        totalUsers: 'Total Users',
        thisMonth: '+3 this month',
        platformBalance: 'Platform Balance',
        totalRefunds: 'Total Refunds',
        totalWithdrawn: 'Total Withdrawn',
        monthlyOverview: 'Monthly Overview',
        withdrawalStatus: 'Withdrawal Status',
      };
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      const { data } = await supabase.from('withdraw_requests').select('*');
      return data || [];
    },
  });

  const { data: refunds = [] } = useQuery({
    queryKey: ['admin-refunds'],
    queryFn: async () => {
      const { data } = await supabase.from('refunds').select('*');
      return data || [];
    },
  });

  const totalBalance = profiles.reduce((s: number, u: any) => s + Number(u.balance), 0);
  const totalRefunds = refunds.reduce((s: number, r: any) => s + Number(r.amount), 0);
  const pendingW = withdrawals.filter((w: any) => w.status === 'pending');
  const totalW = withdrawals.filter((w: any) => w.status === 'approved').reduce((s: number, w: any) => s + Number(w.amount), 0);

  const pieData = [
    { name: text.approved, value: withdrawals.filter((w: any) => w.status === 'approved').length },
    { name: text.pending, value: withdrawals.filter((w: any) => w.status === 'pending').length },
    { name: text.rejected, value: withdrawals.filter((w: any) => w.status === 'rejected').length },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title={text.totalUsers} value={String(profiles.length)} icon={<Users className="w-5 h-5 text-primary" />} change={text.thisMonth} positive />
          <StatCard title={text.platformBalance} value={`$${totalBalance.toFixed(2)}`} icon={<Wallet className="w-5 h-5 text-primary" />} gradient />
          <StatCard title={text.totalRefunds} value={`$${totalRefunds.toFixed(2)}`} icon={<RefreshCw className="w-5 h-5 text-success" />} />
          <StatCard title={text.totalWithdrawn} value={`$${totalW.toFixed(2)}`} icon={<CreditCard className="w-5 h-5 text-warning" />} />
          <StatCard title={text.pending} value={String(pendingW.length)} icon={<AlertTriangle className="w-5 h-5 text-warning" />} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4 text-foreground">{text.monthlyOverview}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="refunds" fill="hsl(220, 100%, 56%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" fill="hsl(45, 100%, 61%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4 text-foreground">{text.withdrawalStatus}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
