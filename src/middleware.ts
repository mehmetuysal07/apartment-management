import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // API rotalarını kontrol etme
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Kullanıcının oturum durumunu kontrol et
  const user = request.cookies.get('user');
  const isLoginPage = request.nextUrl.pathname === '/';
  
  // Korunacak rotalar
  const protectedPaths = [
    '/dashboard',
    '/add-apartment',
    '/add-expense',
    '/reports'
  ];

  // Mevcut yolun korunup korunmadığını kontrol et
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Kullanıcı giriş yapmamış ve korumalı bir sayfaya erişmeye çalışıyorsa
  if (!user && isProtectedPath) {
    // Login sayfasına yönlendir
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Kullanıcı giriş yapmış ve login sayfasına gitmeye çalışıyorsa
  if (user && isLoginPage) {
    // Dashboard'a yönlendir
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Middleware'in hangi yollarda çalışacağını belirt
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 