import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-utils";

// GET route for public site data (logos, etc)
export async function GET() {
    try {
        // Get first site (assuming single site for now)
        const site = await prisma.site.findFirst({
            select: {
                id: true,
                name: true,
                logo: true,
                logoDark: true,
                logoLight: true,
                logoAdmin: true,
                favicon: true,
                settings: true,
            }
        });

        if (!site) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        return NextResponse.json(site);
    } catch (error) {
        console.error("Error fetching site:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { session, siteId } = await getAdminSession();
        const body = await req.json();
        const { name, domain, description, favicon, logo, logoDark, logoLight, logoAdmin, ogImage, emailTo, emailBcc, resendApiKey, settings } = body;

        // Update site
        const updatedSite = await prisma.site.update({
            where: { id: siteId },
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
                emailTo: emailTo || null,
                emailBcc: emailBcc || null,
                resendApiKey: resendApiKey || null,
                settings: settings || undefined,
            },
        });

        return NextResponse.json(updatedSite);
    } catch (error) {
        console.error("Error updating site:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
