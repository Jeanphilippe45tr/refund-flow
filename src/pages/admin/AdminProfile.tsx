import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Upload, PenTool } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [signatoryName, setSignatoryName] = useState('');

  const { data: signature } = useQuery({
    queryKey: ['my-signature', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('admin_signatures').select('*').eq('admin_id', user!.id).maybeSingle();
      if (data) setSignatoryName(data.signatory_name || '');
      return data;
    },
    enabled: !!user,
  });

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user!.id}/signature.${ext}`;
      const { error: upErr } = await supabase.storage.from('signatures').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('signatures').getPublicUrl(path);
      const url = `${pub.publicUrl}?t=${Date.now()}`;
      const { error: dbErr } = await supabase.from('admin_signatures').upsert({
        admin_id: user!.id, signature_url: url, signatory_name: signatoryName || user!.name,
      }, { onConflict: 'admin_id' });
      if (dbErr) throw dbErr;
      queryClient.invalidateQueries({ queryKey: ['my-signature'] });
      toast.success(fr ? 'Signature mise à jour' : 'Signature updated');
    } catch (e: any) {
      toast.error(e.message);
    } finally { setUploading(false); }
  };

  const saveName = async () => {
    if (!signature) return;
    await supabase.from('admin_signatures').update({ signatory_name: signatoryName }).eq('admin_id', user!.id);
    queryClient.invalidateQueries({ queryKey: ['my-signature'] });
    toast.success(fr ? 'Enregistré' : 'Saved');
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">{fr ? 'Mon profil admin' : 'My Admin Profile'}</h1>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><PenTool className="w-5 h-5 text-primary" />{fr ? 'Signature pour factures' : 'Invoice Signature'}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {fr ? 'Téléchargez votre signature scannée (PNG transparent recommandé). Elle apparaîtra sur les factures que vous créez.' : 'Upload your scanned signature (transparent PNG recommended). It will appear on invoices you create.'}
          </p>

          <div className="space-y-4">
            <div>
              <Label>{fr ? 'Nom du signataire' : 'Signatory name'}</Label>
              <div className="flex gap-2">
                <Input value={signatoryName} onChange={e => setSignatoryName(e.target.value)} placeholder={user?.name} />
                <Button onClick={saveName} variant="outline">{fr ? 'Enregistrer' : 'Save'}</Button>
              </div>
            </div>

            {signature?.signature_url && (
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2">{fr ? 'Signature actuelle' : 'Current signature'}</p>
                <img src={signature.signature_url} alt="signature" className="max-h-24 bg-white rounded p-2" />
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="gradient-primary border-0 text-primary-foreground">
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? (fr ? 'Téléchargement...' : 'Uploading...') : (signature ? (fr ? 'Remplacer la signature' : 'Replace signature') : (fr ? 'Télécharger une signature' : 'Upload signature'))}
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminProfile;
