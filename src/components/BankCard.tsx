import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Wifi, CreditCard as CardIcon } from 'lucide-react';
import { toast } from 'sonner';

interface BankDetails {
  bank_name?: string | null;
  account_number?: string | null;
  iban?: string | null;
  swift_bic?: string | null;
  sort_code?: string | null;
  account_type?: string | null;
  holder?: string;
  balance?: number;
  currencySymbol?: string;
  formattedBalance?: string;
}

const Row = ({ label, value }: { label: string; value?: string | null }) => {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const copy = () => {
    navigator.clipboard.writeText(value.replace(/\s+/g, ''));
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/10 last:border-0">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-white/60">{label}</p>
        <p className="font-mono text-sm text-white truncate">{value}</p>
      </div>
      <button
        onClick={copy}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white shrink-0"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export const BankCard = ({ details }: { details: BankDetails }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Virtual card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-2xl min-h-[220px]"
        style={{
          background:
            'linear-gradient(135deg, #0a1f4d 0%, #1E6BFF 55%, #4f8cff 100%)',
        }}
      >
        {/* decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#FFD43B]/20 blur-2xl" />
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:14px_14px]" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">
              {details.bank_name || 'RefundPay Bank'}
            </p>
            <p className="mt-1 text-xs opacity-70 capitalize">
              {details.account_type || 'checking'} account
            </p>
          </div>
          <Wifi className="w-6 h-6 rotate-90 opacity-80" />
        </div>

        <div className="relative mt-8">
          <p className="text-[10px] uppercase tracking-widest opacity-70">Balance</p>
          <p className="text-3xl font-bold tracking-tight">
            {details.formattedBalance ??
              `${details.currencySymbol ?? '$'}${(details.balance ?? 0).toFixed(2)}`}
          </p>
        </div>

        <div className="relative mt-6">
          <p className="text-[10px] uppercase tracking-widest opacity-70">Account number</p>
          <p className="font-mono text-lg tracking-[0.3em]">
            {(details.account_number || '••••••••••').replace(/(.{4})/g, '$1 ').trim()}
          </p>
        </div>

        <div className="relative mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Card holder</p>
            <p className="text-sm font-semibold uppercase truncate max-w-[180px]">
              {details.holder || 'RefundPay Client'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <CardIcon className="w-8 h-8 text-[#FFD43B]" />
            <span className="text-xs font-bold tracking-widest">VISA</span>
          </div>
        </div>
      </motion.div>

      {/* Details panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Bank Details</h3>
          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            ACTIVE
          </span>
        </div>
        <p className="text-xs text-white/60 mb-3">
          Use these details to receive incoming refund transfers.
        </p>
        <Row label="Account Holder" value={details.holder} />
        <Row label="Account Number" value={details.account_number} />
        <Row label="Sort Code" value={details.sort_code} />
        <Row label="IBAN" value={details.iban} />
        <Row label="SWIFT / BIC" value={details.swift_bic} />
        <Row label="Bank Name" value={details.bank_name} />
      </motion.div>
    </div>
  );
};
