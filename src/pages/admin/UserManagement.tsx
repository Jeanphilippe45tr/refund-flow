import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Search, Ban, Trash2, DollarSign, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UserManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [balanceDialog, setBalanceDialog] = useState<string | null>(null);
  const [refundDialog, setRefundDialog] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNote, setRefundNote] = useState('');

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  // Filter out admin profiles by checking user_roles
  const { data: adminUserIds = [] } = useQuery({
    queryKey: ['admin-role-ids'],
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('user_id').eq('role', 'admin');
      return data?.map((r: any) => r.user_id) || [];
    },
  });

  const clients = profiles.filter((p: any) => !adminUserIds.includes(p.user_id));
  const filtered = clients.filter((u: any) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const editBalance = async (userId: string, balance: number) => {
    await supabase.from('profiles').update({ balance }).eq('user_id', userId);
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Edited balance to $${balance}`, details: { user_id: userId } });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    toast.success('Balance updated');
  };

  const addRefund = async (userId: string, amount: number, note: string) => {
    // Add refund record
    await supabase.from('refunds').insert({ user_id: userId, admin_id: user!.id, amount, note });
    // Add transaction
    await supabase.from('transactions').insert({ user_id: userId, type: 'refund', amount, status: 'completed', description: note });
    // Update balance
    const profile = profiles.find((p: any) => p.user_id === userId);
    if (profile) {
      await supabase.from('profiles').update({ balance: Number(profile.balance) + amount }).eq('user_id', userId);
    }
    // Notify user
    await supabase.from('notifications').insert({ user_id: userId, title: 'Refund Received', message: `You received a refund of $${amount.toFixed(2)}` });
    // Log
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Added refund of $${amount} to user`, details: { user_id: userId, note } });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    queryClient.invalidateQueries({ queryKey: ['admin-refunds'] });
    toast.success('Refund added');
  };

  const deleteUser = async (userId: string) => {
    // Note: cascade will handle related data
    await supabase.auth.admin?.deleteUser?.(userId);
    // Fallback: just delete profile 
    await supabase.from('profiles').delete().eq('user_id', userId);
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: 'Deleted user', details: { user_id: userId } });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    toast.success('User deleted');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Balance</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any, i: number) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">{u.name.charAt(0)}</div>
                      <span className="font-medium text-sm text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-4 font-semibold text-foreground">${Number(u.balance).toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setRefundDialog(u.user_id); setRefundAmount(''); setRefundNote(''); }} title="Add refund">
                        <RefreshCw className="w-4 h-4 text-success" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setBalanceDialog(u.user_id); setNewBalance(String(u.balance)); }} title="Edit balance">
                        <DollarSign className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteUser(u.user_id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={!!balanceDialog} onOpenChange={() => setBalanceDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit User Balance</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>New Balance ($)</Label><Input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="mt-1" /></div>
              <Button onClick={() => { editBalance(balanceDialog!, parseFloat(newBalance)); setBalanceDialog(null); }} className="w-full gradient-primary border-0 text-primary-foreground">Update Balance</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!refundDialog} onOpenChange={() => setRefundDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Refund</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Amount ($)</Label><Input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} className="mt-1" /></div>
              <div><Label>Note</Label><Textarea value={refundNote} onChange={e => setRefundNote(e.target.value)} className="mt-1" /></div>
              <Button onClick={() => { addRefund(refundDialog!, parseFloat(refundAmount), refundNote); setRefundDialog(null); }} className="w-full gradient-primary border-0 text-primary-foreground">Add Refund</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
