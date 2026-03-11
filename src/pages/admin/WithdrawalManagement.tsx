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

const WithdrawalManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
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

  const getUserName = (userId: string) => profiles.find((p: any) => p.user_id === userId)?.name || 'Unknown';

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
    await supabase.from('notifications').insert({ user_id: w.user_id, title: 'Withdrawal Approved', message: `Your withdrawal of $${Number(w.amount).toFixed(2)} has been approved` });
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Approved withdrawal $${w.amount}`, details: { withdrawal_id: id } });
    queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    toast.success('Approved');
  };

  const rejectWithdrawal = async (id: string) => {
    if (!reason.trim()) { toast.error('Reason is required'); return; }
    const w = withdrawals.find((w: any) => w.id === id);
    if (!w) return;
    await supabase.from('withdraw_requests').update({ status: 'rejected', rejection_reason: reason, rejection_proof: proof || null }).eq('id', id);
    await supabase.from('transactions').update({ status: 'rejected' }).eq('user_id', w.user_id).eq('type', 'withdrawal').eq('status', 'pending').eq('amount', w.amount);
    await supabase.from('notifications').insert({ user_id: w.user_id, title: 'Withdrawal Rejected', message: `Your withdrawal of $${Number(w.amount).toFixed(2)} was rejected: ${reason}` });
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Rejected withdrawal $${w.amount}: ${reason}`, details: { withdrawal_id: id } });
    queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    setRejectDialog(null);
    toast.success('Withdrawal rejected');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Withdrawal Management</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by user..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Method</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
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
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No withdrawals found</td></tr>}
            </tbody>
          </table>
        </div>
        <Dialog open={!!rejectDialog} onOpenChange={() => setRejectDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Reject Withdrawal</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Rejection Reason *</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} required className="mt-1" placeholder="Provide a reason..." /></div>
              <div><Label>Proof Note (optional)</Label><Input value={proof} onChange={e => setProof(e.target.value)} className="mt-1" /></div>
              <Button onClick={() => rejectWithdrawal(rejectDialog!)} variant="destructive" className="w-full">Reject Withdrawal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default WithdrawalManagement;
