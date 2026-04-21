import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Plus, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const SupportPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const text = language === 'fr'
    ? {
        title: 'Support',
        newTicket: 'Nouveau ticket',
        createTicket: 'Créer un ticket de support',
        subject: 'Sujet',
        issue: 'Décrivez votre problème...',
        submit: 'Envoyer le ticket',
        ticketCreated: 'Ticket créé !',
        replySent: 'Réponse envoyée !',
        noTickets: 'Aucun ticket',
        replyPlaceholder: 'Écrire une réponse...',
        selectTicket: 'Sélectionnez un ticket pour voir la conversation',
      }
    : {
        title: 'Support',
        newTicket: 'New Ticket',
        createTicket: 'Create Support Ticket',
        subject: 'Subject',
        issue: 'Describe your issue...',
        submit: 'Submit Ticket',
        ticketCreated: 'Ticket created!',
        replySent: 'Reply sent!',
        noTickets: 'No tickets',
        replyPlaceholder: 'Type a reply...',
        selectTicket: 'Select a ticket to view conversation',
      };
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const { data: myTickets = [] } = useQuery({
    queryKey: ['my-tickets', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['ticket-messages', selectedTicket],
    queryFn: async () => {
      if (!selectedTicket) return [];
      const { data } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', selectedTicket)
        .order('created_at', { ascending: true });
      return data || [];
    },
    enabled: !!selectedTicket,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: ticket, error } = await supabase.from('support_tickets').insert({
      user_id: user!.id,
      subject,
    }).select().single();
    if (ticket) {
      await supabase.from('support_messages').insert({
        ticket_id: ticket.id,
        sender_id: user!.id,
        message,
        is_admin: false,
      });
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      toast.success(text.ticketCreated);
      setOpen(false);
      setSubject('');
      setMessage('');
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    await supabase.from('support_messages').insert({
      ticket_id: selectedTicket,
      sender_id: user!.id,
      message: reply,
      is_admin: false,
    });
    setReply('');
    queryClient.invalidateQueries({ queryKey: ['ticket-messages'] });
    toast.success(text.replySent);
  };

  const activeTicket = myTickets.find((t: any) => t.id === selectedTicket);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> {text.newTicket}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{text.createTicket}</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <Input placeholder={text.subject} value={subject} onChange={e => setSubject(e.target.value)} required />
                <Textarea placeholder={text.issue} value={message} onChange={e => setMessage(e.target.value)} required rows={4} />
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{text.submit}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {myTickets.map((t: any) => (
              <div key={t.id} onClick={() => setSelectedTicket(t.id)} className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedTicket === t.id ? 'bg-accent' : ''}`}>
                <div className="flex items-center justify-between mb-1 gap-2">
                  <p className="text-sm font-medium truncate text-foreground">{t.subject}</p>
                  <StatusBadge status={t.status} />
                </div>
                {t.created_by_admin && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase font-medium inline-block mb-1">
                    {language === 'fr' ? "Reçu de l'admin" : 'From admin'}
                  </span>
                )}
                <p className="text-xs text-muted-foreground">{format(new Date(t.created_at), 'MMM dd, yyyy')}</p>
              </div>
            ))}
            {myTickets.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">{text.noTickets}</p>}
          </div>
          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col min-h-[400px]">
            {activeTicket ? (
              <>
                <div className="p-4 border-b border-border"><h3 className="font-semibold text-foreground">{activeTicket.subject}</h3></div>
                <div className="flex-1 p-4 space-y-3 overflow-auto">
                  {messages.map((m: any) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${!m.is_admin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl p-3 ${!m.is_admin ? 'gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{m.message}</p>
                        <p className={`text-xs mt-1 ${!m.is_admin ? 'opacity-70' : 'text-muted-foreground'}`}>{format(new Date(m.created_at), 'HH:mm')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input placeholder={text.replyPlaceholder} value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} />
                  <Button onClick={handleReply} className="gradient-primary border-0 text-primary-foreground"><Send className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">{text.selectTicket}</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SupportPage;
