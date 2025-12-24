import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { status, notes } = body;
        const { id } = params;

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(notes !== undefined && { notes }),
            },
        });

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Error updating lead:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
