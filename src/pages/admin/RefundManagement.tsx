import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const RefundManagement = () => {
  const { data: refunds = [] } = useQuery({
    queryKey: ['admin-refunds'],
    queryFn: async () => {
      const { data } = await supabase.from('refunds').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const getUserName = (userId: string) => profiles.find((p: any) => p.user_id === userId)?.name || 'Unknown';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Refund History</h1>
          <p className="text-muted-foreground">Use User Management to add new refunds</p>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Note</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r: any, i: number) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{getUserName(r.user_id)}</td>
                  <td className="p-4 font-semibold text-success">+${Number(r.amount).toFixed(2)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{r.note}</td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(r.created_at), 'MMM dd, yyyy')}</td>
                </motion.tr>
              ))}
              {refunds.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No refunds yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default RefundManagement;
