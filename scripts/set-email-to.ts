/**
 * Script para configurar o Email TO no banco de dados
 */

import prisma from "../lib/prisma";

async function setEmailTo() {
    console.log("🔧 Configurando Email TO...\n");

    const site = await prisma.site.update({
        where: { domain: "renovamente-guiomarmelo.com.br" },
        data: {
            emailTo: "renova@renovamente-guiomarmelo.com.br",
        },
    });

    console.log("✅ Email TO configurado:");
    console.log(`   Email TO: ${site.emailTo}`);
    console.log(`   Email BCC: ${site.emailBcc}`);
    console.log(`   Resend API Key: ${site.resendApiKey ? "✅ Configurada" : "❌ NÃO CONFIGURADA"}`);
}

setEmailTo()
    .then(() => {
        console.log("\n✅ Configuração concluída!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro:", error);
        process.exit(1);
    });
