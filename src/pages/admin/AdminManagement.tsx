import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const [createDialog, setCreateDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const text = language === 'fr'
    ? {
        title: 'Gestion des Administrateurs',
        addAdmin: 'Ajouter un Administrateur',
        name: 'Nom complet',
        email: 'Email',
        password: 'Mot de passe',
        create: 'Créer',
        role: 'Rôle',
        actions: 'Actions',
        adminCreated: 'Administrateur créé avec succès',
        adminDeleted: 'Administrateur supprimé',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet administrateur ?',
        show: 'Afficher',
        hide: 'Masquer',
      }
    : {
        title: 'Admin Management',
        addAdmin: 'Add Administrator',
        name: 'Full Name',
        email: 'Email',
        password: 'Password',
        create: 'Create',
        role: 'Role',
        actions: 'Actions',
        adminCreated: 'Administrator created successfully',
        adminDeleted: 'Administrator deleted',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        confirmDelete: 'Are you sure you want to delete this administrator?',
        show: 'Show',
        hide: 'Hide',
      };

  const { data: adminRoles = [] } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('*').in('role', ['admin', 'super_admin'] as any);
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles-list'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  // Fetch credentials for password visibility
  const { data: credentials = [] } = useQuery({
    queryKey: ['admin-credentials'],
    queryFn: async () => {
      const { data } = await supabase.from('client_credentials').select('*');
      return data || [];
    },
  });

  const getCredential = (userId: string) => credentials.find((c: any) => c.user_id === userId);

  const admins = adminRoles.map((r: any) => {
    const profile = profiles.find((p: any) => p.user_id === r.user_id);
    return { ...r, name: profile?.name || '', email: profile?.email || '' };
  });

  const handleCreate = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke('manage-admin', {
        body: { action: 'create', name, email, password },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(text.adminCreated);
      setCreateDialog(false);
      setName(''); setEmail(''); setPassword('');
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-profiles-list'] });
    } catch (err: any) {
      toast.error(err.message || 'Error creating admin');
    }
    setLoading(false);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm(text.confirmDelete)) return;
    try {
      const { data: session } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke('manage-admin', {
        body: { action: 'delete', userId },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      if (res.data?.error) throw new Error(res.data.error);
      toast.success(text.adminDeleted);
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-profiles-list'] });
    } catch (err: any) {
      toast.error(err.message || 'Error deleting admin');
    }
  };

  if (user?.role !== 'super_admin') {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. Super admin only.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <Button onClick={() => setCreateDialog(true)} className="gradient-primary border-0 text-primary-foreground">
            <UserPlus className="w-4 h-4 mr-2" /> {text.addAdmin}
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.name}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.email}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.role}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.actions}</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a: any, i: number) => (
                <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                        {a.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium text-sm text-foreground">{a.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{a.email}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${a.role === 'super_admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-primary/10 text-primary'}`}>
                      <ShieldCheck className="w-3 h-3" />
                      {a.role === 'super_admin' ? text.superAdmin : text.admin}
                    </span>
                  </td>
                  <td className="p-4">
                    {a.role !== 'super_admin' && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(a.user_id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={createDialog} onOpenChange={setCreateDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>{text.addAdmin}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>{text.name}</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
              <div><Label>{text.email}</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" /></div>
              <div><Label>{text.password}</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1" /></div>
              <Button onClick={handleCreate} disabled={loading} className="w-full gradient-primary border-0 text-primary-foreground">
                {loading ? '...' : text.create}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AdminManagement;
