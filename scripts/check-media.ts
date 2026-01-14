/**
 * Script para verificar imagens no banco de dados
 */

import prisma from "../lib/prisma";

async function checkMedia() {
    console.log("🔍 Verificando imagens no banco de dados...\n");

    const media = await prisma.media.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    console.log(`📊 Total de imagens: ${media.length}\n`);

    media.forEach((item, index) => {
        console.log(`${index + 1}. ${item.filename}`);
        console.log(`   URL: ${item.url}`);
        console.log(`   Tamanho: ${(item.size / 1024).toFixed(2)} KB`);
        console.log(`   Tipo: ${item.mimeType}`);
        console.log(`   Data: ${item.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`);
        console.log();
    });
}

checkMedia()
    .then(() => {
        console.log("✅ Verificação concluída!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Erro:", error);
        process.exit(1);
    });
