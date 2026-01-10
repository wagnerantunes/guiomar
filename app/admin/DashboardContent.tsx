"use client";

import React from "react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface DashboardStats {
    visitors: number;
    leads: number;
    posts: number;
    conversion: string;
}

interface ActivityItem {
    type: string;
    description: string;
    time: string;
    icon: string;
    color: string;
}

interface ChartData {
    day: string;
    count: number;
}

interface DashboardContentProps {
    session: any;
}

export default function DashboardContent({ session }: DashboardContentProps) {
    const [stats, setStats] = React.useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = React.useState<ActivityItem[]>([]);
    const [chartData, setChartData] = React.useState<ChartData[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await fetch('/api/admin/dashboard');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats || null);
                    setRecentActivity(data.activity || []);
                    setChartData(data.chart || []);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    if (loading) {
        return (
            <div className="flex-1 p-10 space-y-8 animate-pulse">
                <div className="h-10 bg-muted/10 rounded-xl w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-muted/10 rounded-3xl" />
                    ))}
                </div>
                <div className="h-80 bg-muted/10 rounded-3xl" />
            </div>
        );
    }

    const statCards = [
        {
            label: 'Visitantes Únicos',
            value: (stats?.visitors ?? 0).toLocaleString(),
            change: 'Real-time',
            icon: 'visibility',
            bgClass: 'bg-primary/10',
            textClass: 'text-primary'
        },
        {
            label: 'Leads (Contatos)',
            value: (stats?.leads ?? 0).toString(),
            change: 'Total',
            icon: 'person_add',
            bgClass: 'bg-blue-500/10',
            textClass: 'text-blue-500'
        },
        {
            label: 'Posts Publicados',
            value: (stats?.posts ?? 0).toString(),
            change: 'Conteúdo',
            icon: 'article',
            bgClass: 'bg-green-500/10',
            textClass: 'text-green-500'
        },
        {
            label: 'Taxa Conversão',
            value: stats?.conversion ?? "0%",
            change: 'Eficiência',
            icon: 'trending_up',
            bgClass: 'bg-purple-500/10',
            textClass: 'text-purple-500'
        },
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-30" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full opacity-20" />
            </div>

            <AdminPageHeader
                title="Dashboard"
                subtitle="Visão Geral do Sistema"
                icon="dashboard"
            >
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/5 border border-border rounded-lg shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Sistema Operante</span>
                </div>
            </AdminPageHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, i) => (
                        <div key={i} className="group p-6 bg-card rounded-xl border border-border hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-3 rounded-lg ${stat.bgClass} ${stat.textClass}`}>
                                    <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted/60 bg-muted/10 px-2 py-1 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-foreground tracking-tight mb-1 group-hover:scale-105 origin-left transition-transform">{stat.value}</h3>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">{stat.label}</p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 pointer-events-none">
                                <span className={`material-symbols-outlined text-9xl ${stat.textClass} -mr-4 -mb-4`}>{stat.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart Section */}
                    <div className="lg:col-span-2 bg-card rounded-xl border border-border p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-1">Tráfego Semanal</h3>
                                <p className="text-xs text-muted">Visualizações únicas nos últimos 7 dias</p>
                            </div>
                            <button className="p-2 hover:bg-muted/10 rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-muted">more_horiz</span>
                            </button>
                        </div>

                        <div className="h-[300px] flex items-end gap-2 sm:gap-4 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-full h-px bg-border border-dashed border-t border-muted" />
                                ))}
                            </div>

                            {chartData.length > 0 ? chartData.map((item, i) => {
                                const maxCount = Math.max(...chartData.map(d => Number(d.count) || 0), 1);
                                const height = Number(item.count) > 0 ? (Number(item.count) / maxCount) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                                        <div
                                            className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-all relative overflow-hidden group-hover:scale-y-110 origin-bottom duration-300"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-primary opacity-50" />
                                        </div>
                                        <div className="mt-4 text-[10px] font-bold text-muted uppercase tracking-wider group-hover:text-primary transition-colors">
                                            {item.day}
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-foreground text-background text-[10px] font-bold py-2 px-3 rounded-lg uppercase tracking-widest shadow-xl transform translate-y-2 group-hover:translate-y-0 pointer-events-none border border-border">
                                            {item.count} Visitas
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted text-xs font-bold uppercase tracking-widest">
                                    Sem dados para o período
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-card rounded-xl border border-border p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-widest">Atividade Recente</h3>
                            <Link href="/admin/leads" className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1">
                                Ver tudo <span className="material-symbols-outlined text-xs">arrow_forward</span>
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4 space-y-4">
                            {Array.isArray(recentActivity) && recentActivity.length > 0 ? recentActivity.map((act, i) => (
                                <div key={i} className="flex gap-4 group cursor-pointer hover:bg-muted/5 p-3 -mx-3 rounded-lg transition-colors border border-transparent hover:border-border/50">
                                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${act.color || 'bg-muted/10'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{act.icon || 'star'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">{act.type}</h4>
                                            <span className="text-[9px] font-bold text-muted shrink-0 ml-2 uppercase tracking-widest opacity-70">
                                                {act.time ? new Date(act.time).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '---'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-medium text-muted line-clamp-1">{act.description}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                                    <span className="material-symbols-outlined text-4xl mb-2">history</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma atividade recente</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
