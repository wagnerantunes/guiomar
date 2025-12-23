import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FeaturedPostProps {
    post: any; // Type accurately with Prisma type later
}

export function BlogHero({ post }: FeaturedPostProps) {
    if (!post) return null;

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary">verified</span>
                <h3 className="uppercase tracking-wider text-xs font-bold text-text-muted dark:text-primary/80">
                    Destaque
                </h3>
            </div>
            <div className="group relative flex flex-col overflow-hidden rounded-xl shadow-lg bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-800 transition-all hover:shadow-xl">
                <div
                    className="w-full h-64 md:h-80 bg-cover bg-center"
                    style={{
                        backgroundImage: `url("${post.featuredImage || "/placeholder.jpg"}")`,
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                        {post.category && (
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold bg-primary text-[#0d1b12] rounded-full">
                                {post.category.name}
                            </span>
                        )}
                        <Link href={`/blog/${post.slug}`}>
                            <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
                                {post.title}
                            </h2>
                        </Link>
                        <p className="text-gray-200 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                {post.author?.image && (
                                    <div
                                        className="size-8 rounded-full bg-gray-300 bg-cover"
                                        style={{ backgroundImage: `url("${post.author.image}")` }}
                                    ></div>
                                )}
                                <span>{post.author?.name || "RenovaMente"}</span>
                            </div>
                            <span>•</span>
                            <span>
                                {post.publishedAt
                                    ? format(new Date(post.publishedAt), "d 'de' MMM, yyyy", {
                                        locale: ptBR,
                                    })
                                    : ""}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
