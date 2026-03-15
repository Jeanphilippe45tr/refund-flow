import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const sections = [
  { title: '1. Eligibility', content: 'Refunds are available for verified transactions where the product or service was not delivered, was defective, did not match the seller\'s description, or was charged in error. Refund requests must be submitted within 30 days of the original transaction.' },
  { title: '2. Refund Process', content: 'Submit a refund request through your dashboard with relevant proof (receipts, screenshots). Our team reviews each request within 1-3 business days. You will be notified via email and in-app notifications of the decision.' },
  { title: '3. Processing Times', content: 'Approved refunds are credited to your RefundPayPro wallet immediately. Withdrawals to external accounts take: Bank Transfer (1-5 business days), PayPal (1-2 business days), Mobile Money (instant to 24 hours), Crypto (10-60 minutes).' },
  { title: '4. Partial Refunds', content: 'In some cases, partial refunds may be issued when only part of a service was unsatisfactory, the product was used before the return, or administrative fees apply to the original transaction.' },
  { title: '5. Non-Refundable Items', content: 'Certain transactions are not eligible for refunds: completed digital services that were delivered as described, transactions older than 90 days, previously refunded transactions, and transactions flagged for fraud.' },
  { title: '6. Dispute Resolution', content: 'If you disagree with a refund decision, you can appeal through our support ticket system within 14 days. Appeals are reviewed by a senior team member and you will receive a final decision within 5 business days.' },
  { title: '7. Fraud Prevention', content: 'Fraudulent refund requests will result in account suspension and potential legal action. We reserve the right to deny refunds where fraud is suspected and to report fraudulent activity to relevant authorities.' },
];

const RefundPolicyPage = () => (
  <div className="min-h-screen bg-background">
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">RefundPayPro</span>
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/login"><Button variant="ghost">Sign In</Button></Link>
        <Link to="/register"><Button className="gradient-primary border-0 text-primary-foreground">Get Started</Button></Link>
      </div>
    </nav>

    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-foreground mb-2">Refund Policy</h1>
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
        <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        <Link to="/refund-policy" className="text-foreground">Refund Policy</Link>
        <Link to="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
      </div>
      © {new Date().getFullYear()} RefundPayPro. All rights reserved.
    </footer>
  </div>
);

export default RefundPolicyPage;
