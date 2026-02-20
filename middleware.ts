import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin/dashboard') || req.nextUrl.pathname.startsWith('/api/dashboard') || (req.nextUrl.pathname.startsWith('/api/products') && req.method !== 'GET')) {
    const token = req.cookies.get('az_admin_token')?.value;
    if (!token || !verifyToken(token)) {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
};
