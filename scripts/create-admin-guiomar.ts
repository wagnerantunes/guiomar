import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'renovamente.mkt@gmail.com'
    const password = 'Renova0102!'
    const name = 'Guiomar Melo'

    console.log(`🔐 Hashing password for ${email}...`)
    const hashedPassword = await bcrypt.hash(password, 10)

    // 1. Create or Update User
    console.log(`👤 Creating/Updating User...`)
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            name: name
        },
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'ADMIN'
        }
    })

    console.log(`✅ User ${user.email} (ID: ${user.id}) updated/created as ADMIN.`)

    // 2. Assign to all sites as ADMIN
    const sites = await prisma.site.findMany()
    console.log(`🏢 Found ${sites.length} sites. Assigning permissions...`)
    
    for (const site of sites) {
        await prisma.siteUser.upsert({
            where: {
                siteId_userId: {
                    siteId: site.id,
                    userId: user.id
                }
            },
            update: {
                role: 'ADMIN'
            },
            create: {
                siteId: site.id,
                userId: user.id,
                role: 'ADMIN'
            }
        })
        console.log(`   -> Assigned ADMIN role for site ${site.domain || site.subdomain} (${site.name})`)
    }
    
    console.log("🎉 All done! Permissions granted.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
