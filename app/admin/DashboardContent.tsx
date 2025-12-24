"use client";

import React, { useState, useEffect } from "react";
import { Skeleton, SkeletonGrid } from "@/components/admin/Skeleton";

interface DashboardStats {
    visitors: number;
    leads: number;
    whatsapp: number;
    time: string;
}

interface Activity {
    type: string;
    description: string;
    time: string;
    icon: string;
    color: string;
}

interface ChartItem {
    day: string;
    count: number;
}

export default function DashboardContent({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartItem[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const response = await fetch("/api/admin/dashboard");
                const data = await response.json();
                setStats(data.stats);
                setChartData(data.chart);
                setRecentActivity(data.activity);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    const maxViews = Math.max(...chartData.map(d => d.count), 1);

    if (loading) {
        return (
            <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <SkeletonGrid count={4} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-[#183221] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-8">
                        <div className="flex justify-between">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <div className="h-[300px] flex items-end gap-4 p-4">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <Skeleton key={i} className="flex-1 rounded-t-xl" style={{ height: `${20 + Math.random() * 60}%` }} />
                            ))}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <Skeleton className="size-10 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Visitantes Únicos', value: stats?.visitors.toLocaleString(), change: '+14%', icon: 'visibility', color: 'primary' },
        { label: 'Leads (Contatos)', value: stats?.leads.toString(), change: '+5%', icon: 'person_add', color: 'blue' },
        { label: 'Cliques WhatsApp', value: stats?.whatsapp.toString(), change: '+22%', icon: 'chat', color: 'green' },
        { label: 'Tempo no Site', value: stats?.time, change: '-2%', icon: 'timer', color: 'purple' },
    ];

    return (
        <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
            {/* HEADER */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-gray-500 font-medium tracking-tight">
                    Bem-vindo de volta, {session?.user?.name || 'Admin'}. Veja o desempenho da RenovaMente hoje.
                </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-[#183221] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group duration-300"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="size-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[#13ec5b] group-hover:bg-[#13ec5b] group-hover:text-white transition-colors duration-300">
                                <span className="material-symbols-outlined">{s.icon}</span>
                            </div>
                            <span className={`text-xs font-black ${s.change?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {s.change}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <h3 className="text-3xl font-black text-[#0d1b12] dark:text-white mt-1">{s.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CHART ACESSOS */}
                <div className="lg:col-span-2 bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm p-8 flex flex-col hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-[#0d1b12] dark:text-white">Acessos na última semana</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total de visualizações diárias</p>
                        </div>
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

                {/* LEAD TRENDS / SPARKLINE */}
                <div className="bg-[#0d1b12] dark:bg-[#13ec5b] rounded-[2.5rem] p-8 flex flex-col justify-between text-white dark:text-[#0d1b12] shadow-xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Lead Acquisition</h4>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-4xl font-black">+{stats?.leads || 0}</span>
                            <span className="text-[10px] font-black bg-white/20 dark:bg-black/10 px-2 py-0.5 rounded-full">ESTE MÊS</span>
                        </div>
                    </div>

                    <div className="h-24 flex items-end gap-1 mb-2 relative z-10">
                        {/* Mock sparkline using leads distribution or simple random for premium feel if data sparse */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-white/30 dark:bg-black/20 rounded-t-sm group-hover:bg-white dark:group-hover:bg-black transition-all duration-500"
                                style={{ height: `${30 + Math.sin(i * 0.5) * 20 + Math.random() * 20}%` }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 flex justify-between items-center">
                        <p className="text-[10px] font-bold opacity-60">Meta Mensal: 50 Leads</p>
                        <div className="size-8 rounded-full bg-white/10 dark:bg-black/5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -right-4 -bottom-4 size-32 bg-white/5 dark:bg-black/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                </div>
            </div>

            {/* COMBINED RECENT ACTIVITY */}
            <div className="bg-white dark:bg-[#183221] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm p-8 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-black text-[#0d1b12] dark:text-white mb-6">Atividade Recente</h3>
                <div className="space-y-6">
                    {recentActivity.slice(0, 7).map((act, i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
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

                    {recentActivity.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-10">Nenhuma atividade recente.</p>
                    )}
                </div>
                <button className="w-full mt-8 py-3 text-xs font-black text-gray-400 hover:text-[#13ec5b] transition-colors uppercase tracking-widest border-t border-gray-100 dark:border-white/5 pt-6">
                    Ver histórico completo
                </button>
            </div>
        </div>
    );
}
