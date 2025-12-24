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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white tracking-tight uppercase tracking-widest">
                        Blog Posts
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">
                        Gerencie e publique conteúdos para sua audiência.
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#13ec5b] text-[#0d1b12] rounded-xl font-black text-xs hover:scale-105 transition-all shadow-xl shadow-[#13ec5b]/20 active:scale-95 uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                    Novo Post
                </Link>
            </div>

            {/* FILTROS E BUSCA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por título ou slug..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-3.5 bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl text-xs focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm font-black text-gray-500 dark:text-gray-300 appearance-none cursor-pointer uppercase tracking-widest"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Todos os Status</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="DRAFT">Rascunho</option>
                </select>
                <select
                    className="px-4 py-3.5 bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl text-xs focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm font-black text-gray-500 dark:text-gray-300 appearance-none cursor-pointer uppercase tracking-widest"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Todas as Categorias</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* POST LIST */}
            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#183221] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center gap-8">
                                <Skeleton className="w-full md:w-48 aspect-[4/3] rounded-[1.5rem]" />
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-20" variant="text" />
                                        <Skeleton className="h-4 w-24" variant="text" />
                                    </div>
                                    <Skeleton className="h-8 w-3/4" variant="text" />
                                    <div className="flex gap-6">
                                        <Skeleton className="h-4 w-24" variant="text" />
                                        <Skeleton className="h-4 w-24" variant="text" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="bg-white dark:bg-[#183221] p-20 rounded-[3rem] border border-gray-100 dark:border-white/5 text-center space-y-6 shadow-sm">
                        <span className="material-symbols-outlined text-6xl text-gray-200">
                            article
                        </span>
                        <div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                Nenhum post encontrado
                            </p>
                            <Link
                                href="/admin/posts/new"
                                className="text-[#13ec5b] font-black text-xs hover:underline uppercase tracking-widest mt-4 inline-block"
                            >
                                Criar meu primeiro post
                            </Link>
                        </div>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-[#183221] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-[#13ec5b]/30 transition-all flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden"
                        >
                            <div className="w-full md:w-48 aspect-[4/3] rounded-[1.5rem] bg-gray-50 dark:bg-zinc-800 overflow-hidden shrink-0 border border-gray-100 dark:border-white/5">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                        <span className="material-symbols-outlined text-5xl">image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    <span
                                        className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${post.status === "PUBLISHED"
                                            ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                            : "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                                            }`}
                                    >
                                        {post.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {new Date(post.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-[#0d1b12] dark:text-white group-hover:text-[#13ec5b] transition-colors leading-tight tracking-tight">
                                    {post.title}
                                </h3>
                                <div className="flex items-center justify-center md:justify-start gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-gray-400 flex-wrap">
                                    <span className="flex items-center gap-2 shrink-0">
                                        <span className="material-symbols-outlined text-lg text-primary">folder</span>
                                        {post.category?.name || "Sem categoria"}
                                    </span>
                                    <span className="flex items-center gap-2 shrink-0">
                                        <span className="material-symbols-outlined text-lg text-primary">visibility</span>
                                        {post.views || 0} views
                                    </span>
                                    <span className="flex items-center gap-2 shrink-0">
                                        <span className="material-symbols-outlined text-lg text-primary">person</span>
                                        {post.author.name || "Admin"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="size-12 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 transition-all active:scale-90"
                                    title="Visualizar no site"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                </Link>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="size-12 rounded-2xl bg-[#0d1b12] dark:bg-white text-white dark:text-[#0d1b12] flex items-center justify-center hover:scale-110 transition-all shadow-lg active:scale-90"
                                    title="Editar post"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </Link>
                                <button
                                    className="size-12 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90"
                                    title="Excluir post"
                                >
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
