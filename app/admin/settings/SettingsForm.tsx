"use client";

import React, { useState } from "react";
import { useToast } from "@/components/admin/Toast";

interface SettingsFormProps {
    site: {
        id: string;
        name: string;
        domain: string | null;
        description: string | null;
        favicon: string | null;
        logo: string | null;
        ogImage: string | null;
    };
}

export default function SettingsForm({ site }: SettingsFormProps) {
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: site.name,
        domain: site.domain || "",
        description: site.description || "",
        favicon: site.favicon || "",
        logo: site.logo || "",
        ogImage: site.ogImage || "",
    });

    const handleImageUpload = async (file: File, field: 'favicon' | 'logo' | 'ogImage') => {
        setUploading(field);
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                body: formDataUpload,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData(prev => ({ ...prev, [field]: data.url }));
                toast({
                    title: "Upload Concluído",
                    description: `${field === 'favicon' ? 'Favicon' : field === 'logo' ? 'Logo' : 'OG Image'} atualizado com sucesso.`,
                    type: "success"
                });
            } else {
                toast({
                    title: "Erro no Upload",
                    description: "Não foi possível processar a imagem.",
                    type: "error"
                });
            }
        } catch (error) {
            toast({
                title: "Erro de Conexão",
                description: "Falha ao enviar imagem para o servidor.",
                type: "error"
            });
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // This would call an API like /api/site/update
            // For now, let's simulate or use the settings API if applicable
            // Since Site is a single record, we might need a specific route
            const res = await fetch("/api/settings/site", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast({
                    title: "Configurações Salvas",
                    description: "As diretrizes globais foram atualizadas com sucesso.",
                    type: "success",
                });
            } else {
                toast({ title: "Erro ao Salvar", description: "Ocorreu um problema ao comunicar com o servidor.", type: "error" });
            }
        } catch (error) {
            toast({ title: "Falha na Rede", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto w-full pb-24">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gray-100 dark:border-white/5 pb-10">
                <div>
                    <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white uppercase tracking-[0.2em]">
                        Configurações
                    </h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">
                        Controle mestre das diretrizes de marca e SEO.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    aria-label="Salvar todas as configurações"
                    className="px-10 py-4 bg-[#13ec5b] text-[#0d1b12] rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-[#13ec5b]/20 active:scale-95 disabled:opacity-50 uppercase tracking-[0.1em]"
                >
                    {saving ? "Processando..." : "Salvar Alterações"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* SEO SECTION */}
                <div className="bg-white dark:bg-[#183221]/40 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden group hover:border-[#13ec5b]/30 transition-all">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center gap-5 bg-gray-50/30 dark:bg-white/5">
                        <div className="size-12 rounded-2xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">SEO & Indexação</h3>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Como o site aparece nos motores de busca.</p>
                        </div>
                    </div>
                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label
                                    htmlFor="site-name"
                                    className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3"
                                >
                                    Nome do Site (Title Tag)
                                </label>
                                <input
                                    id="site-name"
                                    aria-label="Nome do Site"
                                    className="w-full bg-gray-50/50 dark:bg-white/5 border-transparent rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/10 focus:bg-white dark:focus:bg-[#102216] transition-all outline-none text-[#0d1b12] dark:text-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label
                                    htmlFor="custom-domain"
                                    className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3"
                                >
                                    Domínio Customizado
                                </label>
                                <input
                                    id="custom-domain"
                                    aria-label="Domínio Customizado"
                                    className="w-full bg-gray-50/50 dark:bg-white/5 border-transparent rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-4 focus:ring-[#13ec5b]/10 focus:bg-white dark:focus:bg-[#102216] transition-all outline-none text-[#0d1b12] dark:text-white font-mono"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    placeholder="exemplo.com.br"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label
                                htmlFor="meta-description"
                                className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3"
                            >
                                Descrição Global (Meta Description)
                            </label>
                            <textarea
                                id="meta-description"
                                aria-label="Meta Description"
                                rows={4}
                                className="w-full bg-gray-50/50 dark:bg-white/5 border-transparent rounded-[2rem] px-6 py-5 text-xs font-medium focus:ring-4 focus:ring-[#13ec5b]/10 focus:bg-white dark:focus:bg-[#102216] transition-all outline-none resize-none text-gray-600 dark:text-gray-300 leading-relaxed"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* BRANDING SECTION */}
                <div className="bg-white dark:bg-[#183221]/40 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden group hover:border-[#13ec5b]/30 transition-all">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center gap-5 bg-gray-50/30 dark:bg-white/5">
                        <div className="size-12 rounded-2xl bg-[#13ec5b]/10 text-[#13ec5b] flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">brush</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#0d1b12] dark:text-white uppercase tracking-widest">Identidade Visual</h3>
                            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Logos, favicons e imagens de compartilhamento.</p>
                        </div>
                    </div>
                    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* FAVICON */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3 block">
                                Favicon (Ícone do Navegador)
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => document.getElementById('favicon-upload')?.click()}
                                    className="size-32 mx-auto md:mx-0 bg-gray-50/50 dark:bg-white/5 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-[#13ec5b]/50 transition-all group relative overflow-hidden group/fav"
                                >
                                    {formData.favicon ? (
                                        <>
                                            <img src={formData.favicon} alt="Favicon" className="size-12 object-contain group-hover/fav:scale-110 transition-transform" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, favicon: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/fav:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover favicon"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-gray-200 dark:text-white/10 text-5xl group-hover:text-[#13ec5b] transition-colors">circle</span>
                                            {uploading === 'favicon' && <p className="text-[8px] text-[#13ec5b] mt-2 font-bold">Uploading...</p>}
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="favicon-upload"
                                    type="file"
                                    accept="image/png,image/x-icon,image/svg+xml"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file, 'favicon');
                                        e.target.value = '';
                                    }}
                                />
                            </div>
                            <p className="text-[8px] text-gray-400 text-center md:text-left">PNG, ICO ou SVG (32x32px)</p>
                        </div>

                        {/* LOGO */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3 block">
                                Logo Principal
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                    className="h-32 mx-auto md:mx-0 bg-gray-50/50 dark:bg-white/5 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-[#13ec5b]/50 transition-all group relative overflow-hidden group/logo"
                                >
                                    {formData.logo ? (
                                        <>
                                            <img src={formData.logo} alt="Logo" className="max-h-20 max-w-full object-contain group-hover/logo:scale-110 transition-transform px-4" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, logo: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover logo"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-gray-200 dark:text-white/10 text-5xl group-hover:text-[#13ec5b] transition-colors">image</span>
                                            {uploading === 'logo' && <p className="text-[8px] text-[#13ec5b] mt-2 font-bold">Uploading...</p>}
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/png,image/svg+xml,image/jpeg"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file, 'logo');
                                        e.target.value = '';
                                    }}
                                />
                            </div>
                            <p className="text-[8px] text-gray-400 text-center md:text-left">SVG ou PNG (Header/Footer)</p>
                        </div>

                        {/* OG IMAGE */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-3 block">
                                Imagem de Compartilhamento
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => document.getElementById('og-upload')?.click()}
                                    className="aspect-[1.91/1] w-full bg-gray-50/50 dark:bg-white/5 border-2 border-dashed border-gray-100 dark:border-white/10 rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-[#13ec5b]/50 transition-all group relative overflow-hidden group/og"
                                >
                                    {formData.ogImage ? (
                                        <>
                                            <img src={formData.ogImage} alt="OG Image" className="w-full h-full object-cover rounded-[2.5rem] group-hover/og:scale-105 transition-transform" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, ogImage: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/og:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover OG image"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-gray-200 dark:text-white/10 text-5xl group-hover:text-[#13ec5b] transition-colors">share</span>
                                            {uploading === 'ogImage' && <p className="text-[8px] text-[#13ec5b] mt-2 font-bold">Uploading...</p>}
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="og-upload"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(file, 'ogImage');
                                        e.target.value = '';
                                    }}
                                />
                            </div>
                            <p className="text-[8px] text-gray-400 text-center md:text-left">JPG ou PNG (1200x630px)</p>
                        </div>
                    </div>
                </div>

                {/* SYSTEM STATUS */}
                <div className="bg-[#0d1b12] rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#13ec5b]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="size-20 rounded-[2rem] bg-[#13ec5b]/20 flex items-center justify-center text-[#13ec5b] shadow-[0_0_40px_rgba(19,236,91,0.1)]">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest">
                                RenovaMente Engine v2.5
                            </h4>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
                                Núcleo de gestão e proteção de dados operacional.
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            Última Sincronização: Hoje às 09:30
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
