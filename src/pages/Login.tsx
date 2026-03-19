import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import loginHero from '@/assets/login-hero.png';
import { LanguageCurrencyToggle } from '@/components/LanguageCurrencyToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      toast.success(t('login.welcomeBack') + '!');
    } else {
      toast.error('Invalid credentials or account suspended');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-primary-foreground/20" style={{
              width: `${200 + i * 150}px`, height: `${200 + i * 150}px`,
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            }} />
          ))}
        </div>
        <div className="text-center text-primary-foreground z-10 px-12">
          <img src={loginHero} alt="Secure login" className="w-64 h-64 mx-auto mb-6 object-contain" />
          <h2 className="text-4xl font-bold mb-4">RefundPayPro</h2>
          <p className="text-lg opacity-90">{t('login.platformDesc')}</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 lg:hidden hover:opacity-80 transition-opacity">
              <img src="/RefunPayPro-logo.png" alt="RefundPayPro Home" className="h-8 w-auto" />
              <span className="text-xl font-bold">RefundPayPro</span>
            </Link>
            <LanguageCurrencyToggle />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{t('login.welcomeBack')}</h1>
          <p className="text-muted-foreground mb-8">{t('login.signInDesc')}</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="password">{t('login.password')}</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 gradient-primary border-0 text-primary-foreground">
              {loading ? t('login.signingIn') : t('login.signIn')}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t('login.noAccount')} <Link to="/register" className="text-primary font-semibold hover:underline">{t('login.createOne')}</Link>
          </p>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="text-primary font-semibold hover:underline">{t('login.backHome')}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
