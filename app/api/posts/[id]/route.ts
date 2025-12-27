import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                category: true
            }
        })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error("Error fetching post:", error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { title, slug, content, excerpt, categoryId, status, image } = body

        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                excerpt,
                status,
                image,
                categoryId: categoryId || null,
                publishedAt: status === 'PUBLISHED' ? new Date() : null
            }
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error('Error updating post:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.post.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Post deleted' })
    } catch (error) {
        console.error('Error deleting post:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
