import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(' Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY no están configurados')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'filipyhenrique54@gmail.com',
    password: 'Filipy2026!@#', // Contraseña fuerte
    email_confirm: true,
    user_metadata: { name: 'Filipy Henrique' }
  })

  if (error) {
    console.error(' Error creando usuario:', error.message)
    process.exit(1)
  }

  console.log('Created user and profile successfully. User ID:', data.user.id)

  // Crear perfil en tabla users
  const { error: profileError } = await supabase.from('users').insert({
    id: data.user.id,
    email: 'filipyhenrique54@gmail.com',
    name: 'Filipy Henrique',
    created_at: new Date().toISOString()
  })

  if (profileError) {
    console.error(' Error creating profile:', profileError.message)
    process.exit(1)
  }

  console.log(' Created user and profile successfully')
}

createUser()
