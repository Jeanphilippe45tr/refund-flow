import { Link } from 'react-router-dom';
import { PublicHeader } from '@/components/PublicHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const sections = [
  { title: '1. Information We Collect', content: 'We collect personal information you provide when creating an account (name, email, phone number), financial information for processing refunds and withdrawals (bank details, wallet addresses), and usage data (IP address, browser type, pages visited). We also collect transaction data related to refund requests and withdrawal activities.' },
  { title: '2. How We Use Your Information', content: 'Your information is used to process refund requests and withdrawals, verify your identity, communicate with you about your account and transactions, improve our services, prevent fraud and unauthorized activity, and comply with legal obligations.' },
  { title: '3. Data Sharing', content: 'We do not sell your personal information. We may share data with payment processors to complete transactions, law enforcement when required by law, and service providers who assist in operating our platform under strict confidentiality agreements.' },
  { title: '4. Data Security', content: 'We implement industry-standard security measures including SSL/TLS encryption, secure password hashing, two-factor authentication, regular security audits, and access controls to protect your data.' },
  { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data, opt out of marketing communications, request data portability, and lodge a complaint with a data protection authority.' },
  { title: '6. Cookies', content: 'We use essential cookies for site functionality and analytics cookies to improve our services. You can manage cookie preferences through your browser settings. See our Cookie Policy for more details.' },
  { title: '7. Data Retention', content: 'We retain your data for as long as your account is active or as needed to provide services. Transaction records are kept for 7 years for compliance purposes. You may request deletion at any time.' },
  { title: '8. Changes to This Policy', content: 'We may update this policy periodically. We will notify you of significant changes via email or through our platform. Continued use after changes constitutes acceptance.' },
];

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const localizedSections = isFr ? [
    { title: '1. Informations collectées', content: 'Nous collectons les informations personnelles que vous fournissez lors de la création du compte, les informations financières nécessaires au traitement des remboursements et retraits, ainsi que les données d’utilisation du site.' },
    { title: '2. Utilisation des informations', content: 'Vos données sont utilisées pour traiter les remboursements, vérifier votre identité, communiquer au sujet de votre compte, améliorer nos services et prévenir la fraude.' },
    { title: '3. Partage des données', content: 'Nous ne vendons pas vos données personnelles. Nous pouvons les partager avec des prestataires de paiement, les autorités compétentes lorsque la loi l’exige et certains prestataires techniques.' },
    { title: '4. Sécurité des données', content: 'Nous appliquons des mesures de sécurité standards du secteur, notamment le chiffrement, le contrôle des accès et des audits réguliers.' },
    { title: '5. Vos droits', content: 'Vous pouvez demander l’accès, la correction ou la suppression de vos données, ainsi que limiter certains usages dans les limites prévues par la loi.' },
    { title: '6. Cookies', content: 'Nous utilisons des cookies essentiels et analytiques pour faire fonctionner le site et améliorer l’expérience utilisateur.' },
    { title: '7. Conservation des données', content: 'Nous conservons vos données aussi longtemps que nécessaire pour fournir le service et respecter les obligations légales.' },
    { title: '8. Modifications', content: 'Cette politique peut être mise à jour. En cas de changement important, nous vous en informerons par email ou sur la plateforme.' },
  ] : sections;
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader showNavLinks={false} />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-foreground mb-2">{isFr ? 'Politique de confidentialité' : 'Privacy Policy'}</h1>
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
          <Link to="/privacy" className="text-foreground">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">{isFr ? 'Conditions' : 'Terms'}</Link>
          <Link to="/refund-policy" className="hover:text-foreground transition-colors">{isFr ? 'Politique de remboursement' : 'Refund Policy'}</Link>
          <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
        </div>
        © 2015 RefundPayPro. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
