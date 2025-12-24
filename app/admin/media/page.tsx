"use client";

import React, { useState, useEffect } from "react";
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
    const { toast } = useToast();

    useEffect(() => {
        async function fetchMedia() {
            try {
                const response = await fetch("/api/media");
                const data = await response.json();
                setMediaFiles(data);
            } catch (error) {
                console.error("Error fetching media:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMedia();
    }, []);

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
        <div className="flex flex-col h-full bg-[#f6f8f6] dark:bg-[#102216]">
            {/* HEADER */}
            <div className="px-6 py-6 md:px-10 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#102216]/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-[#0d1b12] dark:text-white tracking-tight">Media Library</h1>
                        <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
                            Gerencie imagens e documentos do seu site.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-[#0d1b12] bg-[#13ec5b] rounded-xl hover:bg-[#13ec5b]/90 shadow-lg shadow-[#13ec5b]/20 transition-all hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
                            Upload File
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* MAIN CONTENT */}
                <div className={`${selectedItem && 'hidden lg:flex'} flex-1 flex flex-col p-6 md:p-8 overflow-y-auto custom-scrollbar`}>

                    {/* TOOLBAR */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-2 p-1 bg-white dark:bg-[#183221] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                            {["all", "image", "video", "pdf"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === f
                                        ? "bg-[#13ec5b] text-[#0d1b12] shadow-sm"
                                        : "text-gray-400 hover:text-[#13ec5b]"
                                        }`}
                                >
                                    {f === "all" ? "Tudo" : f === "image" ? "Imagens" : f === "video" ? "Vídeos" : "Docs"}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 flex-1 max-w-md">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                                <input
                                    type="text"
                                    placeholder="Procurar arquivos..."
                                    className="w-full bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* GRID */}
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center p-20 text-gray-400 font-bold uppercase tracking-widest text-xs">
                            Carregando arquivos...
                        </div>
                    ) : mediaFiles.length === 0 ? (
                        <div className="bg-white dark:bg-[#183221] p-20 rounded-[3rem] border border-gray-100 dark:border-white/5 text-center space-y-4 shadow-sm mt-10">
                            <span className="material-symbols-outlined text-6xl text-gray-200">photo_library</span>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sua biblioteca está vazia</p>
                            <button className="text-[#13ec5b] font-black text-xs hover:underline uppercase tracking-widest">
                                Fazer meu primeiro upload
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {filteredFiles.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedItem(file)}
                                    className={`group relative bg-white dark:bg-[#183221] rounded-[2rem] border transition-all cursor-pointer overflow-hidden ${selectedItem?.id === file.id
                                        ? "ring-4 ring-[#13ec5b]/30 border-[#13ec5b]"
                                        : "border-gray-100 dark:border-white/5 hover:border-[#13ec5b]/50 hover:shadow-2xl"
                                        }`}
                                >
                                    <div className="aspect-square bg-gray-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                                        {file.mimeType.startsWith("image/") ? (
                                            <img src={file.url} alt={file.filename} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex flex-col items-center text-[#13ec5b]">
                                                <span className="material-symbols-outlined text-5xl">
                                                    {file.mimeType.includes("pdf") ? "picture_as_pdf" : "description"}
                                                </span>
                                                <span className="text-[10px] font-black mt-2 uppercase tracking-widest opacity-50">
                                                    {file.mimeType.split("/")[1]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white dark:bg-[#183221] border-t border-gray-50 dark:border-white/5">
                                        <p className="text-[11px] font-black text-[#0d1b12] dark:text-white truncate" title={file.filename}>
                                            {file.filename}
                                        </p>
                                        <p className="text-[9px] text-gray-400 mt-1 uppercase font-black tracking-widest">
                                            {formatSize(file.size)}
                                        </p>
                                    </div>

                                    {/* QUICK ACTIONS OVERLAY */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <button className="size-8 bg-white/90 dark:bg-[#0d1b12]/90 backdrop-blur flex items-center justify-center text-[#0d1b12] dark:text-white rounded-lg shadow-lg hover:text-[#13ec5b] transition-colors">
                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                        </button>
                                        <button className="size-8 bg-white/90 dark:bg-[#0d1b12]/90 backdrop-blur flex items-center justify-center text-red-500 rounded-lg shadow-lg hover:bg-red-500 hover:text-white transition-all">
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
                    <div className={`${!selectedItem && 'hidden lg:flex'} w-full lg:w-96 border-l border-gray-200 dark:border-white/10 bg-white dark:bg-[#183221] flex flex-col shrink-0 animate-in slide-in-from-right duration-300 overflow-y-auto custom-scrollbar shadow-2xl`}>
                        <div className="p-6 md:p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <h3 className="font-black text-xs text-[#0d1b12] dark:text-white uppercase tracking-widest">Detalhes do Arquivo</h3>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="hidden lg:flex size-8 items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="aspect-square bg-gray-50 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 flex items-center justify-center shadow-inner">
                                {selectedItem.mimeType.startsWith("image/") ? (
                                    <img src={selectedItem.url} alt={selectedItem.filename} className="w-full h-full object-contain p-4" />
                                ) : (
                                    <span className="material-symbols-outlined text-7xl text-gray-200">
                                        {selectedItem.mimeType.includes("pdf") ? "picture_as_pdf" : "description"}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">File Name</label>
                                    <p className="text-sm font-black mt-2 text-[#0d1b12] dark:text-white break-all bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">{selectedItem.filename}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Format</label>
                                        <p className="text-xs font-black mt-1 uppercase text-[#13ec5b]">{selectedItem.mimeType.split("/")[1]}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Size</label>
                                        <p className="text-xs font-black mt-1 text-[#0d1b12] dark:text-white">{formatSize(selectedItem.size)}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Upload Date</label>
                                    <p className="text-xs font-black mt-1 text-gray-600 dark:text-gray-400">
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

                            <div className="pt-6 space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">Public URL</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        value={selectedItem.url}
                                        className="flex-1 text-[10px] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-gray-500 font-mono focus:ring-1 focus:ring-[#13ec5b]"
                                    />
                                    <button className="bg-[#0d1b12] dark:bg-white text-white dark:text-[#0d1b12] px-6 rounded-xl hover:scale-102 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95">
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="pt-8 grid grid-cols-2 gap-4">
                                <a
                                    href={selectedItem.url}
                                    download
                                    className="flex items-center justify-center py-4 text-[10px] font-black uppercase tracking-widest border border-gray-200 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
                                >
                                    Download
                                </a>
                                <button className="py-4 text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-500 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm">
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
