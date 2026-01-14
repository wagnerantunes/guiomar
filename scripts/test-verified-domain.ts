/**
 * Script para testar o domínio verificado no Resend
 */

import prisma from "../lib/prisma";
import { Resend } from "resend";

async function testVerifiedDomain() {
    console.log("🔍 Testando domínio verificado no Resend...\n");

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

    // Teste com diferentes domínios "from"
    const domainsToTest = [
        'noreply@renovamente-guiomarmelo.com.br',
        'contato@renovamente-guiomarmelo.com.br',
        'renova@renovamente-guiomarmelo.com.br',
        'noreply@email.renovamente-guiomarmelo.com.br',
    ];

    console.log("📧 Testando diferentes endereços 'from'...\n");

    for (const fromEmail of domainsToTest) {
        console.log(`\n🧪 Testando: ${fromEmail}`);

        try {
            const result = await resend.emails.send({
                from: `RenovaMente <${fromEmail}>`,
                to: ['wagnerantunes84@gmail.com'],
                subject: `🧪 Teste de Domínio Verificado - ${fromEmail}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #13ec5b; border-radius: 10px;">
                        <h2 style="color: #13ec5b;">✅ Teste de Domínio Verificado</h2>
                        <p><strong>Remetente (FROM):</strong> ${fromEmail}</p>
                        <p><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                        <hr/>
                        <p>Se você recebeu este email, significa que o domínio <strong>${fromEmail.split('@')[1]}</strong> está verificado e funcionando!</p>
                    </div>
                `,
            });

            if (result.error) {
                console.log(`   ❌ ERRO: ${result.error.message}`);
            } else if (result.data) {
                console.log(`   ✅ SUCESSO! Email enviado com ID: ${result.data.id}`);
            }

        } catch (error: any) {
            console.log(`   ❌ EXCEÇÃO: ${error.message}`);
        }
    }

    console.log("\n\n📧 Agora testando COM BCC usando domínio verificado...\n");

    // Tenta com o primeiro domínio que funcionou
    for (const fromEmail of domainsToTest) {
        console.log(`\n🧪 Testando BCC com: ${fromEmail}`);

        try {
            const result = await resend.emails.send({
                from: `RenovaMente <${fromEmail}>`,
                to: [site.emailTo!],
                bcc: ['wagnerantunes84@gmail.com'],
                subject: `🧪 Teste BCC com Domínio Verificado - ${fromEmail}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #13ec5b; border-radius: 10px;">
                        <h2 style="color: #13ec5b;">✅ Teste de BCC com Domínio Verificado</h2>
                        <p><strong>Remetente (FROM):</strong> ${fromEmail}</p>
                        <p><strong>TO:</strong> ${site.emailTo}</p>
                        <p><strong>BCC:</strong> wagnerantunes84@gmail.com</p>
                        <p><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                        <hr/>
                        <p>Se você recebeu este email no Gmail (BCC), significa que o BCC está funcionando perfeitamente com o domínio verificado!</p>
                    </div>
                `,
            });

            if (result.error) {
                console.log(`   ❌ ERRO: ${result.error.message}`);
            } else if (result.data) {
                console.log(`   ✅ SUCESSO! BCC funcionando! Email ID: ${result.data.id}`);
                console.log(`   🎉 Este é o domínio que devemos usar: ${fromEmail}\n`);
                break; // Para no primeiro que funcionar
            }

        } catch (error: any) {
            console.log(`   ❌ EXCEÇÃO: ${error.message}`);
        }
    }

    console.log("\n✅ Teste concluído!");
    console.log("\n💡 Verifique seu Gmail (wagnerantunes84@gmail.com) para ver quais emails chegaram.");
}

testVerifiedDomain()
    .then(() => {
        console.log("\n🎉 Script finalizado!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
