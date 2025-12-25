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

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [draggedType, setDraggedType] = useState<"header" | "footer" | null>(null);

    const handleDragStart = (index: number, type: "header" | "footer") => {
        setDraggedIndex(index);
        setDraggedType(type);
    };

    const handleDragOver = (e: React.DragEvent, index: number, type: "header" | "footer") => {
        e.preventDefault();
        if (draggedIndex === null || draggedType !== type || draggedIndex === index) return;

        if (type === "header") {
            const newLinks = [...headerLinks];
            const draggedItem = newLinks[draggedIndex];
            newLinks.splice(draggedIndex, 1);
            newLinks.splice(index, 0, draggedItem);
            setHeaderLinks(newLinks);
        } else {
            const newLinks = [...footerInfo.quickLinks];
            const draggedItem = newLinks[draggedIndex];
            newLinks.splice(draggedIndex, 1);
            newLinks.splice(index, 0, draggedItem);
            setFooterInfo({ ...footerInfo, quickLinks: newLinks });
        }

        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDraggedType(null);
    };

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
        <div className="flex flex-col h-full bg-[#f8faf8] dark:bg-[#0d1b12]">
            {/* HEADER DA PÁGINA */}
            <div className="px-6 py-8 md:px-10 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-[#0d1b12]/80 backdrop-blur-xl z-20 shrink-0 sticky top-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white uppercase tracking-[0.2em]">
                            Navegação Global
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                            Ajuste a experiência de navegação do seu site.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            aria-label="Ver o site em uma nova aba"
                            className="hidden md:flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-gray-100 dark:border-white/5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest bg-white dark:bg-transparent"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Ver Site
                        </button>
                        <button
                            aria-label="Salvar todas as alterações de navegação"
                            onClick={saveNavigation}
                            disabled={saving}
                            className="px-10 py-3.5 text-[10px] font-black bg-[#13ec5b] text-[#0d1b12] rounded-xl shadow-xl shadow-[#13ec5b]/20 hover:scale-105 transition-all uppercase tracking-widest disabled:opacity-50 active:scale-95"
                        >
                            {saving ? "Publicando..." : "Publicar Navegação"}
                        </button>

                    </div>
                </div>

                <div className="flex items-center gap-10 mt-10">
                    <button
                        aria-label="Editar Menu Superior"
                        aria-selected={activeTab === "header"}
                        onClick={() => setActiveTab("header")}
                        className={`text-[10px] font-black uppercase tracking-[0.3em] pb-4 border-b-2 transition-all ${activeTab === "header"
                            ? "border-[#13ec5b] text-[#13ec5b]"
                            : "border-transparent text-gray-400 hover:text-[#13ec5b] translate-y-[-2px] hover:translate-y-0"
                            }`}
                    >
                        Menu Superior
                    </button>
                    <button
                        aria-label="Editar Rodapé"
                        aria-selected={activeTab === "footer"}
                        onClick={() => setActiveTab("footer")}
                        className={`text-[10px] font-black uppercase tracking-[0.3em] pb-4 border-b-2 transition-all ${activeTab === "footer"
                            ? "border-[#13ec5b] text-[#13ec5b]"
                            : "border-transparent text-gray-400 hover:text-[#13ec5b] translate-y-[-2px] hover:translate-y-0"
                            }`}
                    >
                        Rodapé Integrado
                    </button>
                </div>
            </div>

            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                <div className="max-w-6xl mx-auto space-y-12">

                    {activeTab === "header" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-12 space-y-10">
                                <div className="bg-white dark:bg-[#183221]/40 p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-12 border-b border-gray-100 dark:border-white/5 pb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                                                <span className="material-symbols-outlined">menu_open</span>
                                            </div>
                                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Estrutura do Menu</h3>
                                        </div>
                                        <button
                                            aria-label="Adicionar novo link ao menu"
                                            className="text-[10px] font-black text-[#13ec5b] uppercase tracking-widest hover:scale-105 transition-transform px-5 py-2.5 bg-[#13ec5b]/5 rounded-xl border border-[#13ec5b]/10"
                                            onClick={() => setHeaderLinks(prev => [...prev, { label: "Novo Link", url: "#" }])}
                                        >
                                            + Adicionar Link
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {headerLinks.map((item, i) => (
                                            <div
                                                key={i}
                                                draggable
                                                onDragStart={() => handleDragStart(i, "header")}
                                                onDragOver={(e) => handleDragOver(e, i, "header")}
                                                onDragEnd={handleDragEnd}
                                                className={`flex items-center gap-6 p-6 bg-[#f8faf8] dark:bg-black/20 rounded-[2rem] border border-gray-100/50 dark:border-white/5 group hover:border-[#13ec5b]/40 transition-all ${draggedIndex === i && draggedType === "header" ? 'opacity-50 scale-98 shadow-inner border-[#13ec5b]/20' : ''}`}
                                            >
                                                <span className="material-symbols-outlined text-gray-200 dark:text-white/10 group-hover:text-[#13ec5b] transition-colors cursor-grab active:cursor-grabbing hover:scale-110">drag_indicator</span>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Label de Exibição</label>
                                                        <input
                                                            aria-label={`Rótulo do link ${i + 1}`}
                                                            className="w-full bg-white dark:bg-[#0d1b12] border border-gray-100 dark:border-white/5 rounded-2xl px-6 py-3.5 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/10 outline-none transition-all dark:text-white"
                                                            value={item.label}
                                                            onChange={(e) => {
                                                                const newLinks = [...headerLinks];
                                                                newLinks[i].label = e.target.value;
                                                                setHeaderLinks(newLinks);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">URL de Destino</label>
                                                        <input
                                                            aria-label={`URL do link ${i + 1}`}
                                                            className="w-full bg-white dark:bg-[#0d1b12] border border-gray-100 dark:border-white/5 rounded-2xl px-6 py-3.5 text-[10px] text-gray-400 font-mono focus:ring-4 focus:ring-[#13ec5b]/10 outline-none transition-all"
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
                                                    aria-label={`Remover link ${item.label}`}
                                                    onClick={() => setHeaderLinks(prev => prev.filter((_, idx) => idx !== i))}
                                                    className="size-11 flex items-center justify-center rounded-2xl bg-white dark:bg-black/20 text-gray-300 hover:text-red-500 hover:shadow-lg transition-all active:scale-90"
                                                >
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* BRAND INFO COL */}
                            <div className="bg-white dark:bg-[#183221]/40 p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                                        <div className="size-10 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                                            <span className="material-symbols-outlined">info_i_outline</span>
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Identidade no Rodapé</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Biografia Institucional</label>
                                        <textarea
                                            aria-label="Biografia curta do rodapé"
                                            rows={6}
                                            className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 text-xs font-bold focus:ring-4 focus:ring-[#13ec5b]/10 transition-all outline-none resize-none leading-relaxed dark:text-gray-300"
                                            value={footerInfo.bio}
                                            onChange={(e) => setFooterInfo(prev => ({ ...prev, bio: e.target.value }))}
                                            placeholder="Descreva a empresa de forma concisa..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                                        <div className="size-10 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                                            <span className="material-symbols-outlined">share</span>
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Conexões Sociais</h3>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {[
                                            { id: "instagram", name: "Instagram", icon: "photo_camera" },
                                            { id: "facebook", name: "Facebook", icon: "facebook" },
                                            { id: "linkedin", name: "LinkedIn", icon: "group" }
                                        ].map(soc => (
                                            <div key={soc.id} className="group/item">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">{soc.name}</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg group-focus-within/item:text-[#13ec5b] transition-colors">{soc.icon}</span>
                                                    <input
                                                        aria-label={`Link do ${soc.name}`}
                                                        className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-[10px] font-mono focus:ring-4 focus:ring-[#13ec5b]/10 outline-none transition-all"
                                                        placeholder="URL completa do perfil..."
                                                        value={(footerInfo.socials as any)[soc.id]}
                                                        onChange={(e) => setFooterInfo(prev => ({
                                                            ...prev,
                                                            socials: { ...prev.socials, [soc.id]: e.target.value }
                                                        }))}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER COLS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="bg-white dark:bg-[#183221]/40 p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-10">
                                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                                                <span className="material-symbols-outlined">bolt</span>
                                            </div>
                                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Links Ágeis</h3>
                                        </div>
                                        <button
                                            aria-label="Adicionar link rápido ao rodapé"
                                            className="text-[10px] font-black text-[#13ec5b] uppercase tracking-widest px-4 py-2 bg-[#13ec5b]/5 rounded-xl border border-[#13ec5b]/10"
                                            onClick={() => setFooterInfo(prev => ({ ...prev, quickLinks: [...prev.quickLinks, { label: "Novo Link", url: "#" }] }))}
                                        >+ Novo</button>
                                    </div>
                                    <div className="space-y-4">
                                        {footerInfo.quickLinks.map((l, idx) => (
                                            <div
                                                key={idx}
                                                draggable
                                                onDragStart={() => handleDragStart(idx, "footer")}
                                                onDragOver={(e) => handleDragOver(e, idx, "footer")}
                                                onDragEnd={handleDragEnd}
                                                className={`flex items-center gap-4 p-5 bg-[#f8faf8] dark:bg-black/20 rounded-[1.5rem] border border-gray-100/50 dark:border-white/5 group hover:border-[#13ec5b]/40 transition-all ${draggedIndex === idx && draggedType === "footer" ? 'opacity-50 scale-95 shadow-inner' : ''}`}
                                            >
                                                <span className="material-symbols-outlined text-gray-200 dark:text-white/10 group-hover:text-[#13ec5b] transition-colors cursor-grab active:cursor-grabbing">drag_indicator</span>
                                                <input
                                                    aria-label={`Rótulo do link rápido ${idx + 1}`}
                                                    className="flex-1 bg-transparent border-none text-[11px] font-black p-0 focus:ring-0 text-[#0d1b12] dark:text-white uppercase tracking-[0.1em]"
                                                    value={l.label}
                                                    onChange={(e) => {
                                                        const newLinks = [...footerInfo.quickLinks];
                                                        newLinks[idx].label = e.target.value;
                                                        setFooterInfo(prev => ({ ...prev, quickLinks: newLinks }));
                                                    }}
                                                />
                                                <button
                                                    aria-label={`Remover link rápido ${l.label}`}
                                                    onClick={() => setFooterInfo(prev => ({ ...prev, quickLinks: prev.quickLinks.filter((_, i) => i !== idx) }))}
                                                    className="size-8 flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-lg">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#183221]/40 p-10 md:p-14 rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-sm space-y-10">
                                    <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
                                        <div className="size-10 rounded-xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                                            <span className="material-symbols-outlined">headset_mic</span>
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Canais Diretos</h3>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">E-mail de Suporte</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">alternate_email</span>
                                                <input
                                                    aria-label="E-mail de contato do rodapé"
                                                    className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/10 outline-none transition-all dark:text-white"
                                                    value={footerInfo.email}
                                                    onChange={(e) => setFooterInfo(prev => ({ ...prev, email: e.target.value }))}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefone / Central</label>
                                            <div className="relative">
                                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-lg">call</span>
                                                <input
                                                    aria-label="Telefone de contato do rodapé"
                                                    className="w-full bg-[#f8faf8] dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/10 outline-none transition-all dark:text-white"
                                                    value={footerInfo.phone}
                                                    onChange={(e) => setFooterInfo(prev => ({ ...prev, phone: e.target.value }))}
                                                />
                                            </div>
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
