/**
 * Script de Debug - Teste de BCC
 * 
 * Este script testa especificamente o envio de BCC para verificar
 * se o problema está na configuração do Resend ou no email BCC
 */

import prisma from "../lib/prisma";
import { Resend } from "resend";

async function debugEmailBCC() {
    console.log("🔍 Iniciando debug de BCC...\n");

    // 1. Buscar configurações do site
    const site = await prisma.site.findUnique({
        where: { domain: "renovamente-guiomarmelo.com.br" },
        select: {
            id: true,
            name: true,
            emailTo: true,
            emailBcc: true,
            resendApiKey: true,
        },
    });

    if (!site) {
        console.error("❌ Site não encontrado!");
        return;
    }

    console.log("📋 Configurações Atuais:");
    console.log(`   Email TO: ${site.emailTo}`);
    console.log(`   Email BCC: ${site.emailBcc}`);
    console.log(`   BCC é null? ${site.emailBcc === null}`);
    console.log(`   BCC é undefined? ${site.emailBcc === undefined}`);
    console.log(`   BCC é string vazia? ${site.emailBcc === ""}`);
    console.log(`   Tipo do BCC: ${typeof site.emailBcc}`);
    console.log(`   Valor exato do BCC: "${site.emailBcc}"\n`);

    if (!site.resendApiKey) {
        console.error("❌ Resend API Key não configurada!");
        return;
    }

    const resend = new Resend(site.resendApiKey);

    // Teste 1: Email SEM BCC
    console.log("📧 Teste 1: Email SEM BCC (apenas TO)");
    try {
        const result1 = await resend.emails.send({
            from: 'RenovaMente CMS <onboarding@resend.dev>',
            to: [site.emailTo!],
            subject: '🧪 [DEBUG 1] Teste SEM BCC',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Teste 1: Email SEM BCC</h2>
                    <p>Este email foi enviado APENAS para o email TO.</p>
                    <p><strong>TO:</strong> ${site.emailTo}</p>
                    <p><strong>BCC:</strong> Nenhum</p>
                </div>
            `,
        });

        console.log(`   ✅ Email enviado!`);
        console.log(`   ID: ${result1.data?.id}`);
        console.log(`   Erro: ${result1.error || 'Nenhum'}\n`);
    } catch (error: any) {
        console.error(`   ❌ Erro:`, error.message);
    }

    // Teste 2: Email COM BCC (se configurado)
    if (site.emailBcc && site.emailBcc.trim() !== "") {
        console.log("📧 Teste 2: Email COM BCC");
        console.log(`   TO: ${site.emailTo}`);
        console.log(`   BCC: ${site.emailBcc}`);

        try {
            const result2 = await resend.emails.send({
                from: 'RenovaMente CMS <onboarding@resend.dev>',
                to: [site.emailTo!],
                bcc: [site.emailBcc],
                subject: '🧪 [DEBUG 2] Teste COM BCC',
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Teste 2: Email COM BCC</h2>
                        <p>Este email foi enviado para TO e BCC.</p>
                        <p><strong>TO:</strong> ${site.emailTo}</p>
                        <p><strong>BCC:</strong> ${site.emailBcc}</p>
                        <hr/>
                        <p style="color: #666; font-size: 12px;">
                            Se você está vendo este email no BCC (wagnerantunes84@gmail.com),
                            significa que o BCC está funcionando!
                        </p>
                    </div>
                `,
            });

            console.log(`   ✅ Email enviado!`);
            console.log(`   ID: ${result2.data?.id}`);
            console.log(`   Erro: ${result2.error || 'Nenhum'}\n`);
        } catch (error: any) {
            console.error(`   ❌ Erro:`, error.message);
            console.error(`   Detalhes completos:`, error);
        }
    } else {
        console.warn("⚠️  Email BCC não está configurado ou está vazio!\n");
    }

    // Teste 3: Email DIRETO para wagnerantunes84@gmail.com (sem BCC)
    console.log("📧 Teste 3: Email DIRETO para wagnerantunes84@gmail.com");
    try {
        const result3 = await resend.emails.send({
            from: 'RenovaMente CMS <onboarding@resend.dev>',
            to: ['wagnerantunes84@gmail.com'],
            subject: '🧪 [DEBUG 3] Teste DIRETO para Gmail',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Teste 3: Email DIRETO</h2>
                    <p>Este email foi enviado DIRETAMENTE para wagnerantunes84@gmail.com (como TO, não BCC).</p>
                    <p>Se você recebeu este email, significa que:</p>
                    <ul>
                        <li>✅ O Resend está funcionando</li>
                        <li>✅ O Gmail está recebendo emails do Resend</li>
                        <li>❓ O problema pode estar no BCC especificamente</li>
                    </ul>
                </div>
            `,
        });

        console.log(`   ✅ Email enviado!`);
        console.log(`   ID: ${result3.data?.id}`);
        console.log(`   Erro: ${result3.error || 'Nenhum'}\n`);
    } catch (error: any) {
        console.error(`   ❌ Erro:`, error.message);
    }

    console.log("✅ Debug concluído!");
    console.log("\n📊 Resumo:");
    console.log("   - Teste 1: Email SEM BCC enviado");
    console.log("   - Teste 2: Email COM BCC enviado");
    console.log("   - Teste 3: Email DIRETO para Gmail enviado");
    console.log("\n💡 Verifique sua caixa de entrada e SPAM em:");
    console.log(`   - ${site.emailTo}`);
    console.log(`   - wagnerantunes84@gmail.com`);
    console.log("\n⚠️  IMPORTANTE: Emails BCC podem demorar alguns minutos para chegar!");
}

debugEmailBCC()
    .then(() => {
        console.log("\n🎉 Script finalizado!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
