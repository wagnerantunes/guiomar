import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [], // Configured in auth.ts
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
            }
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isAdminRoute = nextUrl.pathname.startsWith('/admin')
            const isLoginPage = nextUrl.pathname === '/login'

            // Protect admin routes
            if (isAdminRoute) {
                if (!isLoggedIn) return false

                const user = auth?.user as any
                const email = user?.email
                const role = user?.role

                // Super Admins (Always have access)
                const isSuperAdmin = email === 'wagnerantunes84@gmail.com' || email === 'maycon.santos.ms@gmail.com'

                // Regular Admins (Must have ADMIN role)
                const isAdmin = role === 'ADMIN'

                // If not super admin nor regular admin, deny access
                if (!isSuperAdmin && !isAdmin) {
                    return false
                }

                return true
            }

            // Redirect logged in users away from login page
            if (isLoginPage && isLoggedIn) {
                return Response.redirect(new URL('/admin', nextUrl))
            }

            return true
        },
    },
} satisfies NextAuthConfig
