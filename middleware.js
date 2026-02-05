import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = new URL(request.nextUrl);
  const code = url.pathname.split('/')[1]; // Ambil slug (misal: Cm2zkM)
  const isConfirm = url.searchParams.get('a') === 'confirm';
  const hasCookie = request.cookies.has(`skip_${code}`);

  // 1. Jika ini link pendek (panjang slug biasanya 6) dan BUKAN halaman statis
  if (code && code.length === 6 && !url.pathname.includes('.')) {
    
    // 2. Jika sudah punya cookie, LANGSUNG lempar ke halaman redirect khusus
    if (hasCookie && !isConfirm) {
      return NextResponse.rewrite(new URL(`/${code}/direct`, request.url));
    }
  }

  return NextResponse.next();
}

// Batasi middleware cuma jalan di link pendek
export const config = {
  matcher: '/:code((?!api|_next|static|favicon.ico).*)',
};
