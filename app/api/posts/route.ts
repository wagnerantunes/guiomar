import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

        const posts = await prisma.post.findMany({
            where: { siteId: siteUser.siteId },
            include: {
                category: true,
                author: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(posts)
    } catch (error) {
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
        const { title, slug, content, excerpt, categoryId, status } = body

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
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
