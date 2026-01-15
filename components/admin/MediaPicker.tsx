"use client";

import React, { useState, useEffect } from "react";

interface Media {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    createdAt: string;
}

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    title?: string;
    subtitle?: string;
    recommendedSize?: string;
    onUploadSuccess?: () => void;
}

export function MediaPicker({
    isOpen,
    onClose,
    onSelect,
    title = "Biblioteca de Mídia",
    subtitle = "Selecione uma imagem existente",
    recommendedSize
}: MediaPickerProps) {
    const [mediaLibrary, setMediaLibrary] = useState<Media[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchMediaLibrary();
        }
    }, [isOpen]);

    const fetchMediaLibrary = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/media");
            if (res.ok) {
                const data = await res.json();
                setMediaLibrary(data);
            }
        } catch (error) {
            console.error("Error fetching media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                fetchMediaLibrary();
            }
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

        try {
            const res = await fetch(`/api/media?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMediaLibrary(prev => prev.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const formatBytes = (bytes: number, decimals = 0) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-background rounded-[2rem] w-[95vw] max-w-[1400px] h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-card shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="bg-primary/10 p-3 rounded-2xl">
                            <span className="material-symbols-outlined text-primary text-2xl">perm_media</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                                {title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                    {subtitle}
                                </p>
                                {recommendedSize && (
                                    <span className="text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-md font-bold uppercase">
                                        Recomendado: {recommendedSize}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Mode Toggle */}
                        <div className="flex bg-muted/20 p-1 rounded-xl border border-border">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                title="Visualização em Grade"
                            >
                                <span className="material-symbols-outlined text-xl block">grid_view</span>
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                title="Visualização em Lista"
                            >
                                <span className="material-symbols-outlined text-xl block">view_list</span>
                            </button>
                        </div>

                        <div className="w-px h-8 bg-border" />

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2 active:scale-95"
                        >
                            {uploading ? (
                                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-lg">cloud_upload</span>
                            )}
                            {uploading ? "Enviando..." : "Upload de Imagem"}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="size-10 rounded-full bg-muted/20 flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all border border-transparent hover:border-destructive/20"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpload}
                />

                {/* Content */}
                <div 
                    className={`flex-1 overflow-y-auto custom-scrollbar relative ${dragActive ? "bg-primary/5" : "bg-muted/5"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {/* Upload Drop Zone Overlay */}
                    {dragActive && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-primary/10 backdrop-blur-sm pointer-events-none border-4 border-dashed border-primary m-4 rounded-[2rem]">
                            <div className="text-center text-primary">
                                <span className="material-symbols-outlined text-6xl mb-4">cloud_upload</span>
                                <p className="text-xl font-black uppercase">Solte para fazer Upload</p>
                            </div>
                        </div>
                    )}

                    <div className="p-8">
                        {loading ? (
                            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6" : "grid-cols-1"}`}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                    <div key={i} className={`bg-muted/10 rounded-2xl animate-pulse ${viewMode === "grid" ? "aspect-square" : "h-20"}`} />
                                ))}
                            </div>
                        ) : mediaLibrary.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground border-2 border-dashed border-border rounded-[2rem]">
                                <span className="material-symbols-outlined text-7xl mb-6 opacity-20">add_photo_alternate</span>
                                <h4 className="text-lg font-black uppercase tracking-tight text-foreground">Sua galeria está vazia</h4>
                                <p className="text-sm mt-2 mb-6 max-w-xs text-center">Arraste imagens para cá ou use o botão de upload para começar.</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Selecionar arquivo do computador
                                </button>
                            </div>
                        ) : (
                            viewMode === "grid" ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                    {mediaLibrary.map((media) => (
                                        <div
                                            key={media.id}
                                            onClick={() => onSelect(media.url)}
                                            className="group relative aspect-square bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 cursor-pointer transition-all hover:shadow-xl hover:shadow-primary/5"
                                        >
                                            <div className="absolute inset-0 p-2">
                                                <img
                                                    src={media.url}
                                                    className="w-full h-full object-contain rounded-xl"
                                                    alt={media.filename}
                                                    loading="lazy"
                                                />
                                            </div>
                                            
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transform scale-90 group-hover:scale-100 transition-transform shadow-lg">
                                                    Selecionar
                                                </div>
                                            </div>

                                            {/* Info Bar */}
                                            <div className="absolute bottom-0 inset-x-0 bg-background/90 backdrop-blur border-t border-border p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-[10px] font-bold text-foreground truncate">{media.filename}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[9px] text-muted-foreground uppercase">{formatBytes(media.size)}</span>
                                                    <button
                                                        onClick={(e) => handleDelete(e, media.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <span className="material-symbols-outlined text-sm">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {mediaLibrary.map((media) => (
                                        <div
                                            key={media.id}
                                            onClick={() => onSelect(media.url)}
                                            className="group flex items-center gap-4 p-3 bg-card rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-all hover:bg-primary/5"
                                        >
                                            <div className="size-16 shrink-0 bg-muted/10 rounded-lg overflow-hidden border border-border">
                                                <img
                                                    src={media.url}
                                                    className="w-full h-full object-cover"
                                                    alt={media.filename}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-foreground truncate">{media.filename}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{media.url}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-bold text-foreground">{formatBytes(media.size)}</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono uppercase">
                                                    {new Date(media.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 pl-4 border-l border-border ml-2">
                                                <button
                                                    onClick={(e) => handleDelete(e, media.id)}
                                                    className="size-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                                    title="Excluir"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                                <button
                                                    onClick={() => onSelect(media.url)}
                                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-wider hover:brightness-110"
                                                >
                                                    Usar foto
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
