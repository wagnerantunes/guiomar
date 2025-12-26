"use client";

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
        <section id="blog" className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Blog & Conteúdo
                        </div>
                        <h2 className="text-4xl font-black text-[var(--color-text-main)] leading-tight">
                            {content.title}
                        </h2>
                        <p className="text-lg text-gray-500 font-bold italic">
                            {content.subtitle}
                        </p>
                    </div>
                    <button
                        className="text-xs font-black text-primary uppercase border-b-2 border-primary pb-1"
                        onClick={() => scrollTo("blog")}
                    >
                        Ver todos
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {blogPosts.map((post) => (
                        <div
                            key={post.id}
                            className="group cursor-pointer"
                            onClick={() => setSelectedPost(post)}
                        >
                            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
                                <img
                                    src={post.img}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    alt={post.title}
                                />
                            </div>
                            <div className="space-y-3">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                    {post.date}
                                </span>
                                <h3 className="text-xl font-black text-[#0d1b12] group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h3>
                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                    Ler artigo{" "}
                                    <span className="material-symbols-outlined text-[14px]">
                                        arrow_right_alt
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
