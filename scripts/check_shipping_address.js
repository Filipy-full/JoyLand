import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adoptions = await prisma.adoption.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      userId: true,
      treeId: true,
      shippingAddress: true,
      createdAt: true,
    },
  })
  console.log('Últimas adoções:')
  adoptions.forEach(a => {
    console.log(`ID: ${a.id}`)
    console.log(`User: ${a.userId}`)
    console.log(`Tree: ${a.treeId}`)
    console.log(`Shipping Address: ${a.shippingAddress}`)
    console.log(`Created At: ${a.createdAt}`)
    console.log('---')
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
