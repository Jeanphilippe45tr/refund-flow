import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Send, Plus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-primary/10 text-primary',
  high: 'bg-orange-500/10 text-orange-600',
  urgent: 'bg-destructive/10 text-destructive',
};

const AdminSupport = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const text = fr ? {
    unknown: 'Inconnu', replySent: 'Réponse envoyée', title: 'Tickets de support',
    noTickets: 'Aucun ticket', from: 'De', you: 'Vous',
    replyPlaceholder: 'Écrire une réponse...', selectTicket: 'Sélectionnez un ticket',
    newTicket: 'Nouveau ticket vers un client', selectClient: 'Sélectionner un client',
    subject: 'Sujet', message: 'Message initial', category: 'Catégorie', priority: 'Priorité',
    create: 'Créer le ticket', ticketCreated: 'Ticket envoyé au client',
    cat: { general: 'Général', billing: 'Facturation', technical: 'Technique', kyc: 'KYC/Vérification', other: 'Autre' },
    pri: { low: 'Basse', medium: 'Moyenne', high: 'Haute', urgent: 'Urgente' },
    closeTicket: 'Marquer comme résolu', reopen: 'Rouvrir', closed: 'Ticket résolu',
  } : {
    unknown: 'Unknown', replySent: 'Reply sent', title: 'Support Tickets',
    noTickets: 'No tickets', from: 'From', you: 'You',
    replyPlaceholder: 'Type a reply...', selectTicket: 'Select a ticket',
    newTicket: 'New ticket to client', selectClient: 'Select a client',
    subject: 'Subject', message: 'Initial message', category: 'Category', priority: 'Priority',
    create: 'Create ticket', ticketCreated: 'Ticket sent to client',
    cat: { general: 'General', billing: 'Billing', technical: 'Technical', kyc: 'KYC/Verification', other: 'Other' },
    pri: { low: 'Low', medium: 'Medium', high: 'High', urgent: 'Urgent' },
    closeTicket: 'Mark as resolved', reopen: 'Reopen', closed: 'Ticket resolved',
  };

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [open, setOpen] = useState(false);
  const [newClientId, setNewClientId] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [newPriority, setNewPriority] = useState('medium');

  const { data: tickets = [] } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
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

  const { data: messages = [] } = useQuery({
    queryKey: ['admin-ticket-messages', selectedTicket],
    queryFn: async () => {
      if (!selectedTicket) return [];
      const { data } = await supabase.from('support_messages').select('*').eq('ticket_id', selectedTicket).order('created_at', { ascending: true });
      return data || [];
    },
    enabled: !!selectedTicket,
  });

  const getUserName = (userId: string) => profiles.find((p: any) => p.user_id === userId)?.name || text.unknown;
  const activeTicket: any = tickets.find((t: any) => t.id === selectedTicket);

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    await supabase.from('support_messages').insert({
      ticket_id: selectedTicket, sender_id: user!.id, message: reply, is_admin: true,
    });
    if (activeTicket) {
      await supabase.from('notifications').insert({
        user_id: activeTicket.user_id,
        title: fr ? 'Nouvelle réponse du support' : 'New support reply',
        message: activeTicket.subject,
        type: 'info',
      });
    }
    setReply('');
    queryClient.invalidateQueries({ queryKey: ['admin-ticket-messages'] });
    toast.success(text.replySent);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      user_id: newClientId, subject: newSubject, category: newCategory,
      priority: newPriority, created_by_admin: true, assigned_admin_id: user!.id, status: 'open',
    };
    const { data: ticket, error } = await supabase.from('support_tickets').insert(payload).select().single();
    if (error) { toast.error(error.message); return; }
    if (ticket) {
      await supabase.from('support_messages').insert({
        ticket_id: ticket.id, sender_id: user!.id, message: newMessage, is_admin: true,
      });
      await supabase.from('notifications').insert({
        user_id: newClientId,
        title: fr ? `Nouveau ticket: ${newSubject}` : `New ticket: ${newSubject}`,
        message: fr ? 'Un administrateur vous a envoyé un ticket' : 'An admin sent you a ticket',
        type: newPriority === 'urgent' ? 'warning' : 'info',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success(text.ticketCreated);
      setOpen(false); setNewClientId(''); setNewSubject(''); setNewMessage('');
      setNewCategory('general'); setNewPriority('medium');
    }
  };

  const toggleStatus = async () => {
    if (!activeTicket) return;
    const newStatus = activeTicket.status === 'closed' ? 'open' : 'closed';
    await supabase.from('support_tickets').update({ status: newStatus }).eq('id', activeTicket.id);
    queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    toast.success(newStatus === 'closed' ? text.closed : (fr ? 'Ticket rouvert' : 'Ticket reopened'));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" />{text.newTicket}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{text.newTicket}</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div>
                  <Label>{text.selectClient}</Label>
                  <Select value={newClientId} onValueChange={setNewClientId} required>
                    <SelectTrigger><SelectValue placeholder={text.selectClient} /></SelectTrigger>
                    <SelectContent>
                      {profiles.map((p: any) => (
                        <SelectItem key={p.user_id} value={p.user_id}>{p.name} — {p.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>{text.subject}</Label><Input value={newSubject} onChange={e => setNewSubject(e.target.value)} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{text.category}</Label>
                    <Select value={newCategory} onValueChange={setNewCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(text.cat).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{text.priority}</Label>
                    <Select value={newPriority} onValueChange={setNewPriority}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(text.pri).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>{text.message}</Label><Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={4} required /></div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{text.create}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border divide-y divide-border max-h-[600px] overflow-auto">
            {tickets.map((t: any) => (
              <div key={t.id} onClick={() => setSelectedTicket(t.id)} className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedTicket === t.id ? 'bg-accent' : ''}`}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <p className="text-sm font-medium truncate text-foreground">{t.subject}</p>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  {t.priority && <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-medium ${priorityColors[t.priority] || ''}`}>{(text.pri as any)[t.priority] || t.priority}</span>}
                  {t.created_by_admin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/20 text-secondary-foreground uppercase font-medium">{fr ? 'Admin' : 'Admin'}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{getUserName(t.user_id)} · {format(new Date(t.created_at), 'MMM dd')}</p>
              </div>
            ))}
            {tickets.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">{text.noTickets}</p>}
          </div>
          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col min-h-[500px]">
            {activeTicket ? (
              <>
                <div className="p-4 border-b border-border flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{activeTicket.subject}</h3>
                    <p className="text-xs text-muted-foreground">{text.from}: {getUserName(activeTicket.user_id)}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleStatus}>
                    {activeTicket.status === 'closed' ? text.reopen : text.closeTicket}
                  </Button>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-auto">
                  {messages.map((m: any) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.is_admin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl p-3 ${m.is_admin ? 'gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-xs font-medium mb-1">{m.is_admin ? text.you : getUserName(activeTicket.user_id)}</p>
                        <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                        <p className={`text-xs mt-1 ${m.is_admin ? 'opacity-70' : 'text-muted-foreground'}`}>{format(new Date(m.created_at), 'HH:mm')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input placeholder={text.replyPlaceholder} value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} disabled={activeTicket.status === 'closed'} />
                  <Button onClick={handleReply} disabled={activeTicket.status === 'closed'} className="gradient-primary border-0 text-primary-foreground"><Send className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  {text.selectTicket}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminSupport;
