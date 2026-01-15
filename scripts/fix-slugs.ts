import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log("🔍 Scanning for malformed slugs...")
    const posts = await prisma.post.findMany()
    let fixedCount = 0

    for (const post of posts) {
        if (post.slug.startsWith('/')) {
            const newSlug = post.slug.replace(/^\/+/, '')
            console.log(`🛠️ Fixing slug for "${post.title}": \n   ❌ Old: ${post.slug}\n   ✅ New: ${newSlug}`)
            
            try {
                await prisma.post.update({
                    where: { id: post.id },
                    data: { slug: newSlug }
                })
                fixedCount++
            } catch(e) {
                console.error(`Status: Failed to update post ${post.id}`, e)
            }
        }
    }

    console.log(`\n🎉 Job complete. Fixed ${fixedCount} slugs.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
