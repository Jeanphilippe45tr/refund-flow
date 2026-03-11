import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminSupport = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');

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

  const getUserName = (userId: string) => profiles.find((p: any) => p.user_id === userId)?.name || 'Unknown';
  const activeTicket = tickets.find((t: any) => t.id === selectedTicket);

  const handleReply = async () => {
    if (!reply.trim() || !selectedTicket) return;
    await supabase.from('support_messages').insert({
      ticket_id: selectedTicket,
      sender_id: user!.id,
      message: reply,
      is_admin: true,
    });
    setReply('');
    queryClient.invalidateQueries({ queryKey: ['admin-ticket-messages'] });
    toast.success('Reply sent');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border divide-y divide-border max-h-[600px] overflow-auto">
            {tickets.map((t: any) => (
              <div key={t.id} onClick={() => setSelectedTicket(t.id)} className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedTicket === t.id ? 'bg-accent' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate text-foreground">{t.subject}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-muted-foreground">{getUserName(t.user_id)} · {format(new Date(t.created_at), 'MMM dd')}</p>
              </div>
            ))}
            {tickets.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No tickets</p>}
          </div>
          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col min-h-[500px]">
            {activeTicket ? (
              <>
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">{activeTicket.subject}</h3>
                  <p className="text-xs text-muted-foreground">From: {getUserName(activeTicket.user_id)}</p>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-auto">
                  {messages.map((m: any) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.is_admin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl p-3 ${m.is_admin ? 'gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-xs font-medium mb-1">{m.is_admin ? 'You' : getUserName(activeTicket.user_id)}</p>
                        <p className="text-sm">{m.message}</p>
                        <p className={`text-xs mt-1 ${m.is_admin ? 'opacity-70' : 'text-muted-foreground'}`}>{format(new Date(m.created_at), 'HH:mm')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input placeholder="Type a reply..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply()} />
                  <Button onClick={handleReply} className="gradient-primary border-0 text-primary-foreground"><Send className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a ticket</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminSupport;
