import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  User, WithdrawRequest, Refund, Transaction, SupportTicket, AppNotification, AdminLog,
  defaultUsers, defaultWithdrawals, defaultRefunds, defaultTransactions,
  defaultTickets, defaultNotifications, defaultAdminLogs,
} from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  users: User[];
  withdrawals: WithdrawRequest[];
  refunds: Refund[];
  transactions: Transaction[];
  tickets: SupportTicket[];
  notifications: AppNotification[];
  adminLogs: AdminLog[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  // Client actions
  submitWithdrawal: (data: Omit<WithdrawRequest, 'id' | 'userId' | 'status' | 'createdAt'>) => void;
  cancelWithdrawal: (id: string) => void;
  createTicket: (subject: string, message: string) => void;
  sendTicketMessage: (ticketId: string, message: string) => void;
  markNotificationRead: (id: string) => void;
  // Admin actions
  approveWithdrawal: (id: string) => void;
  rejectWithdrawal: (id: string, reason: string, proof?: string) => void;
  addRefund: (userId: string, amount: number, note: string) => void;
  suspendUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  editUserBalance: (userId: string, newBalance: number) => void;
  flagWithdrawal: (id: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });
  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>(() => {
    const saved = localStorage.getItem('withdrawals');
    return saved ? JSON.parse(saved) : defaultWithdrawals;
  });
  const [refunds, setRefunds] = useState<Refund[]>(() => {
    const saved = localStorage.getItem('refunds');
    return saved ? JSON.parse(saved) : defaultRefunds;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('tickets');
    return saved ? JSON.parse(saved) : defaultTickets;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => {
    const saved = localStorage.getItem('adminLogs');
    return saved ? JSON.parse(saved) : defaultAdminLogs;
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('withdrawals', JSON.stringify(withdrawals)); }, [withdrawals]);
  useEffect(() => { localStorage.setItem('refunds', JSON.stringify(refunds)); }, [refunds]);
  useEffect(() => { localStorage.setItem('transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('adminLogs', JSON.stringify(adminLogs)); }, [adminLogs]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(user)); }, [user]);
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addLog = useCallback((action: string) => {
    if (user?.role === 'admin') {
      setAdminLogs(prev => [{ id: `al-${Date.now()}`, adminId: user.id, action, createdAt: new Date().toISOString() }, ...prev]);
    }
  }, [user]);

  const addNotification = useCallback((userId: string, title: string, message: string) => {
    setNotifications(prev => [{ id: `n-${Date.now()}`, userId, title, message, read: false, createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found && !found.suspended) { setUser(found); return true; }
    return false;
  }, [users]);

  const register = useCallback((name: string, email: string, password: string) => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = { id: `client-${Date.now()}`, name, email, password, balance: 0, profilePhoto: '', role: 'client', createdAt: new Date().toISOString(), suspended: false };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => { setUser(null); localStorage.removeItem('currentUser'); }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  }, [user]);

  const submitWithdrawal = useCallback((data: Omit<WithdrawRequest, 'id' | 'userId' | 'status' | 'createdAt'>) => {
    if (!user) return;
    const w: WithdrawRequest = { ...data, id: `w-${Date.now()}`, userId: user.id, status: 'pending', createdAt: new Date().toISOString() };
    setWithdrawals(prev => [w, ...prev]);
    setTransactions(prev => [{ id: `t-${Date.now()}`, userId: user.id, type: 'withdrawal', amount: data.amount, status: 'pending', description: `${data.paymentMethod} withdrawal`, createdAt: new Date().toISOString() }, ...prev]);
  }, [user]);

  const cancelWithdrawal = useCallback((id: string) => {
    setWithdrawals(prev => prev.filter(w => w.id !== id));
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const approveWithdrawal = useCallback((id: string) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id !== id) return w;
      setUsers(u => u.map(user => user.id === w.userId ? { ...user, balance: user.balance - w.amount } : user));
      setTransactions(t => t.map(tx => tx.userId === w.userId && tx.amount === w.amount && tx.status === 'pending' ? { ...tx, status: 'completed' } : tx));
      addNotification(w.userId, 'Withdrawal Approved', `Your withdrawal of $${w.amount.toFixed(2)} has been approved`);
      return { ...w, status: 'approved' };
    }));
    addLog(`Approved withdrawal ${id}`);
  }, [addLog, addNotification]);

  const rejectWithdrawal = useCallback((id: string, reason: string, proof?: string) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id !== id) return w;
      setTransactions(t => t.map(tx => tx.userId === w.userId && tx.amount === w.amount && tx.status === 'pending' ? { ...tx, status: 'rejected' } : tx));
      addNotification(w.userId, 'Withdrawal Rejected', `Your withdrawal of $${w.amount.toFixed(2)} was rejected: ${reason}`);
      return { ...w, status: 'rejected', rejectionReason: reason, rejectionProof: proof };
    }));
    addLog(`Rejected withdrawal ${id}: ${reason}`);
  }, [addLog, addNotification]);

  const addRefund = useCallback((userId: string, amount: number, note: string) => {
    if (!user) return;
    setRefunds(prev => [{ id: `r-${Date.now()}`, userId, amount, adminId: user.id, note, createdAt: new Date().toISOString() }, ...prev]);
    setTransactions(prev => [{ id: `t-${Date.now()}`, userId, type: 'refund', amount, status: 'completed', description: note, createdAt: new Date().toISOString() }, ...prev]);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
    addNotification(userId, 'Refund Received', `You received a refund of $${amount.toFixed(2)}`);
    addLog(`Added refund of $${amount} to user ${userId}`);
  }, [user, addLog, addNotification]);

  const suspendUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, suspended: !u.suspended } : u));
    addLog(`Toggled suspension for user ${userId}`);
  }, [addLog]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    addLog(`Deleted user ${userId}`);
  }, [addLog]);

  const editUserBalance = useCallback((userId: string, newBalance: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
    addLog(`Edited balance for user ${userId} to $${newBalance}`);
  }, [addLog]);

  const flagWithdrawal = useCallback((id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, flagged: !w.flagged } : w));
    addLog(`Toggled flag on withdrawal ${id}`);
  }, [addLog]);

  const createTicket = useCallback((subject: string, message: string) => {
    if (!user) return;
    const ticket: SupportTicket = {
      id: `tk-${Date.now()}`, userId: user.id, subject, status: 'open',
      messages: [{ id: `m-${Date.now()}`, senderId: user.id, senderRole: user.role, message, createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    setTickets(prev => [ticket, ...prev]);
  }, [user]);

  const sendTicketMessage = useCallback((ticketId: string, message: string) => {
    if (!user) return;
    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      messages: [...t.messages, { id: `m-${Date.now()}`, senderId: user.id, senderRole: user.role, message, createdAt: new Date().toISOString() }],
    } : t));
  }, [user]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  return (
    <AuthContext.Provider value={{
      user, users, withdrawals, refunds, transactions, tickets, notifications, adminLogs,
      login, register, logout, updateProfile,
      submitWithdrawal, cancelWithdrawal, createTicket, sendTicketMessage, markNotificationRead,
      approveWithdrawal, rejectWithdrawal, addRefund, suspendUser, deleteUser, editUserBalance, flagWithdrawal,
      darkMode, toggleDarkMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
