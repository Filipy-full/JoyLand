#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';
import fs from 'fs'
import path from 'path'

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

async function reseedTrees() {
  try {
    console.log('🗑️  Eliminando adopciones primero...')
    const { error: deleteAdoptionsError } = await supabase
      .from('adoptions')
      .delete()
      .gt('created_at', '2000-01-01')

    if (deleteAdoptionsError) {
      console.error('❌ Error al eliminar adopciones:', deleteAdoptionsError)
    } else {
      console.log('✅ Adopciones eliminadas')
    }

    console.log('🗑️  Eliminando árboles existentes...')
    const { error: deleteError } = await supabase
      .from('trees')
      .delete()
      .gt('created_at', '2000-01-01')

    if (deleteError) {
      console.error('❌ Error al eliminar:', deleteError)
    } else {
      console.log('✅ Árboles eliminados')
    }

    console.log('\n📖 Leyendo geojson-map.json...')

    const geoJsonPath = path.join(process.cwd(), 'public', 'geojson-map.json')
    const geoJsonData = JSON.parse(fs.readFileSync(geoJsonPath, 'utf8'))

    const trees = geoJsonData.features
      .filter((f) => f.properties?.type === 'tree')
      .map((f) => {
        const props = f.properties
        const coords = f.geometry.coordinates

        return {
          id: f.id || `tree_${props.name}`,
          name: props.name || `Tree`,
          type: props.species?.toLowerCase().includes('oliv') ? 'olive' : 'almond',
          status: 'available',
          description: `${props.species || 'Tree'} - ${props.area || 'Area'}`,
          latitude: coords[1],
          longitude: coords[0],
        }
      })

    console.log(`🌳 Se encontraron ${trees.length} árboles`)

    const batchSize = 100
    let inserted = 0

    for (let i = 0; i < trees.length; i += batchSize) {
      const batch = trees.slice(i, i + batchSize)

      const { error } = await supabase.from('trees').insert(batch)

      if (error) {
        console.error(`❌ Error en batch:`, error)
        process.exit(1)
      }

      inserted += batch.length
      console.log(`✅ Insertados ${inserted}/${trees.length}...`)
    }

    const olives = trees.filter((t) => t.type === 'olive').length
    const almonds = trees.filter((t) => t.type === 'almond').length

    console.log(`\n🎉 ¡Éxito!`)
    console.log(`  📊 Total: ${trees.length} árboles`)
    console.log(`  🫒 Olivos: ${olives}`)
    console.log(`  🌰 Almendros: ${almonds}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  }
}

reseedTrees()
