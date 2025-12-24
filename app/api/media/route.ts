import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session.user?.id },
        include: { site: true },
    });

    if (!siteUser) {
        return new NextResponse("Site not found", { status: 404 });
    }

    const media = await prisma.media.findMany({
        where: { siteId: siteUser.siteId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(media);
}
