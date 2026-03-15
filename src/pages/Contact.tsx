import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zap, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">RefundPayPro</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
          <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          <Link to="/contact" className="text-foreground">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
          <Link to="/register"><Button className="gradient-primary border-0 text-primary-foreground">Get Started</Button></Link>
        </div>
      </nav>

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">Get In <span className="text-gradient">Touch</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help? We're here for you 24/7.
          </p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email Us', detail: 'support@RefundPayPro.com', sub: 'We respond within 24 hours' },
              { icon: Phone, title: 'Call Us', detail: '+1 (800) 555-0199', sub: 'Mon-Fri 9AM - 6PM EST' },
              { icon: MessageCircle, title: 'Live Chat', detail: 'Available 24/7', sub: 'Average response: 2 minutes' },
              { icon: MapPin, title: 'Office', detail: '123 Finance Street', sub: 'New York, NY 10001' },
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

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <Input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <Input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              <Textarea placeholder="Your message..." rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              <Button type="submit" className="gradient-primary border-0 text-primary-foreground w-full h-12">Send Message</Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p className="font-medium text-foreground">123 Finance Street, New York, NY 10001</p>
            <p className="text-sm">United States</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 md:px-12 text-center text-sm text-muted-foreground bg-card">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
          <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
        </div>
        © {new Date().getFullYear()} RefundPayPro. All rights reserved.
      </footer>
    </div>
  );
};

export default Contact;
