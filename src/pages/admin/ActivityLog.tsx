import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const ActivityLog = () => {
  const { language } = useLanguage();
  const text = language === 'fr'
    ? { title: 'Journal d’activité', empty: 'Aucune activité enregistrée' }
    : { title: 'Activity Log', empty: 'No activity recorded' };
  const { data: adminLogs = [] } = useQuery({
    queryKey: ['admin-logs'],
    queryFn: async () => {
      const { data } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {adminLogs.map((log: any, i: number) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-accent mt-0.5">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground">{log.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}</p>
              </div>
            </motion.div>
          ))}
          {adminLogs.length === 0 && <p className="p-8 text-center text-muted-foreground">{text.empty}</p>}
        </div>
      </div>
    </AppLayout>
  );
};

export default ActivityLog;
