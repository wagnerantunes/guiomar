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
        <section className="relative w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden border border-border group shadow-2xl">
            {/* Background Image with Parallax Effect could go here if we wanted complexity, but kept simple for performance */}
            <div className="absolute inset-0 w-full h-full">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                {/* Gradient Overlay Improved */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-80" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 lg:p-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    {post.category && (
                        <div className="mb-6 overflow-hidden">
                             <motion.span 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center px-5 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-primary/20 border border-primary/20 backdrop-blur-sm"
                             >
                                {post.category.name}
                            </motion.span>
                        </div>
                    )}
                    
                    <Link href={`/blog/${post.slug}`} className="block group/title">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter group-hover/title:text-primary transition-colors duration-300 drop-shadow-lg">
                            {post.title}
                        </h2>
                    </Link>

                    <p className="text-white/80 text-sm md:text-lg mb-8 line-clamp-2 md:line-clamp-3 leading-relaxed font-medium max-w-2xl drop-shadow-md">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
                        <Link
                            href={`/blog/${post.slug}`}
                            className="bg-white text-black px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all flex items-center gap-3 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_40px_-15px_var(--primary)] active:scale-95 duration-300"
                        >
                            Ler Artigo Completo
                            <ArrowRight size={16} />
                        </Link>

                        <div className="flex items-center gap-6 text-white/70 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm bg-black/20 px-4 py-2 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-primary" />
                                <span>{readingTime} min de leitura</span>
                            </div>
                            <div className="w-px h-3 bg-white/20" />
                            <span>
                                {post.publishedAt ? format(new Date(post.publishedAt), "dd 'de' MMMM, yyyy", { locale: ptBR }) : ""}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
