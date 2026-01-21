import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/config';

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales,
    // Used when no locale matches
    defaultLocale
});

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // API routes ve statik dosyaları atla (intl middleware dokunmasın)
    if (
        pathname.includes("/api/") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(tr|en)/:path*', "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
