import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/trees?type=almendro|olivo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  if (!type || (type !== 'almendro' && type !== 'olivo')) {
    return NextResponse.json({ error: 'Tipo de árbol inválido' }, { status: 400 });
  }
  // Prisma usa 'almond' y 'olive' en la base de datos
  const dbType = type === 'almendro' ? 'almond' : 'olive';
  const trees = await prisma.tree.findMany({
    where: { type: dbType },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ trees });
}
