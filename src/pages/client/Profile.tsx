import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Globe, Camera, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  country: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const emailSchema = z.object({
  newEmail: z.string().email('Invalid email'),
});

const ProfilePage = () => {
  const { user, updateProfile, refreshUser } = useAuth();

  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      country: user?.country || '',
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  // Email form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(user?.profilePhoto || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    profileForm.reset({
      name: user?.name || '',
      phone: user?.phone || '',
      country: user?.country || '',
    });
  }, [user]);

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to documents bucket (existing)
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `photo-${timestamp}.${fileExt || 'jpg'}`;
      const filePath = `profile/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Ensure signed URL if private
      const { data: signedUrl } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      // Update profile
      await updateProfile({ profilePhoto: publicUrl });
      setProfilePhotoPreview(signedUrl || publicUrl);
      toast.success('Profile photo updated!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo. Check console.');
    } finally {
      setUploading(false);
    }
  };

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    await updateProfile(values);
    toast.success('Profile updated!');
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });
    if (error) {
      toast.error('Failed to change password');
    } else {
      passwordForm.reset();
      toast.success('Password changed successfully!');
    }
  };

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    const { error } = await supabase.auth.updateUser({
      email: values.newEmail,
    });
    if (error) {
      toast.error('Failed to change email');
    } else {
      emailForm.reset();
      toast.success('Email change requested. Check your inbox for confirmation.');
      await refreshUser();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your profile, password, and account settings</p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" /> Password
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" /> Email
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-32 flex flex-col items-center">
                        <div className="relative mb-2">
                          <img 
                            src={profilePhotoPreview || '/placeholder.svg'} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                            onError={(e) => {
                              console.log('Image load error:', profilePhotoPreview);
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                            <Camera className="w-5 h-5" />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleProfilePhotoUpload}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground text-center">Click camera to change photo</span>
                      </div>
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder=" +1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={profileForm.formState.isSubmitting}>
                      Save Profile Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-semibold capitalize">{user?.role}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Balance</span>
                  <span className="font-semibold">${user?.balance?.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-semibold">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-xs">{user?.id.slice(-6)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Enter your current password and new password</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Current password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="New password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={passwordForm.formState.isSubmitting}>
                      Change Password
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Change Email</CardTitle>
                <CardDescription>Supabase will send confirmation to new email</CardDescription>
              </CardHeader>
              <CardContent className="max-w-md">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="newEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="new@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={emailForm.formState.isSubmitting}>
                      Update Email
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;

