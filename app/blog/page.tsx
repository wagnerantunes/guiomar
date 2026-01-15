import prisma from "@/lib/prisma";
import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import {
    BlogHero,
    BlogCard,
    SearchWidget,
    NewsletterWidget,
    CategoriesWidget,
    TagsWidget,
} from "@/components/blog";

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

export default async function BlogPage() {
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

    // Fetch posts
    const posts = await prisma.post.findMany({
        where: {
            siteId: site.id,
            status: "PUBLISHED",
        },
        include: {
            category: true,
            author: true,
        },
        orderBy: { publishedAt: "desc" },
    });

    // Fetch categories with counts
    const categories = await prisma.category.findMany({
        where: {
            siteId: site.id,
        },
        include: {
            _count: {
                select: { posts: true },
            },
        },
    });

    // Derived data
    const featuredPost = posts[0];
    const recentPosts = posts.slice(1);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamente-guiomarmelo.com.br';

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Blog RenovaMente",
        "description": "Lista de artigos sobre bem-estar, saúde mental e produtividade corporativa.",
        "url": `${baseUrl}/blog`,
        "publisher": {
            "@type": "Organization",
            "name": "RenovaMente",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
            }
        },
        "hasPart": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "url": `${baseUrl}/blog/${post.slug}`,
            "datePublished": post.publishedAt?.toISOString(),
            "author": {
                "@type": "Person",
                "name": post.author.name
            }
        }))
    };

    return (
        <div className="bg-background font-sans min-h-screen flex flex-col relative selection:bg-primary/30 selection:text-primary-foreground text-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl opacity-30" />
                <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full opacity-20" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-32 md:py-40">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Column: Content */}
                    <main className="w-full lg:w-[65%] flex flex-col gap-16">
                        {posts.length > 0 ? (
                            <>
                                <BlogHero post={featuredPost} />

                                {/* Blog Posts Grid */}
                                <section>
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="h-px bg-border flex-1"></div>
                                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                                            <span className="size-2 rounded-full bg-primary"></span>
                                            Últimos Artigos
                                        </h3>
                                        <div className="h-px bg-border flex-1"></div>
                                    </div>

                                    {recentPosts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {recentPosts.map((post) => (
                                                <BlogCard key={post.id} post={post} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-10 font-medium border border-border rounded-2xl bg-card">
                                            Nenhum outro artigo encontrado no momento.
                                        </p>
                                    )}

                                    {/* Pagination Placeholder - Could be implemented if needed */}
                                    {recentPosts.length >= 6 && (
                                        <div className="flex justify-center mt-20">
                                            <button className="px-8 py-4 rounded-2xl border border-border text-xs font-black uppercase tracking-widest text-foreground hover:bg-muted hover:border-primary/50 transition-all duration-300">
                                                Ver Todos
                                            </button>
                                        </div>
                                    )}
                                </section>
                            </>
                        ) : (
                            <div className="text-center py-40 border border-border rounded-[3rem] bg-card">
                                <span className="material-symbols-outlined text-6xl text-muted-foreground mb-6">edit_note</span>
                                <h2 className="text-2xl font-black text-foreground mb-2">
                                    Nenhum post publicado
                                </h2>
                                <p className="text-muted-foreground">Estamos preparando conteúdos incríveis. Volte em breve!</p>
                            </div>
                        )}
                    </main>

                    {/* Right Column: Sidebar */}
                    <aside className="w-full lg:w-[35%] flex flex-col gap-8 sticky top-32 h-fit">
                        <SearchWidget />
                        <NewsletterWidget />
                        <CategoriesWidget categories={categories} />
                        <TagsWidget />
                    </aside>
                </div>
            </div>

            <Footer />
        </div>
    );
}
