import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, RefreshCw, AlertTriangle, Monitor, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PublicHeader } from '@/components/PublicHeader';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: ShoppingCart, title: t('services.onlinePurchase'), desc: t('services.onlinePurchaseDesc'),
      features: ['E-commerce order disputes', 'Wrong item received', 'Defective product claims', 'Non-delivery refunds'],
    },
    {
      icon: RefreshCw, title: t('services.subscription'), desc: t('services.subscriptionDesc'),
      features: ['Unwanted auto-renewals', 'Trial-to-paid disputes', 'Service quality claims', 'Duplicate charges'],
    },
    {
      icon: AlertTriangle, title: t('services.paymentDispute'), desc: t('services.paymentDisputeDesc'),
      features: ['Chargeback support', 'Merchant negotiation', 'Evidence gathering', 'Dispute resolution'],
    },
    {
      icon: Monitor, title: t('services.digitalProduct'), desc: t('services.digitalProductDesc'),
      features: ['Software license refunds', 'Course & training disputes', 'SaaS subscription issues', 'In-app purchase disputes'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="px-6 md:px-12 py-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">{t('services.title')} <span className="text-gradient">{t('services.titleHighlight')}</span></h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">{t('services.desc')}</p>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-primary rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">{t('services.ctaTitle')}</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{t('services.ctaDesc')}</p>
          <Link to="/register">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 font-semibold">
              {t('home.requestRefund')} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
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

export default Services;
