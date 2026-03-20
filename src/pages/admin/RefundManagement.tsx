import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const RefundManagement = () => {
  const { language } = useLanguage();
  const text = language === 'fr'
    ? {
        unknown: 'Inconnu',
        title: 'Historique des remboursements',
        subtitle: 'Utilisez la gestion des utilisateurs pour ajouter de nouveaux remboursements',
        user: 'Utilisateur',
        amount: 'Montant',
        note: 'Note',
        date: 'Date',
        empty: 'Aucun remboursement pour le moment',
      }
    : {
        unknown: 'Unknown',
        title: 'Refund History',
        subtitle: 'Use User Management to add new refunds',
        user: 'User',
        amount: 'Amount',
        note: 'Note',
        date: 'Date',
        empty: 'No refunds yet',
      };
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

  const getUserName = (userId: string) => profiles.find((p: any) => p.user_id === userId)?.name || text.unknown;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.user}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.amount}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.note}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.date}</th>
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
              {refunds.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">{text.empty}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default RefundManagement;
