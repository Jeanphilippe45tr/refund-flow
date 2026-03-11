import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import aboutTeam from '@/assets/about-team.jpg';
import { Zap, Shield, Users, Award, Target, Heart, Clock, ArrowRight } from 'lucide-react';

const team = [
  { name: 'Philippe Makoun', role: 'Founder & CEO', bio: 'Fintech visionary with 10+ years in digital payments.' },
  { name: 'Amara Diallo', role: 'CTO', bio: 'Former lead engineer at a top payment processor.' },
  { name: 'James Mitchell', role: 'Head of Operations', bio: 'Expert in compliance and financial operations.' },
  { name: 'Linda Nguyen', role: 'Customer Success Lead', bio: 'Passionate about creating exceptional user experiences.' },
];

const milestones = [
  { year: '2020', event: 'RefundPay founded with a mission to simplify refunds.' },
  { year: '2021', event: 'Reached 10,000 users and processed $5M in refunds.' },
  { year: '2022', event: 'Expanded to 40+ countries with multi-currency support.' },
  { year: '2023', event: 'Launched advanced fraud detection and crypto withdrawals.' },
  { year: '2024', event: '50,000+ active users and 150K+ refunds processed.' },
];

const About = () => (
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
        <Link to="/about" className="text-foreground">About</Link>
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
    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">About <span className="text-gradient">RefundPay</span></h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to make refunds effortless, transparent, and accessible for everyone across the globe.
        </p>
      </motion.div>
    </section>

    {/* Mission */}
    <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { icon: Target, title: 'Our Mission', desc: 'To provide a seamless, secure, and fast refund experience for individuals and businesses worldwide.' },
          { icon: Heart, title: 'Our Values', desc: 'Transparency, trust, and user-first design guide every decision we make.' },
          { icon: Award, title: 'Our Promise', desc: 'We commit to processing every legitimate refund with speed and integrity.' },
        ].map((v, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="text-center p-8">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <v.icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{v.title}</h3>
            <p className="text-muted-foreground">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Trust Indicators */}
    <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Trust Us</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { value: '99.2%', label: 'Success Rate' },
          { value: '150K+', label: 'Refunds Processed' },
          { value: '80+', label: 'Countries' },
          { value: '24/7', label: 'Support Available' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Team */}
    <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <img src={aboutTeam} alt="Our team at work" className="w-full rounded-2xl object-cover max-h-80 mb-8" />
        </div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg">The people behind RefundPay</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-background border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary-foreground">
                {m.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="font-semibold text-foreground">{m.name}</h3>
              <p className="text-sm text-primary font-medium mb-2">{m.role}</p>
              <p className="text-sm text-muted-foreground">{m.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="px-6 md:px-12 py-20 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Journey</h2>
      </div>
      <div className="space-y-6">
        {milestones.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="flex gap-4 items-start">
            <div className="w-16 h-10 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">{m.year}</div>
            <p className="text-muted-foreground pt-2">{m.event}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Footer */}
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

export default About;
