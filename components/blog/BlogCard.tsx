import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlogCardProps {
    post: any;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col bg-white dark:bg-[#18181b]/40 rounded-[2.2rem] shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#13ec5b]/5 transition-all duration-500">
            <Link href={`/blog/${post.slug}`} className="relative h-60 w-full overflow-hidden block">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                        backgroundImage: `url("${post.image || "/placeholder.jpg"}")`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {post.category && (
                    <div className="absolute top-5 left-5">
                        <span className="px-4 py-1.5 text-[9px] font-black bg-white/90 dark:bg-black/60 backdrop-blur-md text-[#0d1b12] dark:text-[#13ec5b] rounded-full uppercase tracking-widest shadow-xl">
                            {post.category.name}
                        </span>
                    </div>
                )}
            </Link>

            <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        {post.publishedAt
                            ? format(new Date(post.publishedAt), "dd MMM, yyyy", {
                                locale: ptBR,
                            })
                            : "Recente"}
                    </span>
                    <div className="size-1 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">
                        5 min read
                    </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                    <h4 className="text-xl font-black text-[var(--color-text-main)] dark:text-white mb-4 leading-[1.3] group-hover:text-[#13ec5b] transition-colors duration-300">
                        {post.title}
                    </h4>
                </Link>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                    <Link
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-main)] dark:text-white group/btn"
                        href={`/blog/${post.slug}`}
                    >
                        Explorar Artigo
                        <div className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover/btn:bg-[#13ec5b] group-hover/btn:text-[#0d1b12] transition-all duration-300">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </div>
                    </Link>
                </div>
            </div>
        </article>
    );
}
