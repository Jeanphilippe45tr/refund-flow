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

const AdminSupport = () => {
  const { users, tickets, sendTicketMessage } = useAuth();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const activeTicket = tickets.find(t => t.id === selectedTicket);
  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  const handleReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    sendTicketMessage(selectedTicket, reply);
    setReply('');
    toast.success('Reply sent');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border divide-y divide-border max-h-[600px] overflow-auto">
            {tickets.map(t => (
              <div key={t.id} onClick={() => setSelectedTicket(t.id)} className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedTicket === t.id ? 'bg-accent' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{t.subject}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-muted-foreground">{getUserName(t.userId)} · {format(new Date(t.createdAt), 'MMM dd')}</p>
              </div>
            ))}
            {tickets.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No tickets</p>}
          </div>

          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col min-h-[500px]">
            {activeTicket ? (
              <>
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">{activeTicket.subject}</h3>
                  <p className="text-xs text-muted-foreground">From: {getUserName(activeTicket.userId)}</p>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-auto">
                  {activeTicket.messages.map(m => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl p-3 ${m.senderRole === 'admin' ? 'gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-xs font-medium mb-1">{m.senderRole === 'admin' ? 'You' : getUserName(activeTicket.userId)}</p>
                        <p className="text-sm">{m.message}</p>
                        <p className={`text-xs mt-1 ${m.senderRole === 'admin' ? 'opacity-70' : 'text-muted-foreground'}`}>{format(new Date(m.createdAt), 'HH:mm')}</p>
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
