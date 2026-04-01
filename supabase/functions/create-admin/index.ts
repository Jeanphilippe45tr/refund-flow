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

    // Check if admin already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.some(u => u.email === 'makounphilippe@gmail.com');

    if (adminExists) {
      return new Response(JSON.stringify({ message: 'Admin already exists' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Create admin user
    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'makounphilippe@gmail.com',
      password: 'makoun237',
      email_confirm: true,
      user_metadata: { name: 'Philippe Makoun' },
    });

    if (error) throw error;

    // Update role to admin
    if (newUser?.user) {
      await supabaseAdmin.from('user_roles').update({ role: 'super_admin' }).eq('user_id', newUser.user.id);
      await supabaseAdmin.from('profiles').update({ name: 'Philippe Makoun' }).eq('user_id', newUser.user.id);
    }

    return new Response(JSON.stringify({ message: 'Admin created', userId: newUser?.user?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
