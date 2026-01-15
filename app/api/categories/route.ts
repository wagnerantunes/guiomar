import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/utils'

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

        const categories = await prisma.category.findMany({
            where: { siteId: siteUser.siteId },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(categories)
    } catch (error) {
        console.error("Error fetching categories:", error)
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
        const { name } = body

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const slug = slugify(name)

        // Check if exists
        const existing = await prisma.category.findFirst({
            where: { 
                siteId: siteUser.siteId,
                slug: slug 
            }
        })

        if (existing) {
            return NextResponse.json(existing) // Return existing if duplicate
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                siteId: siteUser.siteId
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("Error creating category:", error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
