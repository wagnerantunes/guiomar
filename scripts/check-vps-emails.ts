/**
 * Script para verificar últimos leads e testar envio de email na VPS
 */

import prisma from "../lib/prisma";
import { Resend } from "resend";

async function checkLeadsAndEmail() {
    console.log("🔍 Verificando últimos leads...\n");

    // Buscar site
    const site = await prisma.site.findUnique({
        where: { domain: "renovamente-guiomarmelo.com.br" },
        select: {
            id: true,
            emailTo: true,
            emailBcc: true,
            resendApiKey: true,
        },
    });

    if (!site) {
        console.error("❌ Site não encontrado!");
        return;
    }

    console.log("📋 Configurações do Site:");
    console.log(`   Email TO: ${site.emailTo}`);
    console.log(`   Email BCC: ${site.emailBcc}`);
    console.log(`   Resend API Key: ${site.resendApiKey ? "✅ Configurada" : "❌ NÃO CONFIGURADA"}\n`);

    // Buscar últimos 5 leads
    const leads = await prisma.lead.findMany({
        where: { siteId: site.id },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    console.log(`📊 Últimos ${leads.length} leads:\n`);

    leads.forEach((lead, index) => {
        console.log(`${index + 1}. ${lead.name} (${lead.email})`);
        console.log(`   Empresa: ${lead.company || "N/A"}`);
        console.log(`   Telefone: ${lead.phone || "N/A"}`);
        console.log(`   Origem: ${lead.source}`);
        console.log(`   Data: ${lead.createdAt.toLocaleString("pt-BR")}`);
        console.log(`   ID: ${lead.id}\n`);
    });

    // Testar envio de email
    if (site.resendApiKey && site.emailTo) {
        console.log("📧 Testando envio de email...\n");

        const resend = new Resend(site.resendApiKey);

        try {
            const result = await resend.emails.send({
                from: 'RenovaMente <contato@renovamente-guiomarmelo.com.br>',
                to: [site.emailTo],
                bcc: site.emailBcc ? [site.emailBcc] : undefined,
                subject: '🧪 Teste de Email - VPS',
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #13ec5b; border-radius: 10px;">
                        <h2 style="color: #13ec5b;">✅ Teste de Email da VPS</h2>
                        <p><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                        <p><strong>TO:</strong> ${site.emailTo}</p>
                        <p><strong>BCC:</strong> ${site.emailBcc || "Não configurado"}</p>
                        <hr/>
                        <p>Este email foi enviado diretamente da VPS para testar o sistema de notificações.</p>
                        <p>Se você recebeu este email, o sistema está funcionando corretamente!</p>
                    </div>
                `,
            });

            if (result.error) {
                console.error("❌ ERRO ao enviar email:");
                console.error(JSON.stringify(result.error, null, 2));
            } else if (result.data) {
                console.log("✅ Email enviado com sucesso!");
                console.log(`   ID: ${result.data.id}`);
            }

        } catch (error: any) {
            console.error("❌ EXCEÇÃO ao enviar email:");
            console.error(error.message);
        }
    }
}

checkLeadsAndEmail()
    .then(() => {
        console.log("\n✅ Script finalizado!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
