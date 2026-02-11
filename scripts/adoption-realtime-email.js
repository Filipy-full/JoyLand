// Script para escuchar inserts en adoptions y enviar email
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADOPTION_WEBHOOK_URL = 'https://joylandweb.com/api/webhooks/adoption';
const ADOPTION_WEBHOOK_TOKEN = 'filipyhrm';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const channel = supabase.channel('adoptions-email')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'adoptions',
    }, async (payload) => {
      const adoption = payload.new;
      console.log('Nueva adopción detectada:', adoption);
      // Llama al webhook de email
      const res = await fetch(ADOPTION_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADOPTION_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({
          user_email: adoption.user_email,
          user_name: adoption.user_name,
          tree_name: adoption.tree_name,
          start_date: adoption.start_date,
          end_date: adoption.end_date,
        }),
      });
      const result = await res.json();
      console.log('Resultado del webhook:', result);
    });

  await channel.subscribe();
  console.log('Escuchando inserts en adoptions...');
}

main();
