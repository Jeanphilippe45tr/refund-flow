import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import aboutTeam from '@/assets/about-team.jpg';
import { Shield, Users, Award, Target, Heart, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PublicHeader } from '@/components/PublicHeader';

const team = [
  { name: 'Philippe Makoun', role: 'Founder & CEO', bio: 'Fintech visionary with 10+ years in digital payments.' },
  { name: 'Amara Diallo', role: 'CTO', bio: 'Former lead engineer at a top payment processor.' },
  { name: 'James Mitchell', role: 'Head of Operations', bio: 'Expert in compliance and financial operations.' },
  { name: 'Linda Nguyen', role: 'Customer Success Lead', bio: 'Passionate about creating exceptional user experiences.' },
];

const milestones = [
  { year: '2020', event: 'RefundPayPro founded with a mission to simplify refunds.' },
  { year: '2021', event: 'Reached 10,000 users and processed $5M in refunds.' },
  { year: '2022', event: 'Expanded to 40+ countries with multi-currency support.' },
  { year: '2023', event: 'Launched advanced fraud detection and crypto withdrawals.' },
  { year: '2024', event: '50,000+ active users and 150K+ refunds processed.' },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">{t('about.title')} <span className="text-gradient">RefundPayPro</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t('about.desc')}</p>
        </motion.div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: t('about.mission'), desc: t('about.missionDesc') },
            { icon: Heart, title: t('about.values'), desc: t('about.valuesDesc') },
            { icon: Award, title: t('about.promise'), desc: t('about.promiseDesc') },
          ].map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center p-8">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{v.title}</h3>
              <p className="text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('about.whyTrust')}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '99.2%', label: t('home.successRate') },
            { value: '150K+', label: t('home.refundsProcessed') },
            { value: '80+', label: t('about.countries') },
            { value: '24/7', label: t('about.supportAvailable') },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <img src={aboutTeam} alt="Our team at work" className="w-full rounded-2xl object-cover max-h-80 mb-8" />
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('about.meetTeam')}</h2>
            <p className="text-muted-foreground text-lg">{t('about.meetTeamDesc')}</p>
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

      <section className="px-6 md:px-12 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('about.ourJourney')}</h2>
        </div>
        <div className="space-y-6">
          {milestones.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4 items-start">
              <div className="w-16 h-10 rounded-lg gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">{m.year}</div>
              <p className="text-muted-foreground pt-2">{m.event}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 md:px-12 text-center text-sm text-muted-foreground bg-card">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
          <Link to="/refund-policy" className="hover:text-foreground transition-colors">{t('footer.refundPolicy')}</Link>
          <Link to="/cookies" className="hover:text-foreground transition-colors">{t('footer.cookies')}</Link>
        </div>
        © 2015 RefundPayPro. {t('footer.rights')}
      </footer>
    </div>
  );
};

export default About;
