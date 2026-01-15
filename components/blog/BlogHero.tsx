"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Clock } from "lucide-react";
import { calculateReadingTime } from "@/lib/blog-utils";

interface BlogHeroProps {
    post: any;
}

export function BlogHero({ post }: BlogHeroProps) {
    if (!post) return null;
    const readingTime = calculateReadingTime(post.content || "");

    return (
        <section className="relative w-full rounded-[2.5rem] overflow-hidden border border-border group shadow-xl">
            <div className="relative aspect-[21/9] md:aspect-[21/7] w-full overflow-hidden">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    {post.category && (
                        <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                            {post.category.name}
                        </span>
                    )}
                    
                    <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter hover:text-primary transition-colors duration-300">
                            {post.title}
                        </h2>
                    </Link>

                    <p className="text-white/70 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <Link
                            href={`/blog/${post.slug}`}
                            className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center gap-3 shadow-xl"
                        >
                            Ler Artigo Completo
                            <ArrowRight size={14} />
                        </Link>

                        <div className="flex items-center gap-4 text-white/60 text-[10px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{readingTime} min de leitura</span>
                            </div>
                            <div className="size-1 bg-white/20 rounded-full" />
                            <span>
                                {post.publishedAt ? format(new Date(post.publishedAt), "dd MMM, yyyy", { locale: ptBR }) : ""}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
