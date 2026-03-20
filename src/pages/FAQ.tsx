import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { PublicHeader } from '@/components/PublicHeader';

const FAQ = () => {
  const { t } = useLanguage();

  const categories = [
    {
      title: t('faq.refundProcess'),
      faqs: [
        { q: t('faq.refundTimeQ'), a: t('faq.refundTimeA') },
        { q: t('faq.refundConditionsQ'), a: t('faq.refundConditionsA') },
        { q: t('faq.serviceFeesQ'), a: t('faq.serviceFeesA') },
        { q: t('faq.onboardingFeeQ'), a: t('faq.onboardingFeeA') },
        { q: t('faq.cancelRefundQ'), a: t('faq.cancelRefundA') },
        { q: t('faq.rejectedRefundQ'), a: t('faq.rejectedRefundA') },
      ],
    },
    {
      title: t('faq.requiredDocs'),
      faqs: [
        { q: t('faq.requiredDocsQ1'), a: t('faq.requiredDocsA1') },
        { q: t('faq.requiredDocsQ2'), a: t('faq.requiredDocsA2') },
        { q: t('faq.requiredDocsQ3'), a: t('faq.requiredDocsA3') },
      ],
    },
    {
      title: t('faq.paymentMethods'),
      faqs: [
        { q: t('faq.paymentMethodsQ1'), a: t('faq.paymentMethodsA1') },
        { q: t('faq.paymentMethodsQ2'), a: t('faq.paymentMethodsA2') },
        { q: t('faq.paymentMethodsQ3'), a: t('faq.paymentMethodsA3') },
        { q: t('faq.paymentMethodsQ4'), a: t('faq.paymentMethodsA4') },
      ],
    },
    {
      title: t('faq.accountSecurity'),
      faqs: [
        { q: t('faq.accountSecurityQ1'), a: t('faq.accountSecurityA1') },
        { q: t('faq.accountSecurityQ2'), a: t('faq.accountSecurityA2') },
        { q: t('faq.accountSecurityQ3'), a: t('faq.accountSecurityA3') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-foreground">{t('faq.title')} <span className="text-gradient">{t('faq.titleHighlight')}</span></h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('faq.desc')}</p>
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
          <h3 className="text-xl font-bold text-foreground mb-2">{t('faq.stillQuestions')}</h3>
          <p className="text-muted-foreground mb-4">{t('faq.supportAvail')}</p>
          <Link to="/contact"><Button className="gradient-primary border-0 text-primary-foreground">{t('faq.contactSupport')} <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
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

export default FAQ;
