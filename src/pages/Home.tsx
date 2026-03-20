import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Zap, RefreshCw, CreditCard, Star, CheckCircle, Users, TrendingUp, ChevronDown } from 'lucide-react';
import heroIllustration from '@/assets/hero-illustration.png';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { PublicHeader } from '@/components/PublicHeader';

const Home = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('home.refundsProcessed'), value: '150K+', icon: RefreshCw },
    { label: t('home.successRate'), value: '99.2%', icon: TrendingUp },
    { label: t('home.happyClients'), value: '50K+', icon: Users },
    { label: t('home.countriesServed'), value: '80+', icon: Shield },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'E-commerce Owner', text: t('testimonial1'), rating: 5 },
    { name: 'Michael Chen', role: 'Freelancer', text: t('testimonial2'), rating: 5 },
    { name: 'Amira Osei', role: 'Digital Marketer', text: t('testimonial3'), rating: 5 },
  ];

  const faqs = [
    { q: t('home.faq1Q'), a: t('home.faq1A') },
    { q: t('home.faq2Q'), a: t('home.faq2A') },
    { q: t('home.faq3Q'), a: t('home.faq3A') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero */}
      <section className="px-6 md:px-12 py-20 md:py-32 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-border mb-6 text-sm font-medium text-accent-foreground">
            <Zap className="w-4 h-4" /> {t('home.trusted')}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-foreground">
            {t('home.heroTitle1')}
            <br />
            <span className="text-gradient">{t('home.heroTitle2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{t('home.heroDesc')}</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register">
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground px-8 h-12 text-base">
                {t('home.requestRefund')} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">{t('home.learnMore')}</Button>
            </Link>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="mt-12">
            <img src={heroIllustration} alt="RefundPayPro platform illustration" className="max-w-2xl mx-auto w-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('home.howItWorks')}</h2>
            <p className="text-muted-foreground text-lg">{t('home.howItWorksDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: t('home.step01'), desc: t('home.step01Desc') },
              { step: '02', title: t('home.step02'), desc: t('home.step02Desc') },
              { step: '03', title: t('home.step03'), desc: t('home.step03Desc') },
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('home.whyChoose')}</h2>
            <p className="text-muted-foreground text-lg">{t('home.whyChooseDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: RefreshCw, title: t('home.instantRefunds'), desc: t('home.instantRefundsDesc') },
              { icon: CreditCard, title: t('home.flexibleWithdrawals'), desc: t('home.flexibleWithdrawalsDesc') },
              { icon: Shield, title: t('home.fraudProtection'), desc: t('home.fraudProtectionDesc') },
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('home.testimonials')}</h2>
          <p className="text-muted-foreground text-lg">{t('home.testimonialsDesc')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((te, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: te.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">"{te.text}"</p>
              <div>
                <p className="font-semibold text-foreground">{te.name}</p>
                <p className="text-sm text-muted-foreground">{te.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="px-6 md:px-12 py-20 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{t('home.faqTitle')}</h2>
            <p className="text-muted-foreground text-lg">{t('home.faqDesc')}</p>
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
            <Link to="/faq"><Button variant="outline">{t('home.viewAllFaqs')} <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="gradient-primary rounded-3xl p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">{t('home.ctaDesc')}</p>
          <Link to="/register">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 text-base font-semibold">
              {t('home.getStartedFree')} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 md:px-12 bg-card">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/RefunPayPro-logo.png" alt="RefundPayPro" className="h-8 w-auto" />
              <span className="text-xl font-bold text-foreground">RefundPayPro</span>
            </div>
            <p className="text-sm text-muted-foreground">{t('footer.desc')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.company')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground transition-colors">{t('footer.aboutUs')}</Link>
              <Link to="/services" className="hover:text-foreground transition-colors">{t('nav.services')}</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">{t('nav.contact')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.support')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/faq" className="hover:text-foreground transition-colors">{t('nav.faq')}</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">{t('footer.helpCenter')}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.legal')}</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer.privacy')}</Link>
              <Link to="/refund-policy" className="hover:text-foreground transition-colors">{t('footer.refundPolicy')}</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">{t('footer.terms')}</Link>
              <Link to="/cookies" className="hover:text-foreground transition-colors">{t('footer.cookies')}</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2015 RefundPayPro. {t('footer.rights')}
        </div>
      </footer>
    </div>
  );
};

export default Home;
