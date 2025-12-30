"use client";

import React, { useState } from "react";
import { useToast } from "@/components/admin/Toast";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface SettingsFormProps {
    site: {
        id: string;
        name: string;
        domain: string | null;
        description: string | null;
        favicon: string | null;
        logo: string | null;
        logoDark: string | null;
        logoLight: string | null;
        logoAdmin: string | null;
        ogImage: string | null;
        emailTo?: string | null;
        emailBcc?: string | null;
        resendApiKey?: string | null;
        settings?: any;
    };
}

export default function SettingsForm({ site }: SettingsFormProps) {
    const [saving, setSaving] = useState(false);
    const [showMediaPicker, setShowMediaPicker] = useState(false);
    const [mediaTarget, setMediaTarget] = useState<string | null>(null);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: site.name,
        domain: site.domain || "",
        description: site.description || "",
        favicon: site.favicon || "",
        logo: site.logo || "",
        logoDark: site.logoDark || "",
        logoLight: site.logoLight || "",
        logoAdmin: site.logoAdmin || "",
        ogImage: site.ogImage || "",
        emailTo: site.emailTo || "",
        emailBcc: site.emailBcc || "",
        resendApiKey: site.resendApiKey || "",
        settings: site.settings || {},
    });

    const onSelectMedia = (url: string) => {
        if (mediaTarget) {
            setFormData(prev => ({ ...prev, [mediaTarget]: url }));
            setShowMediaPicker(false);
            setMediaTarget(null);
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
        <div className="space-y-12 max-w-screen-2xl mx-auto w-full pb-24">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-[0.2em]">
                        Configurações
                    </h1>
                    <p className="text-muted font-bold mt-2 uppercase tracking-widest text-[10px]">
                        Controle mestre das diretrizes de marca e SEO.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    aria-label="Salvar todas as configurações"
                    className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 uppercase tracking-[0.1em]"
                >
                    {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* SEO SECTION */}
                <div className="bg-card/40 backdrop-blur-md rounded-[3rem] border border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="p-8 border-b border-border flex items-center gap-5 bg-muted/5">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">SEO & Indexação</h3>
                            <p className="text-[9px] font-bold text-muted mt-1 uppercase tracking-widest">Como o site aparece nos motores de busca.</p>
                        </div>
                    </div>
                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label
                                    htmlFor="site-name"
                                    className="text-[9px] font-black text-muted uppercase tracking-widest ml-3"
                                >
                                    Nome do Site (Title Tag)
                                </label>
                                <input
                                    id="site-name"
                                    aria-label="Nome do Site"
                                    className="w-full bg-muted/5 border-border border rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none text-foreground shadow-inner placeholder:text-muted/50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label
                                    htmlFor="custom-domain"
                                    className="text-[9px] font-black text-muted uppercase tracking-widest ml-3"
                                >
                                    Domínio Customizado
                                </label>
                                <input
                                    id="custom-domain"
                                    aria-label="Domínio Customizado"
                                    className="w-full bg-muted/5 border-border border rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none text-foreground font-mono shadow-inner"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    placeholder="exemplo.com.br"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label
                                htmlFor="meta-description"
                                className="text-[9px] font-black text-muted uppercase tracking-widest ml-3"
                            >
                                Descrição Global (Meta Description)
                            </label>
                            <textarea
                                id="meta-description"
                                aria-label="Meta Description"
                                rows={4}
                                className="w-full bg-muted/5 border-border border rounded-[2rem] px-6 py-5 text-xs font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none resize-none text-muted leading-relaxed shadow-inner"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* EMAIL NOTIFICATIONS SECTION */}
                <div className="bg-card/40 backdrop-blur-md rounded-[3rem] border border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="p-8 border-b border-border flex items-center gap-5 bg-muted/5">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">mail</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Notificações por E-mail</h3>
                            <p className="text-[9px] font-bold text-muted mt-1 uppercase tracking-widest">Configuração de recebimento de leads e contatos.</p>
                        </div>
                    </div>
                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">E-mail de Destino (TO)</label>
                                <input
                                    className="w-full bg-muted/5 border-border border rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                    value={formData.emailTo}
                                    onChange={(e) => setFormData({ ...formData, emailTo: e.target.value })}
                                    placeholder="renova@renovamente-guiomarmelo.com.br"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">E-mail em Cópia Oculta (BCC)</label>
                                <input
                                    className="w-full bg-muted/5 border-border border rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                    value={formData.emailBcc}
                                    onChange={(e) => setFormData({ ...formData, emailBcc: e.target.value })}
                                    placeholder="wagnerantunes84@gmail.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 border-t border-border pt-8">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3">Resend API Key</label>
                                <a href="https://resend.com" target="_blank" className="text-[8px] font-black text-primary uppercase hover:underline">Obter API Key</a>
                            </div>
                            <input
                                type="password"
                                className="w-full bg-muted/5 border-border border rounded-[1.5rem] px-6 py-4 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                value={formData.resendApiKey}
                                onChange={(e) => setFormData({ ...formData, resendApiKey: e.target.value })}
                                placeholder="re_************************"
                            />
                            <p className="text-[8px] text-muted font-bold uppercase tracking-widest ml-3 mt-2 italic">⚠️ Necessário para o envio automático de notificações.</p>
                        </div>
                    </div>
                </div>

                {/* BRANDING SECTION */}
                <div className="bg-card/40 backdrop-blur-md rounded-[3rem] border border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
                    <div className="p-8 border-b border-border flex items-center gap-5 bg-muted/5">
                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">brush</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Identidade Visual</h3>
                            <p className="text-[9px] font-bold text-muted mt-1 uppercase tracking-widest">Logos, favicons e imagens de compartilhamento.</p>
                        </div>
                    </div>
                    <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* FAVICON */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3 block">
                                Favicon (Ícone do Navegador)
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => {
                                        setMediaTarget('favicon');
                                        setShowMediaPicker(true);
                                    }}
                                    className="size-32 mx-auto md:mx-0 bg-muted/5 border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden group/fav"
                                >
                                    {formData.favicon && formData.favicon.trim() ? (
                                        <>
                                            <img src={formData.favicon} alt="Favicon" className="size-12 object-contain group-hover/fav:scale-110 transition-transform" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, favicon: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/fav:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover favicon"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-foreground/10 text-5xl group-hover:text-primary transition-colors">circle</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[8px] text-muted text-center md:text-left">PNG, ICO ou SVG (32x32px)</p>
                        </div>

                        {/* LOGO */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3 block">
                                Logo Principal
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => {
                                        setMediaTarget('logo');
                                        setShowMediaPicker(true);
                                    }}
                                    className="h-32 mx-auto md:mx-0 bg-muted/5 border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden group/logo"
                                >
                                    {formData.logo && formData.logo.trim() ? (
                                        <>
                                            <img src={formData.logo} alt="Logo" className="max-h-20 max-w-full object-contain group-hover/logo:scale-110 transition-transform px-4" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, logo: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover logo"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-foreground/10 text-5xl group-hover:text-primary transition-colors">image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[8px] text-muted text-center md:text-left">SVG ou PNG (Header/Footer)</p>
                        </div>

                        {/* OG IMAGE */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3 block">
                                Imagem de Compartilhamento
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => {
                                        setMediaTarget('ogImage');
                                        setShowMediaPicker(true);
                                    }}
                                    className="aspect-[1.91/1] w-full bg-muted/5 border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden group/og"
                                >
                                    {formData.ogImage && formData.ogImage.trim() ? (
                                        <>
                                            <img src={formData.ogImage} alt="OG Image" className="w-full h-full object-cover rounded-[2.5rem] group-hover/og:scale-105 transition-transform" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, ogImage: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/og:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover OG image"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-foreground/10 text-5xl group-hover:text-primary transition-colors">share</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[8px] text-muted text-center md:text-left">JPG ou PNG (1200x630px)</p>
                        </div>

                        {/* LOGO DARK */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3 block">
                                Logo Dark (Fundo Escuro)
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => {
                                        setMediaTarget('logoDark');
                                        setShowMediaPicker(true);
                                    }}
                                    className="h-32 mx-auto md:mx-0 bg-muted border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden group/logodark"
                                >
                                    {formData.logoDark && formData.logoDark.trim() ? (
                                        <>
                                            <img src={formData.logoDark} alt="Logo Dark" className="max-h-20 max-w-full object-contain group-hover/logodark:scale-110 transition-transform px-4" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, logoDark: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/logodark:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover logo dark"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-muted-foreground text-5xl group-hover:text-primary transition-colors">image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[8px] text-muted text-center md:text-left">SVG ou PNG (Footer)</p>
                        </div>

                        {/* LOGO LIGHT */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3 block">
                                Logo Light (Fundo Claro)
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => {
                                        setMediaTarget('logoLight');
                                        setShowMediaPicker(true);
                                    }}
                                    className="h-32 mx-auto md:mx-0 bg-background border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden group/logolight"
                                >
                                    {formData.logoLight && formData.logoLight.trim() ? (
                                        <>
                                            <img src={formData.logoLight} alt="Logo Light" className="max-h-20 max-w-full object-contain group-hover/logolight:scale-110 transition-transform px-4" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, logoLight: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/logolight:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover logo light"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-muted/30 text-5xl group-hover:text-primary transition-colors">image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[8px] text-muted text-center md:text-left">SVG ou PNG (Header)</p>
                        </div>

                        {/* LOGO ADMIN */}
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-3 block">
                                Logo Admin (Sidebar)
                            </label>
                            <div className="relative">
                                <div
                                    onClick={() => {
                                        setMediaTarget('logoAdmin');
                                        setShowMediaPicker(true);
                                    }}
                                    className="h-32 mx-auto md:mx-0 bg-primary/20 border-2 border-dashed border-primary/20 rounded-[2.5rem] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden group/logoadmin"
                                >
                                    {formData.logoAdmin && formData.logoAdmin.trim() ? (
                                        <>
                                            <img src={formData.logoAdmin} alt="Logo Admin" className="max-h-20 max-w-full object-contain group-hover/logoadmin:scale-110 transition-transform px-4" />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData(prev => ({ ...prev, logoAdmin: "" }));
                                                }}
                                                className="absolute -top-2 -right-2 size-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover/logoadmin:opacity-100 transition-all shadow-lg hover:scale-110"
                                                title="Remover logo admin"
                                            >
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <span className="material-symbols-outlined text-primary/30 text-5xl group-hover:text-primary transition-colors">image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-[8px] text-muted text-center md:text-left">SVG ou PNG (Sidebar)</p>
                        </div>
                    </div>

                    {/* LOGO DIMENSIONS */}
                    <div className="pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest pl-2 border-l-2 border-primary">Dimensões Navbar</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-2">Largura (px)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                        value={formData.settings?.logoWidthNavbar || ""}
                                        onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, logoWidthNavbar: e.target.value } })}
                                        placeholder="Auto"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-2">Altura (px)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                        value={formData.settings?.logoHeightNavbar || ""}
                                        onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, logoHeightNavbar: e.target.value } })}
                                        placeholder="40"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-foreground uppercase tracking-widest pl-2 border-l-2 border-primary">Dimensões Rodapé</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-2">Largura (px)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                        value={formData.settings?.logoWidthFooter || ""}
                                        onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, logoWidthFooter: e.target.value } })}
                                        placeholder="Auto"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-muted uppercase tracking-widest ml-2">Altura (px)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-muted/5 border-border border rounded-xl px-4 py-3 text-xs font-black focus:ring-2 focus:ring-primary/50 transition-all outline-none text-foreground shadow-inner"
                                        value={formData.settings?.logoHeightFooter || ""}
                                        onChange={(e) => setFormData({ ...formData, settings: { ...formData.settings, logoHeightFooter: e.target.value } })}
                                        placeholder="48"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM STATUS */}
                    <div className="bg-primary/20 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-border relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="size-20 rounded-[2rem] bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(var(--primary),0.1)]">
                                <span className="material-symbols-outlined text-4xl">verified_user</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-foreground tracking-tight uppercase tracking-widest">
                                    RenovaMente Engine v2.5
                                </h4>
                                <p className="text-muted text-[10px] font-black uppercase tracking-widest mt-2">
                                    Núcleo de gestão e proteção de dados operacional.
                                </p>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <span className="px-6 py-3 bg-muted/10 border border-border rounded-2xl text-[9px] font-black text-muted uppercase tracking-widest">
                                Última Sincronização: Hoje às 09:30
                            </span>
                        </div>
                    </div>
                </div>

                <MediaPicker
                    isOpen={showMediaPicker}
                    onClose={() => {
                        setShowMediaPicker(false);
                        setMediaTarget(null);
                    }}
                    onSelect={onSelectMedia}
                    title="SelecioneAsset"
                    subtitle="Dica: Formatos SVG são melhores para logos"
                />
            </div>
        </div>
    );
}
