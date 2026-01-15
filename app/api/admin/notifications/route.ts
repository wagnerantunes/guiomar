import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-utils";

export async function GET() {
    let session, siteId;
    try {
        ({ session, siteId } = await getAdminSession());
    } catch (error: any) {
        return new NextResponse(error.message || "Unauthorized", { status: error.message === "Unauthorized" ? 401 : 404 });
    }

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
