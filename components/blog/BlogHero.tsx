/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FeaturedPostProps {
    post: any; // Type accurately with Prisma type later
}

export function BlogHero({ post }: FeaturedPostProps) {
    if (!post) return null;

    return (
        <section className="flex flex-col gap-6 group">
            <div className="flex items-center gap-3 px-2">
                <div className="size-2 bg-[#13ec5b] rounded-full animate-pulse shadow-[0_0_8px_rgba(19,236,91,0.5)]"></div>
                <h3 className="uppercase tracking-[0.3em] text-[10px] font-black text-gray-400 dark:text-[#13ec5b]/60">
                    Destaque da Semana
                </h3>
            </div>

            <Link href={`/blog/${post.slug}`} className="block relative group/hero">
                <div className="relative aspect-[16/10] md:aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl transition-all duration-700 group-hover/hero:scale-[0.99] group-hover/hero:shadow-primary/5">
                    {/* Background Image with Parallax-like effect on hover */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover/hero:scale-110"
                        style={{
                            backgroundImage: `url("${post.image || "/placeholder.jpg"}")`,
                        }}
                    />

                    {/* Multi-layer Gradients for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-60"></div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end">
                        <div className="max-w-3xl space-y-6">
                            {post.category && (
                                <span className="inline-flex px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-[#13ec5b]/90 text-[#0d1b12] rounded-full backdrop-blur-md shadow-lg shadow-[#13ec5b]/20">
                                    {post.category.name}
                                </span>
                            )}

                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tighter group-hover/hero:text-[#13ec5b] transition-colors duration-500">
                                {post.title}
                            </h2>

                            <p className="text-gray-300 text-sm md:text-lg font-medium leading-relaxed line-clamp-2 max-w-2xl opacity-90">
                                {post.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl border-2 border-white/20 overflow-hidden shadow-xl">
                                        <img
                                            src={post.author?.image || `https://ui-avatars.com/api/?name=${post.author?.name || 'Admin'}&background=13ec5b&color=0d1b12`}
                                            alt={post.author?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-[11px] uppercase tracking-wider">
                                            {post.author?.name || "RenovaMente"}
                                        </span>
                                        <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                            {post.publishedAt
                                                ? format(new Date(post.publishedAt), "d 'de' MMMM", {
                                                    locale: ptBR,
                                                })
                                                : "Recente"}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-4 w-px bg-white/10 hidden md:block"></div>

                                <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-lg text-[#13ec5b]">schedule</span>
                                    5 min de leitura
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hover Decoration */}
                    <div className="absolute top-8 right-8 size-14 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 opacity-0 group-hover/hero:opacity-100 transition-all duration-500 translate-y-4 group-hover/hero:translate-y-0">
                        <span className="material-symbols-outlined text-white">arrow_outward</span>
                    </div>
                </div>
            </Link>
        </section>
    );
}
