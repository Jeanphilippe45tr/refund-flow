import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using RefundPay, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services. These terms apply to all users, including clients and administrators.' },
  { title: '2. Account Registration', content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 18 years old to use our services.' },
  { title: '3. Services', content: 'RefundPay provides a platform for managing refund requests and withdrawals. We act as an intermediary and do not guarantee the outcome of any refund claim. All refund decisions are subject to review and verification.' },
  { title: '4. User Obligations', content: 'You agree to provide truthful information in refund requests, not submit fraudulent claims, comply with all applicable laws, not attempt to manipulate or exploit the platform, and respect other users and staff.' },
  { title: '5. Fees and Payments', content: 'RefundPay may charge fees for certain services including withdrawal processing. All fees are disclosed before transactions are completed. We reserve the right to modify fees with 30 days notice.' },
  { title: '6. Prohibited Activities', content: 'You may not use the platform for money laundering, fraud, or illegal activities, attempt to gain unauthorized access, interfere with platform operations, create multiple accounts to circumvent restrictions, or submit false refund claims.' },
  { title: '7. Account Suspension', content: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to the platform or other users. Suspended users will be notified with the reason for suspension.' },
  { title: '8. Limitation of Liability', content: 'RefundPay is not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount of fees paid by you in the 12 months preceding the claim. We do not guarantee uninterrupted service.' },
  { title: '9. Governing Law', content: 'These terms are governed by the laws of the State of New York, United States. Any disputes shall be resolved through binding arbitration in New York, NY.' },
  { title: '10. Changes to Terms', content: 'We may update these terms at any time. Material changes will be communicated via email or platform notification. Continued use after changes constitutes acceptance of the updated terms.' },
];

const TermsOfService = () => (
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
      <h1 className="text-4xl font-extrabold text-foreground mb-2">Terms of Service</h1>
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
        <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        <Link to="/terms" className="text-foreground">Terms</Link>
        <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
      </div>
      © {new Date().getFullYear()} RefundPay. All rights reserved.
    </footer>
  </div>
);

export default TermsOfService;
