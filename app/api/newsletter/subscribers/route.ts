import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user.id },
        });

        if (!siteUser) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        const subscribers = await prisma.newsletterSubscriber.findMany({
            where: { siteId: siteUser.siteId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(subscribers);
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, siteId } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Default site if not provided (for public forms)
        const targetSiteId = siteId || (await prisma.site.findFirst({ where: { domain: "renovamente-guiomarmelo.com.br" } }))?.id;

        if (!targetSiteId) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        const subscriber = await prisma.newsletterSubscriber.upsert({
            where: {
                siteId_email: {
                    siteId: targetSiteId,
                    email: email,
                },
            },
            update: { status: "Active" },
            create: {
                email,
                siteId: targetSiteId,
                status: "Active",
            },
        });

        return NextResponse.json(subscriber);
    } catch (error) {
        console.error("Error creating subscriber:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
