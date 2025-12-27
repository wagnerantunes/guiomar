import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        let siteId: string | null = null

        if (session?.user?.id) {
            const siteUser = await prisma.siteUser.findFirst({
                where: { userId: session.user.id }
            })
            siteId = siteUser?.siteId || null
        } else {
            // Public access - find site by domain
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
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const siteUser = await prisma.siteUser.findFirst({
            where: { userId: session.user.id }
        })

        if (!siteUser) {
            return NextResponse.json({ error: 'Site not found' }, { status: 404 })
        }

        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, status, image } = body

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
                image,
                siteId: siteUser.siteId,
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
