import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const slug = 'nr01-nr17-o-que-mudou'
    console.log(`Searching for post with slug: ${slug}`)
    
    // Search ignoring status
    const post = await prisma.post.findFirst({
        where: { slug },
        include: { site: true }
    })
    
    if (post) {
        console.log(`✅ Post Found!`)
        console.log(`ID: ${post.id}`)
        console.log(`Title: ${post.title}`)
        console.log(`Status: ${post.status}`)
        console.log(`Site ID: ${post.siteId}`)
        console.log(`Site Domain: ${post.site?.domain}`)
    } else {
        console.log(`❌ Post NOT found with slug "${slug}".`)
        
        // List recent posts to check slugs
        const recents = await prisma.post.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { title: true, slug: true, status: true }
        })
        console.log("Recent posts slugs:", recents)
    }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
