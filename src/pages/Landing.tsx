import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, RefreshCw, CreditCard } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader showNavLinks={false} />

      {/* Hero */}
      <section className="px-6 md:px-12 py-20 md:py-32 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-6 text-sm font-medium text-accent-foreground">
            <Zap className="w-4 h-4" /> Trusted by 10,000+ businesses
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Manage Refunds
            <br />
            <span className="text-gradient">Effortlessly</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A modern platform to track, process, and manage refunds and withdrawals with complete transparency and control.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8 h-12 text-base">
                Start Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h2>
          <p className="text-muted-foreground text-lg">Powerful tools for managing your refund operations</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: RefreshCw, title: 'Instant Refunds', desc: 'Process refunds in seconds with automated workflows and real-time tracking.' },
            { icon: CreditCard, title: 'Flexible Withdrawals', desc: 'Support for bank, PayPal, Mobile Money, and crypto withdrawals.' },
            { icon: Shield, title: 'Fraud Protection', desc: 'Advanced security with activity monitoring and suspicious transaction flagging.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 md:px-12 text-center text-sm text-muted-foreground">
        © 2024 RefundPayPro. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
