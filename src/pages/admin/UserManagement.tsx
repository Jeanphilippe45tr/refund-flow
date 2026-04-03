import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Search, Trash2, DollarSign, RefreshCw, UserPlus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const UserManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const isSuperAdmin = user?.role === 'super_admin';

  const text = language === 'fr'
    ? {
        title: 'Gestion des utilisateurs',
        search: 'Rechercher des utilisateurs...',
        userName: 'Utilisateur',
        email: 'Email',
        balance: 'Solde',
        password: 'Mot de passe',
        actions: 'Actions',
        addRefund: 'Ajouter un remboursement',
        editBalance: 'Modifier le solde',
        balanceUpdated: 'Solde mis à jour',
        refundAdded: 'Remboursement ajouté',
        userDeleted: 'Utilisateur supprimé',
        refundReceived: 'Remboursement reçu',
        refundReceivedMessage: 'Vous avez reçu un remboursement de',
        editUserBalance: 'Modifier le solde utilisateur',
        newBalance: 'Nouveau solde ($)',
        updateBalance: 'Mettre à jour le solde',
        addRefundTitle: 'Ajouter un remboursement',
        amount: 'Montant ($)',
        note: 'Note',
        addClient: 'Ajouter un client',
        addClientTitle: 'Créer un nouveau client',
        clientName: 'Nom du client',
        clientEmail: 'Email du client',
        clientPassword: 'Mot de passe',
        createClient: 'Créer le client',
        clientCreated: 'Client créé avec succès',
        noClients: 'Aucun client. Créez-en un.',
        show: 'Afficher',
        hide: 'Masquer',
      }
    : {
        title: 'User Management',
        search: 'Search users...',
        userName: 'User',
        email: 'Email',
        balance: 'Balance',
        password: 'Password',
        actions: 'Actions',
        addRefund: 'Add refund',
        editBalance: 'Edit balance',
        balanceUpdated: 'Balance updated',
        refundAdded: 'Refund added',
        userDeleted: 'User deleted',
        refundReceived: 'Refund Received',
        refundReceivedMessage: 'You received a refund of',
        editUserBalance: 'Edit User Balance',
        newBalance: 'New Balance ($)',
        updateBalance: 'Update Balance',
        addRefundTitle: 'Add Refund',
        amount: 'Amount ($)',
        note: 'Note',
        addClient: 'Add Client',
        addClientTitle: 'Create New Client',
        clientName: 'Client Name',
        clientEmail: 'Client Email',
        clientPassword: 'Password',
        createClient: 'Create Client',
        clientCreated: 'Client created successfully',
        noClients: 'No clients yet. Create one.',
        show: 'Show',
        hide: 'Hide',
      };

  const [search, setSearch] = useState('');
  const [balanceDialog, setBalanceDialog] = useState<string | null>(null);
  const [refundDialog, setRefundDialog] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundNote, setRefundNote] = useState('');
  const [createDialog, setCreateDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Fetch profiles scoped to admin
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles', isSuperAdmin, user?.id],
    queryFn: async () => {
      if (isSuperAdmin) {
        const { data } = await supabase.from('profiles').select('*');
        return data || [];
      }
      // Regular admin: only clients they created
      const { data } = await supabase.from('profiles').select('*').eq('created_by_admin', user!.id);
      return data || [];
    },
  });

  // Filter out admin profiles
  const { data: adminUserIds = [] } = useQuery({
    queryKey: ['admin-role-ids'],
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('user_id').in('role', ['admin', 'super_admin']);
      return data?.map((r: any) => r.user_id) || [];
    },
  });

  // Fetch credentials (super admin sees all, admin sees own)
  const { data: credentials = [] } = useQuery({
    queryKey: ['client-credentials', isSuperAdmin, user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('client_credentials').select('*');
      return data || [];
    },
  });

  const clients = profiles.filter((p: any) => !adminUserIds.includes(p.user_id));
  const filtered = clients.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getCredential = (userId: string) => credentials.find((c: any) => c.user_id === userId);

  const createClient = async () => {
    if (!clientName || !clientEmail || !clientPassword) {
      toast.error('All fields are required');
      return;
    }
    setCreating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke('create-client', {
        body: { name: clientName, email: clientEmail, password: clientPassword },
      });
      if (res.error) throw new Error(res.error.message);
      toast.success(text.clientCreated);
      setCreateDialog(false);
      setClientName('');
      setClientEmail('');
      setClientPassword('');
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['client-credentials'] });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create client');
    } finally {
      setCreating(false);
    }
  };

  const editBalance = async (userId: string, balance: number) => {
    await supabase.from('profiles').update({ balance }).eq('user_id', userId);
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Edited balance to $${balance}`, details: { user_id: userId } });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    toast.success(text.balanceUpdated);
  };

  const addRefund = async (userId: string, amount: number, note: string) => {
    await supabase.from('refunds').insert({ user_id: userId, admin_id: user!.id, amount, note });
    await supabase.from('transactions').insert({ user_id: userId, type: 'refund', amount, status: 'completed', description: note });
    const profile = profiles.find((p: any) => p.user_id === userId);
    if (profile) {
      await supabase.from('profiles').update({ balance: Number(profile.balance) + amount }).eq('user_id', userId);
    }
    await supabase.from('notifications').insert({ user_id: userId, title: text.refundReceived, message: `${text.refundReceivedMessage} $${amount.toFixed(2)}` });
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: `Added refund of $${amount} to user`, details: { user_id: userId, note } });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    queryClient.invalidateQueries({ queryKey: ['admin-refunds'] });
    toast.success(text.refundAdded);
  };

  const deleteUser = async (userId: string) => {
    await supabase.from('profiles').delete().eq('user_id', userId);
    await supabase.from('admin_logs').insert({ admin_id: user!.id, action: 'Deleted user', details: { user_id: userId } });
    queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    toast.success(text.userDeleted);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <Button onClick={() => setCreateDialog(true)} className="gradient-primary border-0 text-primary-foreground">
            <UserPlus className="w-4 h-4 mr-2" />
            {text.addClient}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={text.search} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.userName}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.email}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.balance}</th>
                {(isSuperAdmin || credentials.length > 0) && (
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.password}</th>
                )}
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any, i: number) => {
                const cred = getCredential(u.user_id);
                return (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">{u.name.charAt(0)}</div>
                        <span className="font-medium text-sm text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                    <td className="p-4 font-semibold text-foreground">${Number(u.balance).toFixed(2)}</td>
                    {(isSuperAdmin || credentials.length > 0) && (
                      <td className="p-4 text-sm text-muted-foreground">
                        {cred ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">
                              {showPasswords[u.user_id] ? cred.plain_password : '••••••••'}
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => setShowPasswords(p => ({ ...p, [u.user_id]: !p[u.user_id] }))}>
                              {showPasswords[u.user_id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                          </div>
                        ) : '—'}
                      </td>
                    )}
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setRefundDialog(u.user_id); setRefundAmount(''); setRefundNote(''); }} title={text.addRefund}>
                          <RefreshCw className="w-4 h-4 text-success" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setBalanceDialog(u.user_id); setNewBalance(String(u.balance)); }} title={text.editBalance}>
                          <DollarSign className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteUser(u.user_id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">{text.noClients}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Client Dialog */}
        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>{text.addClientTitle}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>{text.clientName}</Label><Input value={clientName} onChange={e => setClientName(e.target.value)} className="mt-1" /></div>
              <div><Label>{text.clientEmail}</Label><Input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="mt-1" /></div>
              <div><Label>{text.clientPassword}</Label><Input type="text" value={clientPassword} onChange={e => setClientPassword(e.target.value)} className="mt-1" /></div>
              <Button onClick={createClient} disabled={creating} className="w-full gradient-primary border-0 text-primary-foreground">
                {creating ? '...' : text.createClient}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Balance Dialog */}
        <Dialog open={!!balanceDialog} onOpenChange={() => setBalanceDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{text.editUserBalance}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>{text.newBalance}</Label><Input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="mt-1" /></div>
              <Button onClick={() => { editBalance(balanceDialog!, parseFloat(newBalance)); setBalanceDialog(null); }} className="w-full gradient-primary border-0 text-primary-foreground">{text.updateBalance}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Refund Dialog */}
        <Dialog open={!!refundDialog} onOpenChange={() => setRefundDialog(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>{text.addRefundTitle}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>{text.amount}</Label><Input type="number" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} className="mt-1" /></div>
              <div><Label>{text.note}</Label><Textarea value={refundNote} onChange={e => setRefundNote(e.target.value)} className="mt-1" /></div>
              <Button onClick={() => { addRefund(refundDialog!, parseFloat(refundAmount), refundNote); setRefundDialog(null); }} className="w-full gradient-primary border-0 text-primary-foreground">{text.addRefundTitle}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default UserManagement;
