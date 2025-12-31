import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session.user?.id },
    });

    if (!siteUser) return new NextResponse("Site not found", { status: 404 });

    // Fetch leads with status 'New'
    const newLeads = await prisma.lead.findMany({
        where: {
            siteId: siteUser.siteId,
            status: "New",
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    return NextResponse.json(newLeads);
}
