import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, Camera } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, email });
    toast.success('Profile updated!');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2"><User className="w-4 h-4" /> Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" className="gradient-primary border-0 text-primary-foreground">Save Changes</Button>
          </form>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-semibold mb-4 text-foreground">Account Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="capitalize font-medium text-foreground">{user?.role}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Balance</span><span className="font-medium text-foreground">${user?.balance?.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span className="font-medium text-foreground">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</span></div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
