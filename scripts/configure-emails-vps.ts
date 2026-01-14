/**
 * Script para configurar emails no banco de dados da VPS
 */

import prisma from "../lib/prisma";

async function configureEmails() {
    console.log("🔧 Configurando emails no banco de dados...\n");

    const site = await prisma.site.update({
        where: { domain: "renovamente-guiomarmelo.com.br" },
        data: {
            emailTo: "renova@renovamente-guiomarmelo.com.br",
            emailBcc: "wagnerantunes84@gmail.com",
            resendApiKey: process.env.RESEND_API_KEY || "",
        },
    });

    console.log("✅ Configurações atualizadas:");
    console.log(`   Email TO: ${site.emailTo}`);
    console.log(`   Email BCC: ${site.emailBcc}`);
    console.log(`   Resend API Key: ${site.resendApiKey ? "✅ Configurada" : "❌ NÃO CONFIGURADA"}`);
    console.log("\n⚠️  IMPORTANTE: Certifique-se de que RESEND_API_KEY está no arquivo .env da VPS!");
}

configureEmails()
    .then(() => {
        console.log("\n✅ Script finalizado!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
