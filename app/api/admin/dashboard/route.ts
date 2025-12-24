import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session.user?.id },
    });

    if (!siteUser) return new NextResponse("Site not found", { status: 404 });

    const siteId = siteUser.siteId;

    const [totalViews, recentPosts, recentLeads, weeklyAnalytics, leadsCount] = await Promise.all([
        prisma.post.aggregate({
            where: { siteId },
            _sum: { views: true }
        }),
        prisma.post.findMany({
            where: { siteId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { category: true }
        }),
        prisma.lead.findMany({
            where: { siteId },
            orderBy: { createdAt: 'desc' },
            take: 5
        }),
        prisma.analytics.groupBy({
            by: ['date'],
            where: {
                siteId,
                date: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
            },
            _count: { _all: true }
        }),
        prisma.lead.count({ where: { siteId } })
    ]);

    // Process chart
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const chart = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const count = weeklyAnalytics.find((a: any) => a.date.toISOString().split('T')[0] === dateStr)?._count._all || 0;
        return { day: days[d.getDay()], count };
    });

    // Combined activity
    const activity = [
        ...recentLeads.map(l => ({
            type: 'Novo Lead',
            description: `${l.name} enviou uma mensagem`,
            time: l.createdAt,
            icon: 'mail',
            color: 'text-blue-500'
        })),
        ...recentPosts.map(p => ({
            type: 'Blog Publicado',
            description: p.title,
            time: p.createdAt,
            icon: 'article',
            color: 'text-[#13ec5b]'
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
        stats: {
            visitors: totalViews._sum.views || 0,
            leads: leadsCount,
            whatsapp: 423, // Hardcoded for demo as requested earlier
            time: '3m 42s'
        },
        chart,
        activity
    });
}
