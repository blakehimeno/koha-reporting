import { NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from './lib/auth';

export async function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|api/auth/login|_next/static|_next/image|favicon.ico).*)'],
};