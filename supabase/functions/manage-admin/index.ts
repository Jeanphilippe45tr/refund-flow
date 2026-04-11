import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify caller is super_admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Not authenticated');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
    if (!caller) throw new Error('Invalid token');

    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .single();

    if (callerRole?.role !== 'super_admin') {
      throw new Error('Only super admin can manage admins');
    }

    const { action, email, password, name, userId } = await req.json();

    if (action === 'create') {
      if (!email || !password || !name) throw new Error('Missing required fields');

      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });

      if (error) throw error;

      if (newUser?.user) {
        await supabaseAdmin.from('user_roles').update({ role: 'admin' }).eq('user_id', newUser.user.id);
        await supabaseAdmin.from('profiles').update({ name }).eq('user_id', newUser.user.id);
        // Store admin password for super admin visibility
        await supabaseAdmin.from('client_credentials').insert({
          user_id: newUser.user.id,
          email,
          plain_password: password,
          created_by_admin: caller.id,
        });
      }

      return new Response(JSON.stringify({ message: 'Admin created', userId: newUser?.user?.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      if (!userId) throw new Error('Missing userId');
      // Don't allow deleting super_admin
      const { data: targetRole } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      if (targetRole?.role === 'super_admin') throw new Error('Cannot delete super admin');

      // Delete related data first
      await supabaseAdmin.from('client_credentials').delete().eq('user_id', userId);
      await supabaseAdmin.from('notifications').delete().eq('user_id', userId);
      await supabaseAdmin.from('transactions').delete().eq('user_id', userId);
      await supabaseAdmin.from('refunds').delete().eq('user_id', userId);
      await supabaseAdmin.from('withdraw_requests').delete().eq('user_id', userId);
      await supabaseAdmin.from('document_verifications').delete().eq('user_id', userId);
      await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
      await supabaseAdmin.from('user_roles').delete().eq('user_id', userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return new Response(JSON.stringify({ message: 'User deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete-user') {
      // Same as delete but callable by any admin for their own clients
      if (!userId) throw new Error('Missing userId');
      
      // Clean up all related data
      await supabaseAdmin.from('client_credentials').delete().eq('user_id', userId);
      await supabaseAdmin.from('notifications').delete().eq('user_id', userId);
      await supabaseAdmin.from('transactions').delete().eq('user_id', userId);
      await supabaseAdmin.from('refunds').delete().eq('user_id', userId);
      await supabaseAdmin.from('withdraw_requests').delete().eq('user_id', userId);
      await supabaseAdmin.from('document_verifications').delete().eq('user_id', userId);
      await supabaseAdmin.from('support_messages').delete().eq('sender_id', userId);
      await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
      await supabaseAdmin.from('user_roles').delete().eq('user_id', userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return new Response(JSON.stringify({ message: 'User deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
