import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import React from 'react';

export default async function AdminDashboard() {
    const session = await auth();

    // Get user's site
    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
        include: { site: true }
    });

    if (!siteUser) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Site não encontrado</h2>
                <p className="text-gray-500">Certifique-se de que sua conta está vinculada a um site.</p>
            </div>
        );
    }

    // Get statistics
    const [postsCount, categoriesCount, totalViews, recentPosts, recentLeads, weeklyAnalytics, leadsCount] = await Promise.all([
        prisma.post.count({ where: { siteId: siteUser.siteId } }),
        prisma.category.count({ where: { siteId: siteUser.siteId } }),
        prisma.post.aggregate({
            where: { siteId: siteUser.siteId },
            _sum: { views: true }
        }),
        prisma.post.findMany({
            where: { siteId: siteUser.siteId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { category: true, author: true }
        }),
        prisma.lead.findMany({
            where: { siteId: siteUser.siteId },
            orderBy: { createdAt: 'desc' },
            take: 5
        }),
        prisma.analytics.groupBy({
            by: ['date'],
            where: {
                siteId: siteUser.siteId,
                date: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
            },
            _count: { _all: true }
        }),
        prisma.lead.count({ where: { siteId: siteUser.siteId } })
    ]);

    // Process weekly analytics for chart
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const count = weeklyAnalytics.find((a: any) => a.date.toISOString().split('T')[0] === dateStr)?._count._all || 0;
        return { day: days[d.getDay()], count };
    });

    const maxViews = Math.max(...chartData.map(d => d.count), 1);

    const stats = [
        { label: 'Visitantes Únicos', value: (totalViews._sum.views || 0).toLocaleString(), change: '+14%', icon: 'visibility', color: 'primary' },
        { label: 'Leads (Contatos)', value: leadsCount.toString(), change: '+5%', icon: 'person_add', color: 'blue' },
        { label: 'Cliques WhatsApp', value: '423', change: '+22%', icon: 'chat', color: 'green' },
        { label: 'Tempo no Site', value: '3m 42s', change: '-2%', icon: 'timer', color: 'purple' },
    ];

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-gray-500 font-medium tracking-tight">
                    Bem-vindo de volta, {session?.user?.name || 'Admin'}. Veja o desempenho da RenovaMente hoje.
                </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-[#183221] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="size-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[#13ec5b]">
                                <span className="material-symbols-outlined">{s.icon}</span>
                            </div>
                            <span className={`text-xs font-black ${s.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {s.change}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-3xl font-black text-[#0d1b12] dark:text-white mt-1">{s.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CHART */}
                <div className="lg:col-span-2 bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-[#0d1b12] dark:text-white">Acessos na última semana</h3>
                        <div className="flex items-center gap-2">
                            <select className="bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-[#13ec5b]/50">
                                <option>Últimos 7 dias</option>
                                <option>Últimos 30 dias</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-end justify-between gap-2 px-4 pb-4">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                <div
                                    className="w-full bg-[#13ec5b]/10 rounded-t-xl group-hover:bg-[#13ec5b] transition-all duration-500 cursor-pointer relative"
                                    style={{ height: `${(d.count / maxViews) * 100}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0d1b12] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl border border-white/10">
                                        {d.count} views
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {d.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COMBINED RECENT ACTIVITY */}
                <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm p-8">
                    <h3 className="text-lg font-black text-[#0d1b12] dark:text-white mb-6">Atividade Recente</h3>
                    <div className="space-y-6">
                        {/* Merge Leads and Posts into a single feed */}
                        {[
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
                        ]
                            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
                            .slice(0, 7)
                            .map((act, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer">
                                    <div className={`size-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 ${act.color}`}>
                                        <span className="material-symbols-outlined text-xl">{act.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-black text-[#0d1b12] dark:text-white group-hover:text-[#13ec5b] transition-colors line-clamp-1">{act.type}</h4>
                                            <span className="text-[10px] font-bold text-gray-400 shrink-0 ml-2">
                                                {new Date(act.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">{act.description}</p>
                                    </div>
                                </div>
                            ))}

                        {(recentLeads.length === 0 && recentPosts.length === 0) && (
                            <p className="text-sm text-gray-400 text-center py-10">Nenhuma atividade recente.</p>
                        )}
                    </div>
                    <button className="w-full mt-8 py-3 text-xs font-black text-gray-400 hover:text-[#13ec5b] transition-colors uppercase tracking-widest border-t border-gray-100 dark:border-white/5 pt-6">
                        Ver histórico completo
                    </button>
                </div>
            </div>
        </div>
    );
}

