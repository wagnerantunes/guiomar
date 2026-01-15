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

        const campaigns = await prisma.newsletterCampaign.findMany({
            where: { siteId: siteUser.siteId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(campaigns);
    } catch (error) {
        console.error("Error fetching campaigns:", error);
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
        const { subject, content, status } = body;

        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user.id },
        });

        if (!siteUser) {
            return NextResponse.json({ error: "Site not found" }, { status: 404 });
        }

        const campaign = await prisma.newsletterCampaign.create({
            data: {
                subject,
                content,
                status: status || "Draft",
                siteId: siteUser.siteId,
                sentAt: status === "Sent" ? new Date() : null,
            },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("Error creating campaign:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
