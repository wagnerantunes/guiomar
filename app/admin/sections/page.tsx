"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { Skeleton } from "@/components/admin/Skeleton";

interface Section {
    id: string;
    name: string;
    icon: string;
    desc: string;
    status: string;
    content?: any;
}

export default function PageSections() {
    const [expandedId, setExpandedId] = useState<string | null>("hero");
    const [sections, setSections] = useState<Section[]>([
        { id: "hero", name: "01. Hero Banner", icon: "rocket_launch", desc: "Sessão principal com formulário de conversão.", status: "Ativa" },
        { id: "sobre", name: "02. Sobre Nós", icon: "history_edu", desc: "História e o diferencial da RenovaMente.", status: "Ativa" },
        { id: "desafio", name: "03. O Desafio", icon: "warning", desc: "Box escuro com estatística de produtividade.", status: "Ativa" },
        { id: "servicos", name: "04. Nossos Serviços", icon: "category", desc: "Grade com os 9 serviços principais.", status: "Ativa" },
        { id: "metodologia", name: "05. Metodologia", icon: "account_tree", desc: "Linha do tempo dos processos.", status: "Ativa" },
        { id: "blog", name: "06. Blog Preview", icon: "rss_feed", desc: "Chamada para os últimos artigos do blog.", status: "Ativa" },
        { id: "porque", name: "07. Por que RenovaMente?", icon: "star", desc: "Cards com os diferenciais competitivos.", status: "Ativa" },
        { id: "guiomar", name: "08. Sobre Guiomar", icon: "person", desc: "Perfil da fundadora e citação.", status: "Ativa" },
        { id: "faq", name: "09. FAQ (Perguntas)", icon: "quiz", desc: "Acordeões de dúvidas frequentes.", status: "Ativa" },
        { id: "contato", name: "10. Contato Final", icon: "contact_support", desc: "Rodapé de contato e formulário detalhado.", status: "Ativa" },
    ]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch("/api/settings");
                const data = await response.json();
                if (data && data.length > 0) {
                    setSections(prev => prev.map(sec => {
                        const setting = data.find((s: any) => s.key === `section_${sec.id}_content`);
                        if (setting) {
                            try {
                                const content = JSON.parse(setting.value);
                                return { ...sec, content };
                            } catch (e) {
                                return sec;
                            }
                        }
                        return sec;
                    }));
                }
            } catch (error) {
                console.error("Error fetching sections:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleContentChange = (id: string, field: string, value: string) => {
        setSections(prev => prev.map(sec =>
            sec.id === id ? { ...sec, content: { ...sec.content, [field]: value } } : sec
        ));
    };

    const saveSection = async (sec: Section) => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: `section_${sec.id}_content`,
                    value: JSON.stringify(sec.content || {})
                }),
            });
            if (res.ok) {
                toast({
                    title: "Sessão Atualizada",
                    description: `As alterações na sessão ${sec.name} foram aplicadas com sucesso.`,
                    type: "success"
                });
            } else {
                toast({ title: "Erro ao Salvar", description: "Verifique as informações e tente novamente.", type: "error" });
            }
        } catch (error) {
            console.error("Error saving section:", error);
            toast({ title: "Falha na Rede", description: "Não foi possível conectar ao servidor.", type: "error" });
        } finally {
            setSaving(false);
        }
    };


    return (
        <div className="flex flex-col h-full bg-[#f6f8f6] dark:bg-[#102216]">
            {/* HEADER FIXO */}
            <div className="px-6 py-6 md:px-10 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md z-20 shrink-0 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">
                            Home Page Sections
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Organize e edite o conteúdo de cada bloco da sua Landing Page.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all uppercase tracking-widest bg-white dark:bg-transparent">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Preview site
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 text-[10px] font-black bg-[#0d1b12] dark:bg-[#13ec5b] text-white dark:text-[#0d1b12] rounded-xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest">
                            Salvar Estrutura
                        </button>
                    </div>
                </div>
            </div>

            {/* LISTA DE SEÇÕES */}
            <div className="p-6 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-6">
                    {loading ? (
                        <>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-[#183221] p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <Skeleton className="size-5 rounded-md" />
                                        <Skeleton className="size-16 rounded-3xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-20" variant="text" />
                                            <Skeleton className="h-5 w-48" variant="text" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-6 w-16" variant="text" />
                                        <Skeleton className="size-6 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        sections.map((sec) => (
                            <div
                                key={sec.id}
                                className={`group bg-white dark:bg-[#183221] rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expandedId === sec.id
                                    ? "border-[#13ec5b] ring-8 ring-[#13ec5b]/5 shadow-2xl"
                                    : "border-gray-100 dark:border-white/5 hover:border-[#13ec5b]/30 shadow-sm"
                                    }`}
                            >
                                <div
                                    onClick={() => setExpandedId(expandedId === sec.id ? null : sec.id)}
                                    className="p-8 flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="cursor-grab text-gray-300 hover:text-gray-500 transition-colors">
                                            <span className="material-symbols-outlined text-xl">drag_indicator</span>
                                        </div>
                                        <div className={`size-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${expandedId === sec.id
                                            ? "bg-[#13ec5b] text-[#0d1b12] rotate-6 shadow-lg shadow-[#13ec5b]/20"
                                            : "bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:bg-[#13ec5b]/10 group-hover:text-[#13ec5b]"
                                            }`}>
                                            <span className="material-symbols-outlined text-2xl">{sec.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`font-black text-[11px] tracking-[0.2em] uppercase transition-colors ${expandedId === sec.id ? "text-[#13ec5b]" : "text-gray-500"
                                                }`}>
                                                {sec.name}
                                            </h3>
                                            <p className="text-sm text-[#0d1b12] dark:text-white font-black mt-0.5 tracking-tight">{sec.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="hidden md:inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 border border-green-100 dark:border-green-500/20">
                                            {sec.status}
                                        </span>
                                        <span className={`material-symbols-outlined transition-transform duration-500 ${expandedId === sec.id ? "rotate-180 text-[#13ec5b]" : "text-gray-300"
                                            }`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                {/* EDITOR EXPANDIDO */}
                                {expandedId === sec.id && (
                                    <div className="px-10 pb-12 pt-4 border-t border-gray-50 dark:border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                            <div className="lg:col-span-8 space-y-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
                                                        <span className="material-symbols-outlined text-[#13ec5b] text-sm">edit_note</span>
                                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Editor de Conteúdo</h4>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Título Principal</label>
                                                            <input
                                                                className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/20 focus:bg-white dark:focus:bg-[#102216] transition-all outline-none text-[#0d1b12] dark:text-white"
                                                                value={sec.content?.title || ""}
                                                                onChange={(e) => handleContentChange(sec.id, "title", e.target.value)}
                                                                placeholder="Texto de exemplo da sessão..."
                                                            />
                                                        </div>

                                                        {sec.id === "desafio" && (
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Valor Estatístico</label>
                                                                    <input
                                                                        className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-xl px-4 py-3 text-xs font-bold text-[#0d1b12] dark:text-white outline-none focus:ring-2 focus:ring-[#13ec5b]/30"
                                                                        value={sec.content?.statValue || ""}
                                                                        onChange={(e) => handleContentChange(sec.id, "statValue", e.target.value)}
                                                                        placeholder="+30%"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Rótulo Estatístico</label>
                                                                    <input
                                                                        className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-xl px-4 py-3 text-xs font-bold text-[#0d1b12] dark:text-white outline-none focus:ring-2 focus:ring-[#13ec5b]/30"
                                                                        value={sec.content?.statLabel || ""}
                                                                        onChange={(e) => handleContentChange(sec.id, "statLabel", e.target.value)}
                                                                        placeholder="produtividade..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {sec.id === "sobre" && (
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Anos de Experiência</label>
                                                                <input
                                                                    className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-xl px-4 py-3 text-xs font-bold text-[#0d1b12] dark:text-white outline-none focus:ring-2 focus:ring-[#13ec5b]/30"
                                                                    value={sec.content?.experience || ""}
                                                                    onChange={(e) => handleContentChange(sec.id, "experience", e.target.value)}
                                                                    placeholder="30"
                                                                />
                                                            </div>
                                                        )}

                                                        {sec.id === "guiomar" && (
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Citação / Quote</label>
                                                                <textarea
                                                                    rows={3}
                                                                    className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-[1.5rem] px-6 py-4 text-xs font-medium focus:ring-4 focus:ring-[#13ec5b]/20 focus:bg-white dark:focus:bg-[#102216] transition-all outline-none resize-none text-gray-600 dark:text-gray-300"
                                                                    value={sec.content?.quote || ""}
                                                                    onChange={(e) => handleContentChange(sec.id, "quote", e.target.value)}
                                                                    placeholder="A frase de destaque da Guiomar..."
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Texto de Apoio / Descrição</label>
                                                            <textarea
                                                                rows={5}
                                                                className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-[2rem] px-6 py-5 text-xs font-medium focus:ring-4 focus:ring-[#13ec5b]/20 focus:bg-white dark:focus:bg-[#102216] transition-all outline-none resize-none text-gray-600 dark:text-gray-300 leading-relaxed"
                                                                value={sec.content?.description || ""}
                                                                onChange={(e) => handleContentChange(sec.id, "description", e.target.value)}
                                                                placeholder="Descrição longa que aparece abaixo do título principal para dar mais contexto ao usuário..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-4 space-y-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
                                                        <span className="material-symbols-outlined text-[#13ec5b] text-sm">palette</span>
                                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estilização & Mídia</h4>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3">Imagem / URL de Mídia</label>
                                                            <input
                                                                className="w-full bg-gray-50 dark:bg-white/5 border-transparent rounded-xl px-4 py-3 text-xs font-bold text-[#0d1b12] dark:text-white outline-none focus:ring-2 focus:ring-[#13ec5b]/30"
                                                                value={sec.content?.image || ""}
                                                                onChange={(e) => handleContentChange(sec.id, "image", e.target.value)}
                                                                placeholder="https://images.unsplash.com/..."
                                                            />
                                                            {sec.content?.image && (
                                                                <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10">
                                                                    <img src={sec.content.image} alt="Preview" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex justify-end gap-4">
                                            <button className="px-8 py-3 text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">Pausar Sessão</button>
                                            <button
                                                onClick={() => saveSection(sec)}
                                                disabled={saving}
                                                className="px-10 py-4 text-[10px] font-black bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                                            >
                                                {saving ? "Salvando..." : "Aplicar Alterações"}
                                            </button>

                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    <button className="w-full py-12 border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-300 hover:text-[#13ec5b] hover:border-[#13ec5b]/50 hover:bg-[#13ec5b]/5 transition-all group mt-10">
                        <span className="material-symbols-outlined text-5xl group-hover:rotate-90 transition-transform duration-700">add_circle</span>
                        <span className="font-black text-xs uppercase tracking-widest opacity-60">Inserir Nova Sessão Customizada</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
