import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const TransactionsPage = () => {
  const { user } = useAuth();

  const { data: myTx = [] } = useQuery({
    queryKey: ['all-transactions', user?.id],
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {myTx.map((t: any, i: number) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className={`inline-flex p-2 rounded-lg ${t.type === 'refund' ? 'bg-success/10' : 'bg-accent'}`}>
                      {t.type === 'refund' ? <ArrowDownRight className="w-4 h-4 text-success" /> : <ArrowUpRight className="w-4 h-4 text-primary" />}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{t.description || t.type}</td>
                  <td className={`p-4 font-semibold ${t.type === 'refund' ? 'text-success' : ''}`}>
                    {t.type === 'refund' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                  </td>
                  <td className="p-4"><StatusBadge status={t.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(t.created_at), 'MMM dd, yyyy')}</td>
                </motion.tr>
              ))}
              {myTx.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No transactions</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default TransactionsPage;
