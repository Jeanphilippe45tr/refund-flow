import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { PublicHeader } from '@/components/PublicHeader';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        },
      });

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || 'Failed to send message');
      }

      toast.success(t('contact.messageSent'));
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Message not sent. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">{t('contact.title')} <span className="text-gradient">{t('contact.titleHighlight')}</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t('contact.desc')}</p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: Mail, title: t('contact.emailUs'), detail: 'refundpaypro@gmail.com', sub: t('contact.emailResponse') },
              { icon: Phone, title: t('contact.callUs'), detail: '+1 (800) 555-0199', sub: t('contact.callHours') },
              { icon: MessageCircle, title: t('contact.liveChat'), detail: t('contact.liveChatAvail'), sub: t('contact.liveChatResponse') },
              { icon: MapPin, title: t('contact.office'), detail: '123 Finance Street', sub: 'New York, NY 10001' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{c.title}</h3>
                  <p className="text-foreground text-sm">{c.detail}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('contact.sendMessage')}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder={t('contact.yourName')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <Input type="email" placeholder={t('contact.yourEmail')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <Input placeholder={t('contact.subject')} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              <Textarea placeholder={t('contact.yourMessage')} rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              <Button type="submit" disabled={isSubmitting} className="gradient-primary border-0 text-primary-foreground w-full h-12">
                {isSubmitting ? 'Sending...' : t('contact.send')}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p className="font-medium text-foreground">103 Finance Street, New York, NY 10001</p>
            <p className="text-sm">United States</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 md:px-12 text-center text-sm text-muted-foreground bg-card">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
          <Link to="/refund-policy" className="hover:text-foreground transition-colors">{t('footer.refundPolicy')}</Link>
          <Link to="/cookies" className="hover:text-foreground transition-colors">{t('footer.cookies')}</Link>
        </div>
        © {new Date().getFullYear()} RefundPayPro. {t('footer.rights')}
      </footer>
    </div>
  );
};

export default Contact;
