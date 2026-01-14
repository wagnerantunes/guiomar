/**
 * Script de Debug Detalhado - Resend API
 * 
 * Verifica se há erros na resposta do Resend
 */

import prisma from "../lib/prisma";
import { Resend } from "resend";

async function debugResendAPI() {
    console.log("🔍 Debug detalhado da API Resend...\n");

    const site = await prisma.site.findUnique({
        where: { domain: "renovamente-guiomarmelo.com.br" },
        select: {
            emailTo: true,
            emailBcc: true,
            resendApiKey: true,
        },
    });

    if (!site?.resendApiKey) {
        console.error("❌ Resend API Key não configurada!");
        return;
    }

    const resend = new Resend(site.resendApiKey);

    console.log("📧 Enviando email de teste DIRETO para wagnerantunes84@gmail.com...\n");

    try {
        const result = await resend.emails.send({
            from: 'RenovaMente CMS <onboarding@resend.dev>',
            to: ['wagnerantunes84@gmail.com'],
            subject: '🧪 Teste DIRETO - Resend Debug',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 2px solid #13ec5b; border-radius: 10px;">
                    <h2 style="color: #13ec5b;">✅ Email de Teste Direto</h2>
                    <p>Se você está vendo este email, significa que:</p>
                    <ul>
                        <li>✅ O Resend está funcionando corretamente</li>
                        <li>✅ Seu Gmail está recebendo emails do Resend</li>
                        <li>✅ Não há bloqueio de firewall ou filtro</li>
                    </ul>
                    <hr/>
                    <p><strong>Horário do envio:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <p><strong>Destinatário:</strong> wagnerantunes84@gmail.com</p>
                </div>
            `,
        });

        console.log("📊 Resposta completa do Resend:");
        console.log(JSON.stringify(result, null, 2));
        console.log();

        if (result.error) {
            console.error("❌ ERRO encontrado:");
            console.error(JSON.stringify(result.error, null, 2));
        } else if (result.data) {
            console.log("✅ Email enviado com sucesso!");
            console.log(`   ID: ${result.data.id}`);
        }

    } catch (error: any) {
        console.error("❌ Exceção capturada:");
        console.error(error);
    }

    console.log("\n📧 Agora testando com BCC...\n");

    try {
        const result = await resend.emails.send({
            from: 'RenovaMente CMS <onboarding@resend.dev>',
            to: [site.emailTo!],
            bcc: ['wagnerantunes84@gmail.com'],
            subject: '🧪 Teste COM BCC - Resend Debug',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 2px solid #13ec5b; border-radius: 10px;">
                    <h2 style="color: #13ec5b;">✅ Email de Teste COM BCC</h2>
                    <p><strong>TO:</strong> ${site.emailTo}</p>
                    <p><strong>BCC:</strong> wagnerantunes84@gmail.com</p>
                    <hr/>
                    <p>Se você está vendo este email no Gmail (wagnerantunes84@gmail.com), o BCC está funcionando!</p>
                    <p><strong>Horário do envio:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                </div>
            `,
        });

        console.log("📊 Resposta completa do Resend (COM BCC):");
        console.log(JSON.stringify(result, null, 2));
        console.log();

        if (result.error) {
            console.error("❌ ERRO encontrado:");
            console.error(JSON.stringify(result.error, null, 2));
        } else if (result.data) {
            console.log("✅ Email COM BCC enviado com sucesso!");
            console.log(`   ID: ${result.data.id}`);
        }

    } catch (error: any) {
        console.error("❌ Exceção capturada:");
        console.error(error);
    }

    console.log("\n✅ Debug concluído!");
    console.log("\n💡 IMPORTANTE:");
    console.log("   1. Verifique sua caixa de entrada do Gmail");
    console.log("   2. Verifique a pasta SPAM/LIXO ELETRÔNICO");
    console.log("   3. Emails BCC podem demorar alguns minutos");
    console.log("   4. Procure por emails com assunto contendo '[TESTE]' ou 'Debug'");
}

debugResendAPI()
    .then(() => {
        console.log("\n🎉 Script finalizado!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
