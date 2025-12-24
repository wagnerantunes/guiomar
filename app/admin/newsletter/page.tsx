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
        <div className="flex flex-col min-h-full bg-[#f6f8f6] dark:bg-[#102216]">
            {/* HEADER */}
            <div className="px-6 py-8 md:px-10 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#102216]/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">Newsletter </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Manage campaigns, subscribers, and signup forms.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest bg-white dark:bg-transparent">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            View Site
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 text-[10px] font-black bg-[#13ec5b] text-[#0d1b12] rounded-xl shadow-lg shadow-[#13ec5b]/20 hover:scale-105 transition-all uppercase tracking-widest">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            New Campaign
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-[#183221] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between group hover:border-[#13ec5b]/30 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-black text-[#0d1b12] dark:text-white mt-2 tracking-tight">{stat.value}</h3>
                                <p className="text-[10px] font-black mt-2 text-[#13ec5b] uppercase tracking-widest">
                                    {stat.change}
                                </p>
                            </div>
                            <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${stat.color === "blue" ? "bg-blue-50 text-blue-500 shadow-blue-100/50" :
                                stat.color === "purple" ? "bg-purple-50 text-purple-500 shadow-purple-100/50" :
                                    "bg-orange-50 text-orange-500 shadow-orange-100/50"
                                }`}>
                                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-8 space-y-10">
                        {/* COMPOSE */}
                        <div className="bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                            <div className="px-10 py-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-white/5">
                                <h3 className="text-xs font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Compose Campaign</h3>
                                <button className="text-[10px] text-[#13ec5b] font-black uppercase tracking-widest hover:underline">Manage Templates</button>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject Line</label>
                                        <input
                                            className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/20 outline-none text-[#0d1b12] dark:text-white"
                                            placeholder="e.g. Tips for a clearer mind..."
                                            type="text"
                                            value={newCampaign.subject}
                                            onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Segment</label>
                                        <select className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/20 outline-none text-[#0d1b12] dark:text-white appearance-none cursor-pointer">
                                            <option>All Subscribers ({subscribers.length})</option>
                                            <option>New Users (Last 30 days)</option>
                                            <option>VIP Clients</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Content</label>
                                    <div className="border border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden bg-[#f6f8f6] dark:bg-[#102216]">
                                        <div className="flex items-center gap-2 p-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#183221]">
                                            {["format_bold", "format_italic", "format_underlined", "format_align_left", "format_align_center", "format_align_right", "link", "image"].map((icon, i) => (
                                                <button key={i} className="size-9 rounded-xl hover:bg-[#13ec5b]/10 hover:text-[#13ec5b] text-gray-400 transition-all flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            className="w-full p-8 min-h-[350px] outline-none text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-transparent border-none resize-none"
                                            placeholder="Start typing..."
                                            value={newCampaign.content}
                                            onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-4">
                                    <button
                                        disabled={submitting}
                                        onClick={() => handleSendCampaign("Draft")}
                                        className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#0d1b12] transition-colors"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        disabled={submitting}
                                        onClick={() => handleSendCampaign("Sent")}
                                        className="px-10 py-4 text-[10px] font-black bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest flex items-center gap-3 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                        {submitting ? "Sending..." : "Send Campaign"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RECENT CAMPAIGNS */}
                        <div className="bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                            <div className="px-10 py-6 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/5">
                                <h3 className="text-xs font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Recent Campaigns</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-[10px] text-gray-400 uppercase font-black tracking-widest bg-gray-50/50 dark:bg-white/5">
                                        <tr>
                                            <th className="px-10 py-5">Campaign Name</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5">Sent Date</th>
                                            <th className="px-10 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                                        {campaigns.map((c) => (
                                            <tr key={c.id} className="group hover:bg-[#f6f8f6] dark:hover:bg-white/5 transition-colors">
                                                <td className="px-10 py-6 text-sm font-black text-[#0d1b12] dark:text-white">{c.subject}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${c.status === "Sent" ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
                                                        c.status === "Scheduled" ? "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20" :
                                                            "bg-gray-100 text-gray-500 border-gray-200 dark:bg-white/10 dark:text-gray-400 dark:border-white/10"
                                                        } uppercase tracking-widest`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-gray-500">{c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "-"}</td>
                                                <td className="px-10 py-6 text-right">
                                                    <button className="text-[10px] font-black text-[#13ec5b] uppercase tracking-widest hover:underline">
                                                        {c.status === "Sent" ? "View Report" : c.status === "Scheduled" ? "Edit" : "Resume"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-4 space-y-10">
                        {/* WEBSITE SECTION EDITOR */}
                        <div className="bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#13ec5b] to-blue-500"></div>
                            <div className="px-10 py-8 border-b border-gray-50 dark:border-white/5 flex items-center gap-4">
                                <span className="material-symbols-outlined text-[#13ec5b]">web</span>
                                <h3 className="font-black text-xs text-[#0d1b12] dark:text-white uppercase tracking-widest">Signup Section UI</h3>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline</label>
                                    <input className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/20 outline-none text-[#0d1b12] dark:text-white" type="text" defaultValue="Join our growing community" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Subheadline</label>
                                    <textarea className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-[2rem] px-6 py-6 text-xs font-medium focus:ring-4 focus:ring-[#13ec5b]/20 outline-none resize-none leading-relaxed" rows={5} defaultValue="Get exclusive mental health tips, early access to workshops, and daily inspiration delivered to your inbox." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Button text</label>
                                    <input className="w-full bg-[#f6f8f6] dark:bg-[#102216] border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/20 outline-none text-[#0d1b12] dark:text-white" type="text" defaultValue="Subscribe Now" />
                                </div>
                                <button className="w-full py-5 text-[10px] font-black text-[#0d1b12] bg-[#13ec5b] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#13ec5b]/10 uppercase tracking-widest">
                                    Update Section
                                </button>
                            </div>
                        </div>

                        {/* RECENT SUBSCRIBERS */}
                        <div className="bg-white dark:bg-[#183221] rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden">
                            <div className="px-10 py-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#13ec5b]">person_search</span>
                                    <h3 className="font-black text-xs text-[#0d1b12] dark:text-white uppercase tracking-widest">Subscribers</h3>
                                </div>
                                <button className="text-[9px] font-black text-[#13ec5b] uppercase tracking-widest hover:underline">Export CSV</button>
                            </div>
                            <ul className="divide-y divide-gray-50 dark:divide-white/5 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {subscribers.slice(0, 10).map((s) => (
                                    <li key={s.id} className="px-10 py-6 flex items-center justify-between hover:bg-[#f6f8f6] dark:hover:bg-white/5 transition-colors group">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-[#0d1b12] dark:text-white">{s.email}</span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(s.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
