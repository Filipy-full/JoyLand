import { prisma } from '@/lib/prisma'
import AdoptPageClient from '@/components/AdoptPageClient'

export const dynamic = 'force-dynamic'

export default async function AdoptPage() {
  // Fetch all trees from database
  const trees = await prisma.tree.findMany({
    orderBy: {
      type: 'asc',
    },
  })

  return <AdoptPageClient trees={trees} />
}
