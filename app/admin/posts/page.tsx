import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import React from "react";

export default async function PostsPage() {
    const session = await auth();

    const siteUser = await prisma.siteUser.findFirst({
        where: { userId: session?.user?.id },
        include: { site: true },
    });

    if (!siteUser) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-gray-900">Site não encontrado</h2>
                <p className="text-gray-600 mt-2">Certifique-se de que sua conta está vinculada a um site.</p>
            </div>
        );
    }

    const posts = await prisma.post.findMany({
        where: { siteId: siteUser.siteId },
        include: {
            category: true,
            author: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0d1b12] dark:text-white tracking-tight">
                        Blog Posts
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Gerencie e publique conteúdos para sua audiência.
                    </p>
                </div>
                <Link
                    href="/admin/posts/new"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0d1b12] dark:bg-white dark:text-[#0d1b12] text-white rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px] font-bold">add</span>
                    NOVO POST
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
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm"
                    />
                </div>
                <select className="px-4 py-3 bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm font-bold text-gray-600 dark:text-gray-300">
                    <option value="">Status: Todos</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="DRAFT">Rascunho</option>
                </select>
                <select className="px-4 py-3 bg-white dark:bg-[#183221] border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-[#13ec5b]/30 outline-none shadow-sm font-bold text-gray-600 dark:text-gray-300">
                    <option value="">Todas as Categorias</option>
                    {/* Categorias dinâmicas aqui se necessário */}
                </select>
            </div>

            {/* POST LIST */}
            <div className="grid grid-cols-1 gap-4">
                {posts.length === 0 ? (
                    <div className="bg-white dark:bg-[#183221] p-20 rounded-[2.5rem] border border-gray-100 dark:border-white/5 text-center space-y-4">
                        <span className="material-symbols-outlined text-6xl text-gray-200">
                            article
                        </span>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                            Nenhum post encontrado
                        </p>
                        <Link
                            href="/admin/posts/new"
                            className="text-[#13ec5b] font-black text-xs hover:underline uppercase"
                        >
                            Criar meu primeiro post
                        </Link>
                    </div>
                ) : (
                    posts.map((post: any) => (
                        <div
                            key={post.id}
                            className="bg-white dark:bg-[#183221] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group"
                        >
                            <div className="w-full md:w-40 aspect-video rounded-2xl bg-gray-50 dark:bg-zinc-800 overflow-hidden shrink-0">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <span className="material-symbols-outlined text-3xl">image</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <span
                                        className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${post.status === "PUBLISHED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {post.status === "PUBLISHED" ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-[#0d1b12] dark:text-white group-hover:text-[#13ec5b] transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">folder</span>
                                        {post.category?.name || "Sem categoria"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">visibility</span>
                                        {post.views || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    className="size-11 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-[#13ec5b] hover:bg-[#13ec5b]/5 transition-all"
                                    title="Visualizar no site"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                </Link>
                                <Link
                                    href={`/admin/posts/${post.id}/edit`}
                                    className="size-11 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-[#0d1b12] dark:text-white hover:bg-[#13ec5b] hover:text-[#0d1b12] transition-all shadow-sm"
                                    title="Editar post"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </Link>
                                <button
                                    className="size-11 rounded-xl border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
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

