"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/admin/Toast";

interface IntegrationConfig {
    gtmId: string;
    gaId: string;
    fbPixelId: string;
    tiktokPixelId: string;
    customHead: string;
    customBodyStart: string;
    customBodyEnd: string;
}

export default function IntegrationsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();
    const [config, setConfig] = useState<IntegrationConfig>({
        gtmId: "",
        gaId: "",
        fbPixelId: "",
        tiktokPixelId: "",
        customHead: "",
        customBodyStart: "",
        customBodyEnd: "",
    });

    useEffect(() => {
        async function fetchConfig() {
            try {
                const response = await fetch("/api/settings");
                const settings = await response.json();
                const found = settings.find((s: any) => s.key === "integrations_config");
                if (found) {
                    const parsed = JSON.parse(found.value);
                    setConfig(prev => ({ ...prev, ...parsed }));
                }
            } catch (error) {
                console.error("Error fetching integrations configuration:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "integrations_config",
                    value: JSON.stringify(config),
                }),
            });
            if (response.ok) {
                toast({
                    title: "Integrações Publicadas",
                    description: "Os scripts de rastreamento foram atualizados com sucesso.",
                    type: "success"
                });
            } else {
                toast({ title: "Erro ao Salvar", description: "Verifique o servidor e tente novamente.", type: "error" });
            }
        } catch (error) {
            console.error("Error saving integrations configuration:", error);
            toast({ title: "Falha na Rede", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-20">
                <div className="text-center space-y-6">
                    <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto shadow-[0_0_30px_rgba(var(--primary),0.2)]"></div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em] animate-pulse">Carregando integrações...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-full pb-20">
            {/* HEADER */}
            <div className="px-6 py-10 md:px-12 border-b border-border sticky top-0 bg-background/80 backdrop-blur-2xl z-20 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-[0.2em]">Marketing & Tracking</h1>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-[0.2em] mt-2">
                            Conecte Pixel, Analytics e scripts customizados de rastreamento.
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? "Publicando..." : "Publicar Scripts"}
                    </button>
                </div>
            </div>

            <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-12">

                {/* POPULAR TOOLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-foreground">Google Suite</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1 mb-2 block">ID do Google Ads ou Analytics (AW-XXX ou G-XXX)</label>
                                <input
                                    className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={config.gaId}
                                    onChange={(e) => setConfig({ ...config, gaId: e.target.value })}
                                    placeholder="AW-11061964223 ou G-XXXXX"
                                />
                            </div>
                            <div className="group">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1 mb-2 block">ID do Google Tag Manager (GTM-XXXX)</label>
                                <input
                                    className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={config.gtmId}
                                    onChange={(e) => setConfig({ ...config, gtmId: e.target.value })}
                                    placeholder="GTM-XXXXXXX"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="size-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <span className="material-symbols-outlined">ads_click</span>
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-foreground">Social Pixels</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1 mb-2 block">Meta Pixel ID (Facebook)</label>
                                <input
                                    className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={config.fbPixelId}
                                    onChange={(e) => setConfig({ ...config, fbPixelId: e.target.value })}
                                    placeholder="8472947293..."
                                />
                            </div>
                            <div className="group">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1 mb-2 block">TikTok Pixel ID</label>
                                <input
                                    className="w-full bg-background border border-border rounded-xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    value={config.tiktokPixelId}
                                    onChange={(e) => setConfig({ ...config, tiktokPixelId: e.target.value })}
                                    placeholder="C7F8G9H0..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CUSTOM SCRIPTS */}
                <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] border border-border overflow-hidden">
                    <div className="p-10 border-b border-border bg-muted/5">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">code</span>
                            </div>
                            <div>
                                <h3 className="font-black text-lg uppercase tracking-tight text-foreground">Scripts Customizados</h3>
                                <p className="text-[10px] text-muted font-bold uppercase tracking-widest text-amber-500">Atenção: Insira apenas o CONTEÚDO (código js) sem as tags &lt;script&gt;</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">Antes do fechamento do &lt;/head&gt;</label>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-widest">Recomendado para Analytics</span>
                            </div>
                            <textarea
                                className="w-full bg-muted/10 border border-border rounded-[1.5rem] p-6 text-[11px] font-mono focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[150px] resize-y"
                                value={config.customHead}
                                onChange={(e) => setConfig({ ...config, customHead: e.target.value })}
                                placeholder="<!-- Google Tag Manager --> ..."
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">Após abertura do &lt;body&gt;</label>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-widest">Recomendado para GTM No-Script</span>
                            </div>
                            <textarea
                                className="w-full bg-muted/10 border border-border rounded-[1.5rem] p-6 text-[11px] font-mono focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[150px] resize-y"
                                value={config.customBodyStart}
                                onChange={(e) => setConfig({ ...config, customBodyStart: e.target.value })}
                                placeholder="<noscript> ... </noscript>"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[9px] font-black text-muted uppercase tracking-[0.2em] ml-1">Antes do fechamento do &lt;/body&gt;</label>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 uppercase tracking-widest">Recomendado para Chatbots</span>
                            </div>
                            <textarea
                                className="w-full bg-muted/10 border border-border rounded-[1.5rem] p-6 text-[11px] font-mono focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[150px] resize-y"
                                value={config.customBodyEnd}
                                onChange={(e) => setConfig({ ...config, customBodyEnd: e.target.value })}
                                placeholder="<script ...> (Chat widgets, etc) </script>"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-primary/5 rounded-[2rem] border border-primary/20 p-8 flex items-start gap-6">
                    <span className="material-symbols-outlined text-primary text-3xl">info_outline</span>
                    <div className="space-y-2">
                        <p className="text-xs font-black text-primary uppercase tracking-widest">Importante</p>
                        <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                            Cuidado ao colar scripts de fontes desconhecidas. Códigos mal formados podem quebrar o funcionamento do seu site ou afetar o desempenho. Sempre publique as alterações e verifique a interface pública.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
