import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Trash2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { downloadInvoicePdf, InvoiceFee } from '@/lib/invoicePdf';
import logo from '@/assets/RefundPayPro-logo.png';

const InvoiceManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const t = {
    title: fr ? 'Facturation' : 'Invoicing',
    create: fr ? 'Nouvelle facture' : 'New Invoice',
    client: fr ? 'Client' : 'Client',
    selectClient: fr ? 'Sélectionner un client' : 'Select a client',
    refundAmount: fr ? 'Montant remboursé' : 'Refund amount',
    fees: fr ? 'Frais facturés' : 'Fees charged',
    addFee: fr ? '+ Ajouter un frais' : '+ Add fee',
    feeLabel: fr ? 'Libellé (ex: Frais de service)' : 'Label (e.g. Service fee)',
    amount: fr ? 'Montant' : 'Amount',
    notes: fr ? 'Notes' : 'Notes',
    submit: fr ? 'Créer la facture' : 'Create Invoice',
    download: fr ? 'Télécharger PDF' : 'Download PDF',
    delete: fr ? 'Supprimer' : 'Delete',
    empty: fr ? 'Aucune facture' : 'No invoices yet',
    created: fr ? 'Facture créée' : 'Invoice created',
    deleted: fr ? 'Facture supprimée' : 'Invoice deleted',
    confirm: fr ? 'Supprimer cette facture ?' : 'Delete this invoice?',
    company: fr ? 'Nom du site / société' : 'Site / Company name',
    signatory: fr ? 'Nom du signataire' : 'Signatory name',
    currency: fr ? 'Devise' : 'Currency',
    invNumber: fr ? 'N° facture' : 'Invoice #',
    date: fr ? 'Date' : 'Date',
    total: fr ? 'Total' : 'Total',
    actions: fr ? 'Actions' : 'Actions',
  };

  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [companyName, setCompanyName] = useState('RefundPayPro');
  const [signatoryName, setSignatoryName] = useState(user?.name || '');
  const [refundAmount, setRefundAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [fees, setFees] = useState<InvoiceFee[]>([{ label: fr ? 'Frais de service' : 'Service fee', amount: 0 }]);

  const { data: invoices = [] } = useQuery({
    queryKey: ['admin-invoices'],
    queryFn: async () => {
      const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['admin-clients-list'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('user_id, name, email, country');
      return data || [];
    },
  });

  const { data: signature } = useQuery({
    queryKey: ['my-signature', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('admin_signatures').select('*').eq('admin_id', user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const updateFee = (i: number, field: 'label' | 'amount', value: string) => {
    setFees(fees.map((f, idx) => idx === i ? { ...f, [field]: field === 'amount' ? Number(value) : value } : f));
  };
  const addFee = () => setFees([...fees, { label: '', amount: 0 }]);
  const removeFee = (i: number) => setFees(fees.filter((_, idx) => idx !== i));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c: any) => c.user_id === clientId);
    if (!client) { toast.error(fr ? 'Sélectionnez un client' : 'Select a client'); return; }
    const validFees = fees.filter(f => f.label.trim());
    const totalFees = validFees.reduce((s, f) => s + Number(f.amount || 0), 0);

    const { data, error } = await supabase.from('invoices').insert([{
      user_id: clientId,
      admin_id: user!.id,
      company_name: companyName,
      signatory_name: signatoryName,
      signature_url: signature?.signature_url || null,
      logo_url: window.location.origin + logo,
      client_name: client.name,
      client_email: client.email,
      client_country: client.country,
      refund_amount: Number(refundAmount || 0),
      fees: validFees as any,
      total_fees: totalFees,
      currency,
      notes,
      status: 'paid',
    }).select().single();

    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
    toast.success(t.created);
    setOpen(false);
    setClientId(''); setRefundAmount(''); setNotes('');
    setFees([{ label: fr ? 'Frais de service' : 'Service fee', amount: 0 }]);

    // Notify client
    await supabase.from('notifications').insert({
      user_id: clientId,
      title: fr ? 'Nouvelle facture disponible' : 'New invoice available',
      message: fr ? `Facture ${data.invoice_number} disponible dans votre espace` : `Invoice ${data.invoice_number} is available in your account`,
      type: 'info',
    });
  };

  const handleDownload = async (inv: any) => {
    await downloadInvoicePdf(inv);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirm)) return;
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ['admin-invoices'] });
    toast.success(t.deleted);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> {t.title}
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground"><Plus className="w-4 h-4 mr-2" />{t.create}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{t.create}</DialogTitle></DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 mt-4">
                <div>
                  <Label>{t.client}</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger><SelectValue placeholder={t.selectClient} /></SelectTrigger>
                    <SelectContent>
                      {clients.map((c: any) => (
                        <SelectItem key={c.user_id} value={c.user_id}>{c.name} — {c.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{t.company}</Label><Input value={companyName} onChange={e => setCompanyName(e.target.value)} required /></div>
                  <div><Label>{t.signatory}</Label><Input value={signatoryName} onChange={e => setSignatoryName(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>{t.refundAmount}</Label><Input type="number" step="0.01" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} required /></div>
                  <div>
                    <Label>{t.currency}</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>{t.fees}</Label>
                  <div className="space-y-2">
                    {fees.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder={t.feeLabel} value={f.label} onChange={e => updateFee(i, 'label', e.target.value)} />
                        <Input type="number" step="0.01" placeholder={t.amount} value={f.amount} onChange={e => updateFee(i, 'amount', e.target.value)} className="w-32" />
                        {fees.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeFee(i)}><Trash2 className="w-4 h-4" /></Button>}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addFee}>{t.addFee}</Button>
                  </div>
                </div>
                <div><Label>{t.notes}</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>
                {!signature && (
                  <p className="text-xs text-muted-foreground">
                    {fr ? '⚠️ Aucune signature configurée. Ajoutez-la dans votre profil pour qu\'elle apparaisse sur les factures.' : '⚠️ No signature configured. Add one in your profile to include it on invoices.'}
                  </p>
                )}
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">{t.submit}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t.invNumber}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t.client}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t.total}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{t.date}</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any, i: number) => (
                <motion.tr key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-mono text-sm text-foreground">{inv.invoice_number}</td>
                  <td className="p-4 text-sm text-foreground">{inv.client_name}<br /><span className="text-xs text-muted-foreground">{inv.client_email}</span></td>
                  <td className="p-4 font-semibold text-foreground">{inv.currency === 'EUR' ? '€' : '$'}{Number(inv.total_fees).toFixed(2)}</td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(inv.created_at), 'MMM dd, yyyy')}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(inv)}><Download className="w-4 h-4 mr-1" />PDF</Button>
                    {user?.role === 'super_admin' && (
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(inv.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    )}
                  </td>
                </motion.tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">{t.empty}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default InvoiceManagement;
