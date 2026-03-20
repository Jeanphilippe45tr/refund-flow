import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Upload, FileText, Image, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const documentTypes = [
  { value: 'receipt', label: 'Purchase Receipt' },
  { value: 'proof_of_payment', label: 'Proof of Payment' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'correspondence', label: 'Email / Correspondence' },
  { value: 'other', label: 'Other Document' },
];

const DocumentsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const text = language === 'fr'
    ? {
        pageTitle: 'Documents',
        pageDesc: 'Téléversez des reçus, preuves de paiement et captures d’écran pour vérification',
        uploadDocument: 'Téléverser un document',
        uploadForVerification: 'Téléverser un document pour vérification',
        documentType: 'Type de document',
        fileLabel: 'Fichier (Max 10MB)',
        selectFile: 'Cliquez pour sélectionner un fichier (PDF, JPG, PNG, etc.)',
        uploading: 'Téléversement...',
        submitVerification: 'Soumettre pour vérification',
        totalUploaded: 'Total téléversé',
        approved: 'Approuvés',
        pendingReview: 'En attente',
        file: 'Fichier',
        type: 'Type',
        status: 'Statut',
        date: 'Date',
        adminNotes: 'Notes admin',
        noDocuments: 'Aucun document téléversé pour le moment',
        uploadSuccess: 'Document téléversé pour vérification',
        fileTooLarge: 'Le fichier doit faire moins de 10MB',
        saveError: 'Impossible d’enregistrer le document',
        uploadFailed: 'Échec du téléversement : ',
      }
    : {
        pageTitle: 'Documents',
        pageDesc: 'Upload receipts, proofs of payment, and screenshots for verification',
        uploadDocument: 'Upload Document',
        uploadForVerification: 'Upload Document for Verification',
        documentType: 'Document Type',
        fileLabel: 'File (Max 10MB)',
        selectFile: 'Click to select file (PDF, JPG, PNG, etc.)',
        uploading: 'Uploading...',
        submitVerification: 'Submit for Verification',
        totalUploaded: 'Total Uploaded',
        approved: 'Approved',
        pendingReview: 'Pending Review',
        file: 'File',
        type: 'Type',
        status: 'Status',
        date: 'Date',
        adminNotes: 'Admin Notes',
        noDocuments: 'No documents uploaded yet',
        uploadSuccess: 'Document uploaded for verification',
        fileTooLarge: 'File must be under 10MB',
        saveError: 'Failed to save document record',
        uploadFailed: 'Upload failed: ',
      };
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState('receipt');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: documents = [] } = useQuery({
    queryKey: ['my-documents', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('document_verifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(text.fileTooLarge);
        return;
      }
      setFile(f);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(path, file);

    if (uploadError) {
      toast.error(text.uploadFailed + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);

    const { error: dbError } = await supabase.from('document_verifications').insert({
      user_id: user.id,
      document_type: docType,
      file_url: path,
      file_name: file.name,
    });

    if (dbError) {
      toast.error(text.saveError);
    } else {
      toast.success(text.uploadSuccess);
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      setOpen(false);
      setFile(null);
      setDocType('receipt');
    }
    setUploading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'rejected': return 'text-destructive';
      default: return 'text-warning';
    }
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <Image className="w-5 h-5 text-primary" />;
    return <FileText className="w-5 h-5 text-primary" />;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{text.pageTitle}</h1>
            <p className="text-muted-foreground">{text.pageDesc}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border-0 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> {text.uploadDocument}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{text.uploadForVerification}</DialogTitle></DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 mt-4">
                <div>
                  <Label>{text.documentType}</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(t => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{text.fileLabel}</Label>
                  <div className="mt-1 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('file-input')?.click()}>
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : text.selectFile}
                    </p>
                  </div>
                  <Input id="file-input" type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx" onChange={handleFileChange} className="hidden" />
                </div>
                <Button type="submit" disabled={!file || uploading} className="w-full gradient-primary border-0 text-primary-foreground">
                  {uploading ? text.uploading : text.submitVerification}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: text.totalUploaded, value: documents.length, color: 'text-primary' },
            { label: text.approved, value: documents.filter((d: any) => d.status === 'approved').length, color: 'text-success' },
            { label: text.pendingReview, value: documents.filter((d: any) => d.status === 'pending').length, color: 'text-warning' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Document list */}
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.file}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.type}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.status}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.date}</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">{text.adminNotes}</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc: any, i: number) => (
                <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.file_name)}
                      <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{doc.file_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm capitalize text-muted-foreground">{doc.document_type.replace(/_/g, ' ')}</td>
                  <td className="p-4"><StatusBadge status={doc.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(doc.created_at), 'MMM dd, yyyy')}</td>
                  <td className="p-4 text-sm text-muted-foreground">{doc.admin_notes || '—'}</td>
                </motion.tr>
              ))}
              {documents.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">
                  <Upload className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  {text.noDocuments}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentsPage;
