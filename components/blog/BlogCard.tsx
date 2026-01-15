"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { calculateReadingTime } from "@/lib/blog-utils";

interface BlogCardProps {
    post: any;
}

export function BlogCard({ post }: BlogCardProps) {
    const readingTime = calculateReadingTime(post.content || "");

    return (
        <motion.article 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col bg-card rounded-[2rem] border border-border overflow-hidden group hover:-translate-y-2 hover:border-primary/30 transition-all duration-500 relative shadow-sm"
        >
            <Link href={`/blog/${post.slug}`} className="relative h-56 w-full overflow-hidden block">
                {post.image ? (
                    <>
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-6xl text-primary/30">image</span>
                    </div>
                )}

                {post.category && (
                    <div className="absolute top-5 left-5">
                        <span className="px-4 py-1.5 text-[9px] font-black bg-black/60 backdrop-blur-md text-primary rounded-full uppercase tracking-widest border border-white/10">
                            {post.category.name}
                        </span>
                    </div>
                )}
            </Link>

            <div className="p-5 flex flex-col flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        {post.publishedAt
                            ? format(new Date(post.publishedAt), "dd MMM, yyyy", {
                                locale: ptBR,
                            })
                            : "Recente"}
                    </span>
                    <div className="size-1 bg-border rounded-full"></div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        {readingTime} min read
                    </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                    <h4 className="text-xl font-black text-card-foreground mb-4 leading-[1.3] group-hover:text-primary transition-colors duration-300">
                        {post.title}
                    </h4>
                </Link>

                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Link
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground group/btn"
                        href={`/blog/${post.slug}`}
                    >
                        Explorar Artigo
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-all duration-300">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </div>
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
