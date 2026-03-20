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
import { useLanguage } from '@/contexts/LanguageContext';

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

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });

const resizeProfilePhoto = async (file: File) => {
  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);

  const maxSize = 320;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Failed to prepare image');

  context.drawImage(image, 0, 0, width, height);

  const output = canvas.toDataURL('image/jpeg', 0.82);
  if (output.length > 700_000) {
    throw new Error('Image is still too large after compression');
  }

  return output;
};

const ProfilePage = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const { language } = useLanguage();
  const text = language === 'fr'
    ? {
        settings: 'Paramètres',
        manage: 'Gérez votre profil, mot de passe et paramètres du compte',
        profile: 'Profil',
        password: 'Mot de passe',
        email: 'Email',
        profileInfo: 'Informations du profil',
        updateInfo: 'Mettez à jour vos informations personnelles',
        fullName: 'Nom complet',
        clickCamera: 'Cliquez sur l’appareil photo pour changer la photo',
        uploadingPhoto: 'Téléversement de la photo...',
        phone: 'Téléphone',
        country: 'Pays',
        saveProfile: 'Enregistrer les modifications',
        accountInfo: 'Informations du compte',
        role: 'Rôle',
        balance: 'Solde',
        memberSince: 'Membre depuis',
        changePassword: 'Changer le mot de passe',
        passwordDesc: 'Entrez votre mot de passe actuel et votre nouveau mot de passe',
        currentPassword: 'Mot de passe actuel',
        newPassword: 'Nouveau mot de passe',
        confirmPassword: 'Confirmer le nouveau mot de passe',
        changePasswordBtn: 'Changer le mot de passe',
        changeEmail: 'Changer l’email',
        emailDesc: 'Supabase enverra une confirmation à la nouvelle adresse',
        newEmail: 'Nouvel email',
        updateEmail: 'Mettre à jour l’email',
        validImage: 'Veuillez sélectionner une image valide',
        fileLimit: 'La taille du fichier doit être inférieure à 10MB',
        photoUpdated: 'Photo de profil mise à jour !',
        uploadFailed: 'Échec du téléversement de la photo. Veuillez réessayer.',
        profileUpdated: 'Profil mis à jour !',
        changePasswordFailed: 'Impossible de changer le mot de passe',
        passwordChanged: 'Mot de passe changé avec succès !',
        emailFailed: 'Impossible de changer l’email',
        emailRequested: 'Changement d’email demandé. Vérifiez votre boîte mail pour confirmer.',
      }
    : {
        settings: 'Settings',
        manage: 'Manage your profile, password, and account settings',
        profile: 'Profile',
        password: 'Password',
        email: 'Email',
        profileInfo: 'Profile Information',
        updateInfo: 'Update your personal information',
        fullName: 'Full Name',
        clickCamera: 'Click camera to change photo',
        uploadingPhoto: 'Uploading photo...',
        phone: 'Phone',
        country: 'Country',
        saveProfile: 'Save Profile Changes',
        accountInfo: 'Account Information',
        role: 'Role',
        balance: 'Balance',
        memberSince: 'Member since',
        changePassword: 'Change Password',
        passwordDesc: 'Enter your current password and new password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        changePasswordBtn: 'Change Password',
        changeEmail: 'Change Email',
        emailDesc: 'Supabase will send confirmation to new email',
        newEmail: 'New Email',
        updateEmail: 'Update Email',
        validImage: 'Please select a valid image file',
        fileLimit: 'File size must be less than 10MB',
        photoUpdated: 'Profile photo updated!',
        uploadFailed: 'Failed to upload photo. Please try again.',
        profileUpdated: 'Profile updated!',
        changePasswordFailed: 'Failed to change password',
        passwordChanged: 'Password changed successfully!',
        emailFailed: 'Failed to change email',
        emailRequested: 'Email change requested. Check your inbox for confirmation.',
      };

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
    setProfilePhotoPreview(user?.profilePhoto || '');
  }, [user]);

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error(text.validImage);
      return;
    }

    // 10MB limit before compression
    if (file.size > 10 * 1024 * 1024) {
      toast.error(text.fileLimit);
      return;
    }

    setUploading(true);
    try {
      const optimizedPhoto = await resizeProfilePhoto(file);
      await updateProfile({ profilePhoto: optimizedPhoto });
      setProfilePhotoPreview(optimizedPhoto);
      toast.success(text.photoUpdated);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(text.uploadFailed);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    await updateProfile(values);
    toast.success(text.profileUpdated);
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });
    if (error) {
      toast.error(text.changePasswordFailed);
    } else {
      passwordForm.reset();
      toast.success(text.passwordChanged);
    }
  };

  const onEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    const { error } = await supabase.auth.updateUser({
      email: values.newEmail,
    });
    if (error) {
      toast.error(text.emailFailed);
    } else {
      emailForm.reset();
      toast.success(text.emailRequested);
      await refreshUser();
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground mb-2">{text.settings}</h1>
          <p className="text-muted-foreground">{text.manage}</p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" /> {text.profile}
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock className="mr-2 h-4 w-4" /> {text.password}
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="mr-2 h-4 w-4" /> {text.email}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{text.profileInfo}</CardTitle>
                <CardDescription>{text.updateInfo}</CardDescription>
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
                              <FormLabel>{text.fullName}</FormLabel>
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
                        <span className="text-xs text-muted-foreground text-center">
                          {uploading ? text.uploadingPhoto : text.clickCamera}
                        </span>
                      </div>
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text.phone}</FormLabel>
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
                          <FormLabel>{text.country}</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={profileForm.formState.isSubmitting}>
                      {text.saveProfile}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{text.accountInfo}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">{text.role}</span>
                  <span className="font-semibold capitalize">{user?.role}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">{text.balance}</span>
                  <span className="font-semibold">${user?.balance?.toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">{text.memberSince}</span>
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
                <CardTitle>{text.changePassword}</CardTitle>
                <CardDescription>{text.passwordDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text.currentPassword}</FormLabel>
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
                          <FormLabel>{text.newPassword}</FormLabel>
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
                          <FormLabel>{text.confirmPassword}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={passwordForm.formState.isSubmitting}>
                      {text.changePasswordBtn}
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
                <CardTitle>{text.changeEmail}</CardTitle>
                <CardDescription>{text.emailDesc}</CardDescription>
              </CardHeader>
              <CardContent className="max-w-md">
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="newEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{text.newEmail}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="new@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground" disabled={emailForm.formState.isSubmitting}>
                      {text.updateEmail}
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
