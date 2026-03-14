import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Check, X, Search, Eye, FileText, Image, Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const DocumentReview = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [reviewDoc, setReviewDoc] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const { data: documents = [] } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data } = await supabase.from('document_verifications').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const getUserName = (userId: string) => profiles.find((p: any) => p.user_id === userId)?.name || 'Unknown';

  const filtered = documents
    .filter((d: any) => filter === 'all' || d.status === filter)
    .filter((d: any) => {
      if (!search) return true;
      const name = getUserName(d.user_id).toLowerCase();
      return name.includes(search.toLowerCase()) || d.file_name.toLowerCase().includes(search.toLowerCase());
    });

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const doc = documents.find((d: any) => d.id === id);
    if (!doc) return;

    await supabase.from('document_verifications').update({
      status,
      admin_notes: adminNotes || null,
      reviewed_by: user!.id,
    }).eq('id', id);

    await supabase.from('notifications').insert({
      user_id: doc.user_id,
      title: `Document ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your ${doc.document_type.replace(/_/g, ' ')} "${doc.file_name}" has been ${status}.${adminNotes ? ' Note: ' + adminNotes : ''}`,
    });

    await supabase.from('admin_logs').insert({
      admin_id: user!.id,
      action: `${status === 'approved' ? 'Approved' : 'Rejected'} document: ${doc.file_name}`,
      details: { document_id: id, document_type: doc.document_type },
    });

    queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
    setReviewDoc(null);
    setAdminNotes('');
    toast.success(`Document ${status}`);
  };

  const getSignedUrl = async (path: string) => {
    const { data } = await supabase.storage.from('documents').createSignedUrl(path, 60);
    return data?.signedUrl;
  };

  const handlePreview = async (doc: any) => {
    const url = await getSignedUrl(doc.file_url);
    if (url) {
      setPreviewDoc({ ...doc, signedUrl: url });
    } else {
      toast.error('Could not load document preview');
    }
  };

  const handleDownload = async (doc: any) => {
    const url = await getSignedUrl(doc.file_url);
    if (url) window.open(url, '_blank');
  };

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return <Image className="w-5 h-5 text-primary" />;
    return <FileText className="w-5 h-5 text-primary" />;
  };

  const isImage = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Verification</h1>
          <p className="text-muted-foreground">Review receipts, proofs of payment, and screenshots submitted by users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: documents.length },
            { label: 'Pending', value: documents.filter((d: any) => d.status === 'pending').length },
            { label: 'Approved', value: documents.filter((d: any) => d.status === 'approved').length },
            { label: 'Rejected', value: documents.filter((d: any) => d.status === 'rejected').length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by user or filename..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">File</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc: any, i: number) => (
                <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-foreground">{getUserName(doc.user_id)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.file_name)}
                      <span className="text-sm truncate max-w-[150px]">{doc.file_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm capitalize text-muted-foreground">{doc.document_type.replace(/_/g, ' ')}</td>
                  <td className="p-4"><StatusBadge status={doc.status} /></td>
                  <td className="p-4 text-sm text-muted-foreground">{format(new Date(doc.created_at), 'MMM dd, yyyy')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(doc)} title="Preview">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)} title="Download">
                        <Download className="w-4 h-4" />
                      </Button>
                      {doc.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => { setReviewDoc(doc); setAdminNotes(''); }} title="Review">
                            <Check className="w-4 h-4 text-success" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No documents found</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Review Dialog */}
        <Dialog open={!!reviewDoc} onOpenChange={() => setReviewDoc(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Review Document</DialogTitle></DialogHeader>
            {reviewDoc && (
              <div className="space-y-4 mt-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm"><span className="font-medium">User:</span> {getUserName(reviewDoc.user_id)}</p>
                  <p className="text-sm"><span className="font-medium">Type:</span> {reviewDoc.document_type.replace(/_/g, ' ')}</p>
                  <p className="text-sm"><span className="font-medium">File:</span> {reviewDoc.file_name}</p>
                  <p className="text-sm"><span className="font-medium">Uploaded:</span> {format(new Date(reviewDoc.created_at), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <Label>Admin Notes (optional)</Label>
                  <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="mt-1" placeholder="Add review notes..." />
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => updateStatus(reviewDoc.id, 'approved')} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button onClick={() => updateStatus(reviewDoc.id, 'rejected')} variant="destructive" className="flex-1">
                    <X className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Document Preview</DialogTitle></DialogHeader>
            {previewDoc && (
              <div className="mt-4">
                {isImage(previewDoc.file_name) ? (
                  <img src={previewDoc.signedUrl} alt={previewDoc.file_name} className="w-full rounded-lg max-h-[500px] object-contain" />
                ) : (
                  <iframe src={previewDoc.signedUrl} className="w-full h-[500px] rounded-lg border border-border" />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default DocumentReview;
