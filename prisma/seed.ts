import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Limpar tabelas para evitar conflitos de chave única
  await prisma.adoption.deleteMany({});
  await prisma.tree.deleteMany({});
  await prisma.user.deleteMany({});


  // Coordenadas base da propriedade (ajustadas para o local exato do Google Maps)
  const BASE_LAT = 42.8001;
  const BASE_LNG = -5.5001;

  function randomOffset() {
    return (Math.random() - 0.5) * 0.002; // até ~200m de variação
  }

  // Dados de exemplo + árvores geradas com IDs únicos
  const trees = [
    // Olive trees
    {
      id: `olive-1`,
      type: 'olive',
      latitude: 42.8001,
      longitude: -5.5001,
      status: 'available',
      description: 'Un olivo centenario con tronco retorcido y ramas generosas. Ha visto pasar muchas estaciones y sigue produciendo aceitunas cada año.',
    },
    {
      id: `olive-2`,
      type: 'olive',
      latitude: 42.8005,
      longitude: -5.5005,
      status: 'available',
      description: 'Olivo joven y vigoroso, plantado hace 30 años. Está en su mejor momento de producción.',
    },
    {
      id: `olive-3`,
      type: 'olive',
      latitude: 42.8010,
      longitude: -5.5010,
      status: 'available',
      description: 'Este olivo está en una posición privilegiada, con mucha luz solar durante todo el día.',
    },
    {
      id: `olive-4`,
      type: 'olive',
      latitude: 42.8003,
      longitude: -5.5015,
      status: 'available',
      description: 'Olivo de mediana edad, con una forma hermosa y equilibrada.',
    },
    {
      id: `olive-5`,
      type: 'olive',
      latitude: 42.8008,
      longitude: -5.5008,
      status: 'available',
      description: 'Un olivo especial, el más grande de todos. Su sombra es perfecta para descansar en verano.',
    },
    // Almond trees
    {
      id: `almond-1`,
      type: 'almond',
      latitude: 42.8015,
      longitude: -5.5002,
      status: 'available',
      description: 'Almendro que florece rosa cada primavera. El primero en despertar.',
    },
    {
      id: `almond-2`,
      type: 'almond',
      latitude: 42.8020,
      longitude: -5.5007,
      status: 'available',
      description: 'Almendro blanco, con flores delicadas que atraen a las abejas.',
    },
    {
      id: `almond-3`,
      type: 'almond',
      latitude: 42.8012,
      longitude: -5.5012,
      status: 'available',
      description: 'Un almendro joven, lleno de energía y potencial.',
    },
    {
      id: `almond-4`,
      type: 'almond',
      latitude: 42.8018,
      longitude: -5.5018,
      status: 'available',
      description: 'Almendro productivo, sus almendras son especialmente dulces.',
    },
    {
      id: `almond-5`,
      type: 'almond',
      latitude: 42.8025,
      longitude: -5.5025,
      status: 'available',
      description: 'Este almendro está al borde del campo, como guardián del límite.',
    },
    // Geradas
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: `tree-${i + 1 + 10}`,
      name: `Árvore #${i + 1 + 10}`,
      type: i % 2 === 0 ? 'olive' : 'almond',
      status: 'available',
      latitude: BASE_LAT + randomOffset(),
      longitude: BASE_LNG + randomOffset(),
    })),
  ];

  for (const tree of trees) {
    await prisma.tree.create({
      data: tree,
    })
  }

  console.log(`✅ Created ${trees.length} trees`)

  // Optionally create a test user and adoption
  const testUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: 'Test User',
      email: 'info@joylandweb.com',
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
