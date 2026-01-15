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
