"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";

interface Subscriber {
    id: string;
    email: string;
    status: string;
    createdAt: string;
}

interface Campaign {
    id: string;
    subject: string;
    content: string;
    status: string;
    sentAt: string | null;
    createdAt: string;
}

export default function NewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCampaign, setNewCampaign] = useState({ subject: "", content: "" });
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subRes, campRes] = await Promise.all([
                    fetch("/api/newsletter/subscribers"),
                    fetch("/api/newsletter/campaigns"),
                ]);
                const subData = await subRes.json();
                const campData = await campRes.json();
                setSubscribers(subData);
                setCampaigns(campData);
            } catch (error) {
                console.error("Error fetching newsletter data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSendCampaign = async (status: "Draft" | "Sent") => {
        if (!newCampaign.subject || !newCampaign.content) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/newsletter/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newCampaign, status }),
            });
            if (res.ok) {
                const campaign = await res.json();
                setCampaigns([campaign, ...campaigns]);
                toast({
                    title: status === "Sent" ? "Campanha Enviada" : "Rascunho Salvo",
                    description: status === "Sent" ? "Sua mensagem foi entregue aos inscritos." : "Sua campanha foi armazenada para edição posterior.",
                    type: "success"
                });
                setNewCampaign({ subject: "", content: "" });
            } else {
                toast({ title: "Erro na Campanha", description: "Ocorreu um problema ao processar a campanha.", type: "error" });
            }
        } catch (error) {
            console.error("Error sending campaign:", error);
            toast({ title: "Erro de Conexão", description: "Não foi possível conectar ao servidor.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    const stats = [
        { label: "Total Subscribers", value: subscribers.length.toString(), change: "+0% this month", icon: "group", color: "blue" },
        { label: "Avg. Open Rate", value: "0%", change: "Target: 45%", icon: "drafts", color: "purple" },
        { label: "Campaigns Sent", value: campaigns.filter(c => c.status === "Sent").length.toString(), change: "0 Scheduled", icon: "send", color: "orange" },
    ];

    if (loading) {
        return <div className="p-10 text-center font-black animate-pulse">Carregando dados da newsletter...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* HEADER */}
            <div className="px-6 py-8 md:px-10 border-b border-border bg-background/80 backdrop-blur-xl z-20 shrink-0 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">Newsletter</h1>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] mt-1">Gestão de campanhas, inscritos e engajamento.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Visualizar site ao vivo"
                            className="flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-border rounded-xl hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest bg-card shadow-sm"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Preview Site
                        </button>
                        <button
                            aria-label="Criar nova campanha"
                            className="flex items-center gap-2 px-8 py-3 text-[10px] font-black bg-primary text-primary-foreground rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest"
                        >
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            Nova Campanha
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 space-y-12 max-w-screen-2xl mx-auto w-full">
                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-muted uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">
                                        {stat.change}
                                    </p>
                                </div>
                            </div>
                            <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${stat.color === "blue" ? "bg-blue-50/10 text-blue-500" :
                                stat.color === "purple" ? "bg-purple-50/10 text-purple-500" :
                                    "bg-orange-50/10 text-orange-500"
                                }`}>
                                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-8 space-y-12">
                        {/* COMPOSE */}
                        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                            <div className="px-10 py-6 border-b border-border flex items-center justify-between bg-muted/5">
                                <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">Compor Nova Campanha</h3>
                                <button className="text-[9px] text-primary font-black uppercase tracking-widest hover:underline">Templates</button>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label htmlFor="comp-subject" className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Assunto do E-mail</label>
                                        <input
                                            id="comp-subject"
                                            aria-label="Assunto do E-mail"
                                            className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground"
                                            placeholder="Ex: Dicas para uma mente clara..."
                                            type="text"
                                            value={newCampaign.subject}
                                            onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label htmlFor="comp-segment" className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Segmento de Público</label>
                                        <div className="relative group/sel">
                                            <select
                                                id="comp-segment"
                                                aria-label="Segmento de Público"
                                                className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/10 transition-all outline-none text-foreground appearance-none cursor-pointer"
                                            >
                                                <option>Todos os Inscritos ({subscribers.length})</option>
                                                <option>Novos Usuários (Últimos 30 dias)</option>
                                                <option>Clientes VIP</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-focus-within/sel:text-primary transition-colors">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="comp-content" className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Conteúdo da Campanha</label>
                                    <div className="border border-border rounded-[2rem] overflow-hidden bg-muted/5 group-focus-within:border-primary/30 transition-all">
                                        <div className="flex items-center gap-2 p-4 border-b border-border bg-background/50">
                                            {["format_bold", "format_italic", "format_underlined", "format_align_left", "format_align_center", "format_align_right", "link", "image"].map((icon, i) => (
                                                <button key={i} aria-label={`Ferramenta: ${icon.replace('format_', '')}`} className="size-10 rounded-xl hover:bg-primary/10 hover:text-primary text-muted transition-all flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            id="comp-content"
                                            aria-label="Conteúdo da Campanha"
                                            className="w-full p-10 min-h-[400px] outline-none text-sm text-foreground/80 dark:text-foreground/80 leading-relaxed font-medium bg-transparent border-none resize-none"
                                            placeholder="Comece a escrever sua mensagem..."
                                            value={newCampaign.content}
                                            onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-6">
                                    <button
                                        disabled={submitting}
                                        onClick={() => handleSendCampaign("Draft")}
                                        className="px-8 py-3 text-[10px] font-black text-muted uppercase tracking-widest hover:text-foreground transition-colors"
                                    >
                                        Salvar Rascunho
                                    </button>
                                    <button
                                        disabled={submitting}
                                        onClick={() => handleSendCampaign("Sent")}
                                        aria-label="Enviar campanha agora"
                                        className="px-10 py-5 text-[10px] font-black bg-foreground text-background dark:bg-foreground dark:text-background rounded-2xl shadow-xl shadow-black/10 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">send</span>
                                        {submitting ? "Enviando..." : "Enviar Agora"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RECENT CAMPAIGNS */}
                        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                            <div className="px-10 py-8 border-b border-border bg-muted/5">
                                <h3 className="text-[10px] font-black text-foreground uppercase tracking-widest">Histórico de Campanhas</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left" aria-label="Tabela de Campanhas Recentes">
                                    <thead className="text-[9px] text-muted uppercase font-black tracking-widest bg-muted/10">
                                        <tr>
                                            <th className="px-10 py-6">Assunto</th>
                                            <th className="px-8 py-6">Status</th>
                                            <th className="px-8 py-6">Data de Envio</th>
                                            <th className="px-10 py-6 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {campaigns.map((c) => (
                                            <tr key={c.id} className="group hover:bg-muted/5 transition-colors">
                                                <td className="px-10 py-8">
                                                    <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{c.subject}</span>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <span className={`text-[9px] font-black px-3.5 py-1.5 rounded-full ${c.status === "Sent" ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]" :
                                                        c.status === "Scheduled" ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                                                            "bg-muted text-muted-foreground"
                                                        } uppercase tracking-widest`}>
                                                        {c.status === "Sent" ? "Enviado" : c.status === "Scheduled" ? "Agendado" : "Rascunho"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-8 text-[10px] font-black text-muted uppercase tracking-widest">{c.sentAt ? new Date(c.sentAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}</td>
                                                <td className="px-10 py-8 text-right">
                                                    <button
                                                        aria-label={`Ação para campanha: ${c.subject}`}
                                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline hover:scale-105 transition-all"
                                                    >
                                                        {c.status === "Sent" ? "Relatório" : c.status === "Scheduled" ? "Editar" : "Retomar"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-12">
                        {/* WEBSITE SECTION EDITOR */}
                        <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary/0"></div>
                            <div className="px-10 py-10 border-b border-border flex items-center gap-5">
                                <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">web</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-xs text-foreground uppercase tracking-widest">Interface de Captura</h3>
                                    <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-1">Design do bloco de inscrição.</p>
                                </div>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-3">
                                    <label htmlFor="ui-headline" className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Título Chamativo</label>
                                    <input id="ui-headline" aria-label="Título da Captura" className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/20 outline-none text-foreground" type="text" defaultValue="Junte-se à nossa comunidade" />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="ui-subheadline" className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Texto de Apoio</label>
                                    <textarea id="ui-subheadline" aria-label="Texto de Apoio da Captura" className="w-full bg-background border border-border rounded-[2rem] px-6 py-6 text-xs font-medium focus:ring-4 focus:ring-primary/20 outline-none resize-none leading-relaxed text-muted" rows={5} defaultValue="Receba dicas exclusivas de saúde mental, acesso antecipado a workshops e inspiração diária direto no seu e-mail." />
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="ui-button" className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Texto do Botão</label>
                                    <input id="ui-button" aria-label="Texto do Botão da Captura" className="w-full bg-background border border-border rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/20 outline-none text-foreground" type="text" defaultValue="Inscrever Agora" />
                                </div>
                                <button aria-label="Atualizar seção no site" className="w-full py-5 text-[10px] font-black text-primary-foreground bg-primary rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10 uppercase tracking-widest">
                                    Atualizar Visual
                                </button>
                            </div>
                        </div>

                        {/* RECENT SUBSCRIBERS */}
                        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                            <div className="px-10 py-10 border-b border-border flex items-center justify-between bg-muted/5">
                                <div className="flex items-center gap-5">
                                    <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined">person_search</span>
                                    </div>
                                    <h3 className="font-black text-xs text-foreground uppercase tracking-widest">Inscritos Recentes</h3>
                                </div>
                                <button aria-label="Exportar lista de inscritos em CSV" className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Exportar CSV</button>
                            </div>
                            <ul className="divide-y divide-border max-h-[600px] overflow-y-auto custom-scrollbar" aria-label="Lista de Inscritos">
                                {subscribers.slice(0, 10).map((s) => (
                                    <li key={s.id} className="px-10 py-8 flex items-center justify-between hover:bg-muted/5 transition-colors group/li">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-foreground group-hover/li:text-primary transition-colors">{s.email}</span>
                                            <span className="text-[9px] text-muted font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                                                {new Date(s.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="size-8 rounded-lg bg-muted/5 flex items-center justify-center opacity-0 group-hover/li:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-sm text-muted">arrow_forward</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="p-8 border-t border-border text-center">
                                <button className="text-[9px] font-black text-muted uppercase tracking-widest hover:text-primary transition-colors">Ver todos os {subscribers.length} inscritos</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
