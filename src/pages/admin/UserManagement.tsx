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

const UserManagement = () => {
  const { users, suspendUser, deleteUser, editUserBalance, addRefund } = useAuth();
  const clients = users.filter(u => u.role === 'client');
  const [search, setSearch] = useState('');
  const [balanceDialog, setBalanceDialog] = useState<string | null>(null);
  const [refundDialog, setRefundDialog] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNote, setRefundNote] = useState('');

  const filtered = clients.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>

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
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">{u.name.charAt(0)}</div>
                      <span className="font-medium text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                  <td className="p-4 font-semibold">${u.balance.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.suspended ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                      {u.suspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setRefundDialog(u.id); setRefundAmount(''); setRefundNote(''); }} title="Add refund">
                        <RefreshCw className="w-4 h-4 text-success" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { setBalanceDialog(u.id); setNewBalance(String(u.balance)); }} title="Edit balance">
                        <DollarSign className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { suspendUser(u.id); toast.info(u.suspended ? 'User unsuspended' : 'User suspended'); }}>
                        <Ban className="w-4 h-4 text-warning" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { deleteUser(u.id); toast.success('User deleted'); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Balance Dialog */}
        <Dialog open={!!balanceDialog} onOpenChange={() => setBalanceDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit User Balance</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>New Balance ($)</Label>
                <Input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={() => { editUserBalance(balanceDialog!, parseFloat(newBalance)); setBalanceDialog(null); toast.success('Balance updated'); }} className="w-full gradient-primary border-0 text-primary-foreground">
                Update Balance
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Refund Dialog */}
        <Dialog open={!!refundDialog} onOpenChange={() => setRefundDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Refund</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Amount ($)</Label>
                <Input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Note</Label>
                <Textarea value={refundNote} onChange={e => setRefundNote(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={() => { addRefund(refundDialog!, parseFloat(refundAmount), refundNote); setRefundDialog(null); toast.success('Refund added'); }} className="w-full gradient-primary border-0 text-primary-foreground">
                Add Refund
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
