import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample trees
  const trees = [
    // Olive trees
    {
      type: 'olive',
      latitude: 42.8001,
      longitude: -5.5001,
      status: 'available',
      description: 'Un olivo centenario con tronco retorcido y ramas generosas. Ha visto pasar muchas estaciones y sigue produciendo aceitunas cada año.',
    },
    {
      type: 'olive',
      latitude: 42.8005,
      longitude: -5.5005,
      status: 'available',
      description: 'Olivo joven y vigoroso, plantado hace 30 años. Está en su mejor momento de producción.',
    },
    {
      type: 'olive',
      latitude: 42.8010,
      longitude: -5.5010,
      status: 'available',
      description: 'Este olivo está en una posición privilegiada, con mucha luz solar durante todo el día.',
    },
    {
      type: 'olive',
      latitude: 42.8003,
      longitude: -5.5015,
      status: 'available',
      description: 'Olivo de mediana edad, con una forma hermosa y equilibrada.',
    },
    {
      type: 'olive',
      latitude: 42.8008,
      longitude: -5.5008,
      status: 'available',
      description: 'Un olivo especial, el más grande de todos. Su sombra es perfecta para descansar en verano.',
    },
    
    // Almond trees
    {
      type: 'almond',
      latitude: 42.8015,
      longitude: -5.5002,
      status: 'available',
      description: 'Almendro que florece rosa cada primavera. El primero en despertar.',
    },
    {
      type: 'almond',
      latitude: 42.8020,
      longitude: -5.5007,
      status: 'available',
      description: 'Almendro blanco, con flores delicadas que atraen a las abejas.',
    },
    {
      type: 'almond',
      latitude: 42.8012,
      longitude: -5.5012,
      status: 'available',
      description: 'Un almendro joven, lleno de energía y potencial.',
    },
    {
      type: 'almond',
      latitude: 42.8018,
      longitude: -5.5018,
      status: 'available',
      description: 'Almendro productivo, sus almendras son especialmente dulces.',
    },
    {
      type: 'almond',
      latitude: 42.8025,
      longitude: -5.5025,
      status: 'available',
      description: 'Este almendro está al borde del campo, como guardián del límite.',
    },
  ]

  for (const tree of trees) {
    await prisma.tree.create({
      data: tree,
    })
  }

  console.log(`✅ Created ${trees.length} trees`)

  // Optionally create a test user and adoption
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@joyland.es',
    },
  })

  console.log('✅ Created test user')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
