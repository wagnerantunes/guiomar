import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlogCardProps {
    post: any;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col bg-[#09090b] rounded-[2.2rem] border border-white/5 overflow-hidden group hover:-translate-y-2 hover:border-[#13ec5b]/30 transition-all duration-500 relative">
            <div className="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>

            <Link href={`/blog/${post.slug}`} className="relative h-60 w-full overflow-hidden block">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                        backgroundImage: `url("${post.image || "/placeholder.jpg"}")`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {post.category && (
                    <div className="absolute top-5 left-5">
                        <span className="px-4 py-1.5 text-[9px] font-black bg-black/60 backdrop-blur-md text-[#13ec5b] rounded-full uppercase tracking-widest border border-white/10">
                            {post.category.name}
                        </span>
                    </div>
                )}
            </Link>

            <div className="p-8 flex flex-col flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        {post.publishedAt
                            ? format(new Date(post.publishedAt), "dd MMM, yyyy", {
                                locale: ptBR,
                            })
                            : "Recente"}
                    </span>
                    <div className="size-1 bg-white/10 rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        5 min read
                    </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                    <h4 className="text-xl font-black text-white mb-4 leading-[1.3] group-hover:text-[#13ec5b] transition-colors duration-300">
                        {post.title}
                    </h4>
                </Link>

                <p className="text-sm text-gray-400 line-clamp-2 md:line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <Link
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white group/btn"
                        href={`/blog/${post.slug}`}
                    >
                        Explorar Artigo
                        <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-[#13ec5b] group-hover/btn:text-[#0d1b12] transition-all duration-300">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </div>
                    </Link>
                </div>
            </div>
        </article>
    );
}
