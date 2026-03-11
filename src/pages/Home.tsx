import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, RefreshCw, CreditCard, Star, CheckCircle, Users, TrendingUp, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const stats = [
  { label: 'Refunds Processed', value: '150K+', icon: RefreshCw },
  { label: 'Success Rate', value: '99.2%', icon: TrendingUp },
  { label: 'Happy Clients', value: '50K+', icon: Users },
  { label: 'Countries Served', value: '80+', icon: Shield },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'E-commerce Owner', text: 'RefundPay processed my refund in under 24 hours. The transparency is unmatched.', rating: 5 },
  { name: 'Michael Chen', role: 'Freelancer', text: 'I\'ve been using RefundPay for 2 years. Their withdrawal system is fast and reliable.', rating: 5 },
  { name: 'Amira Osei', role: 'Digital Marketer', text: 'The best refund platform I\'ve ever used. Support team is incredibly helpful.', rating: 5 },
];

const faqs = [
  { q: 'How long does a refund take?', a: 'Most refunds are processed within 1-3 business days depending on the payment method.' },
  { q: 'What payment methods are supported?', a: 'We support Bank Transfer, Mobile Money, PayPal, and Crypto Wallet withdrawals.' },
  { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and security measures to protect all user data.' },
];

const Home = () => (
  <div className="min-h-screen bg-background">
    {/* Nav */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">RefundPay</span>
      </Link>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <Link to="/" className="text-foreground">Home</Link>
        <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
        <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
        <Link to="/register"><Button className="gradient-primary border-0 text-primary-foreground">Get Started</Button></Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="px-6 md:px-12 py-20 md:py-32 max-w-6xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-6 text-sm font-medium text-accent-foreground">
          <Zap className="w-4 h-4" /> Trusted by 50,000+ clients worldwide
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-foreground">
          Get Your Money Back
          <br />
          <span className="text-gradient">Fast & Secure</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          RefundPay helps you recover funds from online purchases, subscriptions, and payment disputes with a seamless, transparent process.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/register">
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8 h-12 text-base">
              Request Refund <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/services">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">Learn More</Button>
          </Link>
        </div>
      </motion.div>
    </section>

    {/* How it works */}
    <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How Refunds Work</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to get your money back</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Submit Request', desc: 'Fill in your refund details and select your preferred withdrawal method.' },
            { step: '02', title: 'Admin Review', desc: 'Our team reviews your request and verifies the transaction within 24 hours.' },
            { step: '03', title: 'Receive Funds', desc: 'Once approved, funds are sent to your chosen payment method instantly.' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">{s.step}</div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all">
            <s.icon className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Choose RefundPay</h2>
          <p className="text-muted-foreground text-lg">Powerful tools for managing your refund operations</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: RefreshCw, title: 'Instant Refunds', desc: 'Process refunds in seconds with automated workflows and real-time tracking.' },
            { icon: CreditCard, title: 'Flexible Withdrawals', desc: 'Support for bank, PayPal, Mobile Money, and crypto withdrawals.' },
            { icon: Shield, title: 'Fraud Protection', desc: 'Advanced security with activity monitoring and suspicious transaction flagging.' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-background rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">What Our Clients Say</h2>
        <p className="text-muted-foreground text-lg">Trusted by thousands of satisfied users</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
            </div>
            <p className="text-muted-foreground mb-6 italic">"{t.text}"</p>
            <div>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* FAQ Preview */}
    <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Quick answers to common questions</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border rounded-xl px-6">
              <AccordionTrigger className="text-foreground hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-8">
          <Link to="/faq"><Button variant="outline">View All FAQs <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-3xl p-12 md:p-16">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Get Your Refund?</h2>
        <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of users who trust RefundPay to recover their funds quickly and securely.</p>
        <Link to="/register">
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 text-base font-semibold">
            Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border py-12 px-6 md:px-12 bg-card">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">RefundPay</span>
          </div>
          <p className="text-sm text-muted-foreground">The modern platform for managing refunds and withdrawals with complete transparency.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About Us</Link>
            <Link to="/services" className="hover:text-foreground transition-colors">Services</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Help Center</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Legal</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RefundPay. All rights reserved.
      </div>
    </footer>
  </div>
);

export default Home;
