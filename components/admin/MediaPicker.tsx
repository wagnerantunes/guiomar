"use client";

import React, { useState, useEffect } from "react";

interface Media {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
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

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-card rounded-[2.5rem] max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                            {title}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                            {subtitle}
                        </p>
                        {recommendedSize && (
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
                                <span className="material-symbols-outlined text-xs">photo_size_select_large</span>
                                <span className="text-[9px] font-black uppercase tracking-wider">
                                    Recomendado: {recommendedSize}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {uploading ? (
                                <div className="size-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            )}
                            {uploading ? "Subindo..." : "Upload"}
                        </button>
                        <div className="w-px h-10 bg-gray-100 dark:bg-white/5 mx-2" />
                        <button
                            onClick={onClose}
                            className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all group border border-transparent hover:border-red-100"
                        >
                            <span className="material-symbols-outlined transition-transform group-hover:rotate-90">close</span>
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

                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="aspect-square bg-gray-100 dark:bg-white/5 rounded-2xl" />
                            ))}
                        </div>
                    ) : mediaLibrary.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">photo_library</span>
                            <p className="font-black text-xs uppercase tracking-widest">Nenhuma imagem encontrada</p>
                            <p className="text-[10px] mt-2">Faça upload de imagens nas seções ou posts</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {mediaLibrary.map((media) => (
                                <div
                                    key={media.id}
                                    onClick={() => onSelect(media.url)}
                                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-white/10 hover:border-primary cursor-pointer transition-all group hover:scale-105 shadow-sm"
                                >
                                    <img
                                        src={media.url}
                                        className="w-full h-full object-cover"
                                        alt={media.filename}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                        <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all shadow-xl">
                                            <span className="material-symbols-outlined">check</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="absolute top-2 right-2 flex gap-1 transform translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={(e) => handleDelete(e, media.id)}
                                            className="size-8 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg"
                                            title="Excluir imagem"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 translate-y-full group-hover:translate-y-0 transition-transform">
                                        <p className="text-[8px] text-white truncate font-bold text-center">
                                            {media.filename}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
