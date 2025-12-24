"use client";

import React, { useState, useEffect } from "react";

export default function NavigationPage() {
    const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [headerLinks, setHeaderLinks] = useState<{ label: string, url: string }[]>([
        { label: "SOBRE", url: "#sobre" },
        { label: "SERVIÇOS", url: "#servicos" },
        { label: "METODOLOGIA", url: "#metodologia" },
        { label: "BLOG", url: "#blog" },
        { label: "CONTATO", url: "#contato" },
    ]);

    const [footerInfo, setFooterInfo] = useState({
        bio: "Consultoria em bem-estar corporativo que une técnica, cuidado e gestão humana para transformar ambientes de trabalho.",
        email: "renova@renovamente.com.br",
        phone: "(11) 99441-6024",
        socials: {
            instagram: "",
            facebook: "",
            linkedin: ""
        },
        quickLinks: [
            { label: "Sobre Nós", url: "#sobre" },
            { label: "Serviços", url: "#servicos" },
            { label: "Metodologia", url: "#metodologia" },
            { label: "Blog", url: "#blog" },
        ]
    });

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch("/api/settings");
                const data = await response.json();
                if (data && data.length > 0) {
                    const hSetting = data.find((s: any) => s.key === "navigation_header");
                    if (hSetting) setHeaderLinks(JSON.parse(hSetting.value));

                    const fSetting = data.find((s: any) => s.key === "navigation_footer");
                    if (fSetting) setFooterInfo(JSON.parse(fSetting.value));
                }
            } catch (error) {
                console.error("Error fetching navigation:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const saveNavigation = async () => {
        setSaving(true);
        try {
            const key = activeTab === "header" ? "navigation_header" : "navigation_footer";
            const value = activeTab === "header" ? headerLinks : footerInfo;

            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value: JSON.stringify(value) }),
            });
            if (res.ok) alert("Alterações salvas com sucesso!");
        } catch (error) {
            console.error("Error saving navigation:", error);
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="flex flex-col h-full bg-[#f6f8f6] dark:bg-[#102216]">
            {/* HEADER DA PÁGINA */}
            <div className="px-6 py-8 md:px-10 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#102216]/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">
                            Global Navigation
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                            Configure o menu superior e o rodapé completo do site.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest bg-white dark:bg-transparent">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Ver Site
                        </button>
                        <button
                            onClick={saveNavigation}
                            disabled={saving}
                            className="px-10 py-3.5 text-[10px] font-black bg-[#13ec5b] text-[#0d1b12] rounded-xl shadow-lg shadow-[#13ec5b]/20 hover:scale-105 transition-all uppercase tracking-widest disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Salvar Alterações"}
                        </button>

                    </div>
                </div>

                <div className="flex items-center gap-10 mt-10">
                    <button
                        onClick={() => setActiveTab("header")}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] pb-4 border-b-2 transition-all ${activeTab === "header"
                            ? "border-[#13ec5b] text-[#13ec5b]"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        Cabeçalho (Header)
                    </button>
                    <button
                        onClick={() => setActiveTab("footer")}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] pb-4 border-b-2 transition-all ${activeTab === "footer"
                            ? "border-[#13ec5b] text-[#13ec5b]"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        Rodapé (Footer)
                    </button>
                </div>
            </div>

            <div className="p-10 md:p-14 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-6xl mx-auto space-y-12">

                    {activeTab === "header" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-12 space-y-10">
                                <div className="bg-white dark:bg-[#183221] p-12 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#13ec5b]">list_alt</span>
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Menu de Navegação</h3>
                                        </div>
                                        <button className="text-[10px] font-black text-[#13ec5b] uppercase tracking-widest hover:underline">+ Adicionar Link</button>
                                    </div>
                                    <div className="space-y-4">
                                        {headerLinks.map((item, i) => (
                                            <div key={i} className="flex items-center gap-6 p-6 bg-[#f6f8f6] dark:bg-white/5 rounded-3xl border border-transparent group hover:border-[#13ec5b]/30 transition-all cursor-move">
                                                <span className="material-symbols-outlined text-gray-300 group-hover:text-[#13ec5b] transition-colors">drag_indicator</span>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Label</label>
                                                        <input
                                                            className="w-full bg-white dark:bg-[#102216] border-transparent rounded-2xl px-6 py-3 text-xs font-black focus:ring-2 focus:ring-[#13ec5b]/30 outline-none"
                                                            value={item.label}
                                                            onChange={(e) => {
                                                                const newLinks = [...headerLinks];
                                                                newLinks[i].label = e.target.value;
                                                                setHeaderLinks(newLinks);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Destino (Slug/ID)</label>
                                                        <input
                                                            className="w-full bg-white dark:bg-[#102216] border-transparent rounded-2xl px-6 py-3 text-[10px] text-gray-400 font-mono focus:ring-2 focus:ring-[#13ec5b]/30 outline-none"
                                                            value={item.url}
                                                            onChange={(e) => {
                                                                const newLinks = [...headerLinks];
                                                                newLinks[i].url = e.target.value;
                                                                setHeaderLinks(newLinks);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setHeaderLinks(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="size-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* BRAND INFO COL */}
                            <div className="bg-white dark:bg-[#183221] p-12 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5 pb-4">Coluna Identidade (Sobre)</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio Curta do Rodapé</label>
                                            <textarea
                                                rows={5}
                                                className="w-full bg-[#f6f8f6] dark:bg-white/5 border-transparent rounded-[2rem] p-8 text-xs font-medium focus:ring-2 focus:ring-[#13ec5b]/30 transition-all outline-none resize-none leading-relaxed"
                                                value={footerInfo.bio}
                                                onChange={(e) => setFooterInfo(prev => ({ ...prev, bio: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5 pb-4">Redes Sociais</h3>
                                    <div className="grid grid-cols-1 gap-5">
                                        {[
                                            { id: "instagram", name: "Instagram" },
                                            { id: "facebook", name: "Facebook" },
                                            { id: "linkedin", name: "LinkedIn" }
                                        ].map(soc => (
                                            <div key={soc.id} className="flex items-center gap-4 bg-[#f6f8f6] dark:bg-white/5 p-4 rounded-2xl border border-transparent group hover:border-[#13ec5b]/30 transition-all">
                                                <span className="text-[10px] font-black text-gray-500 w-24 uppercase tracking-widest">{soc.name}:</span>
                                                <input
                                                    className="flex-1 bg-white dark:bg-[#102216] border-transparent rounded-xl px-5 py-2 text-[10px] font-mono focus:ring-2 focus:ring-[#13ec5b]/30 outline-none"
                                                    placeholder="https://..."
                                                    value={(footerInfo.socials as any)[soc.id]}
                                                    onChange={(e) => setFooterInfo(prev => ({
                                                        ...prev,
                                                        socials: { ...prev.socials, [soc.id]: e.target.value }
                                                    }))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER COLS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="bg-white dark:bg-[#183221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
                                    <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/5 pb-4">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Links Rápidos</h3>
                                        <button className="text-[10px] font-black text-[#13ec5b] uppercase tracking-widest hover:underline">+ Novo</button>
                                    </div>
                                    <div className="space-y-3">
                                        {footerInfo.quickLinks.map((l, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-[#f6f8f6] dark:bg-white/5 rounded-2xl border border-transparent group hover:border-[#13ec5b]/30 transition-all">
                                                <input
                                                    className="flex-1 bg-transparent border-none text-[11px] font-black p-0 focus:ring-0 text-[#0d1b12] dark:text-white uppercase tracking-widest"
                                                    value={l.label}
                                                    onChange={(e) => {
                                                        const newLinks = [...footerInfo.quickLinks];
                                                        newLinks[idx].label = e.target.value;
                                                        setFooterInfo(prev => ({ ...prev, quickLinks: newLinks }));
                                                    }}
                                                />
                                                <span className="material-symbols-outlined text-gray-300 text-sm group-hover:text-[#13ec5b]">link</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#183221] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-2xl space-y-8">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5 pb-4">Atendimento & Contato</h3>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail de Contato</label>
                                            <input
                                                className="w-full bg-[#f6f8f6] dark:bg-white/5 border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-2 focus:ring-[#13ec5b]/30 outline-none"
                                                value={footerInfo.email}
                                                onChange={(e) => setFooterInfo(prev => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone/WhatsApp</label>
                                            <input
                                                className="w-full bg-[#f6f8f6] dark:bg-white/5 border-transparent rounded-2xl px-6 py-4 text-xs font-black focus:ring-2 focus:ring-[#13ec5b]/30 outline-none"
                                                value={footerInfo.phone}
                                                onChange={(e) => setFooterInfo(prev => ({ ...prev, phone: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
