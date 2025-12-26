import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, domain, description, favicon, logo, logoDark, logoLight, logoAdmin, ogImage } = body;

        // Get user's site
        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user.id },
        });

        if (!siteUser) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        // Update site
        const updatedSite = await prisma.site.update({
            where: { id: siteUser.siteId },
            data: {
                name,
                domain: domain || null,
                description: description || null,
                favicon: favicon || null,
                logo: logo || null,
                logoDark: logoDark || null,
                logoLight: logoLight || null,
                logoAdmin: logoAdmin || null,
                ogImage: ogImage || null,
            },
        });

        return NextResponse.json(updatedSite);
    } catch (error) {
        console.error("Error updating site:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
