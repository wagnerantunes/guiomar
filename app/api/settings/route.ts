import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        // For public landing page access, we need a way to fetch settings
        // Usually by domain or site slug.
        const url = new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
        const domain = url.hostname;

        try {
            const site = await prisma.site.findFirst({
                where: { domain: { contains: "renovamente" } }, // Fallback logic
                include: { siteSettings: true }
            });
            return NextResponse.json(site?.siteSettings || []);
        } catch (e) {
            return NextResponse.json([]);
        }
    }

    try {
        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user.id },
        });

        if (!siteUser) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        const settings = await prisma.siteSettings.findMany({
            where: { siteId: siteUser.siteId },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { key, value } = body;

        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user.id },
        });

        if (!siteUser) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        const setting = await prisma.siteSettings.upsert({
            where: {
                siteId_key: {
                    siteId: siteUser.siteId,
                    key: key,
                },
            },
            update: { value: value },
            create: {
                siteId: siteUser.siteId,
                key: key,
                value: value,
            },
        });

        return NextResponse.json(setting);
    } catch (error) {
        console.error("Error updating setting:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
