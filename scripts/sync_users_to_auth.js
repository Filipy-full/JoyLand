// Script para sincronizar usuarios de public.users a auth.users en Supabase
// Requiere: npm install @supabase/supabase-js dotenv


import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Usa la service key
);

async function syncUsers() {
  // Obtén todos los usuarios de la tabla public.users
  const { data: users, error } = await supabase.from('users').select('id, email');
  if (error) {
    console.error('Error al leer usuarios:', error);
    return;
  }

  for (const user of users) {
    // Intenta crear el usuario en auth.users
    const { data, error: signUpError } = await supabase.auth.admin.createUser({
      email: user.email,
      user_metadata: { public_user_id: user.id }
    });
    if (signUpError && !signUpError.message.includes('User already registered')) {
      console.error(`Error creando usuario ${user.email}:`, signUpError.message);
    } else {
      console.log(`Usuario ${user.email} sincronizado.`);
    }
  }
}

syncUsers();
