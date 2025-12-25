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
        <div className="p-6 md:p-10 space-y-12 max-w-7xl mx-auto w-full pb-20">
            {/* HEADER */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">Dashboard</h1>
                <p className="text-gray-500 font-medium mt-2 max-w-2xl">
                    Bem-vindo de volta, <span className="text-[#0d1b12] dark:text-white font-bold">{session?.user?.name || 'Admin'}</span>. Aqui está o desempenho da RenovaMente.
                </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-[#183221] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-[#13ec5b]/30 transition-all group duration-500"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="size-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[#13ec5b] group-hover:bg-[#13ec5b] group-hover:text-[#0d1b12] transition-all duration-500 shadow-sm">
                                <span className="material-symbols-outlined text-[28px]">{s.icon}</span>
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${s.change?.startsWith('+') ? 'bg-green-50 text-green-500 dark:bg-green-500/10' : 'bg-red-50 text-red-500 dark:bg-red-500/10'}`}>
                                {s.change}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{s.label}</p>
                        <h3 className="text-3xl font-black text-[#0d1b12] dark:text-white mt-2 tracking-tighter">{s.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* CHART ACESSOS */}
                <div className="lg:col-span-2 bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm p-10 flex flex-col hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Performance Semanal</h3>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Visitas únicas por dia</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                aria-label="Filtrar período"
                                className="bg-[#f6f8f6] dark:bg-white/5 border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 py-3 focus:ring-4 focus:ring-[#13ec5b]/20 outline-none cursor-pointer hover:bg-white dark:hover:bg-[#13ec5b]/10 transition-all shadow-sm"
                            >
                                <option>Últimos 7 dias</option>
                                <option>Últimos 30 dias</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] flex items-end justify-between gap-4 px-4 pb-4" role="img" aria-label="Gráfico de performance semanal">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div
                                    className="w-full bg-[#13ec5b]/5 dark:bg-[#13ec5b]/10 rounded-2xl group-hover:bg-[#13ec5b] group-hover:shadow-lg group-hover:shadow-[#13ec5b]/30 transition-all duration-700 cursor-pointer relative"
                                    style={{ height: `${(d.count / maxViews) * 100}%` }}
                                >
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0d1b12] dark:bg-white text-white dark:text-[#0d1b12] text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap z-10 shadow-2xl border border-white/10">
                                        {d.count} VISITAS
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {d.day}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LEAD TRENDS / SPARKLINE */}
                <div className="bg-[#0d1b12] dark:bg-[#13ec5b] rounded-[3rem] p-10 flex flex-col justify-between text-white dark:text-[#0d1b12] shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Lead Acquisition</h4>
                        <div className="flex items-baseline gap-3 mt-4">
                            <span className="text-5xl font-black tracking-tighter">+{stats?.leads || 0}</span>
                            <span className="text-[9px] font-black bg-white/10 dark:bg-black/10 px-3 py-1 rounded-full uppercase tracking-widest">Meta de Dezembro</span>
                        </div>
                    </div>

                    <div className="h-32 flex items-end gap-1.5 mb-2 relative z-10 px-2" aria-hidden="true">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-white/10 dark:bg-black/10 rounded-full group-hover:bg-white dark:group-hover:bg-[#0d1b12] transition-all duration-700 hover:scale-y-110 origin-bottom"
                                style={{ height: `${30 + Math.sin(i * 0.8) * 30 + Math.random() * 20}%` }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 flex justify-between items-center bg-white/5 dark:bg-black/5 p-4 rounded-3xl backdrop-blur-md">
                        <div>
                            <p className="text-[9px] font-black opacity-50 uppercase tracking-widest">Eficiência Total</p>
                            <p className="text-xl font-black">94.2%</p>
                        </div>
                        <div className="size-12 rounded-2xl bg-white dark:bg-[#0d1b12] flex items-center justify-center text-[#0d1b12] dark:text-[#13ec5b] shadow-xl">
                            <span className="material-symbols-outlined text-[24px]">trending_up</span>
                        </div>
                    </div>

                    {/* Decorative element */}
                    <div className="absolute -right-20 -top-20 size-64 bg-[#13ec5b]/10 dark:bg-black/5 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                </div>
            </div>

            {/* COMBINED RECENT ACTIVITY */}
            <div className="bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm p-10 hover:shadow-xl transition-all duration-500">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Atividade Recente</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Últimas interações no sistema</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {recentActivity.slice(0, 8).map((act, i) => (
                        <div key={i} className="flex gap-6 group cursor-pointer hover:translate-x-2 transition-all p-4 rounded-3xl hover:bg-gray-50 dark:hover:bg-white/5">
                            <div className={`size-14 rounded-2xl bg-[#f6f8f6] dark:bg-white/5 flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#13ec5b]/10 ${act.color}`}>
                                <span className="material-symbols-outlined text-[24px] group-hover:text-[#13ec5b] transition-colors">{act.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-black text-[#0d1b12] dark:text-white group-hover:text-[#13ec5b] transition-colors line-clamp-1 uppercase tracking-tight">{act.type}</h4>
                                    <span className="text-[10px] font-black text-gray-400 shrink-0 ml-4 uppercase tracking-widest">
                                        {new Date(act.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-1 leading-relaxed">{act.description}</p>
                            </div>
                        </div>
                    ))}

                    {recentActivity.length === 0 && (
                        <div className="md:col-span-2 py-20 text-center space-y-4">
                            <span className="material-symbols-outlined text-6xl text-gray-100 dark:text-white/5">history</span>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Nenhum registro de atividade encontrado</p>
                        </div>
                    )}
                </div>
                {recentActivity.length > 0 && (
                    <button className="w-full mt-10 py-6 text-[10px] font-black text-gray-400 hover:text-[#13ec5b] transition-all uppercase tracking-[0.3em] border-t border-gray-100 dark:border-white/5 group">
                        <span className="inline-block group-hover:scale-110 transition-transform">Ver histórico completo</span>
                    </button>
                )}
            </div>
        </div>
    );
}
