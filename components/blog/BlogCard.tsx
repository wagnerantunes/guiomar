import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BlogCardProps {
    post: any;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <article className="flex flex-col bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group hover:-translate-y-1 transition-all duration-300 bg-white">
            <div
                className="h-48 w-full bg-cover bg-center"
                style={{
                    backgroundImage: `url("${post.featuredImage || "/placeholder.jpg"}")`,
                }}
            ></div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-3">
                    {post.category && (
                        <span className="text-xs font-bold text-primary uppercase tracking-wide">
                            {post.category.name}
                        </span>
                    )}
                    <span className="text-xs text-text-muted dark:text-gray-400">
                        {post.publishedAt
                            ? format(new Date(post.publishedAt), "d MMM, yyyy", {
                                locale: ptBR,
                            })
                            : ""}
                    </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                    <h4 className="text-lg font-bold text-text-main dark:text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                    </h4>
                </Link>
                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                </p>
                <Link
                    className="inline-flex items-center gap-1 text-sm font-bold text-text-main dark:text-white hover:text-primary transition-colors"
                    href={`/blog/${post.slug}`}
                >
                    Ler Artigo{" "}
                    <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                    </span>
                </Link>
            </div>
        </article>
    );
}
