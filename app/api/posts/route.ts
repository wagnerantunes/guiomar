import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getActiveSiteId, getAdminSession } from '@/lib/admin-utils'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        let siteId: string | null = null

        if (session?.user?.id && session.user.email) {
            try {
                siteId = await getActiveSiteId(session.user.id, session.user.email)
            } catch (e) {
                // Fallback to searching siteId via domain or first site
            }
        }

        if (!siteId) {
            // Public access or fallback - find site by domain
            const url = new URL(request.url)
            const domain = url.searchParams.get('domain') || "renovamente-guiomarmelo.com.br"
            const site = await prisma.site.findUnique({
                where: { domain }
            })
            siteId = site?.id || null
        }

        if (!siteId) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 })
        }

        const posts = await prisma.post.findMany({
            where: {
                siteId,
                ...(session ? {} : { status: 'PUBLISHED' }) // Only published for public
            },
            include: {
                category: true,
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


export async function POST(request: NextRequest) {
    try {
        const { session, siteId } = await getAdminSession()

        const { title, slug, content, excerpt, categoryId, status, image, seoTitle, seoDescription, seoKeywords } = body

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
                image,
                seoTitle,
                seoDescription,
                seoKeywords,
                siteId: siteId,
                authorId: session.user.id,
                categoryId: categoryId || null,
                publishedAt: status === 'PUBLISHED' ? new Date() : null
            }
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
