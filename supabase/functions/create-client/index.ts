import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (status: number, body: any) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json(401, { error: 'No authorization header' });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
    if (!caller) return json(401, { error: 'Invalid token' });

    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .single();

    if (!callerRole || (callerRole.role !== 'admin' && callerRole.role !== 'super_admin')) {
      return json(403, { error: 'Unauthorized: not an admin' });
    }

    const body = await req.json().catch(() => ({}));
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!name || !email || !password) {
      return json(400, { error: 'All fields (name, email, password) are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(400, { error: 'Invalid email format. Please use a valid email like name@example.com' });
    }

    if (password.length < 6) {
      return json(400, { error: 'Password must be at least 6 characters long' });
    }

    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error) {
      console.error('createUser error:', error);
      return json(400, { error: error.message || 'Failed to create user' });
    }

    if (newUser?.user) {
      await supabaseAdmin
        .from('profiles')
        .update({ name, created_by_admin: caller.id })
        .eq('user_id', newUser.user.id);

      await supabaseAdmin
        .from('client_credentials')
        .insert({
          user_id: newUser.user.id,
          email,
          plain_password: password,
          created_by_admin: caller.id,
        });

      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: newUser.user.id,
          title: 'Welcome!',
          message: `Your account has been created. You can log in with your email: ${email}`,
        });
    }

    return json(200, { message: 'Client created', userId: newUser?.user?.id });
  } catch (err) {
    console.error('Unexpected error:', err);
    return json(500, { error: (err as Error).message || 'Internal server error' });
  }
});
