import prisma from "@/lib/prisma";
import { Footer } from "@/components/landing/Footer";
import {
    BlogHero,
    BlogCard,
    SearchWidget,
    NewsletterWidget,
    CategoriesWidget,
    TagsWidget,
} from "@/components/blog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Blog | RenovaMente - Insights sobre Bem-Estar e Gestão",
        description: "Artigos, dicas e insights profundos sobre saúde mental corporativa, liderança humana e transformação organizacional.",
        openGraph: {
            title: "Blog | RenovaMente",
            description: "Explore nossos artigos sobre bem-estar corporativo.",
            type: "website",
            url: "https://renovamente-guiomarmelo.com.br/blog",
        }
    };
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; category?: string; tag?: string }>;
}) {
    const { page: pageStr, category: categorySlug, tag: tagSlug } = await searchParams;
    const page = parseInt(pageStr || "1");
    const pageSize = 6;

    const site = await prisma.site.findFirst({
        where: {
            OR: [
                { domain: "renovamente-guiomarmelo.com.br" },
                { domain: "www.renovamente-guiomarmelo.com.br" },
                { subdomain: "renovamente" }
            ]
        },
    });

    if (!site) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Site não configurado</div>;
    }

    const where: any = { 
        siteId: site.id, 
        status: "PUBLISHED" 
    };

    if (categorySlug) {
        where.category = { slug: categorySlug };
    }

    if (tagSlug) {
        where.tags = { some: { tag: { slug: tagSlug } } };
    }

    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / pageSize);

    const posts = await prisma.post.findMany({
        where,
        include: { category: true, author: true, tags: { include: { tag: true } } },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
    });

    const categories = await prisma.category.findMany({
        where: { siteId: site.id },
        include: { _count: { select: { posts: true } } },
    });

    const tags = await prisma.tag.findMany({
        take: 20,
    });

    const featuredPost = posts[0];
    const otherPosts = posts.length > 0 ? posts.slice(categorySlug || tagSlug ? 0 : (page === 1 ? 1 : 0)) : [];

    return (
        <div className="bg-background font-sans min-h-screen flex flex-col relative selection:bg-primary/30 selection:text-primary-foreground text-foreground">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-30" />
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-20 md:py-24">
                <div className="flex flex-col lg:flex-row gap-10">
                    <main className="w-full lg:w-[68%] flex flex-col gap-12">
                        {posts.length > 0 ? (
                            <>
                                {!categorySlug && !tagSlug && page === 1 && <BlogHero post={featuredPost} />}
                                <section>
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="h-px bg-border flex-1"></div>
                                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                                            <span className="size-2 rounded-full bg-primary"></span>
                                            {categorySlug ? `Categoria: ${categorySlug}` : (tagSlug ? `Tag: ${tagSlug}` : "Últimos Artigos")}
                                        </h3>
                                        <div className="h-px bg-border flex-1"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {otherPosts.map((post) => (
                                            <BlogCard key={post.id} post={post} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-16 flex items-center justify-center gap-2">
                                            {page > 1 && (
                                                <Link
                                                    href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}${tagSlug ? `&tag=${tagSlug}` : ""}`}
                                                    className="size-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-all shadow-sm"
                                                >
                                                    <ChevronLeft size={20} />
                                                </Link>
                                            )}
                                            
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <Link
                                                    key={i}
                                                    href={`/blog?page=${i + 1}${categorySlug ? `&category=${categorySlug}` : ""}${tagSlug ? `&tag=${tagSlug}` : ""}`}
                                                    className={`size-12 rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all ${
                                                        page === i + 1
                                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                            : "bg-card border-border text-muted hover:border-primary/50"
                                                    }`}
                                                >
                                                    {i + 1}
                                                </Link>
                                            ))}

                                            {page < totalPages && (
                                                <Link
                                                    href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}${tagSlug ? `&tag=${tagSlug}` : ""}`}
                                                    className="size-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted hover:bg-primary hover:text-white transition-all shadow-sm"
                                                >
                                                    <ChevronRight size={20} />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </section>
                            </>
                        ) : (
                            <div className="text-center py-40 border border-border rounded-[3rem] bg-card">
                                <span className="material-symbols-outlined text-6xl text-muted-foreground mb-6">edit_note</span>
                                <h2 className="text-2xl font-black text-foreground mb-2">Nenhum post publicado</h2>
                                <p className="text-sm text-muted">Ainda estamos preparando conteúdo incrível para você.</p>
                                <Link href="/blog" className="mt-8 inline-block px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Ver todos os posts</Link>
                            </div>
                        )}
                    </main>
                    <aside className="w-full lg:w-[35%] flex flex-col gap-8 sticky top-32 h-fit">
                        <SearchWidget />
                        <NewsletterWidget />
                        <CategoriesWidget categories={categories} />
                        <TagsWidget tags={tags} />
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}
