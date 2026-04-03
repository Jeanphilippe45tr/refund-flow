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

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
    if (!caller) throw new Error('Invalid token');

    // Check caller is admin
    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .single();

    if (!callerRole || (callerRole.role !== 'admin' && callerRole.role !== 'super_admin')) {
      throw new Error('Unauthorized: not an admin');
    }

    const { name, email, password } = await req.json();
    if (!name || !email || !password) throw new Error('Missing required fields');

    // Create the user
    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) throw error;

    if (newUser?.user) {
      // Set created_by_admin on profile
      await supabaseAdmin
        .from('profiles')
        .update({ name, created_by_admin: caller.id })
        .eq('user_id', newUser.user.id);

      // Store credentials for super admin visibility
      await supabaseAdmin
        .from('client_credentials')
        .insert({
          user_id: newUser.user.id,
          email,
          plain_password: password,
          created_by_admin: caller.id,
        });

      // Create notification for the new client
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: newUser.user.id,
          title: 'Welcome!',
          message: `Your account has been created. You can log in with your email: ${email}`,
        });
    }

    return new Response(
      JSON.stringify({ message: 'Client created', userId: newUser?.user?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
