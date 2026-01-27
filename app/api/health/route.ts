import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0';
  
  return NextResponse.json({
    status: 'healthy',
    version,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
