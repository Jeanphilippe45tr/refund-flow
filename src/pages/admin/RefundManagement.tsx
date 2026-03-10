import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';

const RefundManagement = () => {
  const { users, refunds } = useAuth();
  const sorted = [...refunds].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Refund History</h1>
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
              {sorted.map((r, i) => (
                <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium">{getUserName(r.userId)}</td>
                  <td className="p-4 font-semibold text-success">+${r.amount.toFixed(2)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{r.note}</td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(r.createdAt), 'MMM dd, yyyy')}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default RefundManagement;
