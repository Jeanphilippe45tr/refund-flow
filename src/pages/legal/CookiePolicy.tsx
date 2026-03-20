import { Link } from 'react-router-dom';
import { PublicHeader } from '@/components/PublicHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const sections = [
  { title: '1. What Are Cookies', content: 'Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences, keeping you signed in, and understanding how you use our platform.' },
  { title: '2. Essential Cookies', content: 'These cookies are necessary for the website to function properly. They enable core features such as user authentication, session management, and security. You cannot opt out of essential cookies as they are required for the platform to work.' },
  { title: '3. Analytics Cookies', content: 'We use analytics cookies to understand how visitors interact with our platform. This helps us improve our services, identify popular features, and fix issues. Analytics data is aggregated and anonymized.' },
  { title: '4. Functional Cookies', content: 'Functional cookies remember your preferences such as language, currency, and display settings. They enhance your experience but are not strictly necessary for the platform to operate.' },
  { title: '5. Third-Party Cookies', content: 'Some cookies are set by third-party services we use, such as payment processors and analytics providers. These cookies are governed by the respective third party\'s privacy policy.' },
  { title: '6. Managing Cookies', content: 'You can manage cookie preferences through your browser settings. Most browsers allow you to block or delete cookies. Please note that disabling essential cookies may affect platform functionality.' },
  { title: '7. Cookie Retention', content: 'Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period (typically 30 days to 1 year) or until you manually delete them.' },
  { title: '8. Updates to This Policy', content: 'We may update this Cookie Policy periodically to reflect changes in our practices or applicable regulations. We encourage you to review this page regularly.' },
];

const CookiePolicy = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const localizedSections = isFr ? [
    { title: '1. Que sont les cookies', content: 'Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site.' },
    { title: '2. Cookies essentiels', content: 'Ces cookies sont nécessaires au bon fonctionnement du site et de certaines fonctionnalités de sécurité.' },
    { title: '3. Cookies analytiques', content: 'Nous utilisons des cookies analytiques pour comprendre comment les visiteurs utilisent la plateforme et améliorer le service.' },
    { title: '4. Cookies fonctionnels', content: 'Ces cookies mémorisent vos préférences comme la langue, la devise ou certains réglages d’affichage.' },
    { title: '5. Cookies tiers', content: 'Certains cookies peuvent être déposés par des services tiers utilisés par la plateforme.' },
    { title: '6. Gestion des cookies', content: 'Vous pouvez gérer les cookies dans les paramètres de votre navigateur.' },
    { title: '7. Durée de conservation', content: 'Les cookies de session disparaissent à la fermeture du navigateur et les cookies persistants restent plus longtemps selon leur finalité.' },
    { title: '8. Mises à jour', content: 'Cette politique peut être mise à jour périodiquement.' },
  ] : sections;
  return (
  <div className="min-h-screen bg-background">
    <PublicHeader showNavLinks={false} />

    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-foreground mb-2">{isFr ? 'Politique de cookies' : 'Cookie Policy'}</h1>
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
        <Link to="/refund-policy" className="hover:text-foreground transition-colors">{isFr ? 'Politique de remboursement' : 'Refund Policy'}</Link>
        <Link to="/cookies" className="text-foreground">Cookies</Link>
      </div>
      © 2015 RefundPayPro. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
    </footer>
  </div>
);};

export default CookiePolicy;
