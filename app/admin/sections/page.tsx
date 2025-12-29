"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";
import { Skeleton } from "@/components/admin/Skeleton";
import { SECTION_DEFAULTS } from "@/lib/sectionDefaults";
import { MediaPicker } from "@/components/admin/MediaPicker";
import RichTextEditor from "@/components/admin/RichTextEditor";

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
        { id: "hero", name: "01. Hero Banner", icon: "rocket_launch", desc: "Sessão principal com slider e conteúdo introdutório.", status: "Ativa" },
        { id: "sobre", name: "02. Sobre Nós", icon: "history_edu", desc: "História e o diferencial da RenovaMente.", status: "Ativa" },
        { id: "desafio", name: "03. O Desafio", icon: "warning", desc: "Box escuro com estatística de produtividade.", status: "Ativa" },
        { id: "servicos", name: "04. Nossos Serviços", icon: "category", desc: "Grade/Carousel com os serviços principais.", status: "Ativa" },
        { id: "metodologia", name: "05. Metodologia", icon: "account_tree", desc: "Linha do tempo dos processos.", status: "Ativa" },
        { id: "blog", name: "06. Blog Preview", icon: "rss_feed", desc: "Chamada para os últimos artigos do blog.", status: "Ativa" },
        { id: "porque", name: "07. Por que RenovaMente?", icon: "star", desc: "Cards com os diferenciais competitivos.", status: "Ativa" },
        { id: "guiomar", name: "08. Sobre Guiomar", icon: "person", desc: "Perfil da fundadora e citação.", status: "Ativa" },
        { id: "testimonials", name: "09. Testemunhos", icon: "chat", desc: "Slider de depoimentos de clientes.", status: "Ativa" },
        { id: "faq", name: "10. FAQ (Perguntas)", icon: "quiz", desc: "Acordeões de dúvidas frequentes.", status: "Ativa" },
        { id: "contato", name: "11. Contato Final", icon: "contact_support", desc: "Rodapé de contato e formulário detalhado.", status: "Ativa" },
    ]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<{ secId: string, fieldName?: string } | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchSettings() {
            try {
                const response = await fetch("/api/settings");
                const data = await response.json();
                if (data) {
                    setSections(prev => prev.map(sec => {
                        const setting = data.find((s: any) => s.key === `section_${sec.id}_content`);
                        const defaultContent = (SECTION_DEFAULTS as any)[sec.id] || {};

                        if (setting) {
                            try {
                                const content = JSON.parse(setting.value);
                                // Merge saved content with defaults to ensure new fields are present
                                return { ...sec, content: { ...defaultContent, ...content } };
                            } catch (e) {
                                return { ...sec, content: defaultContent };
                            }
                        }
                        return { ...sec, content: defaultContent };
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

    const handleContentChange = (id: string, field: string, value: any) => {
        setSections(prev => prev.map(sec =>
            sec.id === id ? { ...sec, content: { ...sec.content, [field]: value } } : sec
        ));
    };

    const handleArrayChange = (id: string, listKey: string, index: number, field: string, value: any) => {
        setSections(prev => prev.map(sec => {
            if (sec.id === id) {
                const list = [...(sec.content?.[listKey] || [])];
                list[index] = { ...list[index], [field]: value };
                return { ...sec, content: { ...sec.content, [listKey]: list } };
            }
            return sec;
        }));
    };

    const addItemToArray = (id: string, listKey: string, defaultItem: any) => {
        setSections(prev => prev.map(sec => {
            if (sec.id === id) {
                const list = [...(sec.content?.[listKey] || []), defaultItem];
                return { ...sec, content: { ...sec.content, [listKey]: list } };
            }
            return sec;
        }));
    };

    const removeItemFromArray = (id: string, listKey: string, index: number) => {
        setSections(prev => prev.map(sec => {
            if (sec.id === id) {
                const list = (sec.content?.[listKey] || []).filter((_: any, i: number) => i !== index);
                return { ...sec, content: { ...sec.content, [listKey]: list } };
            }
            return sec;
        }));
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


    const removeImageFromSlider = (secId: string, index: number) => {
        setSections(prev => prev.map(sec => {
            if (sec.id === secId) {
                const images = (sec.content?.images || []).filter((_: any, i: number) => i !== index);
                return { ...sec, content: { ...sec.content, images } };
            }
            return sec;
        }));
        toast({
            title: "Imagem Removida",
            description: "A imagem foi excluída do slider.",
            type: "success"
        });
    };

    const selectFromMediaLibrary = (url: string) => {
        if (mediaPickerTarget) {
            setSections(prev => prev.map(sec => {
                if (sec.id === mediaPickerTarget.secId) {
                    // If fieldName is provided, it's a single image upload
                    if (mediaPickerTarget.fieldName) {
                        return { ...sec, content: { ...sec.content, [mediaPickerTarget.fieldName]: url } };
                    }
                    // Otherwise it's a slider (images array)
                    const currentImages = sec.content?.images || [];
                    return { ...sec, content: { ...sec.content, images: [...currentImages, url] } };
                }
                return sec;
            }));
            setShowMediaPicker(false);
            setMediaPickerTarget(null);
            toast({
                title: "Imagem Adicionada",
                description: "A imagem foi vinculada com sucesso.",
                type: "success"
            });
        }
    };


    return (
        <div className="flex flex-col h-full bg-background">
            {/* HEADER FIXO */}
            <div className="px-6 py-6 md:px-10 border-b border-border bg-background/80 backdrop-blur-xl z-20 shrink-0 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-foreground uppercase tracking-[0.2em]">
                            Home Page Sections
                        </h1>
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest mt-1">
                            Organize e edite o conteúdo de cada bloco da sua Landing Page.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            aria-label="Visualizar site ao vivo"
                            className="flex items-center gap-2 px-6 py-3 text-[10px] font-black border border-border rounded-xl hover:bg-primary/5 hover:text-primary transition-all uppercase tracking-widest bg-card"
                        >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            Preview site
                        </button>
                        <button
                            aria-label="Salvar alterações de estrutura"
                            onClick={() => {
                                sections.forEach(sec => saveSection(sec));
                                toast({ title: "Sincronização Completa", description: "Todas as seções foram salvas.", type: "success" });
                            }}
                            className="flex items-center gap-2 px-8 py-3 text-[10px] font-black bg-primary text-primary-foreground rounded-xl shadow-xl shadow-primary/10 hover:scale-105 transition-all uppercase tracking-widest"
                        >
                            Salvar Estrutura
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-screen-2xl mx-auto space-y-6">
                    {loading ? (
                        <>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden mb-6 p-8">
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
                                className={`group bg-card rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expandedId === sec.id
                                    ? "border-primary ring-8 ring-primary/5 shadow-2xl"
                                    : "border-border hover:border-primary/30 shadow-sm"
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
                                            ? "bg-primary text-primary-foreground rotate-6 shadow-lg shadow-primary/20"
                                            : "bg-muted/10 text-muted group-hover:bg-primary/10 group-hover:text-primary"
                                            }`}>
                                            <span className="material-symbols-outlined text-2xl">{sec.icon}</span>
                                        </div>
                                        <div>
                                            <h3 className={`font-black text-[11px] tracking-[0.2em] uppercase transition-colors ${expandedId === sec.id ? "text-primary" : "text-muted"
                                                }`}>
                                                {sec.name}
                                            </h3>
                                            <p className="text-sm text-foreground font-black mt-0.5 tracking-tight">{sec.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleContentChange(sec.id, "isVisible", !(sec.content?.isVisible ?? true));
                                            }}
                                            className={`hidden md:inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all ${(sec.content?.isVisible ?? true)
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "bg-destructive/10 text-destructive border border-destructive/20"
                                                }`}
                                        >
                                            {(sec.content?.isVisible ?? true) ? "Visível" : "Escondido"}
                                        </button>
                                        <span className="hidden md:inline-block text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">
                                            {sec.status}
                                        </span>
                                        <span className={`material-symbols-outlined transition-transform duration-500 ${expandedId === sec.id ? "rotate-180 text-primary" : "text-muted"
                                            }`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                {/* EDITOR EXPANDIDO */}
                                {expandedId === sec.id && (
                                    <div className="px-10 pb-12 pt-4 border-t border-border animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                            <div className="lg:col-span-8 space-y-8">
                                                <div className="space-y-4">
                                                    {/* CONTENT EDITOR */}
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-3 pb-3 border-b border-border">
                                                            <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                                                            <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Content Editor</h4>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Title</label>
                                                                <input
                                                                    className="w-full bg-muted/10 border-border rounded-[1.2rem] px-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/20 focus:bg-background transition-all outline-none text-foreground"
                                                                    value={sec.content?.title || ""}
                                                                    onChange={(e) => handleContentChange(sec.id, "title", e.target.value)}
                                                                />
                                                            </div>

                                                            {sec.id === "hero" && (
                                                                <>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Subtitle</label>
                                                                        <input
                                                                            className="w-full bg-muted/10 border-border rounded-[1.2rem] px-6 py-4 text-xs font-black focus:ring-4 focus:ring-primary/20 focus:bg-background transition-all outline-none text-foreground"
                                                                            value={sec.content?.subtitle || ""}
                                                                            onChange={(e) => handleContentChange(sec.id, "subtitle", e.target.value)}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-4">
                                                                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Texto Principal (HTML)</label>
                                                                        <RichTextEditor
                                                                            content={sec.content?.description || ""}
                                                                            onChange={(val) => handleContentChange(sec.id, "description", val)}
                                                                            minHeight="200px"
                                                                        />
                                                                    </div>
                                                                    {/* IMAGE SLIDER UI */}
                                                                    <div className="space-y-4 pt-4">
                                                                        <div className="flex items-center justify-between border-b border-border pb-2">
                                                                            <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Image Slider</h4>
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setMediaPickerTarget({ secId: sec.id });
                                                                                        setShowMediaPicker(true);
                                                                                    }}
                                                                                    className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline px-3 py-1 bg-primary/5 rounded-lg"
                                                                                >
                                                                                    <span className="material-symbols-outlined text-sm">photo_library</span>
                                                                                    Adicionar Imagem
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                                                            {(sec.content?.images || []).filter(Boolean).map((img: string, idx: number) => (
                                                                                <div key={idx} className="relative shrink-0 group/slide">
                                                                                    <div className="bg-card rounded-2xl border border-border h-20 aspect-video overflow-hidden group relative transition-all hover:bg-muted/10">
                                                                                        <img src={img} className="w-full h-full object-cover" alt={`Slide ${idx + 1}`} />
                                                                                    </div>
                                                                                    <button
                                                                                        onClick={() => removeImageFromSlider(sec.id, idx)}
                                                                                        className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/slide:opacity-100 transition-all shadow-lg hover:scale-110 active:scale-95 z-10"
                                                                                        title="Remover imagem"
                                                                                    >
                                                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                            <div
                                                                                onClick={() => {
                                                                                    setMediaPickerTarget({ secId: sec.id });
                                                                                    setShowMediaPicker(true);
                                                                                }}
                                                                                className="h-20 aspect-video rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-gray-300 hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all cursor-pointer bg-gray-50/50 dark:bg-white/2 shrink-0"
                                                                            >
                                                                                <span className="material-symbols-outlined text-xl">photo_library</span>
                                                                                <span className="text-[8px] font-bold uppercase tracking-widest">Adicionar</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {sec.id === "desafio" && (
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Estatística</label>
                                                                        <input className="w-full bg-muted/5 border-border border border-border rounded-xl px-4 py-3 text-xs font-bold transition-all outline-none" value={sec.content?.statValue || ""} onChange={(e) => handleContentChange(sec.id, "statValue", e.target.value)} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Rótulo</label>
                                                                        <input className="w-full bg-muted/5 border-border border border-border rounded-xl px-4 py-3 text-xs font-bold transition-all outline-none" value={sec.content?.statLabel || ""} onChange={(e) => handleContentChange(sec.id, "statLabel", e.target.value)} />
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* GUIOMAR SECTION - IMAGE UPLOAD */}
                                                            {sec.id === "guiomar" && (
                                                                <>
                                                                    <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-6">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Foto da Fundadora</h4>
                                                                        </div>
                                                                        <div className="flex gap-3 flex-wrap">
                                                                            {sec.content?.image && (
                                                                                <div className="relative h-20 aspect-video rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 group">
                                                                                    <img src={sec.content.image} alt="Guiomar" className="w-full h-full object-cover" />
                                                                                    <button
                                                                                        onClick={() => handleContentChange(sec.id, "image", "")}
                                                                                        className="absolute top-2 right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                                                                                        title="Remover imagem"
                                                                                    >
                                                                                        <span className="material-symbols-outlined text-sm">close</span>
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                            <div
                                                                                onClick={() => {
                                                                                    setMediaPickerTarget({ secId: sec.id, fieldName: "image" });
                                                                                    setShowMediaPicker(true);
                                                                                }}
                                                                                className="h-20 aspect-video rounded-2xl border-2 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-gray-300 hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all cursor-pointer bg-gray-50/50 dark:bg-white/2"
                                                                            >
                                                                                <span className="material-symbols-outlined text-xl">photo_library</span>
                                                                                <span className="text-[8px] font-bold uppercase tracking-widest">Trocar Foto</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Anos de Experiência</label>
                                                                            <input className="w-full bg-muted/5 border-border border border-border rounded-xl px-4 py-3 text-xs font-bold transition-all outline-none" value={sec.content?.yearsExp || ""} onChange={(e) => handleContentChange(sec.id, "yearsExp", e.target.value)} placeholder="15+" />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Projetos Entregues</label>
                                                                            <input className="w-full bg-muted/5 border-border border border-border rounded-xl px-4 py-3 text-xs font-bold transition-all outline-none" value={sec.content?.projectsCount || ""} onChange={(e) => handleContentChange(sec.id, "projectsCount", e.target.value)} placeholder="500+" />
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}

                                                            {sec.id !== "hero" && (
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Descrição</label>
                                                                    <RichTextEditor
                                                                        content={sec.content?.description || ""}
                                                                        onChange={(val) => handleContentChange(sec.id, "description", val)}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* REPEATERS */}
                                                            {sec.id === "servicos" && (
                                                                <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Service Cards</h4>
                                                                        <button onClick={() => addItemToArray(sec.id, "items", { t: "Novo Serviço", d: "<p>Descrição do serviço...</p>", icon: "verified" })} className="text-[10px] font-black text-[var(--primary)] uppercase">+ Add Card</button>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 gap-3">
                                                                        {(sec.content?.items || []).map((item: any, idx: number) => (
                                                                            <div key={idx} className="p-6 bg-muted/5 border-border border rounded-[2rem] flex flex-col gap-4 group/item">
                                                                                <div className="flex items-center justify-between">
                                                                                    <label className="text-[9px] font-black text-muted uppercase tracking-widest">Card #{idx + 1}</label>
                                                                                    <button onClick={() => removeItemFromArray(sec.id, "items", idx)} className="text-gray-300 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
                                                                                </div>
                                                                                <div className="space-y-3">
                                                                                    <input className="w-full bg-card border-border border border-none rounded-xl px-4 py-2 text-xs font-black outline-none" placeholder="Título" value={item.t} onChange={(e) => handleArrayChange(sec.id, "items", idx, "t", e.target.value)} />
                                                                                    <RichTextEditor
                                                                                        content={item.d}
                                                                                        onChange={(val) => handleArrayChange(sec.id, "items", idx, "d", val)}
                                                                                        minHeight="100px"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {sec.id === "testimonials" && (
                                                                <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Client Testimonials</h4>
                                                                        <button onClick={() => addItemToArray(sec.id, "items", { name: "Novo Cliente", role: "Cargo/Empresa", quote: "<p>O depoimento aqui...</p>", image: "" })} className="text-[10px] font-black text-[var(--primary)] uppercase">+ Add Review</button>
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        {(sec.content?.items || []).map((item: any, idx: number) => (
                                                                            <div key={idx} className="p-6 bg-muted/5 border-border border rounded-[2rem] flex flex-col gap-4 group/testi relative">
                                                                                <div className="flex items-center justify-between">
                                                                                    <input className="bg-card border-border border border-none rounded-xl px-4 py-2 text-xs font-black outline-none flex-1" placeholder="Nome do Cliente" value={item.name} onChange={(e) => handleArrayChange(sec.id, "items", idx, "name", e.target.value)} />
                                                                                    <button onClick={() => removeItemFromArray(sec.id, "items", idx)} className="ml-4 text-gray-300 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                                                                                </div>
                                                                                <RichTextEditor
                                                                                    content={item.quote}
                                                                                    onChange={(val) => handleArrayChange(sec.id, "items", idx, "quote", val)}
                                                                                    minHeight="100px"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {sec.id === "metodologia" && (
                                                                <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Methodology Steps</h4>
                                                                        <button onClick={() => addItemToArray(sec.id, "steps", { t: "Novo Passo", d: "<p>Descreva o passo...</p>" })} className="text-[10px] font-black text-[var(--primary)] uppercase">+ Add Step</button>
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        {(sec.content?.steps || []).map((step: any, idx: number) => (
                                                                            <div key={idx} className="p-6 bg-muted/5 border-border border rounded-[2rem] flex flex-col gap-4 group/step">
                                                                                <div className="flex items-center justify-between">
                                                                                    <label className="text-[9px] font-black text-muted uppercase tracking-widest">Passo #{idx + 1}</label>
                                                                                    <button onClick={() => removeItemFromArray(sec.id, "steps", idx)} className="text-gray-300 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
                                                                                </div>
                                                                                <div className="space-y-3">
                                                                                    <input className="w-full bg-card border-border border border-none rounded-xl px-4 py-2 text-xs font-black outline-none" placeholder="Título do Passo" value={step.t} onChange={(e) => handleArrayChange(sec.id, "steps", idx, "t", e.target.value)} />
                                                                                    <RichTextEditor
                                                                                        content={step.d}
                                                                                        onChange={(val) => handleArrayChange(sec.id, "steps", idx, "d", val)}
                                                                                        minHeight="80px"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {sec.id === "faq" && (
                                                                <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-6">
                                                                    <div className="flex items-center justify-between">
                                                                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">FAQ Items</h4>
                                                                        <button onClick={() => addItemToArray(sec.id, "items", { q: "Nova Pergunta", r: "<p>Resposta detalhada aqui...</p>" })} className="text-[10px] font-black text-[var(--primary)] uppercase">+ Add Q&A</button>
                                                                    </div>
                                                                    <div className="space-y-3">
                                                                        {(sec.content?.items || []).map((item: any, idx: number) => (
                                                                            <div key={idx} className="p-6 bg-muted/5 border-border border rounded-[2rem] flex flex-col gap-4 group/faq relative">
                                                                                <div className="flex items-center justify-between">
                                                                                    <input className="bg-card border-border border border-none rounded-xl px-4 py-2 text-xs font-black outline-none flex-1" placeholder="Pergunta" value={item.q} onChange={(e) => handleArrayChange(sec.id, "items", idx, "q", e.target.value)} />
                                                                                    <button onClick={() => removeItemFromArray(sec.id, "items", idx)} className="ml-4 text-gray-300 hover:text-red-500 transition-all"><span className="material-symbols-outlined text-lg">close</span></button>
                                                                                </div>
                                                                                <RichTextEditor
                                                                                    content={item.r}
                                                                                    onChange={(val) => handleArrayChange(sec.id, "items", idx, "r", val)}
                                                                                    minHeight="100px"
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* STYLING COLUMN */}
                                            <div className="lg:col-span-4 space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleContentChange(sec.id, "isVisible", !(sec.content?.isVisible ?? true))}
                                                            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${(sec.content?.isVisible ?? true)
                                                                ? "bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20"
                                                                : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                                }`}
                                                        >
                                                            {(sec.content?.isVisible ?? true) ? "Visível" : "Escondido"}
                                                        </button>
                                                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--primary)]/10 rounded-full border border-[var(--primary)]/20">
                                                            <div className="size-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
                                                            <span className="text-[8px] font-black text-[var(--primary)] uppercase tracking-widest">Ativo</span>
                                                        </div>
                                                    </div>
                                                    <span className={`material-symbols-outlined text-muted transition-transform duration-500 ${expandedId === sec.id ? "rotate-180" : ""}`}>expand_more</span>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
                                                        <span className="material-symbols-outlined text-[var(--primary)] text-sm">palette</span>
                                                        <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Styling</h4>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Font</label>
                                                            <select className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none" value={sec.content?.fontFamily || "Manrope"} onChange={(e) => handleContentChange(sec.id, "fontFamily", e.target.value)}>
                                                                <option value="Manrope">Manrope</option>
                                                                <option value="Inter">Inter</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Color</label>
                                                            <input type="color" className="w-full h-10 rounded-xl bg-muted/5 border-border border border-none cursor-pointer" value={sec.content?.textColor || "#0d1b12"} onChange={(e) => handleContentChange(sec.id, "textColor", e.target.value)} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Tamanho do Título</label>
                                                            <select
                                                                className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                                                value={sec.content?.titleSize || "text-4xl"}
                                                                onChange={(e) => handleContentChange(sec.id, "titleSize", e.target.value)}
                                                            >
                                                                <option value="text-xl">XL (20px)</option>
                                                                <option value="text-2xl">2XL (24px)</option>
                                                                <option value="text-3xl">3XL (30px)</option>
                                                                <option value="text-4xl">4XL (36px) - Padrão</option>
                                                                <option value="text-5xl">5XL (48px)</option>
                                                                <option value="text-6xl">6XL (60px)</option>
                                                                <option value="text-7xl">7XL (72px)</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Tamanho do Subtítulo</label>
                                                            <select
                                                                className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                                                value={sec.content?.subtitleSize || "text-xl"}
                                                                onChange={(e) => handleContentChange(sec.id, "subtitleSize", e.target.value)}
                                                            >
                                                                <option value="text-sm">SM (14px)</option>
                                                                <option value="text-base">Base (16px)</option>
                                                                <option value="text-lg">LG (18px)</option>
                                                                <option value="text-xl">XL (20px) - Padrão</option>
                                                                <option value="text-2xl">2XL (24px)</option>
                                                                <option value="text-3xl">3XL (30px)</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Tamanho do Texto</label>
                                                            <select
                                                                className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                                                value={sec.content?.bodySize || "text-base"}
                                                                onChange={(e) => handleContentChange(sec.id, "bodySize", e.target.value)}
                                                            >
                                                                <option value="text-xs">XS (12px)</option>
                                                                <option value="text-sm">SM (14px)</option>
                                                                <option value="text-base">Base (16px) - Padrão</option>
                                                                <option value="text-lg">LG (18px)</option>
                                                                <option value="text-xl">XL (20px)</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* BACKGROUND SETTINGS */}
                                                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined text-[var(--primary)] text-sm">wallpaper</span>
                                                            <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Background</h4>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Imagem de Fundo</label>
                                                                <div className="flex gap-3 items-center">
                                                                    {sec.content?.bgImage ? (
                                                                        <div className="relative size-16 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 group">
                                                                            <img src={sec.content.bgImage} className="w-full h-full object-cover" />
                                                                            <button
                                                                                onClick={() => handleContentChange(sec.id, "bgImage", "")}
                                                                                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                                                                            >
                                                                                <span className="material-symbols-outlined text-sm">close</span>
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            onClick={() => {
                                                                                setMediaPickerTarget({ secId: sec.id, fieldName: "bgImage" });
                                                                                setShowMediaPicker(true);
                                                                            }}
                                                                            className="size-16 rounded-xl border-2 border-dashed border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-300 hover:text-[var(--primary)] transition-all cursor-pointer"
                                                                        >
                                                                            <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1">
                                                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Efeito Alpha</p>
                                                                        <input
                                                                            type="range"
                                                                            min="0" max="100"
                                                                            value={sec.content?.bgOpacity ?? 100}
                                                                            onChange={(e) => handleContentChange(sec.id, "bgOpacity", parseInt(e.target.value))}
                                                                            className="w-full accent-[var(--primary)]"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-2">Efeito Especial</label>
                                                                <select
                                                                    className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                                                    value={sec.content?.bgEffect || "none"}
                                                                    onChange={(e) => handleContentChange(sec.id, "bgEffect", e.target.value)}
                                                                >
                                                                    <option value="none">Nenhum</option>
                                                                    <option value="particles">Partículas Antigravity</option>
                                                                    <option value="parallax">Parallax Suave</option>
                                                                    <option value="glass">Glassmorphism Forte</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* CALL TO ACTION */}
                                                    <div className="space-y-4 border-t border-gray-100 dark:border-white/5 pt-6">
                                                        <h4 className="text-[9px] font-black text-muted uppercase tracking-widest">Call to Action</h4>
                                                        <div className="space-y-2">
                                                            <label className="text-[8px] font-black text-muted uppercase tracking-widest">Button Text</label>
                                                            <input className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none" value={sec.content?.ctaText || "Solicitar Contato"} onChange={(e) => handleContentChange(sec.id, "ctaText", e.target.value)} />
                                                        </div>

                                                        {sec.id === "contato" && (
                                                            <div className="grid grid-cols-2 gap-4 pt-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[8px] font-black text-muted uppercase tracking-widest">WhatsApp</label>
                                                                    <input
                                                                        className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                                                        value={sec.content?.whatsapp || ""}
                                                                        onChange={(e) => handleContentChange(sec.id, "whatsapp", e.target.value)}
                                                                        placeholder="(11) 99999-9999"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[8px] font-black text-muted uppercase tracking-widest">E-mail</label>
                                                                    <input
                                                                        className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-bold outline-none"
                                                                        value={sec.content?.email || ""}
                                                                        onChange={(e) => handleContentChange(sec.id, "email", e.target.value)}
                                                                        placeholder="email@empresa.com"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-12 flex justify-end">
                                                    <button
                                                        onClick={() => saveSection(sec)}
                                                        disabled={saving}
                                                        className="px-10 py-4 text-[10px] font-black bg-primary text-primary-foreground shadow-primary/20 rounded-2xl shadow-xl hover:scale-105 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
                                                    >
                                                        {saving ? "Salvando..." : "Aplicar Alterações"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    <button
                        onClick={() => {
                            toast({
                                title: "Em Breve",
                                description: "A funcionalidade de sessões customizadas estará disponível nas próximas atualizações.",
                                type: "info"
                            });
                        }}
                        className="w-full py-12 border-4 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-300 hover:text-[var(--primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 transition-all group mt-10"
                    >
                        <span className="material-symbols-outlined text-5xl group-hover:rotate-90 transition-transform duration-700">add_circle</span>
                        <span className="font-black text-xs uppercase tracking-widest opacity-60">Inserir Nova Sessão Customizada</span>
                    </button>
                </div>
            </div>

            <MediaPicker
                isOpen={showMediaPicker}
                onClose={() => {
                    setShowMediaPicker(false);
                    setMediaPickerTarget(null);
                }}
                onSelect={(url) => selectFromMediaLibrary(url)}
            />
        </div>
    );
}
