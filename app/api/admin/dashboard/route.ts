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

    const [totalVisitors, totalLeads, totalPosts, weeklyAnalytics, recentLeads, recentPosts] = await Promise.all([
        prisma.analytics.count({
            where: { siteId, type: 'view' }
        }),
        prisma.lead.count({ where: { siteId } }),
        prisma.post.count({ where: { siteId } }),
        prisma.analytics.groupBy({
            by: ['date'],
            where: {
                siteId,
                type: 'view',
                date: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
                }
            },
            _count: { _all: true }
        }),
        prisma.lead.findMany({
            where: { siteId },
            orderBy: { createdAt: 'desc' },
            take: 5
        }),
        prisma.post.findMany({
            where: { siteId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { category: true }
        })
    ]);

    // Process Chart (Real Data)
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const chart = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        // Normalize date to YYYY-MM-DD for comparison
        const dateStr = d.toISOString().split('T')[0];

        // Find matching analytics entry (Need to ensure date matching logic is correct with Prisma return)
        // Prisma groupBy date usually returns Date object. We compare ISO strings.
        const match = weeklyAnalytics.find((a: any) => {
            const aDate = new Date(a.date).toISOString().split('T')[0];
            return aDate === dateStr;
        });

        return {
            day: days[d.getDay()],
            count: match?._count._all || 0
        };
    });

    // Calculate Real Conversion
    const conversionRate = totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(1) + '%' : '0%';

    // Combined Activity Feed
    const activity = [
        ...recentLeads.map(l => ({
            type: 'Novo Lead',
            description: `${l.name} - ${l.company || 'Pessoa Física'}`,
            time: l.createdAt,
            icon: 'person_add',
            color: 'bg-blue-500/10 text-blue-500' // Frontend class
        })),
        ...recentPosts.map(p => ({
            type: 'Post Publicado',
            description: p.title,
            time: p.createdAt,
            icon: 'article',
            color: 'bg-green-500/10 text-green-500' // Frontend class
        }))
    ].sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    return NextResponse.json({
        stats: {
            visitors: totalVisitors,
            leads: totalLeads,
            posts: totalPosts, // Replaces WhatsApp
            conversion: conversionRate // Replaces Time
        },
        chart,
        activity
    });
}
