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

            {/* MAGAZINE GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Featured Post (First Item) - Takes full width on mobile, 7 cols on large */}
                {blogPosts.length > 0 && (
                    <div
                        className="lg:col-span-8 group cursor-pointer relative rounded-[2.5rem] overflow-hidden min-h-[400px] lg:min-h-[500px]"
                        onClick={() => setSelectedPost(blogPosts[0])}
                    >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                        <img
                            src={blogPosts[0].img}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-30 flex flex-col items-start gap-4">
                            <span className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                {blogPosts[0].cat || "Destaque"}
                            </span>
                            <h3 className="text-3xl md:text-5xl font-black text-white leading-[1.1] max-w-2xl">
                                {blogPosts[0].title}
                            </h3>
                            <div className="flex items-center gap-4 text-white/80 text-xs font-bold uppercase tracking-widest mt-2">
                                <span>{blogPosts[0].date}</span>
                                <span className="size-1 rounded-full bg-white/50"></span>
                                <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
                                    Ler Artigo <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Secondary Posts (Stacked Column) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {blogPosts.slice(1, 3).map((post) => (
                        <div
                            key={post.id}
                            className="bg-card hover:bg-muted/10 p-6 rounded-[2rem] border border-border cursor-pointer group transition-all hover:border-primary/30 hover:shadow-xl flex-1 flex flex-col justify-between"
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">
                                        {post.cat || "Geral"}
                                    </span>
                                    <span className="text-[10px] font-bold text-muted">{post.date}</span>
                                </div>
                                <h3 className="text-xl font-black text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                            </div>
                            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Ler agora</span>
                                <div className="size-8 rounded-full bg-muted/10 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* View All Button Card */}
                    <div
                        onClick={() => scrollTo("blog")} // Assuming scrollTo action leads to full blog page
                        className="bg-primary text-primary-foreground p-6 rounded-[2rem] cursor-pointer group flex items-center justify-between hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="text-lg font-black uppercase tracking-wider">Ver todos os posts</span>
                        <span className="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
