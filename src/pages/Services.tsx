import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ShoppingCart, RefreshCw, AlertTriangle, Monitor, ArrowRight, CheckCircle } from 'lucide-react';

const services = [
  {
    icon: ShoppingCart, title: 'Online Purchase Refunds',
    desc: 'Get refunds for products that were never delivered, arrived damaged, or didn\'t match the description.',
    features: ['E-commerce order disputes', 'Wrong item received', 'Defective product claims', 'Non-delivery refunds'],
  },
  {
    icon: RefreshCw, title: 'Subscription Refunds',
    desc: 'Recover charges from unwanted subscriptions, auto-renewals, or services that didn\'t meet expectations.',
    features: ['Unwanted auto-renewals', 'Trial-to-paid disputes', 'Service quality claims', 'Duplicate charges'],
  },
  {
    icon: AlertTriangle, title: 'Payment Dispute Assistance',
    desc: 'We help you navigate chargebacks and payment disputes with merchants and payment processors.',
    features: ['Chargeback support', 'Merchant negotiation', 'Evidence gathering', 'Dispute resolution'],
  },
  {
    icon: Monitor, title: 'Digital Product Refunds',
    desc: 'Recover funds from digital purchases like software, courses, or digital services that didn\'t deliver value.',
    features: ['Software license refunds', 'Course & training disputes', 'SaaS subscription issues', 'In-app purchase disputes'],
  },
];

const Services = () => (
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
        <Link to="/services" className="text-foreground">Services</Link>
        <Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
        <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
        <Link to="/register"><Button className="gradient-primary border-0 text-primary-foreground">Get Started</Button></Link>
      </div>
    </nav>

    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">Our <span className="text-gradient">Services</span></h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We handle all types of refund claims so you can focus on what matters most.
        </p>
      </motion.div>
    </section>

    <section className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {services.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <s.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{s.title}</h3>
            <p className="text-muted-foreground mb-4">{s.desc}</p>
            <ul className="space-y-2">
              {s.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success shrink-0" />{f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="gradient-primary rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-primary-foreground mb-4">Need Help With a Refund?</h2>
        <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Our team is ready to assist you with any refund claim. Get started in minutes.</p>
        <Link to="/register">
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 font-semibold">
            Request Refund <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
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

export default Services;
