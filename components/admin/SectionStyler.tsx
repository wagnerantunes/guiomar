"use client";

import React from "react";

interface SectionStylerProps {
    content: any;
    onChange: (field: string, value: any) => void;
    onMediaClick: (field: string) => void; // For triggering media picker
}

export function SectionStyler({ content, onChange, onMediaClick }: SectionStylerProps) {
    // Helper to safely get nested values or defaults
    const getValue = (field: string, defaultValue: any) => content?.[field] ?? defaultValue;

    return (
        <div className="space-y-8 pt-8 border-t border-border mt-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-sm">tune</span>
                <h4 className="text-[10px] font-black text-muted uppercase tracking-widest">Personalização Avançada</h4>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUNA 1: CORES E TEXTO */}
                <div className="space-y-6">
                    <h5 className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest border-b border-border pb-2">Cores & Tipografia</h5>

                    {/* PALETA DE CORES */}
                    <div className="space-y-3">
                        <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Paleta da Seção</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 bg-muted/5 p-2 rounded-xl border border-border">
                                <input type="color" value={getValue("bgColor", "#ffffff")} onChange={(e) => onChange("bgColor", e.target.value)} className="size-8 rounded-lg cursor-pointer bg-transparent" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-muted">Fundo</span>
                                    <button onClick={() => onChange("bgColor", "")} className="text-[8px] text-primary hover:underline text-left">Auto</button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-muted/5 p-2 rounded-xl border border-border">
                                <input type="color" value={getValue("primaryColor", "#0F758D")} onChange={(e) => onChange("primaryColor", e.target.value)} className="size-8 rounded-lg cursor-pointer bg-transparent" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-muted">Destaque</span>
                                    <button onClick={() => onChange("primaryColor", "")} className="text-[8px] text-primary hover:underline text-left">Auto</button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2">
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-muted ml-1">Título</span>
                                <div className="flex items-center gap-1 bg-muted/5 p-1.5 rounded-lg border border-border">
                                    <input type="color" value={getValue("titleColor", "#000000")} onChange={(e) => onChange("titleColor", e.target.value)} className="size-6 rounded cursor-pointer bg-transparent" />
                                    <button onClick={() => onChange("titleColor", "")} className="text-[8px] text-muted hover:text-red-500 material-symbols-outlined text-sm">restart_alt</button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-muted ml-1">Subtítulo</span>
                                <div className="flex items-center gap-1 bg-muted/5 p-1.5 rounded-lg border border-border">
                                    <input type="color" value={getValue("subtitleColor", "#4b5563")} onChange={(e) => onChange("subtitleColor", e.target.value)} className="size-6 rounded cursor-pointer bg-transparent" />
                                    <button onClick={() => onChange("subtitleColor", "")} className="text-[8px] text-muted hover:text-red-500 material-symbols-outlined text-sm">restart_alt</button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] font-bold text-muted ml-1">Texto</span>
                                <div className="flex items-center gap-1 bg-muted/5 p-1.5 rounded-lg border border-border">
                                    <input type="color" value={getValue("bodyColor", "#6b7280")} onChange={(e) => onChange("bodyColor", e.target.value)} className="size-6 rounded cursor-pointer bg-transparent" />
                                    <button onClick={() => onChange("bodyColor", "")} className="text-[8px] text-muted hover:text-red-500 material-symbols-outlined text-sm">restart_alt</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FONTE E TAMANHO */}
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[9px] font-black text-muted uppercase tracking-widest ml-1">Escala da Fonte ({getValue("fontScale", 1)}x)</label>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={getValue("fontScale", 1)}
                            onChange={(e) => onChange("fontScale", parseFloat(e.target.value))}
                            className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>

                {/* COLUNA 2: FUNDO E ESPAÇAMENTO */}
                <div className="space-y-6">
                    <h5 className="text-[9px] font-black text-[var(--primary)] uppercase tracking-widest border-b border-border pb-2">Background & Layout</h5>

                    {/* IMAGEM E EFEITO */}
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div
                                onClick={() => onMediaClick("bgImage")}
                                className="size-20 shrink-0 rounded-xl border-2 border-dashed border-gray-100 dark:border-white/10 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary/50 transition-colors bg-muted/5 overflow-hidden relative group"
                            >
                                {getValue("bgImage", "") ? (
                                    <>
                                        <img src={getValue("bgImage", "")} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-white text-sm">edit</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-muted text-xl">image</span>
                                        <span className="text-[7px] font-black uppercase text-muted">Img Fundo</span>
                                    </>
                                )}
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-muted">Efeito Visual</label>
                                    <select
                                        value={getValue("bgEffect", "")}
                                        onChange={(e) => onChange("bgEffect", e.target.value)}
                                        className="w-full bg-muted/5 border-border border rounded-lg px-3 py-2 text-xs font-bold outline-none"
                                    >
                                        <option value="">Nenhum</option>
                                        <option value="particles">✨ Partículas</option>
                                        <option value="aurora">🌌 Aurora Boreal</option>
                                        <option value="grid">🕸️ Grid Tech</option>
                                        <option value="parallax">🏔️ Parallax</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-muted flex justify-between"><span>Opacidade</span> <span>{getValue("bgOpacity", 100)}%</span></label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={getValue("bgOpacity", 100)}
                                        onChange={(e) => onChange("bgOpacity", parseInt(e.target.value))}
                                        className="w-full h-1 bg-muted rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ESPAÇAMENTO & LAYOUT */}
                    <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[8px] font-bold text-muted">Padding Top</label>
                                <input type="number" value={getValue("paddingTop", 128)} onChange={(e) => onChange("paddingTop", parseInt(e.target.value))} className="w-full bg-muted/5 border-border border rounded-lg px-3 py-2 text-xs font-bold outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-bold text-muted">Padding Bottom</label>
                                <input type="number" value={getValue("paddingBottom", 128)} onChange={(e) => onChange("paddingBottom", parseInt(e.target.value))} className="w-full bg-muted/5 border-border border rounded-lg px-3 py-2 text-xs font-bold outline-none" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2 border-t border-border/50 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={getValue("fullWidth", false)} onChange={(e) => onChange("fullWidth", e.target.checked)} className="rounded border-border bg-muted/5 text-primary focus:ring-primary/20 accent-primary size-4" />
                                <span className="text-[9px] font-black uppercase text-muted group-hover:text-primary transition-colors">Full Width</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={getValue("fullHeight", false)} onChange={(e) => onChange("fullHeight", e.target.checked)} className="rounded border-border bg-muted/5 text-primary focus:ring-primary/20 accent-primary size-4" />
                                <span className="text-[9px] font-black uppercase text-muted group-hover:text-primary transition-colors">Full Height</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
