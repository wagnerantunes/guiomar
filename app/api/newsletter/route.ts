import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { error: "Email inválido" },
                { status: 400 }
            );
        }

        // Fetch site ID - search for the specific domain or first site
        const site = await prisma.site.findFirst({
            where: {
              OR: [
                { domain: "renovamente-guiomarmelo.com.br" },
                { domain: "www.renovamente-guiomarmelo.com.br" },
                { subdomain: "renovamente" }
              ]
            }
        }) || await prisma.site.findFirst();

        if (!site) {
            return NextResponse.json(
                { error: "Site não encontrado" },
                { status: 404 }
            );
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: {
                siteId_email: {
                    siteId: site.id,
                    email: email,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { message: "Você já está inscrito em nossa newsletter!" },
                { status: 200 }
            );
        }

        // Create subscriber
        await prisma.newsletterSubscriber.create({
            data: {
                email,
                siteId: site.id,
                status: "Active",
            },
        });

        return NextResponse.json(
            { message: "Inscrição realizada com sucesso!" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Newsletter error:", error);
        return NextResponse.json(
            { error: "Erro ao processar sua inscrição. " + (error.message || "") },
            { status: 500 }
        );
    }
}
