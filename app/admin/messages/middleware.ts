import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect or block access to /admin/messages
  return NextResponse.redirect(new URL('/admin', request.url));
}

export const config = {
  matcher: ['/admin/messages/:path*'],
};