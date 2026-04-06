import { auth } from '@/auth';

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/register');
  
  // Если на странице аутентификации и уже залогинен - редирект на dashboard
  if (isAuthPage && req.auth) {
    return Response.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Если нужна аутентификация и не залогинен - редирект на login
  const protectedRoutes = ['/dashboard', '/booking', '/admin'];
  const isProtected = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  
  if (isProtected && !req.auth) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
