import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Generate strong random password
    const generateStrongPassword = () => {
        const length = 16
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        let password = ''
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        return password
    }

    const adminPassword = process.env.ADMIN_PASSWORD || generateStrongPassword()
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@renovamente.com' },
        update: {},
        create: {
            email: 'admin@renovamente.com',
            name: 'Administrador',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin user created:', adminUser.email)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔐 CREDENCIAIS DE ACESSO:')
    console.log('   Email: admin@renovamente.com')
    console.log(`   Senha: ${adminPassword}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('⚠️  IMPORTANTE: Salve estas credenciais em local seguro!')
    console.log('   Você pode alterar a senha no painel admin.')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')


    // Create RenovaMente site
    const renovamenteSite = await prisma.site.upsert({
        where: { domain: 'renovamente-guiomarmelo.com.br' },
        update: {},
        create: {
            name: 'RenovaMente',
            domain: 'renovamente-guiomarmelo.com.br',
            description: 'Transformando mentes, renovando vidas',
            settings: {
                seo: {
                    title: 'RenovaMente - Psicologia e Bem-estar',
                    description: 'Serviços de psicologia e terapia para transformar sua vida',
                    keywords: ['psicologia', 'terapia', 'bem-estar', 'saúde mental'],
                },
                social: {
                    facebook: '',
                    instagram: '',
                    linkedin: '',
                },
            },
            theme: {
                primaryColor: '#0F758D',
                secondaryColor: '#FDF5E6',
                fontFamily: 'Manrope',
            },
        },
    })

    console.log('✅ Site created:', renovamenteSite.name)

    // Link admin user to site
    await prisma.siteUser.upsert({
        where: {
            siteId_userId: {
                siteId: renovamenteSite.id,
                userId: adminUser.id,
            },
        },
        update: {},
        create: {
            siteId: renovamenteSite.id,
            userId: adminUser.id,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin linked to site')

    // Create categories
    const categories = [
        { name: 'Psicologia', slug: 'psicologia', description: 'Artigos sobre psicologia' },
        { name: 'Bem-estar', slug: 'bem-estar', description: 'Dicas de bem-estar e qualidade de vida' },
        { name: 'Saúde Mental', slug: 'saude-mental', description: 'Conteúdo sobre saúde mental' },
        { name: 'Desenvolvimento Pessoal', slug: 'desenvolvimento-pessoal', description: 'Crescimento e desenvolvimento pessoal' },
    ]

    for (const cat of categories) {
        await prisma.category.upsert({
            where: {
                siteId_slug: {
                    siteId: renovamenteSite.id,
                    slug: cat.slug,
                },
            },
            update: {},
            create: {
                ...cat,
                siteId: renovamenteSite.id,
            },
        })
    }

    console.log('✅ Categories created')

    // Create sample post
    const psicologiaCategory = await prisma.category.findFirst({
        where: {
            siteId: renovamenteSite.id,
            slug: 'psicologia',
        },
    })

    if (psicologiaCategory) {
        await prisma.post.upsert({
            where: {
                siteId_slug: {
                    siteId: renovamenteSite.id,
                    slug: 'bem-vindo-ao-renovamente',
                },
            },
            update: {},
            create: {
                title: 'Bem-vindo ao RenovaMente',
                slug: 'bem-vindo-ao-renovamente',
                content: `
          <h2>Transformando Mentes, Renovando Vidas</h2>
          <p>Bem-vindo ao blog RenovaMente! Este é um espaço dedicado ao seu bem-estar emocional e desenvolvimento pessoal.</p>
          <p>Aqui você encontrará conteúdos sobre:</p>
          <ul>
            <li>Psicologia e saúde mental</li>
            <li>Técnicas de autoconhecimento</li>
            <li>Desenvolvimento pessoal</li>
            <li>Qualidade de vida e bem-estar</li>
          </ul>
          <p>Nossa missão é fornecer informações de qualidade para ajudá-lo em sua jornada de transformação pessoal.</p>
        `,
                excerpt: 'Conheça o RenovaMente e descubra como podemos ajudá-lo em sua jornada de transformação pessoal.',
                status: 'PUBLISHED',
                publishedAt: new Date(),
                siteId: renovamenteSite.id,
                authorId: adminUser.id,
                categoryId: psicologiaCategory.id,
            },
        })

        console.log('✅ Sample post created')
    }

    // Seed section settings from SECTION_DEFAULTS (only if not existing)
    const { SECTION_DEFAULTS } = require('../lib/sectionDefaults')
    for (const [id, content] of Object.entries(SECTION_DEFAULTS)) {
        const existingSetting = await prisma.siteSettings.findUnique({
            where: {
                siteId_key: {
                    siteId: renovamenteSite.id,
                    key: `section_${id}_content`
                }
            }
        })

        if (!existingSetting) {
            await prisma.siteSettings.create({
                data: {
                    siteId: renovamenteSite.id,
                    key: `section_${id}_content`,
                    value: JSON.stringify(content)
                }
            })
            console.log(`✅ Default content created for section: ${id}`)
        } else {
            console.log(`ℹ️ Section ${id} already has content, skipping seed to preserve changes.`)
        }
    }

    console.log('🎉 Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
