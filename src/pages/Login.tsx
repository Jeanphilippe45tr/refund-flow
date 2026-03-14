import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OTPVerification } from '@/components/OTPVerification';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import loginHero from '@/assets/login-hero.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    if (success) {
      // Get user id for OTP
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setTempUserId(user.id);
        // Send OTP
        await sendOTP(user.id, email);
        // Sign out temporarily until OTP verified
        await supabase.auth.signOut();
        setOtpStep(true);
      }
    } else {
      toast.error('Invalid credentials or account suspended');
    }
    setLoading(false);
  };

  const sendOTP = async (userId: string, userEmail: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { user_id: userId, email: userEmail },
      });
      if (error) throw error;
      toast.success('Verification code sent to your email');
    } catch {
      toast.error('Failed to send verification code');
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { email, code },
      });
      if (error) throw error;
      if (data?.valid) {
        // OTP valid, sign back in
        const success = await login(email, password);
        if (success) {
          toast.success('Welcome back!');
        }
      } else {
        toast.error('Invalid or expired code. Please try again.');
      }
    } catch {
      toast.error('Verification failed');
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    await sendOTP(tempUserId, email);
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
          <h2 className="text-4xl font-bold mb-4">RefundPay</h2>
          <p className="text-lg opacity-90">
            {otpStep
              ? 'Two-factor authentication keeps your account safe'
              : 'Your trusted platform for seamless refund management'
            }
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        {otpStep ? (
          <OTPVerification
            email={email}
            onVerify={handleVerifyOTP}
            onResend={handleResendOTP}
            onBack={() => setOtpStep(false)}
            loading={loading}
          />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">RefundPay</span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1.5 h-11" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1.5">
                  <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 gradient-primary border-0 text-primary-foreground">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Login;
