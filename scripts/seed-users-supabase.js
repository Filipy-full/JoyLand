#!/usr/bin/env node

/**
 * Script para crear usuarios de prueba en Supabase
 * 
 * Uso:
 *   node scripts/seed-users-supabase.js
 * 
 * Crea:
 *   - 3 usuarios de prueba
 *   - 5 adopciones de ejemplo para cada usuario
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error(' Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY no están configurados')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const testUsers = [
  {
    email: 'juan@example.com',
    password: 'Test123!@#',
    name: 'Juan García',
  },
  {
    email: 'maria@example.com',
    password: 'Test123!@#',
    name: 'María López',
  },
  {
    email: 'carlos@example.com',
    password: 'Test123!@#',
    name: 'Carlos Rodríguez',
  },
]

async function seedUsers() {
  try {
    console.log('👥 Creando usuarios de prueba...\n')

    for (const testUser of testUsers) {
      try {
        // Crear usuario en Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true,
        })

        if (authError) {
          console.warn(`  ⚠️  ${testUser.email}: ${authError.message}`)
          continue
        }

        // Crear profile en tabla users
        const { error: profileError } = await supabase.from('users').insert({
          id: authUser.user.id,
          email: testUser.email,
          name: testUser.name,
        })

        if (profileError) {
          console.error(`   Error creando profile para ${testUser.email}: ${profileError}`)
          continue
        }

        console.log(`  ✅ ${testUser.email} - ID: ${authUser.user.id}`)

        // Crear algunas adopciones de ejemplo
        const treeIds = ['tree_1', 'tree_2', 'tree_3', 'tree_4', 'tree_5']

        for (let i = 0; i < treeIds.length; i++) {
          const startDate = new Date()
          startDate.setDate(startDate.getDate() - (i * 60)) // Adopciones escalonadas

          const endDate = new Date(startDate)
          endDate.setFullYear(endDate.getFullYear() + 1)

          await supabase.from('adoptions').insert({
            user_id: authUser.user.id,
            tree_id: treeIds[i],
            status: 'adopted',
            payment_status: 'completed',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            certificate_code: `JOY-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}-${i}`,
            tree_name: `Mi Árbol ${i + 1}`,
          })
        }

        console.log(`     → 5 adopciones de ejemplo creadas`)
      } catch (error) {
        console.error(`   Error con ${testUser.email}:`, error.message)
      }
    }

    console.log('\n✨ ¡Listo! Usuarios de prueba creados')
    console.log('\nCredenciales de prueba:')
    testUsers.forEach((u) => {
      console.log(`  📧 ${u.email} / 🔑 ${u.password}`)
    })

    process.exit(0)
  } catch (error) {
    console.error(' Error fatal:', error)
    process.exit(1)
  }
}

seedUsers()
