import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/trees?type=almendro|olivo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  let trees;
  if (!type) {
    trees = await prisma.tree.findMany({ orderBy: { createdAt: 'asc' } });
  } else {
    if (type !== 'almendro' && type !== 'olivo') {
      return NextResponse.json({ error: 'Tipo de árbol inválido' }, { status: 400 });
    }
    const dbType = type === 'almendro' ? 'almond' : 'olive';
    trees = await prisma.tree.findMany({
      where: { type: dbType },
      orderBy: { createdAt: 'asc' },
    });
  }
  return NextResponse.json({ trees });
}
