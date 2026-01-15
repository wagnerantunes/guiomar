"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { motion } from "framer-motion";

interface BlogProps {
    getSetting: (key: string, defaultValue: any) => any;
    blogPosts: any[];
    setSelectedPost: (post: any) => void;
    scrollTo: (id: string) => void;
}

export function BlogPreview({ getSetting, blogPosts, setSelectedPost, scrollTo }: BlogProps) {
    const content = getSetting("section_blog_content", {
        title: "Insights & Bem-estar",
        subtitle: "Explore nossos artigos e descubra dicas para uma vida mais saudável."
    });

    const categories = Array.from(new Set(blogPosts.map(p => p.cat || "Geral")));

    return (
        <div className="space-y-16">
            {/* NEW HEADER LAYOUT */}
            <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto relative">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[80px] rounded-full -z-10"></div>

                <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-primary/50"></div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Nosso Blog</span>
                    <div className="h-px w-8 bg-primary/50"></div>
                </div>

                <h2
                    className="font-black text-foreground leading-[1] tracking-tighter uppercase italic drop-shadow-sm"
                    style={{ fontSize: "var(--section-title-size)" } as any}
                >
                    {content.title}
                </h2>
                <p
                    className="text-muted-foreground text-lg font-medium max-w-xl leading-relaxed"
                >
                    {content.subtitle}
                </p>

                {/* Filter / Tabs Mockup (Visual Only for now) */}
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                    <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        Todos
                    </button>
                    {categories.slice(0, 3).map((cat, i) => (
                        <button key={i} className="px-6 py-2 rounded-full bg-card border border-border text-muted-foreground text-xs font-bold uppercase tracking-wider hover:bg-muted/50 transition-colors">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* NEW MAGAZINE GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Featured Post (First Item) - Takes 8 cols */}
                {blogPosts.length > 0 && (
                    <div
                        className="lg:col-span-8 group cursor-pointer flex flex-col h-full bg-card rounded-[3rem] border border-border/50 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        onClick={() => setSelectedPost(blogPosts[0])}
                    >
                        <div className="relative w-full h-[300px] lg:h-[450px] overflow-hidden">
                            <img
                                src={blogPosts[0].img}
                                alt={blogPosts[0].title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            {/* Overlay sutil apenas para profundidade na imagem */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>

                        <div className="p-8 md:p-12 flex flex-col justify-center flex-1 space-y-6">
                            <span className="w-fit px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                {blogPosts[0].cat || "Destaque"}
                            </span>
                            
                            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight group-hover:text-primary transition-colors max-w-4xl">
                                {blogPosts[0].title}
                            </h3>

                            <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">
                                <span>{blogPosts[0].date}</span>
                                <span className="size-1.5 rounded-full bg-primary/30"></span>
                                <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                                    Ler Artigo <span className="material-symbols-outlined text-base">arrow_right_alt</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Secondary Posts (Stacked Column) */}
                <div className="lg:col-span-4 flex flex-col gap-10">
                    {blogPosts.slice(1, 4).map((post) => (
                        <div
                            key={post.id}
                            className="group cursor-pointer flex flex-col md:flex-row lg:flex-col gap-6"
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="w-full md:w-1/3 lg:w-full aspect-[16/10] rounded-[2rem] overflow-hidden relative shadow-lg border border-border/50">
                                <img
                                    src={post.img}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex-1 space-y-3 px-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                                        {post.cat || "Geral"}
                                    </span>
                                    <span className="size-1 rounded-full bg-border"></span>
                                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]">
                                        {post.date}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group-hover:text-primary transition-colors pt-2">
                                    Ler Agora <span className="material-symbols-outlined text-sm">trending_flat</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Compact View All Button */}
                    <button
                        onClick={() => scrollTo("blog")}
                        className="w-full py-6 rounded-2xl bg-muted/30 border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group flex items-center justify-center gap-4 mt-auto"
                    >
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Explorar todo o conteúdo</span>
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <span className="material-symbols-outlined text-lg">grid_view</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
