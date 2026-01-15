"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        posts: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setCreating(true);
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });

            if (res.ok) {
                setNewName("");
                fetchCategories(); // Reload list
            } else {
                alert("Erro ao criar categoria");
            }
        } catch (error) {
            console.error("Error creating category:", error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-screen-xl mx-auto w-full">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin/posts"
                        className="size-14 rounded-[1.5rem] bg-muted/5 flex items-center justify-center text-muted hover:text-primary hover:bg-primary/5 transition-all group shadow-sm border border-border"
                    >
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-foreground uppercase tracking-[0.2em]">
                            Categorias
                        </h1>
                        <p className="text-muted font-bold mt-2 uppercase tracking-widest text-[10px]">
                            Organize seu conteúdo com eficiência.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* CREATE FORM */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-[2.5rem] p-8 border border-border mt-0 lg:sticky lg:top-10">
                        <h2 className="text-xl font-black text-foreground mb-6 uppercase tracking-tight">Nova Categoria</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Nome</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ex: Liderança"
                                    className="w-full bg-muted/5 border border-border rounded-xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none text-foreground transition-all"
                                    disabled={creating}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating || !newName.trim()}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <span className="size-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-base">add</span>
                                        Adicionar
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-muted/5 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-border rounded-[3rem]">
                            <span className="material-symbols-outlined text-6xl text-muted/20 mb-4">category</span>
                            <p className="text-muted font-bold uppercase tracking-widest text-xs">Nenhuma categoria encontrada</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="group bg-card hover:bg-muted/5 p-6 rounded-3xl border border-border flex items-center justify-between transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                            <span className="material-symbols-outlined">label</span>
                                        </div>
                                        <div>
                                            <h3 className="font-black text-foreground text-sm uppercase tracking-wide">{category.name}</h3>
                                            <p className="text-[10px] bg-muted/10 text-muted px-2 py-0.5 rounded-md inline-block mt-1 font-mono">/{category.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            className="size-10 rounded-xl hover:bg-destructive/10 hover:text-destructive flex items-center justify-center text-muted transition-colors cursor-not-allowed"
                                            title="Deletar não implementado"
                                            disabled
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
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
