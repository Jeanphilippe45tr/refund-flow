import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { user, notifications, markNotificationRead } = useAuth();
  const myNotifs = notifications.filter(n => n.userId === user?.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {myNotifs.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? 'bg-accent/30' : ''}`}
            >
              <div className={`p-2 rounded-lg mt-0.5 ${!n.read ? 'gradient-primary' : 'bg-muted'}`}>
                <Bell className={`w-4 h-4 ${!n.read ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              {n.read && <CheckCheck className="w-4 h-4 text-success mt-1" />}
            </motion.div>
          ))}
          {myNotifs.length === 0 && <p className="p-8 text-center text-muted-foreground">No notifications</p>}
        </div>
      </div>
    </AppLayout>
  );
};

export default NotificationsPage;
