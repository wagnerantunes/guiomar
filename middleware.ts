import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const session = await auth()
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname === '/login'

    // Redirect to login if accessing admin without session
    if (isAdminRoute && !session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to admin if already logged in and trying to access login
    if (isLoginPage && session) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login']
}
