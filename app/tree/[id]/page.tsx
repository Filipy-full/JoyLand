import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TreePage({ params }: { params: Promise<{ id: string }> }) {
  // TODO: Re-enable after fixing Prisma schema sync with Supabase
  notFound()
}
