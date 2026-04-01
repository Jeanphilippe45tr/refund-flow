import { useState } from 'react';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock } from 'lucide-react';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const text = language === 'fr'
    ? {
        title: 'Changer le mot de passe',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le mot de passe',
        update: 'Mettre à jour',
        mismatch: 'Les mots de passe ne correspondent pas',
        tooShort: 'Le mot de passe doit contenir au moins 6 caractères',
        success: 'Mot de passe mis à jour avec succès',
      }
    : {
        title: 'Change Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        update: 'Update Password',
        mismatch: 'Passwords do not match',
        tooShort: 'Password must be at least 6 characters',
        success: 'Password updated successfully',
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error(text.tooShort); return; }
    if (newPassword !== confirmPassword) { toast.error(text.mismatch); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(text.success);
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Lock className="w-6 h-6" /> {text.title}
        </h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div>
            <Label>{text.newPassword}</Label>
            <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1" required />
          </div>
          <div>
            <Label>{text.confirmPassword}</Label>
            <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-primary border-0 text-primary-foreground">
            {loading ? '...' : text.update}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default ChangePassword;
