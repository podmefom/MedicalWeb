import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  // Если на странице аутентификации и уже залогинен - редирект на dashboard
  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // Если нужна аутентификация и не залогинен - редирект на login
  const protectedRoutes = ['/dashboard', '/booking', '/admin'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
