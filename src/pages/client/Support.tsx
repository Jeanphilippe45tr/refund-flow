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

const SupportPage = () => {
  const { user, tickets, createTicket, sendTicketMessage } = useAuth();
  const myTickets = tickets.filter(t => t.userId === user?.id);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket(subject, message);
    toast.success('Ticket created!');
    setOpen(false);
    setSubject('');
    setMessage('');
  };

  const handleReply = (ticketId: string) => {
    if (!reply.trim()) return;
    sendTicketMessage(ticketId, reply);
    setReply('');
    toast.success('Reply sent!');
  };

  const activeTicket = myTickets.find(t => t.id === selectedTicket);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Support</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> New Ticket</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
                <Textarea placeholder="Describe your issue..." value={message} onChange={e => setMessage(e.target.value)} required rows={4} />
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Submit Ticket</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {myTickets.map(t => (
              <div key={t.id} onClick={() => setSelectedTicket(t.id)} className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${selectedTicket === t.id ? 'bg-accent' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{t.subject}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-xs text-muted-foreground">{format(new Date(t.createdAt), 'MMM dd, yyyy')}</p>
              </div>
            ))}
            {myTickets.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">No tickets</p>}
          </div>

          <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col min-h-[400px]">
            {activeTicket ? (
              <>
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">{activeTicket.subject}</h3>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-auto">
                  {activeTicket.messages.map(m => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.senderRole === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-xl p-3 ${m.senderRole === 'client' ? 'gradient-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{m.message}</p>
                        <p className={`text-xs mt-1 ${m.senderRole === 'client' ? 'opacity-70' : 'text-muted-foreground'}`}>
                          {format(new Date(m.createdAt), 'HH:mm')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input placeholder="Type a reply..." value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReply(activeTicket.id)} />
                  <Button onClick={() => handleReply(activeTicket.id)} className="gradient-primary border-0 text-primary-foreground"><Send className="w-4 h-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a ticket to view conversation</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SupportPage;
