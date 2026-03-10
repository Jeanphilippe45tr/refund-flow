import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';

const ActivityLog = () => {
  const { adminLogs } = useAuth();
  const sorted = [...adminLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {sorted.map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-accent mt-0.5">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm">{log.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </motion.div>
          ))}
          {sorted.length === 0 && <p className="p-8 text-center text-muted-foreground">No activity recorded</p>}
        </div>
      </div>
    </AppLayout>
  );
};

export default ActivityLog;
