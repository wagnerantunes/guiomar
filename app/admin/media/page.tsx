"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";

interface MediaItem {
    id: string;
    filename: string;
    mimeType: string;
    url: string;
    size: number;
    createdAt: string;
}

export default function MediaLibraryPage() {
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [mediaFiles, setMediaFiles] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const fetchMedia = async () => {
        try {
            const response = await fetch("/api/media");
            const data = await response.json();
            setMediaFiles(data);
        } catch (error) {
            console.error("Error fetching media:", error);
            toast({ title: "Erro", description: "Falha ao carregar mídia.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSyncing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast({ title: "Sucesso", description: "Arquivo enviado com sucesso.", type: "success" });
                await fetchMedia();
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao enviar arquivo.", type: "error" });
        } finally {
            setSyncing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;

        setSyncing(true);
        try {
            const res = await fetch(`/api/media?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast({ title: "Excluído", description: "Arquivo removido permanentemente.", type: "success" });
                setSelectedItem(null);
                await fetchMedia();
            } else {
                throw new Error("Delete failed");
            }
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao excluir arquivo.", type: "error" });
        } finally {
            setSyncing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const filteredFiles = filter === "all"
        ? mediaFiles
        : mediaFiles.filter(f => f.mimeType.includes(filter));

    return (
        <div className="flex flex-col h-full bg-[#09090b]">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUpload}
                accept="image/*,video/*,application/pdf"
            />

            {/* HEADER */}
            <div className="px-6 py-6 md:px-10 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl z-20 shrink-0 sticky top-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Biblioteca de Mídia</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                            Gerencie ativos visuais e documentos do sistema.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            disabled={syncing}
                            aria-label="Fazer upload de novo arquivo"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-[#0d1b12] bg-[#13ec5b] rounded-xl hover:scale-105 shadow-xl shadow-[#13ec5b]/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {syncing ? (
                                <span className="size-4 border-2 border-[#0d1b12]/30 border-t-[#0d1b12] rounded-full animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                            )}
                            {syncing ? "Enviando..." : "Upload de Arquivo"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* MAIN CONTENT */}
                <div className={`${selectedItem && 'hidden lg:flex'} flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar`}>

                    {/* TOOLBAR */}
                    <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 shadow-sm">
                            {["all", "image", "video", "pdf"].map((f) => (
                                <button
                                    key={f}
                                    aria-label={`Filtrar por: ${f}`}
                                    aria-pressed={filter === f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f
                                        ? "bg-[#13ec5b] text-[#0d1b12] shadow-lg shadow-[#13ec5b]/10"
                                        : "text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5"
                                        }`}
                                >
                                    {f === "all" ? "Tudo" : f === "image" ? "Imagens" : f === "video" ? "Vídeos" : "Docs"}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 flex-1 max-w-md">
                            <div className="relative flex-1 group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#13ec5b] transition-colors">search</span>
                                <input
                                    type="text"
                                    aria-label="Procurar arquivos"
                                    placeholder="Procurar na biblioteca..."
                                    className="w-full bg-[#09090b]/50 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 outline-none shadow-sm transition-all focus:bg-[#09090b] text-white placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* GRID */}
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center p-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="size-12 border-4 border-white/5 border-t-[#13ec5b] rounded-full animate-spin"></div>
                                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Acessando storage...</p>
                            </div>
                        </div>
                    ) : mediaFiles.length === 0 ? (
                        <div className="bg-[#09090b]/50 p-20 rounded-[3.5rem] border border-white/5 text-center space-y-6 shadow-sm mt-10 max-w-2xl mx-auto w-full">
                            <div className="size-24 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-5xl text-white/10">photo_library</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-white font-black uppercase tracking-widest text-xs">Vazio por aqui</p>
                                <p className="text-gray-400 font-medium text-xs">Inicie o upload de imagens para usar em seus posts.</p>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-3 bg-[#13ec5b] text-[#0d1b12] font-black text-[10px] rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#13ec5b]/10 uppercase tracking-widest active:scale-95"
                            >
                                Fazer Primeiro Upload
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.id}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={`Selecionar arquivo: ${file.filename}`}
                                    onClick={() => setSelectedItem(file)}
                                    onKeyDown={(e) => e.key === 'Enter' && setSelectedItem(file)}
                                    className={`group relative bg-[#09090b]/40 backdrop-blur-sm rounded-[2.5rem] border transition-all cursor-pointer overflow-hidden outline-none ${selectedItem?.id === file.id
                                        ? "ring-2 ring-[#13ec5b]/30 border-[#13ec5b]"
                                        : "border-white/5 hover:border-[#13ec5b]/50 hover:shadow-2xl hover:shadow-[#13ec5b]/5 focus-visible:ring-2 focus-visible:ring-[#13ec5b]/20"
                                        }`}
                                >
                                    <div className="aspect-square bg-white/5 flex items-center justify-center overflow-hidden">
                                        {file.mimeType.startsWith("image/") ? (
                                            <img src={file.url} alt={file.filename} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center text-[#13ec5b]">
                                                <span className="material-symbols-outlined text-5xl transition-transform group-hover:scale-110 duration-500">
                                                    {file.mimeType.includes("pdf") ? "picture_as_pdf" : "description"}
                                                </span>
                                                <span className="text-[9px] font-black mt-3 uppercase tracking-widest opacity-50">
                                                    {file.mimeType.split("/")[1]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 bg-[#09090b]/80 backdrop-blur-md border-t border-white/5">
                                        <p className="text-[10px] font-black text-white truncate" title={file.filename}>
                                            {file.filename}
                                        </p>
                                        <p className="text-[8px] text-gray-400 mt-1 uppercase font-black tracking-widest flex items-center justify-between">
                                            <span>{formatSize(file.size)}</span>
                                            <span className="text-[#13ec5b] opacity-0 group-hover:opacity-100 transition-opacity">Detalhes →</span>
                                        </p>
                                    </div>

                                    {/* QUICK ACTIONS OVERLAY */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <button
                                            aria-label="Copiar link"
                                            className="size-9 bg-[#0d1b12] flex items-center justify-center text-white rounded-xl shadow-xl hover:text-[#13ec5b] transition-all active:scale-90 border border-white/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(file.url);
                                                toast({ title: "Copiado", description: "URL da imagem copiada.", type: "success" });
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                        <button
                                            aria-label="Excluir arquivo"
                                            className="size-9 bg-[#0d1b12] flex items-center justify-center text-red-500 rounded-xl shadow-xl hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-90 border border-white/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(file.id);
                                            }}
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DETAILS SIDEBAR */}
                {selectedItem && (
                    <div className={`${!selectedItem && 'hidden lg:flex'} w-full lg:w-[400px] border-l border-white/5 bg-[#09090b]/80 flex flex-col shrink-0 animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar shadow-2xl z-30 backdrop-blur-xl`}>
                        <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#09090b]/95 backdrop-blur-xl z-10">
                            <div className="flex items-center gap-4">
                                <button
                                    aria-label="Voltar para a biblioteca"
                                    onClick={() => setSelectedItem(null)}
                                    className="lg:hidden size-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-500 hover:text-[#13ec5b] transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <div>
                                    <h3 className="font-black text-xs text-white uppercase tracking-widest">Ativo de Mídia</h3>
                                    <p className="text-[9px] font-black text-[#13ec5b] uppercase tracking-widest mt-1">Metadados e Ações</p>
                                </div>
                            </div>
                            <button
                                aria-label="Fechar detalhes"
                                onClick={() => setSelectedItem(null)}
                                className="hidden lg:flex size-10 items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <div className="p-10 space-y-10 pb-20">
                            <div className="aspect-square bg-white/5 rounded-[3rem] overflow-hidden border border-white/5 flex items-center justify-center shadow-inner group/preview">
                                {selectedItem.mimeType.startsWith("image/") ? (
                                    <img src={selectedItem.url} alt={selectedItem.filename} className="w-full h-full object-contain p-6 transform group-hover/preview:scale-105 transition-transform duration-700" />
                                ) : (
                                    <span className="material-symbols-outlined text-8xl text-white/5">
                                        {selectedItem.mimeType.includes("pdf") ? "picture_as_pdf" : "description"}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Nome do Arquivo</label>
                                    <p className="text-sm font-black text-white break-all leading-tight">{selectedItem.filename}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Formato</label>
                                        <p className="text-xs font-black uppercase text-[#13ec5b]">{selectedItem.mimeType.split("/")[1]}</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Tamanho</label>
                                        <p className="text-xs font-black text-white">{formatSize(selectedItem.size)}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Data de Upload</label>
                                    <p className="text-xs font-black text-gray-400">
                                        {new Date(selectedItem.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1 ml-1">URL Pública</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        aria-label="URL Pública do arquivo"
                                        value={selectedItem.url}
                                        className="flex-1 text-[10px] bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-500 font-mono focus:ring-2 focus:ring-[#13ec5b]/30 outline-none"
                                    />
                                    <button
                                        aria-label="Copiar link do arquivo"
                                        onClick={() => {
                                            navigator.clipboard.writeText(selectedItem.url);
                                            toast({ title: "Copiado", description: "URL copiada.", type: "success" });
                                        }}
                                        className="bg-[#13ec5b] text-[#0d1b12] px-6 rounded-xl hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-md shadow-[#13ec5b]/20"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 grid grid-cols-2 gap-6">
                                <a
                                    aria-label="Baixar arquivo"
                                    href={selectedItem.url}
                                    download
                                    className="flex items-center justify-center py-5 text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-[1.5rem] bg-transparent shadow-sm hover:bg-white/5 transition-all active:scale-95 text-white"
                                >
                                    Download
                                </a>
                                <button
                                    onClick={() => handleDelete(selectedItem.id)}
                                    aria-label="Excluir arquivo permanentemente"
                                    className="py-5 text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 rounded-[1.5rem] hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-500/5 hover:shadow-red-500/20"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
