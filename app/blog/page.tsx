import prisma from "@/lib/prisma";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import {
    BlogHero,
    BlogCard,
    SearchWidget,
    NewsletterWidget,
    CategoriesWidget,
    TagsWidget,
} from "@/components/blog";
import { AnalyticsTracker } from "@/components/landing/AnalyticsTracker";

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
        }
    };
}

export default async function BlogPage() {
    const site = await prisma.site.findFirst({
        where: { domain: "renovamente-guiomarmelo.com.br" },
    });

    if (!site) {
        return <div>Site não configurado</div>;
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

    return (
        <div className="bg-background font-sans min-h-screen flex flex-col relative selection:bg-primary/30 selection:text-primary-foreground">
            <Header />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#13ec5b]/5 to-transparent blur-3xl opacity-30" />
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
                                        <div className="h-px bg-white/10 flex-1"></div>
                                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                            <span className="size-2 rounded-full bg-[#13ec5b]"></span>
                                            Últimos Artigos
                                        </h3>
                                        <div className="h-px bg-white/10 flex-1"></div>
                                    </div>

                                    {recentPosts.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {recentPosts.map((post) => (
                                                <BlogCard key={post.id} post={post} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-10 font-medium">
                                            Nenhum outro artigo encontrado.
                                        </p>
                                    )}
                                    {/* Pagination - Placeholder for now */}
                                    <div className="flex justify-center mt-20">
                                        <button className="px-8 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-white hover:bg-white/5 hover:border-[#13ec5b]/50 transition-all duration-300">
                                            Carregar Mais
                                        </button>
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="text-center py-40 border border-white/5 rounded-[3rem] bg-white/[0.02]">
                                <span className="material-symbols-outlined text-6xl text-white/10 mb-6">edit_note</span>
                                <h2 className="text-2xl font-black text-white mb-2">
                                    Nenhum post publicado
                                </h2>
                                <p className="text-gray-500">Volte em breve para novidades!</p>
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
