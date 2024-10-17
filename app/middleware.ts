import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/js/script.js')) {
    const url = request.nextUrl.clone();
    url.pathname = '/js/script.tagged-events.js';
    url.host = 'analytics.goosewin.com';
    url.protocol = 'https';
    return NextResponse.rewrite(url);
  }
}
