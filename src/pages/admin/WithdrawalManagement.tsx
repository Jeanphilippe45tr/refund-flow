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

const WithdrawalManagement = () => {
  const { users, withdrawals, approveWithdrawal, rejectWithdrawal, flagWithdrawal } = useAuth();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rejectDialog, setRejectDialog] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [proof, setProof] = useState('');

  const filtered = withdrawals
    .filter(w => filter === 'all' || w.status === filter)
    .filter(w => {
      const u = users.find(u => u.id === w.userId);
      return !search || u?.name.toLowerCase().includes(search.toLowerCase()) || u?.email.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Withdrawal Management</h1>

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
              {filtered.map((w, i) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className={`border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${w.flagged ? 'bg-destructive/5' : ''}`}>
                  <td className="p-4 text-sm font-medium">{getUserName(w.userId)}</td>
                  <td className="p-4 font-semibold">${w.amount.toFixed(2)}</td>
                  <td className="p-4 text-sm capitalize">{w.paymentMethod.replace('_', ' ')}</td>
                  <td className="p-4"><StatusBadge status={w.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(w.createdAt), 'MMM dd, yyyy')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {w.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => { approveWithdrawal(w.id); toast.success('Approved'); }}>
                            <Check className="w-4 h-4 text-success" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setRejectDialog(w.id); setReason(''); setProof(''); }}>
                            <X className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => { flagWithdrawal(w.id); toast.info(w.flagged ? 'Unflagged' : 'Flagged'); }}>
                        <Flag className={`w-4 h-4 ${w.flagged ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} />
                      </Button>
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
              <div>
                <Label>Rejection Reason *</Label>
                <Textarea value={reason} onChange={e => setReason(e.target.value)} required className="mt-1" placeholder="Provide a reason..." />
              </div>
              <div>
                <Label>Proof Note (optional)</Label>
                <Input value={proof} onChange={e => setProof(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={() => {
                if (!reason.trim()) { toast.error('Reason is required'); return; }
                rejectWithdrawal(rejectDialog!, reason, proof);
                setRejectDialog(null);
                toast.success('Withdrawal rejected');
              }} variant="destructive" className="w-full">
                Reject Withdrawal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default WithdrawalManagement;
