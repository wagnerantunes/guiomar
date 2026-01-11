import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAdminSession, getActiveSiteId } from "@/lib/admin-utils";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    let siteId: string | null = null;

    if (session?.user?.id && session.user.email) {
        try {
            siteId = await getActiveSiteId(session.user.id, session.user.email);
        } catch (e) {
            // Log or handle error
        }
    }

    if (!siteId) {
        // Public access or fallback
        try {
            const site = await prisma.site.findFirst({
                where: {
                    OR: [
                        { domain: "renovamente-guiomarmelo.com.br" },
                        { domain: { contains: "renovamente" } }
                    ]
                }
            });
            siteId = site?.id || null;
        } catch (e) {
            return NextResponse.json([]);
        }
    }

    if (!siteId) return NextResponse.json([]);

    try {
        const settings = await prisma.siteSettings.findMany({
            where: { siteId: siteId },
        });
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { siteId } = await getAdminSession();
        const body = await req.json();
        const { key, value } = body;

        const setting = await prisma.siteSettings.upsert({
            where: {
                siteId_key: {
                    siteId: siteId,
                    key: key,
                },
            },
            update: { value: value },
            create: {
                siteId: siteId,
                key: key,
                value: value,
            },
        });

        return NextResponse.json(setting);
    } catch (error: any) {
        console.error("Error updating setting:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: error.message === "Unauthorized" ? 401 : 500 });
    }
}
