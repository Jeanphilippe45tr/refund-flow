import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const WithdrawPage = () => {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ accountHolder: '', paymentMethod: '', walletDetails: '', country: '', amount: '', message: '' });

  const { data: myWithdrawals = [] } = useQuery({
    queryKey: ['my-withdrawals', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('withdraw_requests')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (amount <= 0 || amount > (user?.balance || 0)) {
      toast.error('Invalid amount or insufficient balance');
      return;
    }
    const { error } = await supabase.from('withdraw_requests').insert({
      user_id: user!.id,
      amount,
      payment_method: form.paymentMethod,
      wallet_details: { accountHolder: form.accountHolder, walletDetails: form.walletDetails, country: form.country },
      message: form.message || null,
    });
    if (!error) {
      await supabase.from('transactions').insert({
        user_id: user!.id,
        type: 'withdrawal',
        amount,
        status: 'pending',
        description: `${form.paymentMethod} withdrawal`,
      });
      toast.success('Withdrawal request submitted!');
      queryClient.invalidateQueries({ queryKey: ['my-withdrawals'] });
      setOpen(false);
      setForm({ accountHolder: '', paymentMethod: '', walletDetails: '', country: '', amount: '', message: '' });
    } else {
      toast.error('Failed to submit');
    }
  };

  const cancelWithdrawal = async (id: string) => {
    await supabase.from('withdraw_requests').delete().eq('id', id).eq('user_id', user!.id);
    queryClient.invalidateQueries({ queryKey: ['my-withdrawals'] });
    toast.info('Withdrawal cancelled');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Withdrawals</h1>
            <p className="text-muted-foreground">Manage your withdrawal requests</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> New Withdrawal</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Request Withdrawal</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div><Label>Account Holder Name</Label><Input value={form.accountHolder} onChange={e => setForm(f => ({ ...f, accountHolder: e.target.value }))} required className="mt-1" /></div>
                <div>
                  <Label>Payment Method</Label>
                  <Select value={form.paymentMethod} onValueChange={v => setForm(f => ({ ...f, paymentMethod: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">Crypto Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Wallet / Bank Number</Label><Input value={form.walletDetails} onChange={e => setForm(f => ({ ...f, walletDetails: e.target.value }))} required className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Country</Label><Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required className="mt-1" /></div>
                  <div><Label>Amount ($)</Label><Input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required className="mt-1" /></div>
                </div>
                <div><Label>Message (optional)</Label><Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="mt-1" /></div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Submit Request</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Method</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myWithdrawals.map((w: any, i: number) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 font-semibold">${Number(w.amount).toFixed(2)}</td>
                  <td className="p-4 text-sm capitalize">{w.payment_method.replace('_', ' ')}</td>
                  <td className="p-4"><StatusBadge status={w.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(w.created_at), 'MMM dd, yyyy')}</td>
                  <td className="p-4">
                    {w.status === 'pending' && (
                      <Button variant="ghost" size="sm" onClick={() => cancelWithdrawal(w.id)} className="text-destructive hover:text-destructive">
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}
                    {w.status === 'rejected' && w.rejection_reason && (
                      <span className="text-xs text-destructive">{w.rejection_reason}</span>
                    )}
                  </td>
                </motion.tr>
              ))}
              {myWithdrawals.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No withdrawals yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default WithdrawPage;
