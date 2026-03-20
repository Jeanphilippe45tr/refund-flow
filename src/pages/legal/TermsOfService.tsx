import { Link } from 'react-router-dom';
import { PublicHeader } from '@/components/PublicHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using RefundPayPro, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services. These terms apply to all users, including clients and administrators.' },
  { title: '2. Account Registration', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 18 years old to use our services.' },
  { title: '3. Services', content: 'RefundPayPro provides a platform for managing refund requests and withdrawals. We act as an intermediary and do not guarantee the outcome of any refund claim. All refund decisions are subject to review and verification.' },
  { title: '4. User Obligations', content: 'You agree to provide truthful information in refund requests, not submit fraudulent claims, comply with all applicable laws, not attempt to manipulate or exploit the platform, and respect other users and staff.' },
  { title: '5. Fees and Payments', content: 'RefundPayPro may charge fees for certain services including withdrawal processing. All fees are disclosed before transactions are completed. We reserve the right to modify fees with 30 days notice.' },
  { title: '6. Prohibited Activities', content: 'You may not use the platform for money laundering, fraud, or illegal activities, attempt to gain unauthorized access, interfere with platform operations, create multiple accounts to circumvent restrictions, or submit false refund claims.' },
  { title: '7. Account Suspension', content: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to the platform or other users. Suspended users will be notified with the reason for suspension.' },
  { title: '8. Limitation of Liability', content: 'RefundPayPro is not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount of fees paid by you in the 12 months preceding the claim. We do not guarantee uninterrupted service.' },
  { title: '9. Governing Law', content: 'These terms are governed by the laws of the State of New York, United States. Any disputes shall be resolved through binding arbitration in New York, NY.' },
  { title: '10. Changes to Terms', content: 'We may update these terms at any time. Material changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance of the updated terms.' },
];

const TermsOfService = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const localizedSections = isFr ? [
    { title: '1. Acceptation des conditions', content: 'En accédant à RefundPayPro ou en utilisant la plateforme, vous acceptez ces conditions d’utilisation.' },
    { title: '2. Création de compte', content: 'Vous devez fournir des informations exactes et complètes et garder vos identifiants confidentiels.' },
    { title: '3. Services', content: 'RefundPayPro fournit une plateforme de gestion des demandes de remboursement et de retrait.' },
    { title: '4. Obligations de l’utilisateur', content: 'Vous vous engagez à fournir des informations sincères et à ne pas utiliser la plateforme à des fins frauduleuses.' },
    { title: '5. Frais et paiements', content: 'Certains services peuvent entraîner des frais clairement affichés avant validation.' },
    { title: '6. Activités interdites', content: 'Toute tentative de fraude, accès non autorisé ou usage illégal est interdite.' },
    { title: '7. Suspension', content: 'Nous pouvons suspendre ou fermer un compte en cas de violation des présentes conditions.' },
    { title: '8. Limitation de responsabilité', content: 'Notre responsabilité est limitée dans les conditions prévues par la loi applicable.' },
    { title: '9. Droit applicable', content: 'Ces conditions sont régies par le droit applicable indiqué par la plateforme.' },
    { title: '10. Modifications', content: 'Nous pouvons mettre à jour ces conditions et vous informerons en cas de changement important.' },
  ] : sections;
  return (
  <div className="min-h-screen bg-background">
    <PublicHeader showNavLinks={false} />

    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-foreground mb-2">{isFr ? 'Conditions d’utilisation' : 'Terms of Service'}</h1>
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
        <Link to="/terms" className="text-foreground">{isFr ? 'Conditions' : 'Terms'}</Link>
        <Link to="/refund-policy" className="hover:text-foreground transition-colors">{isFr ? 'Politique de remboursement' : 'Refund Policy'}</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
      </div>
      © 2015 RefundPayPro. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
    </footer>
  </div>
);};

export default TermsOfService;
