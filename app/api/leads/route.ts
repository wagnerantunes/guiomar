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

    const leads = await prisma.lead.findMany({
        where: { siteId: siteId },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leads);
}

import { Resend } from "resend";

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

        // EMAIL NOTIFICATION SYSTEM
        if (site.resendApiKey && site.emailTo) {
            try {
                const resend = new Resend(site.resendApiKey);

                const emailTemplate = (recipientType: string) => `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #13ec5b;">Novo Lead Capturado!</h2>
                        <p>Um novo potencial cliente acaba de entrar em contato pelo site.</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; color: #666;"><strong>Nome:</strong></td><td>${name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;"><strong>E-mail:</strong></td><td>${email}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;"><strong>WhatsApp:</strong></td><td>${phone || 'Não informado'}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;"><strong>Empresa:</strong></td><td>${company || 'Não informada'}</td></tr>
                            <tr><td style="padding: 8px 0; color: #666;"><strong>Origem:</strong></td><td>${source || 'Direto'}</td></tr>
                        </table>
                        
                        <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                            <strong>Mensagem:</strong><br/>
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #999;">
                            Este é um e-mail automático enviado pelo sistema RenovaMente CMS.
                            ${recipientType === 'bcc' ? '<br/><em>(Cópia de notificação)</em>' : ''}
                        </p>
                    </div>
                `;

                // Try to send with BCC first (works if domain is verified)
                try {
                    await resend.emails.send({
                        from: 'RenovaMente <contato@renovamente-guiomarmelo.com.br>',
                        to: [site.emailTo],
                        bcc: site.emailBcc ? [site.emailBcc] : undefined,
                        subject: `🚀 Novo Lead: ${name} (${company || 'Individual'})`,
                        html: emailTemplate('main'),
                    });
                } catch (bccError: any) {
                    // If BCC fails (Resend in test mode), send separate emails
                    console.log("BCC failed, sending separate emails...");

                    // Send to main email (if not the same as BCC)
                    if (site.emailTo !== site.emailBcc) {
                        try {
                            await resend.emails.send({
                                from: 'RenovaMente <contato@renovamente-guiomarmelo.com.br>',
                                to: [site.emailTo],
                                subject: `🚀 Novo Lead: ${name} (${company || 'Individual'})`,
                                html: emailTemplate('main'),
                            });
                        } catch (mainError) {
                            console.error("Error sending to main email:", mainError);
                        }
                    }

                    // Send to BCC email separately
                    if (site.emailBcc) {
                        try {
                            await resend.emails.send({
                                from: 'RenovaMente <contato@renovamente-guiomarmelo.com.br>',
                                to: [site.emailBcc],
                                subject: `🚀 Novo Lead: ${name} (${company || 'Individual'})`,
                                html: emailTemplate('bcc'),
                            });
                        } catch (bccSeparateError) {
                            console.error("Error sending to BCC email:", bccSeparateError);
                        }
                    }
                }
            } catch (emailError) {
                console.error("Error sending lead email:", emailError);
                // We don't fail the lead creation if email fails
            }
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error("Error creating lead:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
