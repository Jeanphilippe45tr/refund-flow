import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LanguageCurrencyToggle } from '@/components/LanguageCurrencyToggle';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      toast.success(t('register.createAccount') + '!');
    } else {
      toast.error('Email already exists or registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img src="/RefunPayPro-logo.png" alt="RefundPayPro" className="h-8 w-auto" />
            <span className="text-xl font-bold text-foreground">RefundPayPro</span>
          </div>
          <LanguageCurrencyToggle />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">{t('register.createAccount')}</h1>
        <p className="text-muted-foreground mb-8">{t('register.getStarted')}</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">{t('register.fullName')}</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5 h-11" />
          </div>
          <div>
            <Label htmlFor="password">{t('login.password')}</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="mt-1.5 h-11" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 gradient-primary border-0 text-primary-foreground">
            {loading ? t('register.creating') : t('register.create')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('register.hasAccount')} <Link to="/login" className="text-primary font-semibold hover:underline">{t('register.signIn')}</Link>
        </p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="text-primary font-semibold hover:underline">{t('login.backHome')}</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
