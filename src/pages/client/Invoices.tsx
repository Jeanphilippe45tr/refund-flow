import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { downloadInvoicePdf } from '@/lib/invoicePdf';

const ClientInvoices = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const t = {
    title: fr ? 'Mes factures' : 'My Invoices',
    subtitle: fr ? 'Téléchargez vos factures officielles au format PDF' : 'Download your official invoices in PDF format',
    download: fr ? 'Télécharger' : 'Download',
    empty: fr ? 'Aucune facture pour le moment' : 'No invoices yet',
    issued: fr ? 'Émise le' : 'Issued',
    paid: fr ? 'Payée' : 'Paid',
  };

  const { data: invoices = [] } = useQuery({
    queryKey: ['my-invoices', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('invoices').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> {t.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
        </div>

        {invoices.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((inv: any, i: number) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-all hover:border-primary/40"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium uppercase">{t.paid}</span>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">{inv.invoice_number}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.issued} {format(new Date(inv.issued_at), 'MMM dd, yyyy')}</p>
                <p className="text-2xl font-bold text-foreground mt-3">
                  {inv.currency === 'EUR' ? '€' : '$'}{Number(inv.total_fees).toFixed(2)}
                </p>
                <Button onClick={() => downloadInvoicePdf(inv)} className="w-full mt-4 gradient-primary border-0 text-primary-foreground">
                  <Download className="w-4 h-4 mr-2" /> {t.download}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ClientInvoices;
