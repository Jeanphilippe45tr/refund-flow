import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  profilePhoto: string;
  role: 'admin' | 'client' | 'super_admin';
  createdAt: string;
  suspended: boolean;
  phone?: string;
  country?: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

async function fetchAppUser(supabaseUser: SupabaseUser): Promise<AppUser | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', supabaseUser.id)
    .single();

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', supabaseUser.id)
    .single();

  if (!profile) return null;

  return {
    id: supabaseUser.id,
    name: profile.name,
    email: profile.email,
    balance: Number(profile.balance),
    profilePhoto: profile.profile_photo || '',
    role: (roleData?.role as 'admin' | 'client' | 'super_admin') || 'client',
    createdAt: profile.created_at,
    suspended: false,
    phone: profile.phone || undefined,
    country: profile.country || undefined,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Use setTimeout to avoid potential deadlock with Supabase auth
        setTimeout(async () => {
          const appUser = await fetchAppUser(session.user);
          setUser(appUser);
          setLoading(false);
        }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const appUser = await fetchAppUser(session.user);
        setUser(appUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    return !error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<AppUser>) => {
    if (!user) return;
    const updates: Record<string, unknown> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.email !== undefined) updates.email = data.email;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.country !== undefined) updates.country = data.country;
    if (data.profilePhoto !== undefined) updates.profile_photo = data.profilePhoto;

    await supabase.from('profiles').update(updates).eq('user_id', user.id);
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, [user]);

  const refreshUser = useCallback(async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
      const appUser = await fetchAppUser(supabaseUser);
      setUser(appUser);
    }
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refreshUser, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
