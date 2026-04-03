import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export function useBrowserNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const lastCheckRef = useRef<string>(new Date().toISOString());
  const permissionRef = useRef<NotificationPermission>('default');

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      permissionRef.current = 'granted';
      return;
    }
    if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      permissionRef.current = perm;
    }
  }, []);

  useEffect(() => {
    if (user) requestPermission();
  }, [user, requestPermission]);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const since = lastCheckRef.current;
      const { data: newNotifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .gt('created_at', since)
        .order('created_at', { ascending: false });

      if (newNotifs && newNotifs.length > 0) {
        lastCheckRef.current = newNotifs[0].created_at;
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });

        if (permissionRef.current === 'granted') {
          newNotifs.forEach((n) => {
            try {
              new Notification(n.title, {
                body: n.message,
                icon: '/RefunPayPro-logo.png',
                tag: n.id,
              });
            } catch {
              // mobile or restricted env
            }
          });
        }
      }
    }, 15000); // poll every 15s

    return () => clearInterval(interval);
  }, [user, queryClient]);
}
