import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

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

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">RefundPay</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
        <Link to="/register"><Button className="gradient-primary border-0 text-primary-foreground">Get Started</Button></Link>
      </div>
    </nav>

    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: March 1, 2026</p>
      <div className="space-y-8">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold text-foreground mb-2">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>

    <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground bg-card">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <Link to="/privacy" className="text-foreground">Privacy</Link>
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
      </div>
      © {new Date().getFullYear()} RefundPay. All rights reserved.
    </footer>
  </div>
);

export default PrivacyPolicy;
