export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
  profilePhoto: string;
  role: 'admin' | 'client';
  createdAt: string;
  suspended: boolean;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: 'bank' | 'mobile_money' | 'paypal' | 'crypto';
  walletDetails: string;
  accountHolder: string;
  country: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  rejectionProof?: string;
  flagged?: boolean;
  createdAt: string;
}

export interface Refund {
  id: string;
  userId: string;
  amount: number;
  adminId: string;
  note: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'refund' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'rejected';
  description: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'closed' | 'in_progress';
  messages: TicketMessage[];
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: 'admin' | 'client';
  message: string;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Default users
export const defaultUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Philippe Makoun',
    email: 'makounphilippe@gmail.com',
    password: 'makoun237',
    balance: 0,
    profilePhoto: '',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    suspended: false,
  },
  {
    id: 'client-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    balance: 2450.75,
    profilePhoto: '',
    role: 'client',
    createdAt: '2024-02-15T10:30:00Z',
    suspended: false,
  },
  {
    id: 'client-2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    balance: 1820.00,
    profilePhoto: '',
    role: 'client',
    createdAt: '2024-03-01T08:00:00Z',
    suspended: false,
  },
  {
    id: 'client-3',
    name: 'Mike Chen',
    email: 'mike@example.com',
    password: 'password123',
    balance: 5100.50,
    profilePhoto: '',
    role: 'client',
    createdAt: '2024-03-10T14:00:00Z',
    suspended: false,
  },
];

export const defaultWithdrawals: WithdrawRequest[] = [
  {
    id: 'w-1',
    userId: 'client-1',
    amount: 500,
    paymentMethod: 'paypal',
    walletDetails: 'john@paypal.com',
    accountHolder: 'John Doe',
    country: 'United States',
    status: 'pending',
    createdAt: '2024-03-15T09:00:00Z',
  },
  {
    id: 'w-2',
    userId: 'client-2',
    amount: 300,
    paymentMethod: 'bank',
    walletDetails: 'DE89370400440532013000',
    accountHolder: 'Sarah Wilson',
    country: 'Germany',
    status: 'approved',
    createdAt: '2024-03-10T11:00:00Z',
  },
  {
    id: 'w-3',
    userId: 'client-3',
    amount: 1000,
    paymentMethod: 'crypto',
    walletDetails: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD12',
    accountHolder: 'Mike Chen',
    country: 'Singapore',
    status: 'rejected',
    rejectionReason: 'Suspicious activity detected. Please verify your identity.',
    createdAt: '2024-03-12T16:00:00Z',
    flagged: true,
  },
  {
    id: 'w-4',
    userId: 'client-1',
    amount: 200,
    paymentMethod: 'mobile_money',
    walletDetails: '+237 6XX XXX XXX',
    accountHolder: 'John Doe',
    country: 'Cameroon',
    status: 'pending',
    createdAt: '2024-03-16T10:00:00Z',
  },
];

export const defaultRefunds: Refund[] = [
  { id: 'r-1', userId: 'client-1', amount: 1500, adminId: 'admin-1', note: 'Product return refund', createdAt: '2024-02-20T10:00:00Z' },
  { id: 'r-2', userId: 'client-2', amount: 820, adminId: 'admin-1', note: 'Service compensation', createdAt: '2024-03-02T09:00:00Z' },
  { id: 'r-3', userId: 'client-3', amount: 3100, adminId: 'admin-1', note: 'Bulk order refund', createdAt: '2024-03-11T14:00:00Z' },
  { id: 'r-4', userId: 'client-1', amount: 950, adminId: 'admin-1', note: 'Warranty claim approved', createdAt: '2024-03-14T08:00:00Z' },
];

export const defaultTransactions: Transaction[] = [
  { id: 't-1', userId: 'client-1', type: 'refund', amount: 1500, status: 'completed', description: 'Product return refund', createdAt: '2024-02-20T10:00:00Z' },
  { id: 't-2', userId: 'client-2', type: 'refund', amount: 820, status: 'completed', description: 'Service compensation', createdAt: '2024-03-02T09:00:00Z' },
  { id: 't-3', userId: 'client-3', type: 'refund', amount: 3100, status: 'completed', description: 'Bulk order refund', createdAt: '2024-03-11T14:00:00Z' },
  { id: 't-4', userId: 'client-2', type: 'withdrawal', amount: 300, status: 'completed', description: 'Bank transfer withdrawal', createdAt: '2024-03-10T11:00:00Z' },
  { id: 't-5', userId: 'client-1', type: 'withdrawal', amount: 500, status: 'pending', description: 'PayPal withdrawal', createdAt: '2024-03-15T09:00:00Z' },
  { id: 't-6', userId: 'client-3', type: 'withdrawal', amount: 1000, status: 'rejected', description: 'Crypto withdrawal', createdAt: '2024-03-12T16:00:00Z' },
  { id: 't-7', userId: 'client-1', type: 'refund', amount: 950, status: 'completed', description: 'Warranty claim approved', createdAt: '2024-03-14T08:00:00Z' },
];

export const defaultTickets: SupportTicket[] = [
  {
    id: 'tk-1',
    userId: 'client-1',
    subject: 'Withdrawal taking too long',
    status: 'open',
    messages: [
      { id: 'm-1', senderId: 'client-1', senderRole: 'client', message: 'My withdrawal has been pending for 3 days. Can you check?', createdAt: '2024-03-15T10:00:00Z' },
      { id: 'm-2', senderId: 'admin-1', senderRole: 'admin', message: 'We are reviewing your request. Please allow 24-48 hours.', createdAt: '2024-03-15T11:00:00Z' },
    ],
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'tk-2',
    userId: 'client-3',
    subject: 'Account flagged incorrectly',
    status: 'in_progress',
    messages: [
      { id: 'm-3', senderId: 'client-3', senderRole: 'client', message: 'My account was flagged but I have done nothing wrong. Please review.', createdAt: '2024-03-13T08:00:00Z' },
    ],
    createdAt: '2024-03-13T08:00:00Z',
  },
];

export const defaultNotifications: AppNotification[] = [
  { id: 'n-1', userId: 'client-1', title: 'Refund Received', message: 'You received a refund of $950.00', read: false, createdAt: '2024-03-14T08:00:00Z' },
  { id: 'n-2', userId: 'client-2', title: 'Withdrawal Approved', message: 'Your withdrawal of $300.00 has been approved', read: true, createdAt: '2024-03-10T12:00:00Z' },
  { id: 'n-3', userId: 'client-3', title: 'Withdrawal Rejected', message: 'Your withdrawal of $1000.00 has been rejected', read: false, createdAt: '2024-03-12T17:00:00Z' },
  { id: 'n-4', userId: 'client-1', title: 'Withdrawal Submitted', message: 'Your withdrawal request of $500.00 is pending', read: true, createdAt: '2024-03-15T09:05:00Z' },
];

export const defaultAdminLogs: AdminLog[] = [
  { id: 'al-1', adminId: 'admin-1', action: 'Approved withdrawal W-2 for Sarah Wilson ($300)', createdAt: '2024-03-10T12:00:00Z' },
  { id: 'al-2', adminId: 'admin-1', action: 'Rejected withdrawal W-3 for Mike Chen ($1000)', createdAt: '2024-03-12T17:00:00Z' },
  { id: 'al-3', adminId: 'admin-1', action: 'Added refund of $950 to John Doe', createdAt: '2024-03-14T08:00:00Z' },
  { id: 'al-4', adminId: 'admin-1', action: 'Flagged withdrawal W-3 as suspicious', createdAt: '2024-03-12T16:30:00Z' },
];
