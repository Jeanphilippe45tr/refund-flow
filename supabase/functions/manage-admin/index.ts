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

    const isSuperAdmin = callerRole?.role === 'super_admin';
    const isAdmin = callerRole?.role === 'admin' || isSuperAdmin;

    if (!isAdmin) throw new Error('Admin access required');

    const { action, email, password, name, userId } = await req.json();

    // Super admin only actions
    if (action === 'create') {
      if (!isSuperAdmin) throw new Error('Only super admin can create admins');
      if (!email || !password || !name) throw new Error('Missing required fields');

      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { name },
      });
      if (error) throw error;

      if (newUser?.user) {
        await supabaseAdmin.from('user_roles').update({ role: 'admin' }).eq('user_id', newUser.user.id);
        await supabaseAdmin.from('profiles').update({ name }).eq('user_id', newUser.user.id);
        await supabaseAdmin.from('client_credentials').insert({
          user_id: newUser.user.id, email, plain_password: password, created_by_admin: caller.id,
        });
      }

      return new Response(JSON.stringify({ message: 'Admin created', userId: newUser?.user?.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      if (!isSuperAdmin) throw new Error('Only super admin can delete admins');
      if (!userId) throw new Error('Missing userId');

      const { data: targetRole } = await supabaseAdmin
        .from('user_roles').select('role').eq('user_id', userId).single();
      if (targetRole?.role === 'super_admin') throw new Error('Cannot delete super admin');

      await deleteUserCompletely(supabaseAdmin, userId);

      return new Response(JSON.stringify({ message: 'Admin deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete-user') {
      if (!userId) throw new Error('Missing userId');

      // Verify ownership: admin can only delete their own clients, super admin can delete anyone
      if (!isSuperAdmin) {
        const { data: targetProfile } = await supabaseAdmin
          .from('profiles').select('created_by_admin').eq('user_id', userId).single();
        if (targetProfile?.created_by_admin !== caller.id) {
          throw new Error('You can only delete your own clients');
        }
      }

      // Don't allow deleting admins via this action
      const { data: targetRole } = await supabaseAdmin
        .from('user_roles').select('role').eq('user_id', userId).single();
      if (targetRole?.role === 'admin' || targetRole?.role === 'super_admin') {
        throw new Error('Use delete action for admins');
      }

      await deleteUserCompletely(supabaseAdmin, userId);

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

async function deleteUserCompletely(supabaseAdmin: any, userId: string) {
  // Delete all related data then the auth user
  await supabaseAdmin.from('client_credentials').delete().eq('user_id', userId);
  await supabaseAdmin.from('notifications').delete().eq('user_id', userId);
  await supabaseAdmin.from('transactions').delete().eq('user_id', userId);
  await supabaseAdmin.from('refunds').delete().eq('user_id', userId);
  await supabaseAdmin.from('withdraw_requests').delete().eq('user_id', userId);
  await supabaseAdmin.from('document_verifications').delete().eq('user_id', userId);
  await supabaseAdmin.from('admin_logs').delete().eq('admin_id', userId);
  // Delete support tickets and messages
  const { data: tickets } = await supabaseAdmin.from('support_tickets').select('id').eq('user_id', userId);
  if (tickets?.length) {
    for (const t of tickets) {
      await supabaseAdmin.from('support_messages').delete().eq('ticket_id', t.id);
    }
    await supabaseAdmin.from('support_tickets').delete().eq('user_id', userId);
  }
  await supabaseAdmin.from('support_messages').delete().eq('sender_id', userId);
  await supabaseAdmin.from('profiles').delete().eq('user_id', userId);
  await supabaseAdmin.from('user_roles').delete().eq('user_id', userId);
  // Also clean credentials where this user created clients
  await supabaseAdmin.from('client_credentials').delete().eq('created_by_admin', userId);
  await supabaseAdmin.auth.admin.deleteUser(userId);
}
