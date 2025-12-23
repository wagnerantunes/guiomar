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
                if (isLoggedIn) return true
                return false // Redirect to login
            }

            // Redirect logged in users away from login page
            if (isLoginPage && isLoggedIn) {
                return Response.redirect(new URL('/admin', nextUrl))
            }

            return true
        },
    },
} satisfies NextAuthConfig
