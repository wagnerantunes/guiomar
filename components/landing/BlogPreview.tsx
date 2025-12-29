"use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

interface BlogProps {
    getSetting: (key: string, defaultValue: any) => any;
    blogPosts: any[];
    setSelectedPost: (post: any) => void;
    scrollTo: (id: string) => void;
}

export function BlogPreview({ getSetting, blogPosts, setSelectedPost, scrollTo }: BlogProps) {
    const content = getSetting("section_blog_content", {
        title: "Insights & Bem-estar",
        subtitle: "Explore nossos artigos e descubra dicas para uma vida mais saudável e equilibrada."
    });

    return (
        <>
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                <div className="space-y-6 max-w-2xl">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Insights</span>
                    <h2 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic">
                        {content.title}
                    </h2>
                    <p className="text-xl text-muted font-bold italic border-l-4 border-primary pl-6">
                        {content.subtitle}
                    </p>
                </div>

                <button
                    className="group flex items-center gap-3 text-xs font-black text-foreground uppercase tracking-widest hover:text-primary transition-colors mb-2"
                    onClick={() => scrollTo("blog")}
                >
                    Ver todos os artigos
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <div
                        key={post.id}
                        className="group cursor-pointer bg-card rounded-[2rem] p-4 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-border shadow-xl backdrop-blur-sm"
                        onClick={() => setSelectedPost(post)}
                    >
                        <div className="aspect-[16/10] rounded-3xl overflow-hidden mb-8 relative">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                            <img
                                src={post.img}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={post.title}
                            />
                            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full z-20 border border-border">
                                <span className="text-[10px] font-black text-foreground uppercase tracking-wider">
                                    {post.date}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6 px-4 pb-4">
                            <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-[1.1]">
                                {post.title}
                            </h3>

                            <div className="flex items-center justify-between border-t border-border pt-6">
                                <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                                    {post.cat || "Geral"}
                                </span>
                                <div className="size-8 rounded-full bg-muted/5 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-border">
                                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

