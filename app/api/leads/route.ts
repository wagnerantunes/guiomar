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

    const leads = await prisma.lead.findMany({
        where: { siteId: siteUser.siteId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, company, message, source, domain } = body;

        // Find site by domain if provided, or use default
        const site = await prisma.site.findUnique({
            where: { domain: domain || "renovamente-guiomarmelo.com.br" },
        });

        if (!site) {
            return new NextResponse("Site not found", { status: 404 });
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                company,
                message,
                source,
                siteId: site.id,
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Error creating lead:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
