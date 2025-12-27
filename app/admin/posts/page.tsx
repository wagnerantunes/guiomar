"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/admin/Skeleton";

interface Post {
    id: string;
    title: string;
    slug: string;
    status: string;
    image: string | null;
    createdAt: string;
    views: number;
    category: {
        id: string;
        name: string;
    } | null;
    author: {
        name: string | null;
    };
}

interface Category {
    id: string;
    name: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const [postsRes, catsRes] = await Promise.all([
                    fetch("/api/posts"),
                    fetch("/api/categories")
                ]);
                const postsData = await postsRes.json();
                const catsData = await catsRes.json();

                setPosts(Array.isArray(postsData) ? postsData : []);
                setCategories(Array.isArray(catsData) ? catsData : []);
            } catch (error) {
                console.error("Error fetching posts data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return;

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setPosts(posts.filter((p) => p.id !== id));
            } else {
                alert("Erro ao excluir post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Erro ao excluir post");
        }
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.slug.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "" || post.status === statusFilter;
        const matchesCategory = categoryFilter === "" || post.category?.id === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
                        Blog Posts
                    </h1>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">
                        Estratégia de conteúdo e gestão de conhecimento.
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    aria-label="Criar novo post"
                    className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#13ec5b] text-[#0d1b12] rounded-2xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-[#13ec5b]/20 active:scale-95 uppercase tracking-[0.1em]"
                >
                    <span className="material-symbols-outlined text-[20px] font-bold">add_circle</span>
                    Novo Artigo
                </Link>
            </div>

            {/* FILTROS E BUSCA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#13ec5b] transition-colors">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por título ou slug..."
                        aria-label="Buscar posts"
                        className="w-full pl-12 pr-4 py-4 bg-[#09090b]/50 backdrop-blur-sm border border-white/5 rounded-2xl text-xs font-bold text-white focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 outline-none shadow-sm transition-all placeholder:text-gray-500 placeholder:font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <select
                        aria-label="Filtrar por status"
                        className="w-full px-6 py-4 bg-[#09090b]/50 backdrop-blur-sm border border-white/5 rounded-2xl text-[10px] focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 outline-none shadow-sm font-black text-gray-400 appearance-none cursor-pointer uppercase tracking-widest transition-all hover:bg-white/5"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Status: Todos</option>
                        <option value="PUBLISHED">Publicado</option>
                        <option value="DRAFT">Rascunho</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">expand_more</span>
                </div>
                <div className="relative group">
                    <select
                        aria-label="Filtrar por categoria"
                        className="w-full px-6 py-4 bg-[#09090b]/50 backdrop-blur-sm border border-white/5 rounded-2xl text-[10px] focus:ring-2 focus:ring-[#13ec5b]/50 focus:border-[#13ec5b]/50 outline-none shadow-sm font-black text-gray-400 appearance-none cursor-pointer uppercase tracking-widest transition-all hover:bg-white/5"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">Categorias: Todas</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg">category</span>
                </div>
            </div>

            {/* POST LIST */}
            <div className="grid grid-cols-1 gap-6 pb-20">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row items-center gap-10">
                                <Skeleton className="w-full md:w-64 aspect-video rounded-[2rem] bg-white/5" />
                                <div className="flex-1 space-y-6">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-20 bg-white/5" />
                                        <Skeleton className="h-4 w-24 bg-white/5" />
                                    </div>
                                    <Skeleton className="h-10 w-3/4 bg-white/5" />
                                    <div className="flex gap-8">
                                        <Skeleton className="h-4 w-24 bg-white/5" />
                                        <Skeleton className="h-4 w-24 bg-white/5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="bg-[#09090b]/50 p-32 rounded-[4rem] border border-dashed border-white/5 text-center space-y-8 shadow-inner">
                        <div className="size-32 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto shadow-sm">
                            <span className="material-symbols-outlined text-5xl text-white/10">auto_stories</span>
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Nenhum artigo encontrado na sua biblioteca
                            </p>
                            <Link
                                href="/admin/posts/new"
                                className="mt-8 inline-flex items-center gap-2 text-[#13ec5b] font-black text-xs hover:scale-105 transition-all uppercase tracking-[0.2em]"
                            >
                                Iniciar nova publicação
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-[#09090b]/40 backdrop-blur-md p-8 rounded-[3rem] border border-white/5 shadow-sm hover:shadow-2xl hover:shadow-[#13ec5b]/5 hover:border-[#13ec5b]/30 transition-all flex flex-col md:flex-row items-center gap-10 group relative overflow-hidden"
                        >
                            <div className="w-full md:w-64 aspect-video rounded-[2rem] bg-white/5 overflow-hidden shrink-0 border border-white/5 relative">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5">
                                        <span className="material-symbols-outlined text-6xl">image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex-1 space-y-5 text-center md:text-left min-w-0">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <span
                                        className={`text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest ${post.status === "PUBLISHED"
                                            ? "bg-[#13ec5b] text-[#0d1b12] shadow-[0_0_15px_rgba(19,236,91,0.2)]"
                                            : "bg-white/5 text-gray-400"
                                            }`}
                                    >
                                        {post.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white/5 px-2.5 py-1 rounded-lg">
                                        {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-[#13ec5b] transition-colors leading-tight tracking-tight truncate max-w-full">
                                    {post.title}
                                </h3>
                                <div className="flex items-center justify-center md:justify-start gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex-wrap">
                                    <span className="flex items-center gap-2.5 shrink-0 group-hover:text-gray-300 transition-colors">
                                        <span className="material-symbols-outlined text-xl opacity-60">category</span>
                                        {post.category?.name || "Sem categoria"}
                                    </span>
                                    <span className="flex items-center gap-2.5 shrink-0 group-hover:text-gray-300 transition-colors">
                                        <span className="material-symbols-outlined text-xl opacity-60">visibility</span>
                                        {post.views || 0} acessos
                                    </span>
                                    <span className="flex items-center gap-2.5 shrink-0 group-hover:text-gray-300 transition-colors">
                                        <span className="material-symbols-outlined text-xl opacity-60">edit_square</span>
                                        {post.author.name || "Admin"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col lg:flex-row items-center gap-4 shrink-0">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    aria-label="Visualizar post no site"
                                    className="size-14 rounded-2xl border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 hover:border-[#13ec5b]/20 transition-all active:scale-90 group/btn"
                                >
                                    <span className="material-symbols-outlined text-[22px] group-hover/btn:scale-110 transition-transform">open_in_new</span>
                                </Link>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    aria-label="Editar post"
                                    className="size-14 rounded-2xl bg-white text-[#0d1b12] flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-black/10 active:scale-90 group/btn hover:bg-[#13ec5b] hover:text-[#0d1b12]"
                                >
                                    <span className="material-symbols-outlined text-[22px] group-hover/btn:rotate-12 transition-transform">edit</span>
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    aria-label="Excluir post"
                                    className="size-14 rounded-2xl border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-95 group/btn"
                                >
                                    <span className="material-symbols-outlined text-[22px] group-hover/btn:scale-125 transition-transform">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
