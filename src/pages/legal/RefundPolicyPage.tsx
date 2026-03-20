import { Link } from 'react-router-dom';
import { PublicHeader } from '@/components/PublicHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const sections = [
  { title: '1. Eligibility', content: 'Refunds are available for verified transactions where the product or service was not delivered, was defective, did not match the seller\'s description, or was charged in error. Refund requests must be submitted within 30 days of the original transaction.' },
  { title: '2. Refund Process', content: 'Submit a refund request through your dashboard with relevant proof (receipts, screenshots). Our team reviews each request within 1-3 business days. You will be notified via email and in-app notifications of the decision.' },
  { title: '3. Processing Times', content: 'Approved refunds are credited to your RefundPayPro wallet immediately. Withdrawals to external accounts take: Bank Transfer (1-5 business days), PayPal (1-2 business days), Mobile Money (instant to 24 hours), Crypto (10-60 minutes).' },
  { title: '4. Partial Refunds', content: 'In some cases, partial refunds may be issued when only part of a service was unsatisfactory, the product was used before the return, or administrative fees apply to the original transaction.' },
  { title: '5. Non-Refundable Items', content: 'Certain transactions are not eligible for refunds: completed digital services that were delivered as described, transactions older than 90 days, previously refunded transactions, and transactions flagged for fraud.' },
  { title: '6. Dispute Resolution', content: 'If you disagree with a refund decision, you can appeal through our support ticket system within 14 days. Appeals are reviewed by a senior team member and you will receive a final decision within 5 business days.' },
  { title: '7. Fraud Prevention', content: 'Fraudulent refund requests will result in account suspension and potential legal action. We reserve the right to deny refunds where fraud is suspected and to report fraudulent activity to relevant authorities.' },
];

const RefundPolicyPage = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const localizedSections = isFr ? [
    { title: '1. Éligibilité', content: 'Les remboursements sont disponibles pour les transactions vérifiées lorsque le produit ou service n’a pas été livré, était défectueux, ne correspondait pas à la description ou a été facturé par erreur.' },
    { title: '2. Processus', content: 'Soumettez une demande de remboursement depuis votre tableau de bord avec vos justificatifs. Notre équipe examine chaque demande sous 1 à 3 jours ouvrables.' },
    { title: '3. Délais de traitement', content: 'Les remboursements approuvés sont crédités sur votre portefeuille RefundPayPro. Les retraits externes dépendent de la méthode choisie.' },
    { title: '4. Remboursements partiels', content: 'Dans certains cas, des remboursements partiels peuvent être accordés lorsque seule une partie du service ou du produit est concernée.' },
    { title: '5. Éléments non remboursables', content: 'Certaines transactions ne sont pas éligibles, notamment les services numériques déjà consommés, les transactions trop anciennes ou suspectées de fraude.' },
    { title: '6. Litiges', content: 'Si vous n’êtes pas d’accord avec une décision, vous pouvez faire appel via le support dans les délais prévus.' },
    { title: '7. Prévention de la fraude', content: 'Les demandes frauduleuses peuvent entraîner une suspension du compte et des actions supplémentaires si nécessaire.' },
  ] : sections;
  return (
  <div className="min-h-screen bg-background">
    <PublicHeader showNavLinks={false} />

    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-foreground mb-2">{isFr ? 'Politique de remboursement' : 'Refund Policy'}</h1>
      <p className="text-muted-foreground mb-10">{isFr ? 'Dernière mise à jour : 1 mars 2026' : 'Last updated: March 1, 2026'}</p>
      <div className="space-y-8">
        {localizedSections.map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold text-foreground mb-2">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>

    <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground bg-card">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <Link to="/privacy" className="hover:text-foreground transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
        <Link to="/terms" className="hover:text-foreground transition-colors">{isFr ? 'Conditions' : 'Terms'}</Link>
        <Link to="/refund-policy" className="text-foreground">{isFr ? 'Politique de remboursement' : 'Refund Policy'}</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
      </div>
      © 2015 RefundPayPro. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
    </footer>
  </div>
);};

export default RefundPolicyPage;
