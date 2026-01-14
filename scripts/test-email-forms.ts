/**
 * Script de Teste de Emails dos Formulários
 * 
 * Este script testa o envio de emails de todos os formulários do site RenovaMente
 * 
 * Configurações esperadas:
 * - emailTo: renova@renovamente-guiomarmelo.com.br
 * - emailBcc: wagnerantunes84@gmail.com
 * 
 * Formulários testados:
 * 1. Hero Section Lead Form
 * 2. Landing Page Dynamic Form (Contact)
 */

import prisma from "../lib/prisma";
import { Resend } from "resend";

async function testEmailForms() {
    console.log("🚀 Iniciando teste de envio de emails dos formulários...\n");

    // 1. Buscar configurações do site
    const site = await prisma.site.findUnique({
        where: { domain: "renovamente-guiomarmelo.com.br" },
        select: {
            id: true,
            name: true,
            domain: true,
            emailTo: true,
            emailBcc: true,
            resendApiKey: true,
        },
    });

    if (!site) {
        console.error("❌ Site não encontrado no banco de dados!");
        return;
    }

    console.log("📋 Configurações do Site:");
    console.log(`   Nome: ${site.name}`);
    console.log(`   Domínio: ${site.domain}`);
    console.log(`   Email TO: ${site.emailTo || "NÃO CONFIGURADO"}`);
    console.log(`   Email BCC: ${site.emailBcc || "NÃO CONFIGURADO"}`);
    console.log(`   Resend API Key: ${site.resendApiKey ? "✅ Configurada" : "❌ NÃO CONFIGURADA"}\n`);

    // Validar configurações
    if (!site.resendApiKey) {
        console.error("❌ ERRO: Resend API Key não está configurada!");
        console.log("   Configure em: /admin/settings\n");
        return;
    }

    if (!site.emailTo) {
        console.error("❌ ERRO: Email de destino (TO) não está configurado!");
        console.log("   Configure em: /admin/settings\n");
        return;
    }

    // Verificar se os emails estão corretos
    const expectedEmailTo = "renova@renovamente-guiomarmelo.com.br";
    const expectedEmailBcc = "wagnerantunes84@gmail.com";

    if (site.emailTo !== expectedEmailTo) {
        console.warn(`⚠️  AVISO: Email TO diferente do esperado!`);
        console.warn(`   Esperado: ${expectedEmailTo}`);
        console.warn(`   Atual: ${site.emailTo}\n`);
    }

    if (site.emailBcc !== expectedEmailBcc) {
        console.warn(`⚠️  AVISO: Email BCC diferente do esperado!`);
        console.warn(`   Esperado: ${expectedEmailBcc}`);
        console.warn(`   Atual: ${site.emailBcc || "NÃO CONFIGURADO"}\n`);
    }

    const resend = new Resend(site.resendApiKey);

    // 2. Teste do Formulário Hero
    console.log("📧 Teste 1: Formulário Hero Section");
    console.log("   Criando lead de teste...");

    const heroLead = await prisma.lead.create({
        data: {
            name: "TESTE - Wagner Antunes",
            email: "teste.hero@renovamente.com.br",
            phone: "19993236343",
            company: "RenovaMente Teste",
            message: "CONTATO VIA HERO. Cliente: TESTE - Wagner Antunes (@RenovaMente Teste). Interessado em consultoria profissional.",
            source: "Hero Section Lead Form - TESTE AUTOMÁTICO",
            siteId: site.id,
        },
    });

    console.log(`   ✅ Lead criado: ID ${heroLead.id}`);

    try {
        const heroEmailResult = await resend.emails.send({
            from: 'RenovaMente CMS <onboarding@resend.dev>',
            to: [site.emailTo],
            bcc: site.emailBcc ? [site.emailBcc] : undefined,
            subject: `🚀 [TESTE] Novo Lead: ${heroLead.name} (${heroLead.company})`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #13ec5b;">Novo Lead Capturado! (TESTE)</h2>
                    <p>Um novo potencial cliente acaba de entrar em contato pelo site.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Nome:</strong></td><td>${heroLead.name}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>E-mail:</strong></td><td>${heroLead.email}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>WhatsApp:</strong></td><td>${heroLead.phone}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Empresa:</strong></td><td>${heroLead.company}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Origem:</strong></td><td>${heroLead.source}</td></tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                        <strong>Mensagem:</strong><br/>
                        <p style="white-space: pre-wrap;">${heroLead.message}</p>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">
                        Este é um e-mail automático enviado pelo sistema RenovaMente CMS.
                    </p>
                </div>
            `,
        });

        console.log(`   ✅ Email enviado com sucesso!`);
        console.log(`   ID do Email: ${heroEmailResult.data?.id}\n`);
    } catch (error: any) {
        console.error(`   ❌ Erro ao enviar email:`, error.message);
        console.error(`   Detalhes:`, error);
    }

    // 3. Teste do Formulário de Contato
    console.log("📧 Teste 2: Formulário de Contato (Landing Page)");
    console.log("   Criando lead de teste...");

    const contactLead = await prisma.lead.create({
        data: {
            name: "TESTE - Maria Silva",
            email: "teste.contato@renovamente.com.br",
            message: `Seu Nome: TESTE - Maria Silva
Seu melhor E-mail: teste.contato@renovamente.com.br
Como podemos ajudar sua empresa?: Gostaria de uma consultoria sobre ergonomia no ambiente de trabalho para nossa equipe de 50 colaboradores.`,
            source: "Landing Page Dynamic Form - TESTE AUTOMÁTICO",
            siteId: site.id,
        },
    });

    console.log(`   ✅ Lead criado: ID ${contactLead.id}`);

    try {
        const contactEmailResult = await resend.emails.send({
            from: 'RenovaMente CMS <onboarding@resend.dev>',
            to: [site.emailTo],
            bcc: site.emailBcc ? [site.emailBcc] : undefined,
            subject: `🚀 [TESTE] Novo Lead: ${contactLead.name} (Individual)`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #13ec5b;">Novo Lead Capturado! (TESTE)</h2>
                    <p>Um novo potencial cliente acaba de entrar em contato pelo site.</p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Nome:</strong></td><td>${contactLead.name}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>E-mail:</strong></td><td>${contactLead.email}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>WhatsApp:</strong></td><td>${contactLead.phone || 'Não informado'}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Empresa:</strong></td><td>${contactLead.company || 'Não informada'}</td></tr>
                        <tr><td style="padding: 8px 0; color: #666;"><strong>Origem:</strong></td><td>${contactLead.source}</td></tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                        <strong>Mensagem:</strong><br/>
                        <p style="white-space: pre-wrap;">${contactLead.message}</p>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">
                        Este é um e-mail automático enviado pelo sistema RenovaMente CMS.
                    </p>
                </div>
            `,
        });

        console.log(`   ✅ Email enviado com sucesso!`);
        console.log(`   ID do Email: ${contactEmailResult.data?.id}\n`);
    } catch (error: any) {
        console.error(`   ❌ Erro ao enviar email:`, error.message);
        console.error(`   Detalhes:`, error);
    }

    console.log("✅ Teste de emails concluído!");
    console.log("\n📊 Resumo:");
    console.log(`   - Emails enviados para: ${site.emailTo}`);
    console.log(`   - Cópia oculta (BCC) para: ${site.emailBcc || "NÃO CONFIGURADO"}`);
    console.log(`   - Total de leads de teste criados: 2`);
    console.log("\n💡 Verifique sua caixa de entrada em ambos os emails!");
}

testEmailForms()
    .then(() => {
        console.log("\n🎉 Script finalizado com sucesso!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Erro ao executar script:", error);
        process.exit(1);
    });
