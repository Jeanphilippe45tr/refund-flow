import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Check, X, Flag, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const WithdrawalManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const text = language === 'fr'
    ? {
        unknown: 'Inconnu',
        approvedTitle: 'Retrait approuvé',
        approvedMessage: 'Votre retrait de',
        rejectedTitle: 'Retrait rejeté',
        rejectedMessage: 'Votre retrait de',
        approvedToast: 'Approuvé',
        reasonRequired: 'Le motif est obligatoire',
        rejectedToast: 'Retrait rejeté',
        title: 'Gestion des retraits',
        search: 'Rechercher par utilisateur...',
        all: 'Tous',
        pending: 'En attente',
        approved: 'Approuvé',
        rejected: 'Rejeté',
        user: 'Utilisateur',
        amount: 'Montant',
        method: 'Méthode',
        status: 'Statut',
        date: 'Date',
        actions: 'Actions',
        noWithdrawals: 'Aucun retrait trouvé',
        rejectTitle: 'Rejeter le retrait',
        rejectReason: 'Motif du rejet *',
        provideReason: 'Indiquez un motif...',
        proofNote: 'Note de preuve (optionnel)',
        rejectButton: 'Rejeter le retrait',
      }
    : {
        unknown: 'Unknown',
        approvedTitle: 'Withdrawal Approved',
        approvedMessage: 'Your withdrawal of',
        rejectedTitle: 'Withdrawal Rejected',
        rejectedMessage: 'Your withdrawal of',
        approvedToast: 'Approved',
        reasonRequired: 'Reason is required',
        rejectedToast: 'Withdrawal rejected',
        title: 'Withdrawal Management',
        search: 'Search by user...',
        all: 'All',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        user: 'User',
        amount: 'Amount',
        method: 'Method',
        status: 'Status',
        date: 'Date',
        actions: 'Actions',
        noWithdrawals: 'No withdrawals found',
        rejectTitle: 'Reject Withdrawal',
        rejectReason: 'Rejection Reason *',
        provideReason: 'Provide a reason...',
        proofNote: 'Proof Note (optional)',
        rejectButton: 'Reject Withdrawal',
      };
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [proof, setProof] = useState('');

  const { data: withdrawals = [] } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: async () => {
      const { data } = await supabase.from('withdraw_requests').select('*').order('created_at', { ascending: false });
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

  const filtered = withdrawals
    .filter((w: any) => filter === 'all' || w.status === filter)
    .filter((w: any) => {
      if (!search) return true;
      const name = getUserName(w.user_id).toLowerCase();
      return name.includes(search.toLowerCase());
    });

  const approveWithdrawal = async (id: string) => {
    const w = withdrawals.find((w: any) => w.id === id);
    if (!w) return;
    await supabase.from('withdraw_requests').update({ status: 'approved' }).eq('id', id);
    // Deduct balance
    const profile = profiles.find((p: any) => p.user_id === w.user_id);
    if (profile) {
      await supabase.from('profiles').update({ balance: Number(profile.balance) - Number(w.amount) }).eq('user_id', w.user_id);
    }
    // Update transaction
    await supabase.from('transactions').update({ status: 'completed' }).eq('user_id', w.user_id).eq('type', 'withdrawal').eq('status', 'pending').eq('amount', w.amount);
    await supabase.from('notifications').insert({ user_id: w.user_id, title: text.approvedTitle, message: `${text.approvedMessage} $${Number(w.amount).toFixed(2)} has been approved` });
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Approved withdrawal $${w.amount}`, details: { withdrawal_id: id } });
    queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    toast.success(text.approvedToast);
  };

  const rejectWithdrawal = async (id: string) => {
    if (!reason.trim()) { toast.error(text.reasonRequired); return; }
    const w = withdrawals.find((w: any) => w.id === id);
    if (!w) return;
    await supabase.from('withdraw_requests').update({ status: 'rejected', rejection_reason: reason, rejection_proof: proof || null }).eq('id', id);
    await supabase.from('transactions').update({ status: 'rejected' }).eq('user_id', w.user_id).eq('type', 'withdrawal').eq('status', 'pending').eq('amount', w.amount);
    await supabase.from('notifications').insert({ user_id: w.user_id, title: text.rejectedTitle, message: `${text.rejectedMessage} $${Number(w.amount).toFixed(2)} was rejected: ${reason}` });
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Rejected withdrawal $${w.amount}: ${reason}`, details: { withdrawal_id: id } });
    queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    setRejectDialog(null);
    toast.success(text.rejectedToast);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={text.search} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{text.all}</SelectItem>
              <SelectItem value="pending">{text.pending}</SelectItem>
              <SelectItem value="approved">{text.approved}</SelectItem>
              <SelectItem value="rejected">{text.rejected}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.user}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.amount}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.method}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.status}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.date}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w: any, i: number) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{getUserName(w.user_id)}</td>
                  <td className="p-4 font-semibold text-foreground">${Number(w.amount).toFixed(2)}</td>
                  <td className="p-4 text-sm capitalize">{w.payment_method.replace('_', ' ')}</td>
                  <td className="p-4"><StatusBadge status={w.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(w.created_at), 'MMM dd, yyyy')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {w.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => approveWithdrawal(w.id)}><Check className="w-4 h-4 text-success" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setRejectDialog(w.id); setReason(''); setProof(''); }}><X className="w-4 h-4 text-destructive" /></Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">{text.noWithdrawals}</td></tr>}
            </tbody>
          </table>
        </div>
        <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{text.rejectTitle}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>{text.rejectReason}</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} required className="mt-1" placeholder={text.provideReason} /></div>
              <div><Label>{text.proofNote}</Label><Input value={proof} onChange={e => setProof(e.target.value)} className="mt-1" /></div>
              <Button onClick={() => rejectWithdrawal(rejectDialog!)} variant="destructive" className="w-full">{text.rejectButton}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default WithdrawalManagement;
