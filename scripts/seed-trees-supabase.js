#!/usr/bin/env node

/**
 * Script para insertar los 90 árboles de GeoJSON en Supabase
 * 
 * Uso:
 *   node scripts/seed-trees-supabase.js
 * 
 * Requiere:
 *   - NEXT_PUBLIC_SUPABASE_URL en .env.local
 *   - SUPABASE_SERVICE_KEY en .env.local
 */

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY no están configurados en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedTrees() {
  try {
    console.log('📖 Leyendo geojson-map.json...')
    
    // Leer el archivo GeoJSON
    const geoJsonPath = path.join(process.cwd(), 'public', 'geojson-map.json')
    const geoJsonData = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'))

    // Filtrar solo los árboles
    const trees = geoJsonData.features
      .filter((f) => f.properties?.type === 'tree')
      .map((f, idx) => {
        const props = f.properties
        const coords = f.geometry.coordinates
        
        return {
          id: f.id || `tree_${idx}`,
          name: props.name || `Árbol ${idx + 1}`,
          type: props.species?.toLowerCase().includes('oliv') ? 'olive' : 'almond',
          status: 'available',
          description: `${props.species || 'Árbol'} en ${props.area || 'Can Aguillera'}`,
          latitude: coords[1],
          longitude: coords[0],
        }
      })

    console.log(`\n🌳 Se encontraron ${trees.length} árboles`)

    if (trees.length === 0) {
      console.error('❌ No se encontraron árboles en el GeoJSON')
      process.exit(1)
    }

    // Verificar si ya existen árboles
    const { count: existingCount } = await supabase
      .from('trees')
      .select('*', { count: 'exact' })

    if (existingCount && existingCount > 0) {
      console.warn(`⚠️  Ya existen ${existingCount} árboles en la base de datos`)
      console.log('💡 Para reimportar, ejecuta:')
      console.log('   DELETE FROM trees;')
      console.log('')
      
      const response = await new Promise((resolve) => {
        process.stdout.write('¿Deseas continuar y duplicar? (s/n): ')
        process.stdin.once('data', (data) => {
          resolve(data.toString().trim().toLowerCase() === 's')
        })
      })

      if (!response) {
        console.log('❌ Operación cancelada')
        process.exit(0)
      }
    }

    // Insertar en batches de 100 para evitar timeouts
    const batchSize = 100
    let inserted = 0

    for (let i = 0; i < trees.length; i += batchSize) {
      const batch = trees.slice(i, i + batchSize)
      
      const { error } = await supabase.from('trees').insert(batch)

      if (error) {
        console.error(`❌ Error en batch ${Math.floor(i / batchSize) + 1}:`, error)
        process.exit(1)
      }

      inserted += batch.length
      console.log(`✅ Insertados ${inserted}/${trees.length} árboles...`)
    }

    console.log(`\n🎉 ¡Éxito! Se importaron ${trees.length} árboles a Supabase`)
    console.log('\nResumen:')
    console.log(`  - Olivos: ${trees.filter((t) => t.type === 'olive').length}`)
    console.log(`  - Almendros: ${trees.filter((t) => t.type === 'almond').length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

seedTrees()
