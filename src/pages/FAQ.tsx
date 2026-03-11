import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const categories = [
  {
    title: 'Refund Process',
    faqs: [
      { q: 'How long does a refund take?', a: 'Most refunds are processed within 1-3 business days. Bank transfers may take up to 5 business days depending on your financial institution.' },
      { q: 'What are the refund conditions?', a: 'Refunds are issued for verified transactions where the product or service was not delivered as promised, was defective, or did not match the description.' },
      { q: 'Can I cancel a refund request?', a: 'Yes, you can cancel a pending refund request from your dashboard. Once a refund has been approved and processed, it cannot be reversed.' },
      { q: 'What if my refund is rejected?', a: 'If your refund is rejected, you will receive a detailed explanation from our admin team. You can appeal the decision by opening a support ticket.' },
    ],
  },
  {
    title: 'Required Documents',
    faqs: [
      { q: 'What documents do I need for a refund?', a: 'Typically you need proof of purchase (receipt, order confirmation), evidence of the issue (screenshots, photos), and your identification.' },
      { q: 'Do I need to provide bank statements?', a: 'Bank statements may be required for certain disputes to verify the original transaction. We only ask for this when absolutely necessary.' },
      { q: 'How do I upload proof documents?', a: 'You can upload documents directly through your dashboard when submitting a refund request or through the support ticket system.' },
    ],
  },
  {
    title: 'Payment Methods',
    faqs: [
      { q: 'What withdrawal methods are available?', a: 'We support Bank Transfer, Mobile Money (MTN, Orange, etc.), PayPal, and Cryptocurrency wallets (BTC, ETH, USDT).' },
      { q: 'Are there fees for withdrawals?', a: 'Standard bank transfers are free. PayPal withdrawals have a 2% fee. Crypto and Mobile Money withdrawals have minimal network fees.' },
      { q: 'Can I change my withdrawal method?', a: 'Yes, you can select a different withdrawal method for each withdrawal request. You can also update your default payment method in your profile.' },
      { q: 'What currencies are supported?', a: 'We primarily operate in USD but support conversions to EUR, GBP, XAF, NGN, and major cryptocurrencies.' },
    ],
  },
  {
    title: 'Account & Security',
    faqs: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the instructions sent to your registered email.' },
      { q: 'Is my financial information secure?', a: 'Yes. We use bank-level encryption, two-factor authentication, and comply with international data protection regulations.' },
      { q: 'Can I delete my account?', a: 'Yes, you can request account deletion through your profile settings or by contacting support. All data will be permanently removed within 30 days.' },
    ],
  },
];

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">RefundPay</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
        <Link to="/faq" className="text-foreground">FAQ</Link>
        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
        <Link to="/register"><Button className="gradient-primary border-0 text-primary-foreground">Get Started</Button></Link>
      </div>
    </nav>

    <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">Frequently Asked <span className="text-gradient">Questions</span></h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Find answers to common questions about our refund services.</p>
      </motion.div>
    </section>

    <section className="px-6 md:px-12 pb-20 max-w-3xl mx-auto space-y-12">
      {categories.map((cat, ci) => (
        <motion.div key={ci} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
          <h2 className="text-2xl font-bold text-foreground mb-4">{cat.title}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {cat.faqs.map((f, i) => (
              <AccordionItem key={i} value={`${ci}-${i}`} className="bg-card border border-border rounded-xl px-6">
                <AccordionTrigger className="text-foreground hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      ))}
    </section>

    <section className="px-6 md:px-12 pb-20 max-w-3xl mx-auto text-center">
      <div className="bg-card border border-border rounded-2xl p-8">
        <h3 className="text-xl font-bold text-foreground mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">Our support team is available 24/7 to help you.</p>
        <Link to="/contact"><Button className="gradient-primary border-0 text-primary-foreground">Contact Support <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
      </div>
    </section>

    <footer className="border-t border-border py-8 px-6 md:px-12 text-center text-sm text-muted-foreground bg-card">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
      </div>
      © {new Date().getFullYear()} RefundPay. All rights reserved.
    </footer>
  </div>
);

export default FAQ;
