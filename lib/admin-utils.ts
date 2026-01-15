import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const SUPER_ADMIN_EMAILS = [
    'wagnerantunes84@gmail.com',
    'maycon.santos.ms@gmail.com',
    'renovamente.mkt@gmail.com'
];

export async function isSuperAdmin(email?: string | null) {
    if (!email) return false;
    return SUPER_ADMIN_EMAILS.includes(email);
}

/**
 * Gets the siteId for the current user.
 * If user is super admin and not linked, it automatically links or returns the first site.
 */
export async function getActiveSiteId(userId: string, email: string) {
    // 1. Check if user is already linked to a site
    let siteUser = await prisma.siteUser.findFirst({
        where: { userId },
    });

    if (siteUser) {
        return siteUser.siteId;
    }

    // 2. If not linked, check if it's a super admin
    const superAdmin = await isSuperAdmin(email);
    if (superAdmin) {
        // Find the first site (which should be the main one)
        const site = await prisma.site.findFirst();
        if (site) {
            // Auto-link super admin to this site to prevent future issues
            await prisma.siteUser.create({
                data: {
                    userId,
                    siteId: site.id,
                    role: 'ADMIN'
                }
            });
            return site.id;
        }
    }

    return null;
}

/**
 * Server-side helper to get current session and active siteId
 * Throws error if unauthorized
 */
export async function getAdminSession() {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) {
        throw new Error("Unauthorized");
    }

    const siteId = await getActiveSiteId(session.user.id, session.user.email);

    if (!siteId) {
        throw new Error("Site not found");
    }

    return {
        session,
        userId: session.user.id,
        siteId
    };
}
